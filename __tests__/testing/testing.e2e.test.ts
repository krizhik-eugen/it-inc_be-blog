import { ObjectId } from 'mongodb';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { baseRoutes } from '../../src/configs';
import { postsRepository, PostViewModel } from '../../src/posts';
import { blogsRepository, BlogViewModel } from '../../src/blogs';
import { DBHandlers, req } from '../test-helpers';

describe('Testing Controller', () => {
    const testPost: Required<Omit<PostViewModel, 'id'>> = {
        title: 'Test Post',
        content: 'Test content',
        blogId: '',
        blogName: '',
        shortDescription: 'test shortDescription',
        createdAt: new Date().toISOString(),
    };

    let testBlog: BlogViewModel;
    beforeAll(async () => {
        await DBHandlers.connectToDB();

        const newBlog: Omit<BlogViewModel, 'id'> = {
            name: 'Test Blog',
            description: 'Test description',
            websiteUrl: 'https://test.com',
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        const createdBlogId = await blogsRepository.addNewBlog(newBlog);
        const createdBlog = await blogsRepository.findBlogById(
            new ObjectId(createdBlogId)
        );
        testBlog = {
            id: createdBlog?._id.toString() || '',
            name: createdBlog?.name || '',
            description: createdBlog?.description || '',
            websiteUrl: createdBlog?.websiteUrl || '',
            createdAt: createdBlog?.createdAt || '',
            isMembership: createdBlog?.isMembership || false,
        };
        testPost.blogName = testBlog.name;
        testPost.blogId = testBlog.id;
        await postsRepository.addNewPost(testPost);
    });

    afterAll(async () => {
        await DBHandlers.closeDB();
    });

    describe('DELETE /testing', () => {
        it('deletes all data', async () => {
            const blogsResponse = await req.get(baseRoutes.blogs);
            expect(blogsResponse.body.items.length).toBe(1);
            expect(blogsResponse.body.items[0].name).toBe(testBlog.name);

            const postsResponse = await req.get(baseRoutes.posts);
            expect(postsResponse.body.items.length).toBe(1);
            expect(postsResponse.body.items[0].title).toBe(testPost.title);
            expect(postsResponse.body.items[0].blogName).toBe(testBlog.name);

            const deleteResponse = await req.delete(baseRoutes.testing);
            expect(deleteResponse.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);

            const deletedBlogsResponse = await req.get(baseRoutes.blogs);
            expect(deletedBlogsResponse.status).toBe(HTTP_STATUS_CODES.OK);
            expect(deletedBlogsResponse.body.items).toEqual([]);

            const deletedPostsResponse = await req.get(baseRoutes.blogs);
            expect(deletedPostsResponse.status).toBe(HTTP_STATUS_CODES.OK);
            expect(deletedPostsResponse.body.items).toEqual([]);
        });
    });
});
