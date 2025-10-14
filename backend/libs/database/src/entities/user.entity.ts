import { Entity, PrimaryKey, Property, Index, Unique } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'users' })
@Index({ properties: ['email'] })
@Unique({ properties: ['email'] })
export class User {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ length: 255 })
  email!: string;

  @Property({ length: 255, nullable: true })
  firstName?: string;

  @Property({ length: 100, nullable: true })
  nickName?: string;

  @Property({ length: 255, nullable: true })
  lastName?: string;

  @Property({ type: 'date', nullable: true })
  dob?: Date;

  @Property({ length: 20, nullable: true })
  zipcode?: string;

  @Property({ length: 255, nullable: true })
  phoneNumber?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Property({ default: false })
  isEmailVerified: boolean = false;

  @Property({ default: false })
  isPhoneVerified: boolean = false;

  @Property({ type: 'jsonb', nullable: true })
  profileData?: Record<string, any>;

  @Property({ type: 'jsonb', nullable: true })
  preferences?: Record<string, any>;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  lastLoginAt?: Date;

  @Property({ nullable: true })
  emailVerifiedAt?: Date;

  @Property({ nullable: true })
  phoneVerifiedAt?: Date;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
