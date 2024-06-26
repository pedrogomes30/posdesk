import { BaseEntity } from './BaseEntity';
import sqlite3 from 'sqlite3';

export class Product extends BaseEntity {
    id: number;
    description: string;
    sku: string;
    categoryId: number;
    categoryName: string;
    image: string;
    brand: string;
    price: number;

    static readonly tableName: string = 'products';
    static readonly fields = [
        { name: 'description', type: 'TEXT NOT NULL' },
        { name: 'sku', type: 'TEXT NOT NULL UNIQUE' },
        { name: 'categoryId', type: 'INTEGER' },
        { name: 'categoryName', type: 'TEXT' },
        { name: 'image', type: 'TEXT' },
        { name: 'brand', type: 'TEXT' },
        { name: 'price', type: 'REAL' }
    ];

    constructor(db: sqlite3.Database, entityData: {
        id: number,
        description: string,
        sku: string,
        categoryId: number,
        categoryName: string,
        image: string,
        brand: string,
        price: number
    }) {
        super(db);
        Object.assign(this, entityData);
    }

    get tableName(): string {
        return Product.tableName;
    }

}
