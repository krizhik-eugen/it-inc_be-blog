import { Database } from '../../src/db';

describe('Database class', () => {
    let db: Database<{ id: string; name: string }>;

    beforeEach(() => {
        db = new Database();
    });

    const dataInstance1 = { id: '1', name: 'John' };
    const dataInstance2 = { id: '2', name: 'Jane' };
    const dataset = [dataInstance1, dataInstance2];

    it('should initialize with an empty array', () => {
        expect(db.getAllData()).toEqual([]);
    });

    it('should set the database with the provided dataset', () => {
        db.setDB(dataset);
        expect(db.getAllData()).toEqual(dataset);
    });

    it('should add a new instance to the database', () => {
        db.addInstance(dataInstance1);
        expect(db.getAllData()).toEqual([dataInstance1]);
    });

    it('should get an instance by id', () => {
        db.addInstance(dataInstance1);
        expect(db.getInstance('1')).toEqual(dataInstance1);
    });

    it('should update an instance in the database', () => {
        db.addInstance(dataInstance1);
        const updatedInstance = { ...dataInstance1, name: 'Jack' };
        db.updateInstance(updatedInstance);
        expect(db.getInstance('1')).toEqual(updatedInstance);
    });

    it('should return false if instance is not found during update', () => {
        db.setDB(dataset);
        const updatedInstance = { id: '3', name: 'Jack' };
        expect(db.updateInstance(updatedInstance)).toBe(false);
    });

    it('should delete an instance from the database', () => {
        db.setDB(dataset);
        db.deleteInstance('1');
        expect(db.getInstance('1')).toBeUndefined();
    });

    it('should return false if instance is not found during deletion', () => {
        db.setDB(dataset);
        expect(db.deleteInstance('3')).toBe(false);
    });
});
