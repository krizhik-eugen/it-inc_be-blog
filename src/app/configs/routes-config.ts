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
        registration: '/registration',
        confirmation: '/registration-confirmation',
        resendEmail: '/registration-email-resending',
        refreshToken: '/refresh-token',
        logout: '/logout',
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
