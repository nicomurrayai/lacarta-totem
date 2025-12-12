import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Función para verificar credenciales
export const verifyUser = mutation({
  args: {
    userName: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Buscar el usuario por nombre de usuario
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userName"), args.userName))
      .first();

    // Si no existe el usuario, retornar null
    if (!user) {
      return null;
    }

    // Verificar la contraseña (en producción deberías usar hashing)
    if (user.password === args.password) {
      return {
        id: user._id,
        userName: user.userName,
      };
    }

    return null;
  },
});