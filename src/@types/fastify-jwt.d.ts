
import { Role } from "@/dtos/user/user.ts"
import "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: string,
      role: Role
    } 
  }
}