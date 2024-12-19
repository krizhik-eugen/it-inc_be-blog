import { app } from '../src/initApp';
import { agent } from 'supertest';
import { client, connectToDB, db } from '../src/db';
import { BlogViewModel } from '../src/domain/blogs';
import { PostViewModel } from '../src/domain/posts';
import { baseRoutes } from '../src/app/configs';
import { UserViewModel } from '../src/domain/users';

export const req = agent(app);

export const DBHandlers = {
    connectToDB: async () => {
        await connectToDB();
    },
    closeDB: async () => {
        await db.dropDatabase();
        await client.close();
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
    post: Omit<PostViewModel, 'id' | 'blogName' | 'createdAt'>
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
