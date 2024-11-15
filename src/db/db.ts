export type TDBBaseInstance = {
    id: string;
};
export class Database<T extends TDBBaseInstance> {
    private db: T[];

    constructor() {
        this.db = [];
    }

    public setDB(dataset: T[]) {
        this.db = dataset;
    }

    public getAllData() {
        return this.db;
    }

    public getInstance(id: TDBBaseInstance['id']) {
        return this.db.find((instance) => instance.id === id);
    }

    public addInstance(newInstance: T) {
        this.db = [...this.db, newInstance];
        return newInstance;
    }

    public updateInstance(updatedInstance: T) {
        const foundInstance = this.db.find(
            (instance) => instance.id === updatedInstance.id
        );
        if (!foundInstance) return false;
        this.db = this.db.map((instance) => {
            return instance.id === foundInstance.id
                ? { ...instance, ...updatedInstance }
                : instance;
        });
        return true;
    }

    public deleteInstance(id: TDBBaseInstance['id']) {
        const foundInstance = this.db.find((instance) => instance.id === id);
        if (!foundInstance) return false;
        this.db = this.db.filter(
            (instance) => instance.id !== foundInstance.id
        );
        return true;
    }
}
