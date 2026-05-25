import jwt from 'jsonwebtoken';

// 1. Defina aqui a mesma chave que está no seu .env
// Se você não sabe qual é, pode inventar uma agora para teste, 
// mas lembre-se que o seu .env do backend precisa ter a mesma!
const secret = "sua_chave_secreta_aqui"; 

const payload = { 
    id: "lucas_dev_test_01", // Um ID qualquer para representar você
    role: "professor"        // CRUCIAL: precisa ser professor para as rotas que você criou
};

try {
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    console.log("\n✅ TOKEN GERADO COM SUCESSO:");
    console.log("----------------------------");
    console.log(token);
    console.log("----------------------------\n");
    console.log("Copie o código acima e cole no Postman (Bearer Token).");
} catch (error) {
    console.error("Erro ao gerar o token:", error.message);
}