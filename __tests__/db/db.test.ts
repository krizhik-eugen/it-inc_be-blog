import { Database } from '../../src/db';

describe('Database class', () => {
    let db: Database<{ id: string; name: string }>;

    beforeEach(() => {
        db = new Database();
    });

    const dataInstance1 = { id: '1', name: 'John' };
    const dataInstance2 = { id: '2', name: 'Jane' };
    const dataset = [dataInstance1, dataInstance2];

    it('should initialize with an empty array', async () => {
        expect(await db.getAllData()).toEqual([]);
    });

    it('should set the database with the provided dataset', async () => {
        await db.setDB(dataset);
        expect(await db.getAllData()).toEqual(dataset);
    });

    it('should add a new instance to the database', async () => {
        await db.addInstance(dataInstance1);
        expect(await db.getAllData()).toEqual([dataInstance1]);
    });

    it('should get an instance by id', async () => {
        await db.addInstance(dataInstance1);
        expect(await db.getInstance('1')).toEqual(dataInstance1);
    });

    it('should update an instance in the database', async () => {
        await db.addInstance(dataInstance1);
        const updatedInstance = { ...dataInstance1, name: 'Jack' };
        await db.updateInstance(updatedInstance);
        expect(await db.getInstance('1')).toEqual(updatedInstance);
    });

    it('should return false if instance is not found during update', async () => {
        await db.setDB(dataset);
        const updatedInstance = { id: '3', name: 'Jack' };
        expect(await db.updateInstance(updatedInstance)).toBe(false);
    });

    it('should delete an instance from the database', async () => {
        await db.setDB(dataset);
        await db.deleteInstance('1');
        expect(await db.getInstance('1')).toBeUndefined();
    });

    it('should return false if instance is not found during deletion', async () => {
        await db.setDB(dataset);
        expect(await db.deleteInstance('3')).toBe(false);
    });
});
