import { connection, disconnect } from 'mongoose';
import { agent } from 'supertest';
import { app } from '../src/initApp';
import { connectToDB } from '../src/db/db';
import { baseRoutes } from '../src/app/configs/routes-config';
import { PostViewModel } from '../src/features/posts/api/types';
import { UserViewModel } from '../src/features/users/api/types';
import { PostModel } from '../src/features/posts/domain/post-entity';
import { CommentsModel } from '../src/features/comments/comments-model';
import { UserModel } from '../src/features/users/domain/user-entity';
import { RateLimiterModel } from '../src/app/models/rate-limiter-model';
import { SessionModel } from '../src/features/security/domain/session-entity';
import { BlogViewModel } from '../src/features/blogs/api/types';
import { BlogModel } from '../src/features/blogs/domain/blog-entity';
import { LikeModel } from '../src/features/likes/domain/like-entity';

export const req = agent(app);

export const DBHandlers = {
    connectToDB: async () => {
        await connectToDB();
    },
    closeDB: async () => {
        await connection.db?.dropDatabase();
        await connection.close();
        await disconnect();
    },
};

export const validAuthData = ['admin', 'qwerty', { type: 'basic' }] as const;
export const invalidAuthData = ['admin', 'abcdef', { type: 'basic' }] as const;
export const getUserAuthData = (token: string) =>
    [token, { type: 'bearer' }] as const;
export const idValidationErrorMessages = 'Invalid Id';
export const validObjectId = '57430b985302e02a9657421c';
export const invalidObjectId = 'qwerty1234567890';
export const invalidEmailFormat = 'invalid_email_format@.d';
export const invalidURLFormat = 'invalid_email_format.dom';
export const textWithLengthGraterThan10 = `Ten symbols.`;
export const textWithLengthGraterThan15 = `Sixteen symbols.`;
export const textWithLengthGraterThan20 = textWithLengthGraterThan15 + '+five';
export const textWithLengthGraterThan30 =
    textWithLengthGraterThan15 + textWithLengthGraterThan20;
export const textWithLengthGraterThan100 =
    textWithLengthGraterThan30 +
    textWithLengthGraterThan30 +
    textWithLengthGraterThan30 +
    textWithLengthGraterThan15;
export const textWithLengthGraterThan300 =
    textWithLengthGraterThan100 +
    textWithLengthGraterThan100 +
    textWithLengthGraterThan100;
export const textWithLengthGraterThan500 =
    textWithLengthGraterThan300 +
    textWithLengthGraterThan100 +
    textWithLengthGraterThan100;
export const textWithLengthGraterThan1000 =
    textWithLengthGraterThan500 + textWithLengthGraterThan500;
export const emailWithLengthGraterThan100 =
    textWithLengthGraterThan100 + '@.tt';

export const blogsValidationErrorMessages = {
    name: { length: 'Name length should be max 15 characters' },
    description: { length: 'Description length should be max 500 characters' },
    websiteUrl: {
        length: 'Website URL length should be max 100 characters',
        format: 'Website URL should be a valid URL',
    },
};

export const postsValidationErrorMessages = {
    title: { length: 'Title length should be max 30 characters' },
    shortDescription: {
        length: 'ShortDescription length should be max 100 characters',
    },
    content: {
        length: 'Content length should be max 1000 characters',
    },
    blogId: {
        format: 'Invalid Id',
        value: 'Incorrect Blog Id, no blogs found',
    },
};

export const usersValidationErrorMessages = {
    login: {
        format: 'Login should contain only latin letters, numbers, - and _',
        length: 'Login length should be min 3 and max 10 characters',
    },
    password: {
        length: 'Password length should be min 6 and max 20 characters',
    },
    email: {
        format: 'Email should be a valid email address, example: example@example.com',
    },
};

export const getTestBlog = (blogNumber: number) => ({
    name: `Test Blog ${blogNumber}`,
    description: `Test description ${blogNumber}`,
    websiteUrl: `https://test${blogNumber}.com`,
});

export const getTestPost = (postNumber: number, blogId: string) => ({
    title: `Test Post ${postNumber}`,
    content: `Test content ${postNumber}`,
    blogId,
    shortDescription: `test shortDescription ${postNumber}`,
});

export const getTestUser = (userNumber: number) => ({
    email: `email_${userNumber}@email.com`,
    login: `login_${userNumber}`,
    password: `password${userNumber}`,
});

export const getTestComment = (commentNumber: number) => ({
    content: `test comment ${commentNumber} with proper length`,
});

export const addNewBlog = async (
    blog: Omit<BlogViewModel, 'id' | 'createdAt' | 'isMembership'>
) => {
    const { body } = await req
        .post(baseRoutes.blogs)
        .auth(...validAuthData)
        .send(blog);
    return body;
};

export const addNewPost = async (
    post: Omit<
        PostViewModel,
        'id' | 'blogName' | 'createdAt' | 'extendedLikesInfo'
    >
) => {
    const { body } = await req
        .post(baseRoutes.posts)
        .auth(...validAuthData)
        .send(post);
    return body;
};

export const addNewUser = async (
    user: Omit<UserViewModel, 'id' | 'createdAt'> & { password: string }
) => {
    const { body } = await req
        .post(baseRoutes.users)
        .auth(...validAuthData)
        .send(user);
    return body;
};

export const mockUserAgents = {
    chromeWindows:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36; Device/SurfacePro9',
    safariMacOS:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
    firefoxLinux:
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:118.0) Gecko/20100101 Firefox/118.0',
    chromeAndroid:
        'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
};

export const clearAllCollections = async () => {
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await CommentsModel.deleteMany({});
    await UserModel.deleteMany({});
    await SessionModel.deleteMany({});
    await RateLimiterModel.deleteMany({});
    await LikeModel.deleteMany({});
};
