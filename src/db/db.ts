import { connect, disconnect } from 'mongoose';
import { mongoDBName, mongoDBUrl } from '../app/configs';

export const connectToDB = async () => {
    try {
        await connect(`${mongoDBUrl}/${mongoDBName}`);
        console.log('connected to db');
        return true;
    } catch (e) {
        console.log(e);
        await disconnect();
        return false;
    }
};
