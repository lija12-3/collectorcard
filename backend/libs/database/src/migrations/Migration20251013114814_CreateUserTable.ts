import { Migration } from '@mikro-orm/migrations';

export class Migration20251013114814_CreateUserTable extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE \`users\` (
        \`id\` varchar(36) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`first_name\` varchar(255) NULL,
        \`nick_name\` varchar(100) NULL,
        \`last_name\` varchar(255) NULL,
        \`dob\` date NULL,
        \`zipcode\` varchar(20) NULL,
        \`phone_number\` varchar(255) NULL,
        \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
        \`is_email_verified\` tinyint(1) NOT NULL DEFAULT 0,
        \`is_phone_verified\` tinyint(1) NOT NULL DEFAULT 0,
        \`profile_data\` json NULL,
        \`preferences\` json NULL,
        \`created_at\` datetime NOT NULL,
        \`updated_at\` datetime NOT NULL,
        \`last_login_at\` datetime NULL,
        \`email_verified_at\` datetime NULL,
        \`phone_verified_at\` datetime NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`users_email_unique\` (\`email\`),
        INDEX \`users_email_index\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS \`users\`;`);
  }

}
