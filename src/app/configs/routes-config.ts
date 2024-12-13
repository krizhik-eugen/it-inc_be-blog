export const baseRoutes = {
    testing: '/testing/all-data',
    blogs: '/blogs',
    posts: '/posts',
    users: '/users',
    auth: '/auth',
    comments: '/comments',
} as const;

export const routersPaths = {
    auth: {
        main: '/',
        login: '/login',
        me: '/me',
    },
    blogs: {
        main: '/',
        id: '/:id',
        idPosts: '/:id/posts',
        idPostsId: '/:id/posts/:postId',
    },
    posts: {
        main: '/',
        id: '/:id',
        idComments: '/:id/comments',
    },
    comments: {
        main: '/',
        id: '/:id',
    },
    users: {
        main: '/',
        id: '/:id',
    },
} as const;
