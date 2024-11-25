import { baseRoutes } from '../../src/configs';
import { blogsModel } from '../../src/blogs';
import {
    addNewBlog,
    blogsValidationErrorMessages,
    DBHandlers,
    invalidAuthData,
    invalidBlogsFields,
    invalidObjectId,
    req,
    testBlog,
    validAuthData,
    validObjectId,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';

describe('Blogs Controller', () => {
    beforeAll(async () => {
        await DBHandlers.connectToDB();
    });

    beforeEach(async () => {
        await blogsModel.deleteAllBlogs();
    });

    afterAll(async () => {
        await DBHandlers.closeDB();
    });

    describe('GET /blogs', () => {
        it('returns an empty array initially', async () => {
            const response = await req.get(baseRoutes.blogs);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual([]);
        });

        it('returns a list of blogs after creating one', async () => {
            await addNewBlog(testBlog);
            const response = await req.get(baseRoutes.blogs);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual([expect.objectContaining(testBlog)]);
        });
    });

    describe('POST /blogs', () => {
        it('can not create a new blog without authorization', async () => {
            const response = await req.post(baseRoutes.blogs).send(testBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a blog if auth data is invalid', async () => {
            const response = await req
                .post(baseRoutes.blogs)
                .auth(...invalidAuthData)
                .send(testBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('creates a new blog', async () => {
            const response = await req
                .post(baseRoutes.blogs)
                .auth(...validAuthData)
                .send(testBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body).toEqual(expect.objectContaining(testBlog));
        });

        it('returns an error if required fields are missing', async () => {
            (Object.keys(testBlog) as (keyof typeof testBlog)[]).forEach(
                async (key) => {
                    const newBlog = { ...testBlog };
                    delete newBlog[key];
                    const response = await req
                        .post(baseRoutes.blogs)
                        .auth(...validAuthData)
                        .send(newBlog)
                        .expect(HTTP_STATUS_CODES.BAD_REQUEST);
                    expect(response.body.errorsMessages[0].field).toEqual(key);
                }
            );
        });

        it('returns an error if name field is not valid', async () => {
            const newBlog = {
                ...testBlog,
            };

            newBlog.name = invalidBlogsFields.name.length;

            const response = await req
                .post(baseRoutes.blogs)
                .auth(...validAuthData)
                .send(newBlog)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('name');
            expect(response.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.name.length
            );
        });

        it('returns an error if description field is not valid', async () => {
            const newBlog = {
                ...testBlog,
            };

            newBlog.description = invalidBlogsFields.description.length;

            const response = await req
                .post(baseRoutes.blogs)
                .auth(...validAuthData)
                .send(newBlog)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual(
                'description'
            );
            expect(response.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.description.length
            );
        });

        it('returns an error if websiteUrl field is not valid', async () => {
            const newBlog = {
                ...testBlog,
            };

            newBlog.websiteUrl = invalidBlogsFields.websiteUrl.format;

            const response_1 = await req
                .post(baseRoutes.blogs)
                .auth(...validAuthData)
                .send(newBlog)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response_1.body.errorsMessages[0].field).toEqual(
                'websiteUrl'
            );
            expect(response_1.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.websiteUrl.format
            );

            newBlog.websiteUrl = invalidBlogsFields.websiteUrl.length;

            const response_2 = await req
                .post(baseRoutes.blogs)
                .auth(...validAuthData)
                .send(newBlog)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response_2.body.errorsMessages[0].field).toEqual(
                'websiteUrl'
            );
            expect(response_2.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.websiteUrl.length
            );
        });
    });

    describe('GET /blogs/:id', () => {
        it('returns a blog by id', async () => {
            const createdBlog = await addNewBlog(testBlog);
            const response = await req.get(
                `${baseRoutes.blogs}/${createdBlog.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual(createdBlog);
        });

        it("returns an error if blog's id is not valid", async () => {
            const createdBlog = await addNewBlog(testBlog);
            const response = await req.get(
                `${baseRoutes.blogs}/${createdBlog.id.slice(1, 7)}`
            );
            expect(response.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.id.format
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if blog is not found', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${validObjectId}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });

    describe('PUT /blogs/:id', () => {
        it('can not update a blog without authorization', async () => {
            const updatedBlog = {
                ...testBlog,
                name: 'Updated name',
            };
            const response = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .send(updatedBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not update a blog if auth data is invalid', async () => {
            const updatedBlog = {
                ...testBlog,
                name: 'Updated name',
            };
            const response = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .auth(...invalidAuthData)
                .send(updatedBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('updates a blog', async () => {
            await addNewBlog(testBlog);
            const response = await req.get(baseRoutes.blogs);
            const blogId = response.body[0].id;
            const updatedBlog = {
                ...testBlog,
                name: 'Updated name',
            };
            const updateResponse = await req
                .put(`${baseRoutes.blogs}/${blogId}`)
                .auth(...validAuthData)
                .send(updatedBlog);
            expect(updateResponse.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
        });

        it('returns an error if blog is not found', async () => {
            const updatedBlog = {
                ...testBlog,
                name: 'Updated name',
            };
            const response = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .auth(...validAuthData)
                .send(updatedBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it("returns an error if blog's id is not valid", async () => {
            const updatedBlog = {
                ...testBlog,
                name: 'Updated name',
            };
            const response = await req
                .put(`${baseRoutes.blogs}/${invalidObjectId}`)
                .auth(...validAuthData)
                .send(updatedBlog);
            expect(response.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.id.format
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if name field is not valid', async () => {
            const newBlog = {
                ...testBlog,
            };

            newBlog.name = invalidBlogsFields.name.length;

            const response = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .auth(...validAuthData)
                .send(newBlog)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('name');
            expect(response.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.name.length
            );
        });

        it('returns an error if description field is not valid', async () => {
            const newBlog = {
                ...testBlog,
            };

            newBlog.description = invalidBlogsFields.description.length;

            const response = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .auth(...validAuthData)
                .send(newBlog)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual(
                'description'
            );
            expect(response.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.description.length
            );
        });

        it('returns an error if websiteUrl field is not valid', async () => {
            const newBlog = {
                ...testBlog,
            };

            newBlog.websiteUrl = invalidBlogsFields.websiteUrl.format;

            const response_1 = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .auth(...validAuthData)
                .send(newBlog)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response_1.body.errorsMessages[0].field).toEqual(
                'websiteUrl'
            );
            expect(response_1.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.websiteUrl.format
            );

            newBlog.websiteUrl = invalidBlogsFields.websiteUrl.length;

            const response_2 = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .auth(...validAuthData)
                .send(newBlog)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response_2.body.errorsMessages[0].field).toEqual(
                'websiteUrl'
            );
            expect(response_2.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.websiteUrl.length
            );
        });
    });

    describe('DELETE /blogs/:id', () => {
        it('can not delete a blog without authorization', async () => {
            const createdBlog = await addNewBlog(testBlog);
            const response = await req.delete(
                `${baseRoutes.blogs}/${createdBlog.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not delete a blog if auth data is invalid', async () => {
            const createdBlog = await addNewBlog(testBlog);
            const response = await req
                .delete(`${baseRoutes.blogs}/${createdBlog.id}`)
                .auth(...invalidAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('deletes a blog', async () => {
            const createdBlog = await addNewBlog(testBlog);
            const response_1 = await req
                .delete(`${baseRoutes.blogs}/${createdBlog.id}`)
                .auth(...validAuthData);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const response_2 = await req.get(
                `${baseRoutes.blogs}/${createdBlog.id}`
            );
            expect(response_2.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it("returns an error if blog's id is not valid", async () => {
            const response = await req
                .delete(`${baseRoutes.blogs}/${invalidObjectId}`)
                .auth(...validAuthData);
            expect(response.body.errorsMessages[0].message).toEqual(
                blogsValidationErrorMessages.id.format
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if blog is not found', async () => {
            const response = await req
                .delete(`${baseRoutes.blogs}/${validObjectId}`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });
});
