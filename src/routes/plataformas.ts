import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

// Listar todas as plataformas
router.get("/", async (req: Request, res: Response) => {
    try {
        const plataformas = await prisma.plataforma.findMany({
            include: {
                jogos: true
            }
        });
        res.json(plataformas);
    } catch (ex) {
        console.error("Erro ao buscar plataformas:", ex);
        res.status(500).json({
            erro: "Erro ao buscar plataformas"
        });
    }
});

// Buscar uma plataforma por ID
router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const plataforma = await prisma.plataforma.findUnique({
            where: { id },
            include: {
                jogos: true
            }
        });

        if (!plataforma) {
            return res.status(404).json({
                erro: "Plataforma não encontrada"
            });
        }

        res.json(plataforma);
    } catch (ex) {
        console.error("Erro ao buscar plataforma:", ex);
        res.status(500).json({
            erro: "Erro ao buscar plataforma"
        });
    }
});

// Cadastrar uma nova plataforma
router.post("/", async (req: Request, res: Response) => {
    const { nome } = req.body;

    if (!nome || typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({
            erro: "O campo nome da plataforma é obrigatório."
        });
    }

    try {
        const plataforma = await prisma.plataforma.create({
            data: {
                nome: nome.trim()
            },
            include: {
                jogos: true
            }
        });

        res.status(201).json(plataforma);
    } catch (ex) {
        res.status(500).json({
            erro: "Erro ao cadastrar plataforma."
        });
    }
});

// Atualizar uma plataforma
router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { nome } = req.body;

    if (!nome || typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({
            erro: "O campo nome da plataforma é obrigatório."
        });
    }

    try {
        const plataforma = await prisma.plataforma.update({
            where: { id },
            data: {
                nome: nome.trim()
            },
            include: {
                jogos: true
            }
        });

        res.json(plataforma);
    } catch (ex) {
        if ((ex as any).code === 'P2025') {
            return res.status(404).json({
                erro: "Plataforma não encontrada"
            });
        }
        res.status(500).json({
            erro: "Erro ao atualizar plataforma."
        });
    }
});

// Remover uma plataforma
router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        await prisma.plataforma.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (ex) {
        if ((ex as any).code === 'P2025') {
            return res.status(404).json({
                erro: "Plataforma não encontrada"
            });
        }
        res.status(500).json({
            erro: "Erro ao remover plataforma."
        });
    }
});

export default router;
