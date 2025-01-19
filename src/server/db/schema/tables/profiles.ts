import { pgTable } from "drizzle-orm/pg-core";
import { varchar, index, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";

export const profiles = pgTable(
  "profiles",
  {
    // NextAuth fields
    userId: varchar("user_id")
      .notNull()
      .primaryKey()
      .references(() => users.id),

    // Profile fields
    aboutYou: varchar("about", { length: 450 }),
    school: varchar("school", { length: 40 }),
    work: varchar("work", { length: 20 }),
    pets: varchar("pets", { length: 40 }),
    funFact: varchar("fun_fact", { length: 40 }),
    favoriteSong: varchar("favorite_song", {
      length: 40,
    }),
    biographyTitle: varchar("biography_title", { length: 40 }),
    languagesSpoken: varchar("languages_spoken", { length: 40 }),
    dreamDestination: varchar("dream_destination", { length: 40 }),
    hostingHabits: varchar("hosting_habits", { length: 40 }),
    showBirthDecade: boolean("show_birth_decade").default(false).notNull(),
    tooMuchTime: varchar("too_much_time", { length: 40 }),
    uselessSkill: varchar("useless_skill", { length: 40 }),
    forGuests: varchar("for_guests", { length: 40 }),
    obsession: varchar("obsession", { length: 40 }),
    location: varchar("location", { length: 40 }),
  },
  (t) => ({
    users: index().on(t.userId),
  }),
);
