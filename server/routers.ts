import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { deleteGalleryAsset, getGalleryAssets, insertGalleryAsset } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  gallery: router({
    list: publicProcedure.query(() => getGalleryAssets()),
    upload: adminProcedure
      .input(z.object({
        fileName: z.string().min(1).max(180),
        title: z.string().min(1).max(160),
        altText: z.string().min(1).max(240),
        mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        dataBase64: z.string().min(1).max(12_000_000),
      }))
      .mutation(async ({ ctx, input }) => {
        const data = Buffer.from(input.dataBase64, "base64");
        if (data.byteLength > 8 * 1024 * 1024) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Images must be smaller than 8 MB." });
        }
        const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "gallery-image";
        const stored = await storagePut(`gallery/${ctx.user.id}/${safeName}`, data, input.mimeType);
        return insertGalleryAsset({
          title: input.title,
          altText: input.altText,
          fileKey: stored.key,
          fileUrl: stored.url,
          mimeType: input.mimeType,
          createdBy: ctx.user.id,
        });
      }),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteGalleryAsset(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
