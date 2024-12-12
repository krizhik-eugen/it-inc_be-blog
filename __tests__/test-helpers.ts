import { app } from '../src/app';
import { agent } from 'supertest';
import { client, connectToDB, db } from '../src/db';
import { BlogViewModel } from '../src/blogs';
import { PostCreateRequestModel, PostViewModel } from '../src/posts';
import { baseRoutes } from '../src/configs';
import { UserViewModel } from '../src/users';
import { CommentCreateRequestModel } from '../src/comments';

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
export const idValidationErrorMessages = 'Invalid Id';
export const validObjectId = '57430b985302e02a9657421c';
export const invalidObjectId = 'qwerty1234567890';
export const invalidEmailFormat = 'invalid_email_format@.d';
export const invalidURLFormat = 'invalid_email_format.dom';
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

export const testPosts: PostCreateRequestModel[] = [
    {
        title: 'Test Post 1',
        content: 'Test content 1',
        blogId: '',
        shortDescription: 'test shortDescription 1',
    },
    {
        title: 'Test Post 2',
        content: 'Test content 2',
        blogId: '',
        shortDescription: 'test shortDescription 2',
    },
    {
        title: 'Test Post 3',
        content: 'Test content 3',
        blogId: '',
        shortDescription: 'test shortDescription 3',
    },
    {
        title: 'Test Post 4',
        content: 'Test content 4',
        blogId: '',
        shortDescription: 'test shortDescription 4',
    },
    {
        title: 'Test Post 5',
        content: 'Test content 5',
        blogId: '',
        shortDescription: 'test shortDescription 5',
    },
    {
        title: 'Test Post 6',
        content: 'Test content 6',
        blogId: '',
        shortDescription: 'test shortDescription 6',
    },
    {
        title: 'Test Post 7',
        content: 'Test content 7',
        blogId: '',
        shortDescription: 'test shortDescription 7',
    },
    {
        title: 'Test Post 8',
        content: 'Test content 8',
        blogId: '',
        shortDescription: 'test shortDescription 8',
    },
    {
        title: 'Test Post 9',
        content: 'Test content 9',
        blogId: '',
        shortDescription: 'test shortDescription 9',
    },
];

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

export const testComments: CommentCreateRequestModel[] = [
    { content: 'test comment 1 with proper length' },
    { content: 'test comment 2 with proper length' },
    { content: 'test comment 3 with proper length' },
    { content: 'test comment 4 with proper length' },
    { content: 'test comment 5 with proper length' },
    { content: 'test comment 6 with proper length' },
    { content: 'test comment 7 with proper length' },
    { content: 'test comment 8 with proper length' },
    { content: 'test comment 9 with proper length' },
];

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
