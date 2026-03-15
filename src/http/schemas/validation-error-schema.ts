import { z } from 'zod'

export const ValidationErrorSchema = z.object({
  message: z.string().describe('Falha na validação'),
  details: z.array(
    z.object({
      keyword: z.string(),
      instancePath: z.string(),
      schemaPath: z.string(),
      message: z.string(),
      params: z.object({
        origin: z.string(),
        minimum: z.number(),
        inclusive: z.boolean(),
      }),
    }),
  ).optional(),
})