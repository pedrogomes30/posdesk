import { BaseEntity } from './BaseEntity';

export class Product extends BaseEntity {
    id: number;
    description: string;
    sku: string;
    categoryId: number;
    categoryName: string;
    image: string;
    brand: string;
    price: number;

    static tableName = 'products';
    static fields = [
        { name: 'description', type: 'TEXT NOT NULL' },
        { name: 'sku', type: 'TEXT NOT NULL UNIQUE' },
        { name: 'categoryId', type: 'INTEGER' },
        { name: 'categoryName', type: 'TEXT' },
        { name: 'image', type: 'TEXT' },
        { name: 'brand', type: 'TEXT' },
        { name: 'price', type: 'REAL' }
    ];

    constructor(productData: {
        id: number,
        description: string,
        sku: string,
        categoryId: number,
        categoryName: string,
        image: string,
        brand: string,
        price: number
    }) {
        super();
        this.id = productData.id;
        this.description = productData.description;
        this.sku = productData.sku;
        this.categoryId = productData.categoryId;
        this.categoryName = productData.categoryName;
        this.image = productData.image;
        this.brand = productData.brand;
        this.price = productData.price;
    }
}