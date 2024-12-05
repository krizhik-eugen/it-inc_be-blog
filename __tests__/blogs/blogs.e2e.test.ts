import { baseRoutes } from '../../src/configs';
import { blogsRepository, BlogViewModel } from '../../src/blogs';
import {
    addNewBlog,
    addNewPost,
    blogsValidationErrorMessages,
    DBHandlers,
    invalidAuthData,
    invalidBlogsFields,
    invalidObjectId,
    invalidPostsFields,
    postsValidationErrorMessages,
    req,
    testBlogs,
    testPosts,
    validAuthData,
    validObjectId,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { postsRepository } from '../../src/posts';

describe('Blogs Controller', () => {
    beforeAll(async () => {
        await DBHandlers.connectToDB();
    });

    beforeEach(async () => {
        await blogsRepository.setBlogs([]);
    });

    afterAll(async () => {
        await DBHandlers.closeDB();
    });

    const setTestBlogs = async () => {
        for (let i = 0; i < testBlogs.length; i++) {
            await addNewBlog(testBlogs[i]);
        }
    };

    const setTestPosts = async (blogId: string) => {
        for (let i = 0; i < testPosts.length; i++) {
            await addNewPost({ ...testPosts[i], blogId });
        }
    };

    describe('GET /blogs', () => {
        it('returns an empty array initially', async () => {
            const response = await req.get(baseRoutes.blogs);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(0);
            expect(response.body.items).toEqual([]);
        });

        it('returns a list of blogs after creating one', async () => {
            await addNewBlog(testBlogs[0]);
            const response = await req.get(baseRoutes.blogs);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(1);
            expect(response.body.items[0].name).toEqual(testBlogs[0].name);
            expect(response.body.items[0]).toHaveProperty('createdAt');
            expect(response.body.items[0]).toHaveProperty('isMembership');
            expect(response.body.items[0]).toHaveProperty('websiteUrl');
        });

        it('returns a list of blogs sorted by createdAt and descending order by default', async () => {
            await setTestBlogs();
            const response = await req.get(`${baseRoutes.blogs}`);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].name).toEqual(testBlogs[8].name);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeGreaterThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.totalCount).toEqual(9);
            expect(response.body.items[0]).toHaveProperty('createdAt');
            expect(response.body.items[0]).toHaveProperty('isMembership');
            expect(response.body.items[0]).toHaveProperty('websiteUrl');
        });

        it('returns errors if invalid search params are provided', async () => {
            await setTestBlogs();
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
            await setTestBlogs();
            const response = await req.get(
                `${baseRoutes.blogs}?sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].name).toEqual(testBlogs[0].name);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeLessThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.totalCount).toEqual(9);
        });

        it('returns a list of blogs sorted by name and descending order', async () => {
            await setTestBlogs();
            const response = await req.get(`${baseRoutes.blogs}?sortBy=name`);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].name).toEqual(testBlogs[8].name);
            expect(
                response.body.items[0].name > response.body.items[8].name
            ).toBeTruthy();
        });

        it('returns a list of blogs sorted by name and ascending order', async () => {
            await setTestBlogs();
            const response = await req.get(
                `${baseRoutes.blogs}?sortBy=name&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].name).toEqual(testBlogs[0].name);
            expect(
                response.body.items[8].name > response.body.items[0].name
            ).toBeTruthy();
        });

        it('returns a list of blogs with pagination and page size 3', async () => {
            await setTestBlogs();
            const response = await req.get(
                `${baseRoutes.blogs}?pageSize=3&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(1);
            expect(response.body.items[2].name).toEqual(testBlogs[2].name);
        });

        it('returns a list of blogs with pagination, page size 3, and page number 2', async () => {
            await setTestBlogs();
            const response = await req.get(
                `${baseRoutes.blogs}?pageSize=3&sortDirection=asc&pageNumber=2`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(2);
            expect(response.body.items[2].name).toEqual(testBlogs[5].name);
        });

        it('returns a list of blogs with pagination, page size 4, and page number 3', async () => {
            await setTestBlogs();
            const response = await req.get(
                `${baseRoutes.blogs}?pageSize=4&sortDirection=asc&pageNumber=3`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(1);
            expect(response.body.pageSize).toEqual(4);
            expect(response.body.page).toEqual(3);
            expect(response.body.items[0].name).toEqual(testBlogs[8].name);
        });

        it('returns a list of blogs with the name matching the search term', async () => {
            await setTestBlogs();
            await blogsRepository.setBlogs([
                {
                    name: 'Test Blog10',
                    description: 'Test description 10',
                    websiteUrl: 'https://test10.com',
                },
                {
                    name: 'Test Blog11',
                    description: 'Test description 11',
                    websiteUrl: 'https://test11.com',
                },
                {
                    name: 'Test Blog12',
                    description: 'Test description 11',
                    websiteUrl: 'https://test11.com',
                },
            ]);
            const response_1 = await req.get(
                `${baseRoutes.blogs}?searchNameTerm=blog`
            );
            expect(response_1.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_1.body.totalCount).toEqual(12);

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
        let createdBlog: BlogViewModel;
        const testPost = testPosts[0];

        beforeEach(async () => {
            await postsRepository.setPosts([]);
            createdBlog = await addNewBlog(testBlogs[0]);
            testPost.blogId = createdBlog.id;
        });

        it('can not create a new post for particular blog without authorization', async () => {
            const response = await req
                .post(`${baseRoutes.blogs}/${createdBlog.id}/posts`)
                .send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a post if auth data is invalid', async () => {
            const response = await req
                .post(`${baseRoutes.blogs}/${createdBlog.id}/posts`)
                .auth(...invalidAuthData)
                .send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('creates a new post', async () => {
            const response = await req
                .post(`${baseRoutes.blogs}/${createdBlog.id}/posts`)
                .auth(...validAuthData)
                .send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body).toEqual(expect.objectContaining(testPost));
            expect(response.body.blogName).toEqual(createdBlog.name);
        });

        it('returns an error if required fields are missing', async () => {
            const newPost = {
                title: testPost.title,
                content: testPost.content,
                shortDescription: testPost.shortDescription,
            };

            for (const key of Object.keys(
                newPost
            ) as (keyof typeof newPost)[]) {
                const invalidPost = { ...newPost };
                delete invalidPost[key];

                const response = await req
                    .post(`${baseRoutes.blogs}/${createdBlog.id}/posts`)
                    .auth(...validAuthData)
                    .send(invalidPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST);

                expect(response.body.errorsMessages[0].field).toEqual(key);
            }
        });

        it('returns an error if title field is not valid', async () => {
            const newPost = {
                title: testPost.title,
                content: testPost.content,
                shortDescription: testPost.shortDescription,
            };

            newPost.title = invalidPostsFields.title.length;

            const response = await req
                .post(`${baseRoutes.blogs}/${createdBlog.id}/posts`)
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
                ...testPost,
            };

            newPost.shortDescription =
                invalidPostsFields.shortDescription.length;

            const response = await req
                .post(`${baseRoutes.blogs}/${createdBlog.id}/posts`)
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
                ...testPost,
            };

            newPost.content = invalidPostsFields.content.length;

            const response = await req
                .post(`${baseRoutes.blogs}/${createdBlog.id}/posts`)
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
                title: testPost.title,
                content: testPost.content,
                shortDescription: testPost.shortDescription,
            };

            const response_1 = await req
                .post(`${baseRoutes.blogs}/${invalidObjectId}/posts`)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response_1.body.errorsMessages[0].field).toEqual('id');
            expect(response_1.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.id.format
            );

            const response_2 = await req
                .post(`${baseRoutes.blogs}/${validObjectId}/posts`)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response_2.body.errorsMessages[0].field).toEqual('id');
            expect(response_2.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.blogId.value
            );
        });
    });

    describe('GET /blogs/:blogId/posts', () => {
        let addedBlogId: BlogViewModel['id'];

        beforeEach(async () => {
            await addNewBlog(testBlogs[0]);
            addedBlogId = (await req.get(baseRoutes.blogs)).body.items[0].id;
            await setTestPosts(addedBlogId);
        });

        it('returns an empty array initially', async () => {
            await postsRepository.setPosts([]);
            const response = await req.get(
                `${baseRoutes.blogs}/${addedBlogId}/posts`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(0);
            expect(response.body.items).toEqual([]);
        });

        it('returns a list of posts for particular blog sorted by createdAt in descending order by default', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${addedBlogId}/posts`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(9);
            expect(response.body.page).toEqual(1);
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.items[0]).toHaveProperty('createdAt');
            expect(response.body.items[0].title).toEqual(testPosts[8].title);
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
                `${baseRoutes.blogs}/${addedBlogId}/posts?sortDirection=ascqwerty&sortBy=createdAtqwerty&pageSize=0&pageNumber=big_number`
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
                `${baseRoutes.blogs}/${addedBlogId}/posts?sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(testPosts[0].title);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeLessThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.totalCount).toEqual(9);
        });

        it('returns a list of posts for particular blog sorted by title and descending order', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${addedBlogId}/posts?sortBy=title`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(testPosts[8].title);
            expect(
                response.body.items[0].title > response.body.items[8].title
            ).toBeTruthy();
        });

        it('returns a list of posts for particular blog sorted by title and ascending order', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${addedBlogId}/posts?sortBy=title&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(testPosts[0].title);
            expect(
                response.body.items[8].title > response.body.items[0].title
            ).toBeTruthy();
        });

        it('returns a list of posts for particular blog with pagination and page size 3', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${addedBlogId}/posts?pageSize=3&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(1);
            expect(response.body.items[2].title).toEqual(testPosts[2].title);
        });

        it('returns a list of posts for particular blog with pagination, page size 3, and page number 2', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${addedBlogId}/posts?pageSize=3&sortDirection=asc&pageNumber=2`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(2);
            expect(response.body.items[2].title).toEqual(testPosts[5].title);
        });

        it('returns a list of posts for particular blog with pagination, page size 4, and page number 3', async () => {
            const response = await req.get(
                `${baseRoutes.blogs}/${addedBlogId}/posts?pageSize=4&sortDirection=asc&pageNumber=3`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(1);
            expect(response.body.pageSize).toEqual(4);
            expect(response.body.page).toEqual(3);
            expect(response.body.items[0].title).toEqual(testPosts[8].title);
        });
    });

    describe('POST /blogs', () => {
        it('can not create a new blog without authorization', async () => {
            const response = await req
                .post(baseRoutes.blogs)
                .send(testBlogs[0]);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a blog if auth data is invalid', async () => {
            const response = await req
                .post(baseRoutes.blogs)
                .auth(...invalidAuthData)
                .send(testBlogs[0]);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('creates a new blog', async () => {
            const response = await req
                .post(baseRoutes.blogs)
                .auth(...validAuthData)
                .send(testBlogs[0]);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body.name).toEqual(testBlogs[0].name);
            expect(response.body.description).toEqual(testBlogs[0].description);
        });

        it('returns an error if required fields are missing', async () => {
            (
                Object.keys(testBlogs[0]) as (keyof (typeof testBlogs)[0])[]
            ).forEach(async (key) => {
                const newBlog = { ...testBlogs[0] };
                delete newBlog[key];
                const response = await req
                    .post(baseRoutes.blogs)
                    .auth(...validAuthData)
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST);
                expect(response.body.errorsMessages[0].field).toEqual(key);
            });
        });

        it('returns an error if name field is not valid', async () => {
            const newBlog = {
                ...testBlogs[0],
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
                ...testBlogs[0],
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
                ...testBlogs[0],
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
            const createdBlog = await addNewBlog(testBlogs[0]);
            const response = await req.get(
                `${baseRoutes.blogs}/${createdBlog.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual(createdBlog);
        });

        it("returns an error if blog's id is not valid", async () => {
            const createdBlog = await addNewBlog(testBlogs[0]);
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
                ...testBlogs[0],
                name: 'Updated name',
            };
            const response = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .send(updatedBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not update a blog if auth data is invalid', async () => {
            const updatedBlog = {
                ...testBlogs[0],
                name: 'Updated name',
            };
            const response = await req
                .put(`${baseRoutes.blogs}/${validObjectId}`)
                .auth(...invalidAuthData)
                .send(updatedBlog);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('updates a blog', async () => {
            const createdBlogId = (await addNewBlog(testBlogs[0])).id;
            const response = await req.get(
                `${baseRoutes.blogs}/${createdBlogId}`
            );
            expect(response.body.id).toBe(createdBlogId);
            const updatedBlog = {
                ...testBlogs[0],
                name: 'Updated name',
            };
            const updateResponse = await req
                .put(`${baseRoutes.blogs}/${createdBlogId}`)
                .auth(...validAuthData)
                .send(updatedBlog);
            expect(updateResponse.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
        });

        it('returns an error if blog is not found', async () => {
            const updatedBlog = {
                ...testBlogs[0],
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
                ...testBlogs[0],
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
                ...testBlogs[0],
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
                ...testBlogs[0],
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
                ...testBlogs[0],
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
            const createdBlog = await addNewBlog(testBlogs[0]);
            const response = await req.delete(
                `${baseRoutes.blogs}/${createdBlog.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not delete a blog if auth data is invalid', async () => {
            const createdBlog = await addNewBlog(testBlogs[0]);
            const response = await req
                .delete(`${baseRoutes.blogs}/${createdBlog.id}`)
                .auth(...invalidAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('deletes a blog', async () => {
            const createdBlog = await addNewBlog(testBlogs[0]);
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
