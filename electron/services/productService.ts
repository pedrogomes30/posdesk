import { getProducts } from './api/productApi';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { DatabaseService } from '../services/databaseService.js';
import { addMinutes, addHours, differenceInMilliseconds } from 'date-fns';
import { Category } from '../models/Category';


const db = DatabaseService.getDBInstance();

export const productService =
{
    async getProduct (page:number|null, sku:number|null):Promise <Product[]|undefined>
    {
        let user = await User.findFirst(db);
        if(await this.needGetProductFromApi(user)){
            await this.updateProductBase(user.accessToken);
        }

        if(null !== sku){
            const product = await Product.findBy(db,[['sku','=',sku]]);
            return product;
        }

        page = page ?? 1;
        const products = await this.getProductsByPage(page);
        user.productUpdatedAt = new Date().toISOString();
        user.save()

        return products;
    },

    async needGetProductFromApi(user: User): Promise<boolean> {
        if(user.productUpdatedAt === 'NULL' || undefined === await Product.findFirst(db)){
            console.log(
                'PRODUTOS DESATUALIZADOS POR ESTAR VAZIO OU USUARIO SEM UPDATE PRODUTO ',
                'USER ',
                user.productUpdatedAt,
                'FIRST PRODUCT ',
                await Product.findFirst(db)
            );
            return true;
        }

        let productTimeInterval = '24h'; //intervalo de atualizações'24h'    
        const parseTimeInterval = (interval: string): number => {
            const value = parseInt(interval);
            if (interval.includes('min')) {
                return addMinutes(new Date(), value).getTime() - new Date().getTime();
            } else if (interval.includes('h')) {
                return addHours(new Date(), value).getTime() - new Date().getTime();
            }
            return 0;
        };
    
        const intervalMilliseconds = parseTimeInterval(productTimeInterval);
    
        const now = new Date();
        const lastUpdate = new Date(user.productUpdatedAt);
        if (differenceInMilliseconds(now, lastUpdate) > intervalMilliseconds ) {
            console.log('tempo de update produto')
            return true;
        } else {
            console.log('fora tempo produto')
            return false;
        }
    },

    async updateProductBase(token:string):Promise<boolean>
    {
        Product.clear(db);
        Category.clear(db);
        let productsInfo = await getProducts(token);

        let categorys = await this.saveCategorys(productsInfo);
        let products = await this.saveProducts(productsInfo);

        return true;
    },
    
    async saveCategorys(productsInfo:any):Promise<Category[]>
    {
        const categorysSaved:Category[] = [];
        for (const category of productsInfo.category){
            const savedCategory = new Category(db,{
                id: category.id,
                name: category.name
            })

            await savedCategory.save();
            categorysSaved.push(savedCategory);
        }

        return categorysSaved;
    },

    async saveProducts(productsInfo:any):Promise<Product[]>
    {
        const productSaved:Product[] = [];
        for (const product of productsInfo.products){
            const savedProduct = new Product(db,{
                id: product.id,
                description: product.description??'sem descrição',
                sku: product.sku,
                categoryId: product.categoryId,
                categoryName: product.categoryName,
                image: product.website,
                brand: product.brand,
                price: product.price
            })

            await savedProduct.save();
            productSaved.push(savedProduct);
        }

        return productSaved;
    },

    async getProductsByPage(page:number):Promise<Product[]|undefined>
    {   
        const pageSize = 20;
        const products = await Product.findByPage(db, page, pageSize);
        return products;
    }
}