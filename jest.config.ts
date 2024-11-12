import type { Config } from 'jest';

export default async (): Promise<Config> => {
    return {
        preset: 'ts-jest',
        testEnvironment: 'node',
        testRegex: '(/__tests__/.*|\\.(test|spec))\\.ts$',
    };
};