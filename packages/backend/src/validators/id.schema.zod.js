import { z } from "zod";

export const createIdMongoSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Id inválido")