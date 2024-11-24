import { app } from '../src/app';
import { agent } from 'supertest';
import { client, connectToDB, db } from '../src/db';
import { TBlog } from '../src/blogs';
import { TPost } from '../src/posts';
import { baseRoutes } from '../src/configs';

export const req = agent(app);

export const DBHandlers = {
    connectToDB: async () => {
        connectToDB();
    },
    closeDB: async () => {
        db.dropDatabase();
        await client.close();
    },
};

export const validAuthData = ['admin', 'qwerty', { type: 'basic' }] as const;
export const invalidAuthData = ['admin', 'abcdef', { type: 'basic' }] as const;

export const blogsValidationErrorMessages = {
    id: { format: 'ID is not a valid ObjectId' },
    name: { length: 'Name length should be max 15 characters' },
    description: { length: 'Description length should be max 500 characters' },
    websiteUrl: {
        length: 'Website URL length should be max 100 characters',
        format: 'Website URL should be a valid URL',
    },
};

export const postsValidationErrorMessages = {
    id: { format: 'ID is not a valid ObjectId' },
    title: { length: 'Title length should be max 30 characters' },
    shortDescription: {
        length: 'ShortDescription length should be max 100 characters',
    },
    content: {
        length: 'Content length should be max 1000 characters',
    },
    blogId: {
        format: 'Invalid BlogId',
        value: 'Incorrect BlogId, no blogs associated',
    },
};

export const testBlog: Omit<TBlog, 'id'> = {
    name: 'Test Blog',
    description: 'Test description',
    websiteUrl: 'https://test.com',
};

export const testPost: Omit<TPost, 'id' | 'blogName'> = {
    title: 'Test Post',
    content: 'Test content',
    blogId: '',
    shortDescription: 'test shortDescription',
};

export const validObjectId = '67430b985302e02a9657421c';
export const invalidObjectId = 'qwerty1234567890';

export const invalidBlogsFields = {
    name: { length: 'new name with the length grater than 15 symbols' },
    description: {
        length: `new description with the length grater than 500 symbols, 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            uis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    },
    websiteUrl: {
        length: 'new_website_url_with_the_length_grater_than_100_symbols_for_testing_and_checking_validation_result@test.tt',
        format: 'new_website_url_with_invalid_format@.test',
    },
};

export const invalidPostsFields = {
    title: { length: 'new title with the length grater than 30 symbols' },
    shortDescription: {
        length: `new short description with the length grater than 100 symbols, 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            `,
    },
    content: {
        length: `new content with the length grater than 500 symbols, 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magna aliqua. 
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.`,
    },
};

export const addNewBlog = async (blog: Omit<TBlog, 'id'>) => {
    const { body } = await req
        .post(baseRoutes.blogs)
        .auth(...validAuthData)
        .send(blog);
    return body;
};

export const addNewPost = async (post: Omit<TPost, 'id' | 'blogName'>) => {
    const { body } = await req
        .post(baseRoutes.posts)
        .auth(...validAuthData)
        .send(post);
    return body;
};
