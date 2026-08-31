-- Support joins, cascading deletes, and ownership lookups on application foreign keys.

CREATE INDEX IF NOT EXISTS "portfolio_auth_email_verifications_user_id_idx"
  ON "portfolio_auth"."email_verifications" ("user_id");

CREATE INDEX IF NOT EXISTS "portfolio_auth_sned_progress_item_id_idx"
  ON "portfolio_auth"."sned_progress" ("item_id");

CREATE INDEX IF NOT EXISTS "portfolio_auth_teacher_schedule_entries_schedule_id_idx"
  ON "portfolio_auth"."teacher_schedule_entries" ("schedule_id");

CREATE INDEX IF NOT EXISTS "portfolio_auth_teacher_schedules_user_id_idx"
  ON "portfolio_auth"."teacher_schedules" ("user_id");

CREATE INDEX IF NOT EXISTS "portfolio_auth_user_identities_user_id_idx"
  ON "portfolio_auth"."user_identities" ("user_id");

CREATE INDEX IF NOT EXISTS "saas_demo_inventory_movements_product_id_idx"
  ON "saas_demo"."inventory_movements" ("product_id");
