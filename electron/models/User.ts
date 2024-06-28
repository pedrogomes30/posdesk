import { BaseEntity } from './BaseEntity';
import sqlite3 from 'sqlite3';

export class User extends BaseEntity {
    id: number;
    name: string;
    login: string;
    accessToken: string;
    profession: string;
    isManager: boolean;
    image: string;
    cashierId: number;
    cashierName: string;

    static readonly tableName = 'users';
    static readonly fields = [
        { name: 'name', type: 'TEXT NOT NULL' },
        { name: 'login', type: 'TEXT NOT NULL UNIQUE' },
        { name: 'accessToken', type: 'TEXT NOT NULL' },
        { name: 'profession', type: 'TEXT' },
        { name: 'isManager', type: 'INTEGER' },
        { name: 'image', type: 'TEXT' },
        { name: 'cashierId', type: 'INTEGER' },
        { name: 'cashierName', type: 'TEXT' }
    ];

    constructor(db: sqlite3.Database, userData: {
        id: number,
        name: string,
        login: string,
        accessToken: string,
        profession: string,
        isManager: boolean,
        image: string,
        cashierId: number,
        cashierName: string
    }) {
        super(db);
        this.id = userData.id;
        this.name = userData.name;
        this.login = userData.login;
        this.accessToken = userData.accessToken;
        this.profession = userData.profession;
        this.isManager = userData.isManager;
        this.image = userData.image;
        this.cashierId = userData.cashierId;
        this.cashierName = userData.cashierName;
    }

    public static async getFirstUser(db: sqlite3.Database): Promise<User | null> {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ${User.tableName} LIMIT 1`;
            db.get(query, (err, row:any) => {
                if (err) {
                    console.error(`Error fetching first ${User.tableName}:`, err);
                    reject(err);
                } else {
                    if (row) {
                        const user = new User(db, {
                            id: row.id,
                            name: row.name,
                            login: row.login,
                            accessToken: row.accessToken,
                            profession: row.profession,
                            isManager: row.isManager === 1,
                            image: row.image,
                            cashierId: row.cashierId,
                            cashierName: row.cashierName
                        });
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

}
