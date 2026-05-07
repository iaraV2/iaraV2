
import app from './app.js';
import { iniciarMonitor } from './services/monitorService.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n Servidor rodando na porta ${PORT}`);

    // Inicia o monitor de pasta do Drive
    // Verifica arquivos novos ao subir e depois no intervalo configurado
    iniciarMonitor();
});