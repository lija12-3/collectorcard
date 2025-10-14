import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager, FilterQuery } from '@mikro-orm/core';
import { User, BaseRepository } from '@libs/database';
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
      $or: [{ email: identifier }, { nickName: identifier }],
    });
  }

  async findAll(
    options: UserQueryDto = {},
  ): Promise<{ users: User[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      isEmailVerified,
      isPhoneVerified,
    } = options;

    const where: FilterQuery<User> = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isEmailVerified !== undefined) {
      where.isEmailVerified = isEmailVerified;
    }

    if (isPhoneVerified !== undefined) {
      where.isPhoneVerified = isPhoneVerified;
    }

    if (search) {
      where.$or = [
        { email: { $like: `%${search}%` } },
        { firstName: { $like: `%${search}%` } },
        { nickName: { $like: `%${search}%` } },
        { lastName: { $like: `%${search}%` } },
        { zipcode: { $like: `%${search}%` } },
      ];
    }

    const [users, total] = await this.findAndCount(where, {
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'DESC' },
    });

    return { users, total };
  }

  async softDelete(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) {
      return false;
    }

    user.isActive = false;
    await this.em.persistAndFlush(user);
    return true;
  }

  async verifyEmail(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) {
      return false;
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    await this.em.persistAndFlush(user);
    return true;
  }

  async verifyPhone(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) {
      return false;
    }

    user.isPhoneVerified = true;
    user.phoneVerifiedAt = new Date();
    await this.em.persistAndFlush(user);
    return true;
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.lastLoginAt = new Date();
      await this.em.persistAndFlush(user);
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.exists({ email });
  }

  async existsByNickName(nickName: string): Promise<boolean> {
    return await this.exists({ nickName });
  }
}
