import { sql } from "drizzle-orm";

import {
  text,
  integer,
  sqliteTable,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const administrator = sqliteTable("administrator", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const applicant = sqliteTable("applicant", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  // json data about the applicant e.g. { age, income, etc }
  fields: text("fields").notNull(),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const scheme = sqliteTable("scheme", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  // json data about the eligibity criteria e.g. { age, income, etc }
  eligibility: text("eligibility").notNull(),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const application = sqliteTable(
  "application",
  {
    applicant_id: integer("applicant_id")
      .notNull()
      .references(() => applicant.id),
    scheme_id: integer("scheme_id")
      .notNull()
      .references(() => scheme.id),
    status: text("status", {
      enum: ["pending", "successful", "unsuccessful"],
    }).notNull(),
    createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.applicant_id, table.scheme_id] }),
    };
  }
);
