import {
    MongoClient,
    Db,
} from 'mongodb';
import { mongoDBName, mongoDBUrl } from '../configs/app-config';

export const client: MongoClient = new MongoClient(mongoDBUrl);
export const db: Db = client.db(mongoDBName);
export const connectToDB = async () => {
    try {
        await client.connect();
        console.log('connected to db');
        return true;
    } catch (e) {
        console.log(e);
        await client.close();
        return false;
    }
};
