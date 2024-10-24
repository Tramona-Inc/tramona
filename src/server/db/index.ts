import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import { env } from "@/env";
import {
  type BuildQueryResult,
  type DBQueryConfig,
  type ExtractTablesWithRelations,
} from "drizzle-orm";

const client = postgres(env.DATABASE_URL, { prepare: false, max: 1 });

export const db = drizzle(client, { schema });

///////// InferQueryModel type helper //////////////

type Schema = typeof schema;
type TablesWithRelations = ExtractTablesWithRelations<Schema>;

type IncludeRelation<TableName extends keyof TablesWithRelations> =
  DBQueryConfig<
    "one" | "many",
    boolean,
    TablesWithRelations,
    TablesWithRelations[TableName]
  >["with"];

type IncludeColumns<TableName extends keyof TablesWithRelations> =
  DBQueryConfig<
    "one" | "many",
    boolean,
    TablesWithRelations,
    TablesWithRelations[TableName]
  >["columns"];

export type InferQueryModel<
  TableName extends keyof TablesWithRelations,
  Options extends {
    columns?: IncludeColumns<TableName>;
    with?: IncludeRelation<TableName>;
    // eslint-disable-next-line @typescript-eslint/ban-types
  } = {},
> = BuildQueryResult<
  TablesWithRelations,
  TablesWithRelations[TableName],
  {
    columns: Options["columns"];
    with: Options["with"];
  }
>;
