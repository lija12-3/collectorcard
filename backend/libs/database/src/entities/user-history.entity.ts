import { Entity, PrimaryKey, Property, ManyToOne, Ref } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@Entity({ tableName: 'user_history' })
export class UserHistory {
  @PrimaryKey()
  user_history_id: string = uuidv4();

  @Property()
  user_id!: string;

  @ManyToOne(() => User, { ref: true })
  user!: Ref<User>;

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();

  @Property({ length: 255 })
  field_name!: string;

  @Property({ type: 'text' })
  field_value!: string;

  @Property({ type: 'text', nullable: true })
  old_value?: string;

  @Property({ type: 'text', nullable: true })
  new_value?: string;

  constructor(data?: Partial<UserHistory>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
