import { EntityRepository, EntityManager, FilterQuery, FindOptions, RequiredEntityData } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository<T extends object> {
  constructor(
    protected readonly repository: EntityRepository<T>,
    protected readonly em: EntityManager,
  ) {}

  async find(where?: FilterQuery<T>, options?: any): Promise<T[]> {
    return this.repository.find(where, options);
  }

  async findOne(where: FilterQuery<T>, options?: any): Promise<T | null> {
    return this.repository.findOne(where, options);
  }

  async findById(id: string | number): Promise<T | null> {
    return this.repository.findOne({ id } as FilterQuery<T>);
  }

  async create(data: RequiredEntityData<T>): Promise<T> {
    const entity = this.repository.create(data);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }
    Object.assign(entity, data);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async delete(id: string | number): Promise<boolean> {
    const entity = await this.findById(id);
    if (!entity) {
      return false;
    }
    await this.em.removeAndFlush(entity);
    return true;
  }

  async count(where?: FilterQuery<T>): Promise<number> {
    return this.repository.count(where);
  }

  async exists(where: FilterQuery<T>): Promise<boolean> {
    const count = await this.repository.count(where);
    return count > 0;
  }

  async findAndCount(where?: FilterQuery<T>, options?: any): Promise<[T[], number]> {
    return this.repository.findAndCount(where, options);
  }
}
