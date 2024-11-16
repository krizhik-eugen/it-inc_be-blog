import request from 'supertest';
import { app } from '../../src/app'; // assuming your app is exported in app.ts
import { blogsModel, TBlog } from '../../src/models';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { baseRoutes } from '../../src/configs';

describe('Blogs Controller', () => {
    beforeEach(async () => {
        await blogsModel.deleteAllBlogs();
    });

    const testBlog: Omit<TBlog, 'id'> = {
        name: 'Test Blog',
        description: 'Test description',
        websiteUrl: 'https://test.com',
    };

    describe('GET /blogs', () => {
        it('returns an empty array initially', async () => {
            const response = await request(app).get(baseRoutes.blogs);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual([]);
        });

        it('returns a list of blogs after creating one', async () => {
            await blogsModel.addNewBlog(testBlog);
            const response = await request(app).get('/blogs');
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual([expect.objectContaining(testBlog)]);
        });
    });

    describe('POST /blogs', () => {
        it('can not create a new blog without authorization', async () => {
            const response = await request(app)
                .post(baseRoutes.blogs)
                .send(testBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('creates a new blog', async () => {
            const response = await request(app)
                .post(baseRoutes.blogs)
                .auth('admin', 'qwerty', { type: 'basic' })
                .send(testBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body).toEqual(expect.objectContaining(testBlog));
        });

        it('returns an error if required fields are missing', async () => {
            (Object.keys(testBlog) as (keyof typeof testBlog)[]).forEach(
                async (key) => {
                    const newBlog = { ...testBlog };
                    delete newBlog[key];
                    const response = await request(app)
                        .post(baseRoutes.blogs)
                        .auth('admin', 'qwerty', { type: 'basic' })
                        .send(newBlog)
                        .expect(HTTP_STATUS_CODES.BAD_REQUEST);
                    expect(response.body.errorsMessages[0].field).toEqual(key);
                }
            );
        });
    });

    describe('GET /blogs/:id', () => {
        it('returns a blog by id', async () => {
            const createdBlog = await blogsModel.addNewBlog(testBlog);
            const response = await request(app).get(
                `${baseRoutes.blogs}/${createdBlog.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual(expect.objectContaining(createdBlog));
        });

        it('returns an error if blog is not found', async () => {
            const response = await request(app).get(`${baseRoutes.blogs}/123`);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });

    describe('PUT /blogs/:id', () => {
        it('can not update a blog without authorization', async () => {
            const blogId = '12345';
            const updatedBlog = {
                ...testBlog,
                name: 'Updated name',
            };
            const response = await request(app)
                .put(`/blogs/${blogId}`)
                .send(updatedBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('updates a blog', async () => {
            await blogsModel.addNewBlog(testBlog);
            const response = await request(app).get('/blogs');
            const blogId = response.body[0].id;
            const updatedBlog = {
                ...testBlog,
                name: 'Updated name',
            };
            const updateResponse = await request(app)
                .put(`/blogs/${blogId}`)
                .auth('admin', 'qwerty', { type: 'basic' })
                .send(updatedBlog);
            expect(updateResponse.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
        });

        it('returns 404 if blog is not found', async () => {
            const blogId = 'non-existent-id';
            const updatedBlog = {
                ...testBlog,
                name: 'Updated name',
            };
            const response = await request(app)
                .put(`/blogs/${blogId}`)
                .auth('admin', 'qwerty', { type: 'basic' })
                .send(updatedBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });

    describe('DELETE /blogs/:id', () => {
        it('can not delete a blog without authorization', async () => {
            const createdBlog = await blogsModel.addNewBlog(testBlog);
            const response = await request(app).delete(
                `${baseRoutes.blogs}/${createdBlog.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('deletes a blog', async () => {
            const createdBlog = await blogsModel.addNewBlog(testBlog);
            const response = await request(app)
                .delete(`${baseRoutes.blogs}/${createdBlog.id}`)
                .auth('admin', 'qwerty', { type: 'basic' });
            expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const deletedBlog = await blogsModel.getBlog(createdBlog.id);
            expect(deletedBlog).toBeUndefined();
        });

        it('returns an error if blog is not found', async () => {
            const response = await request(app)
                .delete(`${baseRoutes.blogs}/123`)
                .auth('admin', 'qwerty', { type: 'basic' });
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });
});
