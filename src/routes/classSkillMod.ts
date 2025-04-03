import Router from "@koa/router";
import prisma from "../../prisma/client";
import { ClassSkillMod, USER_ROLE } from "@prisma/client";
import { classSkillModSchema } from "../../prisma/validation/validationClassSkillMod";
import { ZodError } from "zod";
import { validationError } from "../utilities/errorsHandler";
import { classSkillModExists } from "../middlewares/middlewareClassSkillMod";
import { authUser, userRole } from "../middlewares/middlewareAuth";
import { classExists } from "../middlewares/middlewareClass";

const router = new Router();

// GET /: retrive all class/skill mods
router.get(
  "/class/skill/mod",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      const data = await prisma.classSkillMod.findMany();
      ctx.status = 201;
      ctx.body = data;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

// POST /class/:idClass/skill/:idSkill: create a modificator for class/skill
router.post(
  "/class/:idClass/skill/:idSkill",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      ctx.request.body = classSkillModSchema.parse(ctx.request.body);
      const data = ctx.request.body as ClassSkillMod;

      const idClass = ctx.params.idClass;
      const idSkill = ctx.params.idSkill;

      if (!idClass || !idSkill) {
        ctx.status = 400;
        ctx.body = "Error: idClass and idSkill are required";
        return;
      }

      try {
        const classSkillPivot = await prisma.classSkillMod.create({
          data: {
            idSkill: idSkill,
            idClass: idClass,
            value: data.value,
          },
        });

        ctx.status = 201;
        ctx.body =
          "Pivot table of Class and Skill created: Class -> " +
          classSkillPivot.idClass +
          " Skill -> " +
          classSkillPivot.idSkill;
      } catch (error) {
        ctx.status = 500;
        ctx.body = "Error: " + error;
      }
    } catch (error) {
      ctx.status = 500;
      if (error instanceof ZodError) {
        ctx.body = validationError(error);
      } else {
        ctx.body = "Generic Error: " + error;
      }
    }
  }
);

// GET /class/:idClass/skill/:idSkill: return a single class/skill mods
router.get(
  "/class/:idClass/skill/:idSkill",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const idClass = ctx.params.idClass;
    const idSkill = ctx.params.idSkill;

    if (!idClass || !idSkill) {
      ctx.status = 400;
      ctx.body = "Error: idClass and idSkill are required";
      return;
    }

    try {
      const data = await prisma.classSkillMod.findUnique({
        where: {
          idSkill_idClass: {
            idClass: idClass,
            idSkill: idSkill,
          },
        },
      });

      if (!data) {
        ctx.status = 404;
        ctx.body = "not found";
        return;
      } else {
        ctx.status = 201;
        ctx.body = data;
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

// PATCH /:id: update single class/skill mod
router.patch(
  "/class/:idClass/skill/:idSkill",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  classSkillModExists,
  async (ctx) => {
    const idClass = ctx.params.idClass;
    const idSkill = ctx.params.idSkill;
    const data = ctx.request.body as ClassSkillMod;

    try {
      const classSkillMod = await prisma.classSkillMod.update({
        where: {
          idSkill_idClass: {
            idClass: idClass,
            idSkill: idSkill,
          },
        },
        data: {
          value: data.value,
        },
      });

      ctx.status = 201;
      ctx.body =
        "Pivot table of Class and Skill modified: Class -> " +
        classSkillMod.idClass +
        " Skill -> " +
        classSkillMod.idSkill +
        " with value: -> " +
        classSkillMod.value;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

// DELETE /:id: delete single class/skill mod
router.delete(
  "/class/:idClass/skill/:idSkill",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  classSkillModExists,
  async (ctx) => {
    const idClass = ctx.params.idClass;
    const idSkill = ctx.params.idSkill;

    try {
      const classSkillMod = await prisma.classSkillMod.delete({
        where: {
          idSkill_idClass: {
            idClass: idClass,
            idSkill: idSkill,
          },
        },
      });

      ctx.status = 200;
      ctx.body =
        "Pivot table of Class and Skill deleted: Class -> " +
        classSkillMod.idClass +
        " Skill -> " +
        classSkillMod.idSkill;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

// GET /class/:idClass/skill: get single class with relative skills
router.get(
  "/class/:idClass/skill",
  authUser,
  classExists,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const idClass = ctx.params.idClass;

    try {
      const clazz = await prisma.classSkillMod.findMany({
        where: {
          idClass,
        },
        include: {
          skill: true,
        },
      });

      if (!clazz) {
        ctx.status = 404;
        ctx.body = { error: "class not found" };
        return;
      } else {
        ctx.status = 201;
        ctx.body = clazz;
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Unable to find the requested class information" };
    }
  }
);

export default router;
