// backend/src/services/monitorService.js
//
// Monitora uma pasta do Google Drive em busca de PDFs novos.
// Roda automaticamente ao ligar o servidor (chamado em server.js).
//
// FLUXO DE CADA VERIFICAÇÃO:
//   1. Lista todos os PDFs da pasta no Drive
//   2. Para cada arquivo, consulta o Firestore se já foi processado
//   3. Se for novo → chama aprenderNovaAula() → marca como processado
//   4. Se já existe → ignora silenciosamente
//
// INTERVALO:
//   Configurável via .env com MONITOR_INTERVALO_MINUTOS.
//   Padrão: 5 minutos (ajustado para resposta rápida da IAra).

import { listarArquivosDaPasta, extrairTextoDoDrive } from './driveService.js';
import { salvarDocumentoNoPinecone } from './ragServices.js';
import { jaFoiProcessado, marcarComoProcessado } from '../models/monitorModel.js';
import 'dotenv/config';

// Intervalo em milissegundos (padrão: 5 minutos)
const INTERVALO_MS = (parseInt(process.env.MONITOR_INTERVALO_MINUTOS) || 5) * 60 * 1000;

// ID da pasta monitorada — obrigatório no .env
const FOLDER_ID = process.env.DRIVE_FOLDER_ID;


//! Executa uma verificação completa da pasta
async function verificarPasta() {
    if (!FOLDER_ID) {
        console.warn('⚠️  [MONITOR] DRIVE_FOLDER_ID não definido no .env — monitoramento desativado.');
        return;
    }

    console.log(`\n🔄 [MONITOR] Verificando pasta do Drive por arquivos novos...`);

    let arquivos;
    try {
        arquivos = await listarArquivosDaPasta(FOLDER_ID);
    } catch (error) {
        console.error(`❌ [MONITOR] Falha ao listar arquivos: ${error.message}`);
        return;
    }

    if (!arquivos?.length) {
        console.log(`   Nenhum PDF encontrado na pasta.`);
        return;
    }

    // Filtra só os novos, sem awaitar todos de uma vez
    // (verificação sequencial para não sobrecarregar o Firestore)
    const arquivosNovos = [];
    for (const arquivo of arquivos) {
        const jaProcessado = await jaFoiProcessado(arquivo.id);
        if (!jaProcessado) arquivosNovos.push(arquivo);
    }

    if (!arquivosNovos.length) {
        console.log(`   ✓ Nenhum arquivo novo. (${arquivos.length} já processados)`);
        return;
    }

    console.log(`   📥 ${arquivosNovos.length} arquivo(s) novo(s) encontrado(s)!`);

    // Processa cada arquivo novo
    for (const arquivo of arquivosNovos) {
        console.log(`\n   🧠 [MONITOR] Aprendendo: ${arquivo.name}`);
        try {
            const texto = await extrairTextoDoDrive(arquivo.id);

            await salvarDocumentoNoPinecone(texto, {
                origem:          'Google Drive',
                arquivoId:       arquivo.id,
                nomeArquivo:     arquivo.nome,
                dataAprendizado: new Date().toISOString(),
            });

            // Só marca como processado se o aprendizado foi bem-sucedido
            await marcarComoProcessado(arquivo.id, arquivo.name);

            console.log(`   ✅ [MONITOR] "${arquivo.name}" aprendido e registrado!`);

        } catch (error) {
            // Não marca como processado em caso de erro —
            // assim tentará de novo na próxima verificação
            console.error(`   ❌ [MONITOR] Erro em "${arquivo.name}": ${error.message}`);
        }
    }

    console.log(`\n   🎉 [MONITOR] Verificação concluída.`);
}


//! Inicia o monitor — chamado uma vez no server.js
export function iniciarMonitor() {
    if (!FOLDER_ID) {
        console.warn('⚠️  [MONITOR] DRIVE_FOLDER_ID ausente no .env. Monitor não iniciado.');
        return;
    }

    const intervaloMin = parseInt(process.env.MONITOR_INTERVALO_MINUTOS) || 60;

    console.log(`\n🟢 [MONITOR] Iniciado. Verificando a cada ${intervaloMin} minutos.`);
    console.log(`   Pasta: ${FOLDER_ID}`);

    // Primeira verificação imediata ao ligar o servidor
    // (com pequeno delay para o servidor terminar de subir)
    setTimeout(verificarPasta, 5000);

    // Verificações periódicas
    setInterval(verificarPasta, INTERVALO_MS);
}


//! Permite forçar uma verificação manual (usada pelo endpoint admin)
export { verificarPasta };