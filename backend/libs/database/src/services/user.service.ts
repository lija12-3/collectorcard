import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager, FilterQuery, FindOptions } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { BaseRepository } from '../repositories/base.repository';

export interface CreateUserDto {
  email: string;
  firstName?: string;
  nickName?: string;
  lastName?: string;
  dob?: Date;
  zipcode?: string;
  phoneNumber?: string;
  profileData?: Record<string, any>;
  preferences?: Record<string, any>;
}

export interface UpdateUserDto {
  firstName?: string;
  nickName?: string;
  lastName?: string;
  dob?: Date;
  zipcode?: string;
  phoneNumber?: string;
  profileData?: Record<string, any>;
  preferences?: Record<string, any>;
  isActive?: boolean;
}

export interface UserQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

@Injectable()
export class UserService extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    userRepository: EntityRepository<User>,
    em: EntityManager,
  ) {
    super(userRepository, em);
  }

  // Business-specific methods that extend BaseRepository functionality
  
  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email });
  }

  async findByEmailOrNickName(identifier: string): Promise<User | null> {
    return await this.findOne({
      $or: [
        { email: identifier },
        { nickName: identifier },
      ],
    });
  }

  async findAll(options: UserQueryOptions = {}): Promise<{ users: User[]; total: number }> {
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
