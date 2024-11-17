export type TDBBaseInstance = {
    id: string;
};
export class Database<T extends TDBBaseInstance> {
    private db: T[];

    constructor() {
        this.db = [];
    }

    public async setDB(dataset: T[]) {
        this.db = dataset;
    }

    public async getAllData() {
        return this.db;
    }

    public async getInstance(id: TDBBaseInstance['id']) {
        return this.db.find((instance) => instance.id === id);
    }

    public async addInstance(newInstance: T) {
        this.db = [...this.db, newInstance];
        return newInstance;
    }

    public async updateInstance(updatedInstance: T) {
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

    public async deleteInstance(id: TDBBaseInstance['id']) {
        const foundInstance = this.db.find((instance) => instance.id === id);
        if (!foundInstance) return false;
        this.db = this.db.filter(
            (instance) => instance.id !== foundInstance.id
        );
        return true;
    }
}
