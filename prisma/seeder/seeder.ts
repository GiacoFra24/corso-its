import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Creazione di utenti
  await prisma.user.createMany({
    data: [
      {
        email: "admin@example.com",
        password: await bcrypt.hash("adminpass", 10),
        role: "ADMIN",
      },
      {
        email: "user0@example.com",
        password: await bcrypt.hash("userpass", 10),
        role: "GUEST",
      },
      {
        email: "user1@example.com",
        password: await bcrypt.hash("userpass", 10),
        role: "GUEST",
      },
    ],
  });

  // Creazione di razze
  await prisma.race.createMany({
    data: [
      {
        key: "human",
        name: "Human",
        modHealth: 10,
        modStamina: 10,
        modMana: 10,
      },
      {
        key: "elf",
        name: "Elf",
        modHealth: 5,
        modStamina: 15,
        modMana: 20,
      },
      {
        key: "dwarf",
        name: "Dwarf",
        modHealth: 20,
        modStamina: 10,
        modMana: 5,
      },
      {
        key: "orc",
        name: "Orc",
        modHealth: 25,
        modStamina: 5,
        modMana: 5,
      },
      {
        key: "gnome",
        name: "Gnome",
        modHealth: 5,
        modStamina: 5,
        modMana: 25,
      },
    ],
  });

  // Creazione di classi
  const classes = await prisma.class.createMany({
    data: [
      {
        key: "warrior",
        name: "Warrior",
        description: "A strong melee fighter.",
      },
      {
        key: "mage",
        name: "Mage",
        description: "A master of arcane magic.",
      },
      {
        key: "rogue",
        name: "Rogue",
        description: "A stealthy assassin.",
      },
      {
        key: "priest",
        name: "Priest",
        description: "A healer and support class.",
      },
      {
        key: "ranger",
        name: "Ranger",
        description: "A master of ranged weapons.",
      },
    ],
  });

  // Creazione di attributi
  const attributes = await prisma.attribute.createMany({
    data: [
      { key: "strength", name: "Strength", value: 20 },
      { key: "dexterity", name: "Dexterity", value: 20 },
      { key: "intelligence", name: "Intelligence", value: 20 },
      { key: "wisdom", name: "Wisdom", value: 20 },
      { key: "charisma", name: "Charisma", value: 20 },
    ],
  });

  // Recupero degli utenti, delle razze e degli attributi creati
  const userData = await prisma.user.findMany();
  const raceData = await prisma.race.findMany();
  const attributeData = await prisma.attribute.findMany();

  // Creazione di abilità
  const skills = await prisma.skill.createMany({
    data: [
      {
        key: "swordsmanship",
        name: "Swordsmanship",
        idAttribute: attributeData[0].id,
      },
      {
        key: "archery",
        name: "Archery",
        idAttribute: attributeData[1].id,
      },
      {
        key: "spellcasting",
        name: "Spellcasting",
        idAttribute: attributeData[2].id,
      },
      {
        key: "stealth",
        name: "Stealth",
        idAttribute: attributeData[3].id,
      },
      {
        key: "persuasion",
        name: "Persuasion",
        idAttribute: attributeData[4].id,
      },
    ],
  });
  console.log("Skills created!" + skills);

  // Creazione di modificatori di razza-attributo
  await prisma.raceAttrMod.createMany({
    data: [
      { idRace: raceData[0].id, idAttribute: attributeData[0].id, value: 2 },
      { idRace: raceData[1].id, idAttribute: attributeData[1].id, value: 3 },
      { idRace: raceData[2].id, idAttribute: attributeData[2].id, value: 4 },
    ],
  });

  // Recupero delle classi e delle abilità create
  const classData = await prisma.class.findMany();
  const skillData = await prisma.skill.findMany();

  // Creazione di modificatori di classe-abilità
  await prisma.classSkillMod.createMany({
    data: [
      { idClass: classData[0].id, idSkill: skillData[0].id, value: 5 },
      { idClass: classData[1].id, idSkill: skillData[1].id, value: 5 },
      { idClass: classData[2].id, idSkill: skillData[2].id, value: 5 },
    ],
  });

  // Creazione di personaggi
  const characters = await prisma.character.createMany({
    data: [
      {
        name: "Matheos",
        history: "A fallen prince.",
        age: 30,
        idRace: raceData[0].id,
        idClass: classData[0].id,
        userId: userData[0].id,
      },
      {
        name: "Nis",
        history: "A legendary archer.",
        age: 120,
        idRace: raceData[1].id,
        idClass: classData[1].id,
        userId: userData[0].id,
      },
      {
        name: "Phot",
        history: "A sturdy dwarf.",
        age: 90,
        idRace: raceData[2].id,
        idClass: classData[2].id,
        userId: userData[0].id,
      },
      {
        name: "Jacohm",
        history: "A wise wizard.",
        age: 500,
        idRace: raceData[3].id,
        idClass: classData[3].id,
        userId: userData[0].id,
      },
      {
        name: "Renzhus",
        history: "A powerful shaman.",
        age: 40,
        idRace: raceData[4].id,
        idClass: classData[4].id,
        userId: userData[0].id,
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
