import { sql } from "drizzle-orm";

import { text, sqliteTable,} from "drizzle-orm/sqlite-core";

export const administrator = sqliteTable("administrator", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const applicant = sqliteTable("applicant", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    // json data about the applicant e.g. { age, income, etc }
    fields: text('fields').notNull(),
    createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const scheme = sqliteTable("scheme", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    // json data about the eligibity criteria e.g. { age, income, etc }
    eligibility: text('eligibility').notNull(),
    createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});


export const application = sqliteTable("application", {
    id: text('id').primaryKey(),
    applicant_id: text('applicant_id').notNull().references(() => applicant.id),
    scheme_id: text('scheme_id').notNull().references(() => scheme.id),
    status: text('status').notNull(),
    createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});