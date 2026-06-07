//! arquivo para monitorar os arquivos processados, evitando processar o mesmo arquivo mais de uma vez


import { db } from '../config/firebase.js';

const COLECAO = 'arquivosProcessados';

//! Salva o registro de que um arquivo foi processado
export const marcarComoProcessado = async (fileId, nome) => {
    try {
        await db.collection(COLECAO).doc(fileId).set({
            fileId,
            nome,
            processadoEm: new Date(),
        });
    } catch (error) {
        console.error('Erro ao marcar arquivo como processado:', error);
        throw error;
    }
};

//! Retorna true se o arquivo já foi processado alguma vez
export const jaFoiProcessado = async (fileId) => {
    try {
        const doc = await db.collection(COLECAO).doc(fileId).get();
        return doc.exists;
    } catch (error) {
        console.error('Erro ao verificar arquivo:', error);
        return false; // Em caso de falha, tenta processar (melhor processar duas vezes do que ignorar)
    }
};

//! Lista todos os IDs já processados (útil para diagnóstico)
export const listarProcessados = async () => {
    const snapshot = await db.collection(COLECAO).orderBy('processadoEm', 'desc').get();
    const lista = [];
    snapshot.forEach(doc => lista.push(doc.data()));
    return lista;
};