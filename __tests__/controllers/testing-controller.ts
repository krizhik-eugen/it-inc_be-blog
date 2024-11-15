import request from 'supertest';
import { app } from '../../src/app'; // assuming your app is exported in app.ts
import { blogsModel, postsModel, testingModel, TBlog, TPost } from '../../src/models';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { baseRoutes } from '../../src/configs';

describe('Testing Controller', () => {
    const testPost: Omit<TPost, 'id'> = {
        title: 'Test Post',
        content: 'Test content',
        blogId: '',
        blogName: '',
        shortDescription: 'test shortDescription'
    };

    let testBlog: TBlog;

    beforeAll(async () => {
        const newBlog: Omit<TBlog, 'id'> = {
            name: 'Test Blog',
            description: 'Test description',
            websiteUrl: 'https://test.com'
        };

        const createdBlog = await blogsModel.addNewBlog(newBlog);
        testBlog = createdBlog;
        testPost.blogName = testBlog.name;
        testPost.blogId = testBlog.id
        await postsModel.addNewPost(testPost)
    })

    describe('DELETE /testing', () => {
        it('deletes all data', async () => {
            const blogsResponse = await request(app).get(baseRoutes.blogs);
            expect(blogsResponse.body.length).toBe(1);
            expect(blogsResponse.body[0].name).toBe(testBlog.name);

            const postsResponse = await request(app).get(baseRoutes.posts);
            expect(postsResponse.body.length).toBe(1);
            expect(postsResponse.body[0].title).toBe(testPost.title);
            expect(postsResponse.body[0].blogName).toBe(testBlog.name);

            const deleteResponse = await request(app).delete(baseRoutes.testing);
            expect(deleteResponse.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);

            const deletedBlogsResponse = await request(app).get(baseRoutes.blogs);
            expect(deletedBlogsResponse.status).toBe(HTTP_STATUS_CODES.OK);
            expect(deletedBlogsResponse.body).toEqual([]);

            const deletedPostsResponse = await request(app).get(baseRoutes.blogs);
            expect(deletedPostsResponse.status).toBe(HTTP_STATUS_CODES.OK);
            expect(deletedPostsResponse.body).toEqual([]);
        });

        it('returns 204 even if there is no data to delete', async () => {
            await testingModel.deleteAllData();
            const response = await request(app).delete(baseRoutes.testing);
            expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
        });
    });
});