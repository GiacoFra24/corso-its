import Router from "@koa/router";
import prisma from "../../prisma/client";
import { Race, USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../middlewares/middlewareAuth";
import { raceSchema } from "../../prisma/validation/validationRace";
import { raceExists } from "../middlewares/middlewareRace";

const router = new Router({
  prefix: "/attrs/race",
});

// GET /: retrieve all attributes for a race
router.get(
  "/:idRace",
  authUser, raceExists,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),
  async (ctx) => {
    const id = ctx.params.id;

    try {
      const raceAttrs = await prisma.raceAttrMod.findMany({
        where: {
          idRace: id
        },
        include: {
          attribute: true,
        }
      });

      if (raceAttrs.length === 0) {
        ctx.status = 404;
        ctx.body = "No attributes found for this race";
        return;
      }

      ctx.status = 200;
      ctx.body = raceAttrs;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

export default router;