import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

// Listar todos os jogos
router.get("/", async (req: Request, res: Response) => {
    try {
        const jogos = await prisma.jogo.findMany({
            include: {
                genero: true,
                plataformas: true
            }
        });
        res.json(jogos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar jogos" });
    }
});

// Cadastrar um novo jogo
router.post("/", async (req: Request, res: Response) => {
    const { titulo, idGenero, plataformasIds } = req.body;

    if (!titulo || typeof titulo !== "string" || titulo.trim() === "") {
        return res.status(400).json({
            erro: "O campo título é obrigatório."
        });
    }

    if (!idGenero || typeof idGenero !== "number") {
        return res.status(400).json({
            erro: "O campo idGenero é obrigatório e deve ser um número."
        });
    }

    try {
        const data: any = {
            titulo: titulo.trim(),
            idGenero: idGenero
        };

        if (plataformasIds && Array.isArray(plataformasIds)) {
            data.plataformas = {
                connect: plataformasIds.map((id: number) => ({ id }))
            };
        }

        const jogo = await prisma.jogo.create({
            data,
            include: {
                genero: true,
                plataformas: true
            }
        });

        res.status(201).json(jogo);
    } catch (ex: any) {
        if (ex.code === 'P2002') {
            return res.status(400).json({ erro: "Este jogo já existe." });
        }
        if (ex.code === 'P2025' || ex.code === 'P2003') {
            return res.status(400).json({ erro: "Gênero ou Plataforma não encontrado." });
        }
        console.error(ex);
        res.status(500).json({
            erro: "Erro ao cadastrar jogo."
        });
    }
});

// Atualizar um jogo
router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { titulo, idGenero, plataformasIds } = req.body;

    if (!titulo || typeof titulo !== "string" || titulo.trim() === "") {
        return res.status(400).json({
            erro: "O campo título é obrigatório."
        });
    }

    if (!idGenero || typeof idGenero !== "number") {
        return res.status(400).json({
            erro: "O campo idGenero é obrigatório e deve ser um número."
        });
    }

    try {
        const data: any = {
            titulo: titulo.trim(),
            idGenero: idGenero
        };

        if (plataformasIds && Array.isArray(plataformasIds)) {
            data.plataformas = {
                set: plataformasIds.map((id: number) => ({ id }))
            };
        }

        const jogo = await prisma.jogo.update({
            where: { id },
            data,
            include: {
                genero: true,
                plataformas: true
            }
        });

        res.json(jogo);
    } catch (ex: any) {
        if (ex.code === 'P2025') {
            return res.status(404).json({
                erro: "Jogo, Gênero ou Plataforma não encontrado."
            });
        }
        console.error(ex);
        res.status(500).json({
            erro: "Erro ao atualizar jogo."
        });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        await prisma.jogo.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (ex) {
        if ((ex as any).code === 'P2025') {
            return res.status(404).json({
                erro: "Jogo não encontrado"
            });
        }
        console.error(ex);
        res.status(500).json({
            erro: "Erro ao deletar jogo."
        });
    }
});

router.patch("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { titulo, idGenero, plataformasIds } = req.body;

    try {
        const data: any = {};
        
        if (titulo !== undefined) {
            if (typeof titulo !== "string" || titulo.trim() === "") {
                return res.status(400).json({ erro: "O campo título não pode ser vazio." });
            }
            data.titulo = titulo.trim();
        }

        if (idGenero !== undefined) {
            if (typeof idGenero !== "number") {
                return res.status(400).json({ erro: "O campo idGenero deve ser um número." });
            }
            data.idGenero = idGenero;
        }

        if (plataformasIds !== undefined) {
            if (!Array.isArray(plataformasIds)) {
                return res.status(400).json({ erro: "O campo plataformasIds deve ser um array." });
            }
            data.plataformas = {
                set: plataformasIds.map((id: number) => ({ id }))
            };
        }

        const jogo = await prisma.jogo.update({
            where: { id },
            data,
            include: {
                genero: true,
                plataformas: true
            }
        });

        res.json(jogo);
    } catch (ex: any) {
        if (ex.code === 'P2025' || ex.code === 'P2003') {
            return res.status(404).json({
                erro: "Jogo, Gênero ou Plataforma não encontrado"
            });
        }
        console.error(ex);
        res.status(500).json({
            erro: "Erro ao atualizar jogo."
        });
    }
});

export default router;
