import type { Config } from 'jest';

export default async (): Promise<Config> => {
    return {
        preset: 'ts-jest',
        testEnvironment: 'node',
        testRegex: '\\.(e2e\\.test)\\.ts$',
    };
};
