import { baseRoutes } from '../../src/app/configs';
import { blogsRepository, BlogViewModel } from '../../src/features/blogs';
import {
    addNewBlog,
    addNewPost,
    blogsValidationErrorMessages,
    DBHandlers,
    emailWithLengthGraterThan100,
    getTestBlog,
    getTestPost,
    idValidationErrorMessages,
    invalidAuthData,
    invalidObjectId,
    invalidURLFormat,
    postsValidationErrorMessages,
    req,
    textWithLengthGraterThan100,
    textWithLengthGraterThan1000,
    textWithLengthGraterThan15,
    textWithLengthGraterThan30,
    textWithLengthGraterThan500,
    validAuthData,
    validObjectId,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import {
    PostCreateRequestModel,
    postsRepository,
} from '../../src/features/posts';
import { testingService } from '../../src/features/testing';

describe('Blogs Controller', () => {
    let createdTestBlog: BlogViewModel;
    const setTestBlogs = async () => {
        for (let i = 1; i < 20; i++) {
            const addedBlog = await addNewBlog(getTestBlog(i));
            if (i === 1) {
                createdTestBlog = addedBlog;
            }
        }
    };
    const setTestPosts = async (blogId: string) => {
        for (let i = 1; i < 20; i++) {
            await addNewPost(getTestPost(i, blogId));
        }
    };

    beforeAll(async () => {
        await DBHandlers.connectToDB();
        await blogsRepository.clearBlogs();
        await setTestBlogs();
        await setTestPosts(createdTestBlog.id);
    }, 10000);

    afterAll(async () => {
        await testingService.deleteAllData();
        await DBHandlers.closeDB();
    });

    describe('GET /blogs', () => {
        it('returns a list of blogs sorted by createdAt and descending order by default', async () => {
            const response = await req.get(`${baseRoutes.blogs}`);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].name).toEqual(getTestBlog(19).name);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeGreaterThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(2);
            expect(response.body.totalCount).toEqual(19);
            expect(response.body.items[0]).toHaveProperty('createdAt');
            expect(response.body.items[0]).toHaveProperty('isMembership');
            expect(response.body.items[0]).toHaveProperty('websiteUrl');
        });

        it('returns errors if invalid search params are provided', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}?sortDirection=ascqwerty&sortBy=createdAtqwerty&pageSize=0&pageNumber=big_number`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages.length).toEqual(4);
            const errorsParams = response.body.errorsMessages.map(
                (error: { message: string; field: string }) => error.field
            );
            ['sortDirection', 'sortBy', 'pageSize', 'pageNumber'].forEach(
                (param) => {
                    expect(errorsParams).toContain(param);
                }
            );
        });

        it('returns a list of blogs sorted by createdAt and ascending order', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}?sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].name).toEqual(getTestBlog(1).name);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeLessThan(
                new Date(response.body.items[9].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(2);
            expect(response.body.totalCount).toEqual(19);
        });

        it('returns a list of blogs sorted by name and descending order', async () => {
            const response = await req.get(`${baseRoutes.blogs}?sortBy=name`);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].name).toEqual(getTestBlog(9).name);
            expect(
                response.body.items[0].name > response.body.items[9].name
            ).toBeTruthy();
        });

        it('returns a list of blogs sorted by name and ascending order', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}?sortBy=name&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].name).toEqual(getTestBlog(1).name);
            expect(
                response.body.items[8].name > response.body.items[0].name
            ).toBeTruthy();
        });

        it('returns a list of blogs with pagination and page size 3', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}?pageSize=3&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(1);
            expect(response.body.items[2].name).toEqual(getTestBlog(3).name);
        });

        it('returns a list of blogs with pagination, page size 3, and page number 2', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}?pageSize=3&sortDirection=asc&pageNumber=2`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(2);
            expect(response.body.items[2].name).toEqual(getTestBlog(6).name);
        });

        it('returns a list of blogs with pagination, page size 5, and page number 4', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}?pageSize=5&sortDirection=asc&pageNumber=4`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(4);
            expect(response.body.pageSize).toEqual(5);
            expect(response.body.page).toEqual(4);
            expect(response.body.items[0].name).toEqual(getTestBlog(16).name);
        });

        it('returns a list of blogs with the name matching the search term', async () => {
            await addNewBlog({
                name: 'Test Blog10',
                description: 'Test description 10',
                websiteUrl: 'https://test10.com',
            });
            await addNewBlog({
                name: 'Test Blog11',
                description: 'Test description 11',
                websiteUrl: 'https://test11.com',
            });
            await addNewBlog({
                name: 'Test Blog12',
                description: 'Test description 11',
                websiteUrl: 'https://test11.com',
            });
            const response_1 = await req.get(
                `${baseRoutes.blogs}?searchNameTerm=blog`
            );
            expect(response_1.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_1.body.totalCount).toEqual(22);
            const response_2 = await req.get(
                `${baseRoutes.blogs}?searchNameTerm=blog1`
            );
            expect(response_2.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_2.body.totalCount).toEqual(3);

            ['Test Blog10', 'Test Blog11', 'Test Blog12'].forEach(
                (blogName) => {
                    expect(
                        response_2.body.items.some(
                            (blog: BlogViewModel) => blog.name === blogName
                        )
                    ).toBeTruthy();
                }
            );
        });
    });

    describe('POST /blogs/:blogId/posts', () => {
        let newTestPost: PostCreateRequestModel;
        let createdPostId = '';

        beforeAll(async () => {
            newTestPost = getTestPost(100, createdTestBlog.id);
        });

        afterAll(async () => {
            if (createdPostId) {
                await postsRepository.deletePost(createdPostId);
            }
        });

        it('can not create a new post for particular blog without authorization', async () => {
            const response = await req
                .post(`${baseRoutes.blogs}/${createdTestBlog.id}/posts`)
                .send(newTestPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a post if auth data is invalid', async () => {
            const response = await req
                .post(`${baseRoutes.blogs}/${createdTestBlog.id}/posts`)
                .auth(...invalidAuthData)
                .send(newTestPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a post if blogId in uri param is npt found', async () => {
            const response = await req
                .post(`${baseRoutes.blogs}/${validObjectId}/posts`)
                .auth(...validAuthData)
                .send(newTestPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it('creates a new post', async () => {
            const response = await req
                .post(`${baseRoutes.blogs}/${createdTestBlog.id}/posts`)
                .auth(...validAuthData)
                .send(newTestPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body).toEqual(expect.objectContaining(newTestPost));
            expect(response.body.blogName).toEqual(createdTestBlog.name);

            // for removing created post after tests
            if (response.body.id) {
                createdPostId = response.body.id;
            }
        });

        it('returns an error if required fields are missing', async () => {
            const newPost = {
                title: newTestPost.title,
                content: newTestPost.content,
                shortDescription: newTestPost.shortDescription,
            };
            for (const key of Object.keys(
                newPost
            ) as (keyof typeof newPost)[]) {
                const invalidPost = { ...newPost };
                delete invalidPost[key];
                const response = await req
                    .post(`${baseRoutes.blogs}/${createdTestBlog.id}/posts`)
                    .auth(...validAuthData)
                    .send(invalidPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST);

                expect(response.body.errorsMessages[0].field).toEqual(key);
            }
        });

        it('returns an error if title field is not valid', async () => {
            const newPost = {
                title: newTestPost.title,
                content: newTestPost.content,
                shortDescription: newTestPost.shortDescription,
            };
            newPost.title = textWithLengthGraterThan30;
            const response = await req
                .post(`${baseRoutes.blogs}/${createdTestBlog.id}/posts`)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('title');
            expect(response.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.title.length
            );
        });

        it('returns an error if shortDescription field is not valid', async () => {
            const newPost = {
                ...newTestPost,
            };
            newPost.shortDescription = textWithLengthGraterThan100;
            const response = await req
                .post(`${baseRoutes.blogs}/${createdTestBlog.id}/posts`)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual(
                'shortDescription'
            );
            expect(response.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.shortDescription.length
            );
        });

        it('returns an error if content field is not valid', async () => {
            const newPost = {
                ...newTestPost,
            };
            newPost.content = textWithLengthGraterThan1000;
            const response = await req
                .post(`${baseRoutes.blogs}/${createdTestBlog.id}/posts`)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('content');
            expect(response.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.content.length
            );
        });

        it('returns an error if blogId param is not valid', async () => {
            const newPost = {
                title: newTestPost.title,
                content: newTestPost.content,
                shortDescription: newTestPost.shortDescription,
            };
            const response = await req
                .post(`${baseRoutes.blogs}/${invalidObjectId}/posts`)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('id');
            expect(response.body.errorsMessages[0].message).toEqual(
                idValidationErrorMessages
            );
            await req
                .post(`${baseRoutes.blogs}/${validObjectId}/posts`)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });

    describe('GET /blogs/:blogId/posts', () => {
        it('returns an error if blogId param is not found', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${validObjectId}/posts`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it('returns a list of posts for particular blog sorted by createdAt in descending order by default', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}/posts`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(19);
            expect(response.body.page).toEqual(1);
            expect(response.body.pagesCount).toEqual(2);
            expect(response.body.items[0]).toHaveProperty('createdAt');
            expect(response.body.items[0].title).toEqual(
                getTestPost(19, createdTestBlog.id).title
            );
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeGreaterThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.items[0]).toHaveProperty('createdAt');
            expect(response.body.items[0]).toHaveProperty('blogName');
        });

        it('returns errors if invalid search params are provided', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}/posts?sortDirection=ascqwerty&sortBy=createdAtqwerty&pageSize=0&pageNumber=big_number`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages.length).toEqual(4);
            const errorsParams = response.body.errorsMessages.map(
                (error: { message: string; field: string }) => error.field
            );
            ['sortDirection', 'sortBy', 'pageSize', 'pageNumber'].forEach(
                (param) => {
                    expect(errorsParams).toContain(param);
                }
            );
        });

        it('returns a list of posts for particular blog sorted by createdAt and ascending order', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}/posts?sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(
                getTestPost(1, createdTestBlog.id).title
            );
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeLessThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(2);
            expect(response.body.totalCount).toEqual(19);
        });

        it('returns a list of posts for particular blog sorted by title and descending order', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}/posts?sortBy=title`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(
                getTestPost(9, createdTestBlog.id).title
            );
            expect(
                response.body.items[0].title > response.body.items[8].title
            ).toBeTruthy();
        });

        it('returns a list of posts for particular blog sorted by title and ascending order', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}/posts?sortBy=title&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(
                getTestPost(1, createdTestBlog.id).title
            );
            expect(
                response.body.items[8].title > response.body.items[0].title
            ).toBeTruthy();
        });

        it('returns a list of posts for particular blog with pagination and page size 3', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}/posts?pageSize=3&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(1);
            expect(response.body.items[2].title).toEqual(
                getTestPost(3, createdTestBlog.id).title
            );
        });

        it('returns a list of posts for particular blog with pagination, page size 3, and page number 2', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}/posts?pageSize=3&sortDirection=asc&pageNumber=2`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(2);
            expect(response.body.items[2].title).toEqual(
                getTestPost(6, createdTestBlog.id).title
            );
        });

        it('returns a list of posts for particular blog with pagination, page size 5, and page number 4', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}/posts?pageSize=5&sortDirection=asc&pageNumber=4`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(4);
            expect(response.body.pageSize).toEqual(5);
            expect(response.body.page).toEqual(4);
            expect(response.body.items[0].title).toEqual(
                getTestPost(16, createdTestBlog.id).title
            );
        });
    });

    describe('POST /blogs', () => {
        it('can not create a new blog without authorization', async () => {
            const response = await req
                .post(baseRoutes.blogs)
                .send(getTestBlog(1));
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a blog if auth data is invalid', async () => {
            const response = await req
                .post(baseRoutes.blogs)
                .auth(...invalidAuthData)
                .send(getTestBlog(1));
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('creates a new blog', async () => {
            const response = await req
                .post(baseRoutes.blogs)
                .auth(...validAuthData)
                .send(getTestBlog(1));
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body.name).toEqual(getTestBlog(1).name);
            expect(response.body.description).toEqual(
                getTestBlog(1).description
            );
        });

        it('returns an error if required fields are missing', async () => {
            const keys = Object.keys(getTestBlog(1));
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const newBlog = { ...getTestBlog(1) };
                delete newBlog[key as keyof typeof newBlog];
                const response = await req
                    .post(baseRoutes.blogs)
                    .auth(...validAuthData)
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST);
                expect(response.body.errorsMessages[0].field).toEqual(key);
            }
        });

        it('returns an error if name field is not valid', async () => {
            const newBlog = {
                ...getTestBlog(1),
            };
            newBlog.name = textWithLengthGraterThan15;
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
                ...getTestBlog(1),
            };
            newBlog.description = textWithLengthGraterThan500;
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
                ...getTestBlog(1),
            };
            newBlog.websiteUrl = invalidURLFormat;
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
            newBlog.websiteUrl = emailWithLengthGraterThan100;
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
            const createdTestBlog = await addNewBlog(getTestBlog(1));
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual(createdTestBlog);
        });

        it("returns an error if blog's id is not valid", async () => {
            const createdTestBlog = await addNewBlog(getTestBlog(1));
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id.slice(1, 7)}`
            );
            expect(response.body.errorsMessages[0].message).toEqual(
                idValidationErrorMessages
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
                ...getTestBlog(1),
                name: 'Updated name',
            };
            const response = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .send(updatedBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not update a blog if auth data is invalid', async () => {
            const updatedBlog = {
                ...getTestBlog(1),
                name: 'Updated name',
            };
            const response = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .auth(...invalidAuthData)
                .send(updatedBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('updates a blog', async () => {
            const createdTestBlogId = (await addNewBlog(getTestBlog(1))).id;
            const response = await req.get(
                `${baseRoutes.blogs}/${createdTestBlogId}`
            );
            expect(response.body.id).toBe(createdTestBlogId);
            const updatedBlog = {
                ...getTestBlog(1),
                name: 'Updated name',
            };
            const updateResponse = await req
                .put(`${baseRoutes.blogs}/${createdTestBlogId}`)
                .auth(...validAuthData)
                .send(updatedBlog);
            expect(updateResponse.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
        });

        it('returns an error if blog is not found', async () => {
            const updatedBlog = {
                ...getTestBlog(1),
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
                ...getTestBlog(1),
                name: 'Updated name',
            };
            const response = await req
                .put(`${baseRoutes.blogs}/${invalidObjectId}`)
                .auth(...validAuthData)
                .send(updatedBlog);
            expect(response.body.errorsMessages[0].message).toEqual(
                idValidationErrorMessages
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if name field is not valid', async () => {
            const newBlog = {
                ...getTestBlog(1),
            };
            newBlog.name = textWithLengthGraterThan15;
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
                ...getTestBlog(1),
            };
            newBlog.description = textWithLengthGraterThan500;
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
                ...getTestBlog(1),
            };
            newBlog.websiteUrl = invalidURLFormat;
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
            newBlog.websiteUrl = emailWithLengthGraterThan100;
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
            const createdTestBlog = await addNewBlog(getTestBlog(1));
            const response = await req.delete(
                `${baseRoutes.blogs}/${createdTestBlog.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not delete a blog if auth data is invalid', async () => {
            const createdTestBlog = await addNewBlog(getTestBlog(1));
            const response = await req
                .delete(`${baseRoutes.blogs}/${createdTestBlog.id}`)
                .auth(...invalidAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('deletes a blog', async () => {
            const createdTestBlog = await addNewBlog(getTestBlog(1));
            const response_1 = await req
                .delete(`${baseRoutes.blogs}/${createdTestBlog.id}`)
                .auth(...validAuthData);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const response_2 = await req.get(
                `${baseRoutes.blogs}/${createdTestBlog.id}`
            );
            expect(response_2.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it("returns an error if blog's id is not valid", async () => {
            const response = await req
                .delete(`${baseRoutes.blogs}/${invalidObjectId}`)
                .auth(...validAuthData);
            expect(response.body.errorsMessages[0].message).toEqual(
                idValidationErrorMessages
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
