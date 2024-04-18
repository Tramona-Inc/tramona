import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import { env } from "@/env";
import {
  type BuildQueryResult,
  type DBQueryConfig,
  type ExtractTablesWithRelations,
} from "drizzle-orm";

const client = postgres(env.DATABASE_URL, { max: 1 });
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
  Columns extends IncludeColumns<TableName> | undefined = undefined,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TablesWithRelations,
  TablesWithRelations[TableName],
  {
    columns: Columns;
    with: With;
  }
>;
