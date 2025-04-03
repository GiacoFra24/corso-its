import Router from "@koa/router";
import prisma from "../../prisma/client";
import { RaceAttrMod, USER_ROLE } from "@prisma/client";
import { RaceAttrModSchema } from "../../prisma/validation/validationRaceAttrMod";
import { validationError } from "../utilities/errorsHandler";
import { raceAttrModExsist } from "../middlewares/middlewareRaceAttrMod";
import { ZodError } from "zod";
import { authUser, userRole } from "../middlewares/middlewareAuth";
import { raceExists } from "../middlewares/middlewareRace";

const router = new Router();

// GET /: retrive all races attribute mode
router.get(
  "/race/attr/mod",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      const raceAttrMod = await prisma.raceAttrMod.findMany();
      ctx.status = 201;
      ctx.body = raceAttrMod;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

router.get(
  "/race/:idRace/attr/:idAttribute",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      ctx.request.body = RaceAttrModSchema.parse(ctx.request.body);
      const data = ctx.request.body as RaceAttrMod;

      const idRace = ctx.params.idRace;
      const idAttribute = ctx.params.idAttribute;

      if (!idRace || !idAttribute) {
        ctx.status = 400;
        ctx.body = "Error: idRace and idAttribute are required";
        return;
      }

      const raceAttrMod = await prisma.raceAttrMod.findUnique({
        where: {
          idRace_idAttribute: {
            idRace: idRace,
            idAttribute: idAttribute,
          },
        },
      });

      if (!raceAttrMod) {
        ctx.status = 404;
        ctx.body = "raceAttribute not found";
      }

      ctx.status = 200;
      ctx.body = raceAttrMod;
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

// POST /: create a raceAttrMod
router.post(
  "/race/:idRace/attr/:idAttribute",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      ctx.request.body = RaceAttrModSchema.parse(ctx.request.body);
      const data = ctx.request.body as RaceAttrMod;

      const idRace = ctx.params.idRace;
      const idAttribute = ctx.params.idAttribute;

      if (!idRace || !idAttribute) {
        ctx.status = 400;
        ctx.body = "Error: idRace and idAttribute are required";
        return;
      }

      try {
        const raceAttrMod = await prisma.raceAttrMod.create({
          data: {
            idRace: idRace,
            idAttribute: idAttribute,
            value: data.value,
          },
        });

        ctx.status = 201;
        ctx.body =
          "Race Attribute Relation created: " +
          "idRace: " +
          raceAttrMod.idRace +
          "idAttribute: " +
          raceAttrMod.idAttribute;
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

// PATCH /: update a raceAttrMod
router.patch(
  "/race/:idRace/attr/:idAttribute",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  raceAttrModExsist,
  async (ctx) => {
    try {
      ctx.request.body = RaceAttrModSchema.parse(ctx.request.body);
      const data = ctx.request.body as RaceAttrMod;

      const idRace = ctx.params.idRace;
      const idAttribute = ctx.params.idAttribute;

      if (!idRace || !idAttribute) {
        ctx.status = 400;
        ctx.body = "Error: idRace and idAttribute are required";
        return;
      }

      try {
        const raceAttrMod = await prisma.raceAttrMod.update({
          where: {
            idRace_idAttribute: {
              idRace: idRace,
              idAttribute: idAttribute,
            },
          },
          data: {
            value: data.value,
          },
        });

        ctx.status = 200;
        ctx.body =
          "Race Attribute Relation updated: " +
          "idRace: " +
          raceAttrMod.idRace +
          "idAttribute: " +
          raceAttrMod.idAttribute;
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

// DELETE /: delete a raceAttrMod
router.delete(
  "/race/:idRace/attr/:idAttribute",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  raceAttrModExsist,
  async (ctx) => {
    try {
      ctx.request.body = RaceAttrModSchema.parse(ctx.request.body);
      const data = ctx.request.body as RaceAttrMod;

      const idRace = ctx.params.idRace;
      const idAttribute = ctx.params.idAttribute;

      if (!idRace || !idAttribute) {
        ctx.status = 400;
        ctx.body = "Error: idRace and idAttribute are required";
        return;
      }

      try {
        const raceAttrMod = await prisma.raceAttrMod.delete({
          where: {
            idRace_idAttribute: {
              idRace: idRace,
              idAttribute: idAttribute,
            },
          },
        });

        ctx.status = 200;
        ctx.body = "Race Attribute Relation deleted correctly";
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

// GET /race/:idRace/attr get a race with relative attributes
router.get(
  "/race/:idRace/attr",
  authUser,
  raceExists,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const idRace = ctx.params.idRace;

    try {
      const race = await prisma.raceAttrMod.findMany({
        where: {
          idRace,
        },
        include: {
          attribute: true,
        },
      });

      if (!race) {
        ctx.status = 404;
        ctx.body = { error: "Race not found" };
        return;
      } else {
        ctx.status = 201;
        ctx.body = race;
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: `Unable to find the requested race information` };
    }
  }
);

export default router;
