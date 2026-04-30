import { cadastrarUsuarioService, loginUsuarioService, editarUsuarioService, deletarUsuarioService, solicitarRecuperacao, realizarResetSenha} from "../services/usuarioService.js";



/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


//!CADASTRO
const cadastrarUsuarioController = async (req, res) => { //? req = request / res = response

    try {
        const dados = req.body //? o body é um tipo de parametro em formato de json, ele vai receber os dados e colocar dentro da variavel "dados"
        const resultado = await cadastrarUsuarioService(dados) //? aqui ele ta jogando os dados recebidos pelo cliente para o service que ira fazer todas as verificações e regras de negocios de la
        
        res.status(201).json(resultado) //?se tudo der certo no service ele vai cair aqui e retornar um status http 201 o famoso "criou algo"
    } catch (error) {
        res.status(400).json({ erro: error.message }); //? se tiver algo errado la ele cai aqui no bloco catch e retorna o status 400 de erro do lado do cliente
    }
  
}

const loginUsuarioController = async (req, res) => {
    try {
        const dados = req.body
        const resultado = await loginUsuarioService(dados)

        res.status(200).json(resultado)
        
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
    
}

//! Editar usuário

const editarUsuarioController = async(req, res) => {
    try {
        const novosDados = req.body;

        const idUsuarioAutenticado = req.userId;

        const resultado = await editarUsuarioService(idUsuarioAutenticado, novosDados);

        res.status(200).json("dados atualizados com sucesso", resultado);
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
}

//! Deletar usuário

const deletarUsuarioController = async (req, res) => {
    try {
        const idUsuarioAutenticado = req.userId;

        const resultado = await deletarUsuarioService(idUsuarioAutenticado);

        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const esqueciSenhaController = async (req, res) => {
    try {
        const { email } = req.body;
        await solicitarRecuperacao(email);
        res.status(200).json({ message: "E-mail enviado com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


 const resetarSenhaController = async (req, res) => {
    try {
        const { token, novaSenha } = req.body;
        await realizarResetSenha(token, novaSenha);
        res.status(200).json({ message: "Senha alterada com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const aprovarProfessorController = async (req, res) => {
    try {
        const { token, id } = req.query
 
        if (!token || !id) {
            return res.status(400).send(`
                <h2>Link inválido.</h2>
                <p>Parâmetros ausentes. Verifique o e-mail e tente novamente.</p>
            `)
        }
 
        const resultado = await aprovarProfessorService(token, id)
 
        // Responde com HTML simples — é o admin clicando num link no e-mail
        res.status(200).send(`
            <html>
            <body style="font-family:sans-serif; text-align:center; padding:60px; background:#f9f5ff;">
                <h2 style="color:#420583;">✅ ${resultado.mensagem}</h2>
                <p>O professor já pode fazer login na plataforma IAra.</p>
                <p>Você pode fechar esta janela.</p>
            </body>
            </html>
        `)
    } catch (error) {
        res.status(400).send(`
            <html>
            <body style="font-family:sans-serif; text-align:center; padding:60px; background:#fff0f0;">
                <h2 style="color:#cc0000;">❌ Erro na aprovação</h2>
                <p>${error.message}</p>
                <p>Você pode fechar esta janela.</p>
            </body>
            </html>
        `)
    }
}



export {cadastrarUsuarioController,
    loginUsuarioController,
    editarUsuarioController,
    deletarUsuarioController, 
    esqueciSenhaController,
    resetarSenhaController,
    aprovarProfessorController};
