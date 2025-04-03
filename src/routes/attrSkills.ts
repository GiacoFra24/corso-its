import Router from "@koa/router";
import prisma from "../../prisma/client";
import { Attribute, USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../middlewares/middlewareAuth";
import { attributeSchema } from "../../prisma/validation/validationAttribute";
import { attributeExists } from "../middlewares/middlewareAttribute";

const router = new Router({
  prefix: "/skills/attr",
});

// GET /: retrive all skills for an attribute
router.get(
  "/:idAttribute",
  authUser, attributeExists,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),

  async (ctx) => {
    const id = ctx.params.id
    
    try {
      const attrSkills = await prisma.skill.findMany({
        where: {
          id: id
        },
        include: {
          attribute: true
        }
      });

      if (attrSkills.length === 0) {
        ctx.status = 404;
        ctx.body = "No skills found for this attribute";
        return;
      }

      ctx.status = 200;
      ctx.body = attrSkills;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

export default router;