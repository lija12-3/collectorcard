import { Migration } from '@mikro-orm/migrations';

export class Migration20251015162916UpdateUserEntityStructure extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create type "user_status_enum" as enum('active', 'inactive', 'deleted');`,
    );

    this.addSql(
      `create table "user_master" ("user_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "nick_name" varchar(100) null, "dob" date not null, "zipcode" varchar(20) not null, "is_email_verified" boolean not null default false, "email_verified_at" timestamptz null, "user_status" "user_status_enum" not null default 'active', constraint "user_master_pkey" primary key ("user_id"));`,
    );
    this.addSql(
      `create index "user_master_email_index" on "user_master" ("email");`,
    );
    this.addSql(
      `alter table "user_master" add constraint "user_master_email_unique" unique ("email");`,
    );

    this.addSql(
      `create table "user_history" ("user_history_id" varchar(255) not null, "user_id" varchar(255) not null, "user_user_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "field_name" varchar(255) not null, "field_value" text not null, "old_value" text null, "new_value" text null, constraint "user_history_pkey" primary key ("user_history_id"));`,
    );

    this.addSql(
      `alter table "user_history" add constraint "user_history_user_user_id_foreign" foreign key ("user_user_id") references "user_master" ("user_id") on update cascade;`,
    );

    // Drop old users table if it exists
    this.addSql(`drop table if exists "users" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "user_history" drop constraint "user_history_user_user_id_foreign";`,
    );

    this.addSql(
      `create table "users" ("id" varchar(255) not null, "email" varchar(255) not null, "first_name" varchar(255) null, "nick_name" varchar(100) null, "last_name" varchar(255) null, "dob" date null, "zipcode" varchar(20) null, "phone_number" varchar(255) null, "is_active" boolean not null default true, "is_email_verified" boolean not null default false, "is_phone_verified" boolean not null default false, "profile_data" jsonb null, "preferences" jsonb null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "last_login_at" timestamptz null, "email_verified_at" timestamptz null, "phone_verified_at" timestamptz null, constraint "users_pkey" primary key ("id"));`,
    );
    this.addSql(`create index "users_email_index" on "users" ("email");`);
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );

    this.addSql(`drop table if exists "user_master" cascade;`);

    this.addSql(`drop table if exists "user_history" cascade;`);

    this.addSql(`drop type if exists "user_status_enum";`);
  }
}
