import express from "express";
import generosRouter from "./routes/generos";
import jogosRouter from "./routes/jogos";
import plataformasRouter from "./routes/plataformas";

const app = express();
const PORT = 3001;

app.use(express.json());

app.use("/generos", generosRouter);
app.use("/jogos", jogosRouter);
app.use("/plataformas", plataformasRouter);

const server = app.listen(PORT, () => {
    console.log(`Servidor executando em localhost:${PORT}`)
});

server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Erro: A porta ${PORT} já está em uso.`);
    } else {
        console.error('Erro no servidor:', err);
    }
});
