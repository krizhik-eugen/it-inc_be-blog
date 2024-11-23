import {
    MongoClient,
    Collection,
    Db,
    ObjectId,
    Document,
    Filter,
    OptionalUnlessRequiredId,
} from 'mongodb';
import { mongoDBName, mongoDBUrl } from '../configs/app-config';

const client: MongoClient = new MongoClient(mongoDBUrl);
export const db: Db = client.db(mongoDBName);
export const connectToDB = async () => {
    console.log('connectToDB tests');

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

export class MongoDBCollection<T extends Document & { id: string }> {
    readonly collection: Collection<Omit<T, 'id'>>;

    constructor(collectionName: string) {
        this.collection = db.collection(collectionName);
    }

    public async getAllData() {
        const allData = await this.collection.find().toArray();

        return allData.map((doc) => {
            const { _id, ...docWithoutId } = doc;
            return { ...docWithoutId, id: _id.toString() };
        });
    }

    public async getInstance(id: T['id']) {
        const foundInstance = await this.collection.findOne({
            _id: new ObjectId(id),
        } as Filter<Omit<T, 'id'>>);
        if (!foundInstance) return undefined;
        const { _id, ...foundInstanceWithoutId } = foundInstance;
        return {
            ...foundInstanceWithoutId,
            id: _id.toString(),
        };
    }

    public async addInstance(newInstance: Omit<T, 'id'>) {
        const result = await this.collection.insertOne({
            ...(newInstance as OptionalUnlessRequiredId<Omit<T, 'id'>>),
            createdAt: new Date(),
        });
        const addedInstance = await this.getInstance(
            result.insertedId.toString()
        );

        return addedInstance;
    }

    public async updateInstance(updatedInstance: T) {
        const { id, ...instanceToInsert } = updatedInstance;
        const _id = new ObjectId(id);
        const result = await this.collection.updateOne(
            { _id } as Filter<Omit<T, 'id'>>,
            { $set: instanceToInsert }
        );
        return result.modifiedCount > 0;
    }

    public async deleteInstance(id: T['id']) {
        const _id = new ObjectId(id);
        const result = await this.collection.deleteOne({ _id } as Filter<
            Omit<T, 'id'>
        >);
        return result.deletedCount > 0;
    }

    public async setDB(dataset: T[]) {
        if (dataset.length > 0) {
            const mappedData = dataset.map((doc) => {
                if ('id' in doc) {
                    const { id, ...docWithoutId } = doc;
                    return {
                        ...docWithoutId,
                        _id: new ObjectId(id),
                    } as OptionalUnlessRequiredId<Omit<T, 'id'>>;
                }
                return doc as OptionalUnlessRequiredId<Omit<T, 'id'>>;
            });
            await this.collection.insertMany(mappedData);
            return;
        }
        await this.collection.deleteMany({});
    }
}
