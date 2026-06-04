import { z } from "zod";

export const createSedeSchema = z.object({
    nombre: z.string().min(1),
    direccion: z.string().min(1)
}); 