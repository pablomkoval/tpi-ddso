import { z } from "zod";

export const idMongoSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Id inválido")