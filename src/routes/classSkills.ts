import Router from "@koa/router";
import prisma from "../../prisma/client";
import { Class, USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../middlewares/middlewareAuth";
import { classSchema } from "../../prisma/validation/validationClass";
import { classExists } from "../middlewares/middlewareClass";

const router = new Router({
  prefix: "/skills/class/",
});

// GET /: retrieve all skills for a class
router.get(
  "/:idClass",
  authUser, classExists,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),
  async (ctx) => {
    const id = ctx.params.idClass

    try {
      const classSkills = await prisma.classSkillMod.findMany({
        where: {
          idClass: id
        },
        include: {
          skill: true,
        }
      });

      if (classSkills.length === 0) {
        ctx.status = 404;
        ctx.body = "No skills found for this class";
        return;
      }

      ctx.status = 200;
      ctx.body = classSkills;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

export default router;