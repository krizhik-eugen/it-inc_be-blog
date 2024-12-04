import { app } from '../src/app';
import { agent } from 'supertest';
import { client, connectToDB, db } from '../src/db';
import { BlogViewModel } from '../src/blogs';
import { PostViewModel } from '../src/posts';
import { baseRoutes } from '../src/configs';
import { UserViewModel } from '../src/users';

export const req = agent(app);

export const DBHandlers = {
    connectToDB: async () => {
        await connectToDB();
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
        value: 'Incorrect Blog Id, no blogs found',
    },
};

export const testBlogs: Omit<
    BlogViewModel,
    'id' | 'createdAt' | 'isMembership'
>[] = [
    {
        name: 'Test Blog 1',
        description: 'Test description 1',
        websiteUrl: 'https://test1.com',
    },
    {
        name: 'Test Blog 2',
        description: 'Test description 2',
        websiteUrl: 'https://test2.com',
    },
    {
        name: 'Test Blog 3',
        description: 'Test description 3',
        websiteUrl: 'https://test3.com',
    },
    {
        name: 'Test Blog 4',
        description: 'Test description 4',
        websiteUrl: 'https://test4.com',
    },
    {
        name: 'Test Blog 5',
        description: 'Test description 5',
        websiteUrl: 'https://test5.com',
    },
    {
        name: 'Test Blog 6',
        description: 'Test description 6',
        websiteUrl: 'https://test6.com',
    },
    {
        name: 'Test Blog 7',
        description: 'Test description 7',
        websiteUrl: 'https://test7.com',
    },
    {
        name: 'Test Blog 8',
        description: 'Test description 8',
        websiteUrl: 'https://test8.com',
    },
    {
        name: 'Test Blog 9',
        description: 'Test description 9',
        websiteUrl: 'https://test9.com',
    },
];

export const testPosts: Omit<PostViewModel, 'id' | 'blogName' | 'createdAt'>[] =
    [
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

export const testUsers: ({ password: string } & Omit<
    UserViewModel,
    'id' | 'createdAt'
>)[] = [
    { email: 'email_1@email.com', login: 'login_1', password: 'password1' },
    { email: 'email_2@email.com', login: 'login_2', password: 'password2' },
    { email: 'email_3@email.com', login: 'login_3', password: 'password3' },
    { email: 'email_4@email.com', login: 'login_4', password: 'password4' },
    { email: 'email_5@email.com', login: 'login_5', password: 'password5' },
    { email: 'email_6@email.com', login: 'login_6', password: 'password6' },
    { email: 'email_7@email.com', login: 'login_7', password: 'password7' },
    { email: 'email_8@email.com', login: 'login_8', password: 'password8' },
    { email: 'email_9@email.com', login: 'login_9', password: 'password9' },
];

export const validObjectId = '57430b985302e02a9657421c';
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
