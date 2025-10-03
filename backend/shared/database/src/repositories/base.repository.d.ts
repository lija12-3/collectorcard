import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
export declare abstract class BaseRepository<T> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    find(options?: FindManyOptions<T>): Promise<T[]>;
    findOne(options: FindOneOptions<T>): Promise<T | null>;
    findById(id: string | number): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T | null>;
    delete(id: string | number): Promise<boolean>;
    count(options?: FindManyOptions<T>): Promise<number>;
    exists(options: FindOneOptions<T>): Promise<boolean>;
}
