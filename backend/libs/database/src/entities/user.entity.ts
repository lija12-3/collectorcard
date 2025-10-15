import { Entity, PrimaryKey, Property, Index, Unique, Enum } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

@Entity({ tableName: 'user_master' })
@Index({ properties: ['email'] })
@Unique({ properties: ['email'] })
export class User {
  @PrimaryKey()
  user_id: string = uuidv4();

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();

  @Property({ length: 255 })
  email!: string;

  @Property({ length: 255 })
  first_name!: string;

  @Property({ length: 255 })
  last_name!: string;

  @Property({ length: 100, nullable: true })
  nick_name?: string;

  @Property({ type: 'date' })
  dob!: Date;

  @Property({ length: 20 })
  zipcode!: string;

  @Property({ default: false })
  is_email_verified: boolean = false;

  @Property({ nullable: true })
  email_verified_at?: Date;

  @Property({ type: 'enum', default: UserStatus.ACTIVE })
  user_status: UserStatus = UserStatus.ACTIVE;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
