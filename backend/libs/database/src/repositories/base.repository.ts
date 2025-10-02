import { Repository, FindOptionsWhere, FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findById(id: string | number): Promise<T | null> {
    return this.repository.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as unknown as DeepPartial<T>);
    return this.repository.save(entity as unknown as DeepPartial<T>);
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string | number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  async exists(options: FindOneOptions<T>): Promise<boolean> {
    const count = await this.repository.count(options);
    return count > 0;
  }
}
