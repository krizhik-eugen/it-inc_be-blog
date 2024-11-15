import { generateId } from '../../src/utils';

describe('generateId function', () => {
    it('should generate an id of default length 8', () => {
        const id = generateId();
        expect(id.length).toBe(8);
    });

    it('should generate an id of specified length', () => {
        const length = 10;
        const id = generateId(length);
        expect(id.length).toBe(length);
    });

    it('should generate an id containing only allowed characters', () => {
        const id = generateId();
        const allowedCharacters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}:<>?,./';
        for (const char of id) {
            expect(allowedCharacters.includes(char)).toBe(true);
        }
    });

    it('should generate different ids on multiple calls', () => {
        const id1 = generateId();
        const id2 = generateId();
        expect(id1).not.toBe(id2);
    });
});
