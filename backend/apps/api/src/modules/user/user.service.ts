import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager, FilterQuery } from '@mikro-orm/core';
import { User, UserHistory, UserStatus, BaseRepository } from '@libs/database';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';

@Injectable()
export class UserService extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    userRepository: EntityRepository<User>,
    em: EntityManager,
  ) {
    super(userRepository, em);
  }

  // Override create method to use proper DTO
  async create(data: CreateUserDto): Promise<User> {
    const entity = this.repository.create(data);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  // Override update method to use proper DTO
  async update(id: string | number, data: UpdateUserDto): Promise<User | null> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }

    Object.assign(entity, data);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  // Business-specific methods that extend BaseRepository functionality

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email });
  }

  async findByEmailOrNickName(identifier: string): Promise<User | null> {
    return await this.findOne({
      $or: [{ email: identifier }, { nick_name: identifier }],
    });
  }

  async findAll(
    options: UserQueryDto = {},
  ): Promise<{ users: User[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      user_status,
      is_email_verified,
    } = options;

    const where: FilterQuery<User> = {};

    if (user_status !== undefined) {
      where.user_status = user_status;
    }

    if (is_email_verified !== undefined) {
      where.is_email_verified = is_email_verified;
    }

    if (search) {
      where.$or = [
        { email: { $like: `%${search}%` } },
        { first_name: { $like: `%${search}%` } },
        { nick_name: { $like: `%${search}%` } },
        { last_name: { $like: `%${search}%` } },
        { zipcode: { $like: `%${search}%` } },
      ];
    }

    const [users, total] = await this.findAndCount(where, {
      limit,
      offset: (page - 1) * limit,
      orderBy: { created_at: 'DESC' },
    });

    return { users, total };
  }

  async softDelete(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) {
      return false;
    }

    user.user_status = UserStatus.DELETED;
    await this.em.persistAndFlush(user);
    return true;
  }

  async verifyEmail(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) {
      return false;
    }

    user.is_email_verified = true;
    user.email_verified_at = new Date();
    await this.em.persistAndFlush(user);
    return true;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.exists({ email });
  }

  async existsByNickName(nick_name: string): Promise<boolean> {
    return await this.exists({ nick_name });
  }

  // User History methods
  async createUserHistory(
    user_id: string,
    field_name: string,
    field_value: string,
    old_value?: string,
    new_value?: string,
  ): Promise<UserHistory> {
    const userHistory = new UserHistory({
      user_id,
      field_name,
      field_value,
      old_value,
      new_value,
    });

    await this.em.persistAndFlush(userHistory);
    return userHistory;
  }

  async getUserHistory(user_id: string): Promise<UserHistory[]> {
    return await this.em.find(
      UserHistory,
      { user_id },
      {
        orderBy: { created_at: 'DESC' },
      },
    );
  }
}
