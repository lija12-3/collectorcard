import { Migration } from '@mikro-orm/migrations';

export class Migration20251013114814_CreateUserTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "users" (
        "id" varchar(36) NOT NULL,
        "email" varchar(255) NOT NULL,
        "first_name" varchar(255) NULL,
        "nick_name" varchar(100) NULL,
        "last_name" varchar(255) NULL,
        "dob" date NULL,
        "zipcode" varchar(20) NULL,
        "phone_number" varchar(255) NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "is_email_verified" boolean NOT NULL DEFAULT false,
        "is_phone_verified" boolean NOT NULL DEFAULT false,
        "profile_data" jsonb NULL,
        "preferences" jsonb NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "last_login_at" timestamp NULL,
        "email_verified_at" timestamp NULL,
        "phone_verified_at" timestamp NULL,
        PRIMARY KEY ("id"),
        CONSTRAINT "users_email_unique" UNIQUE ("email")
      );
    `);

    this.addSql(`
      CREATE INDEX "users_email_index" ON "users" ("email");
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "users";`);
  }
}
