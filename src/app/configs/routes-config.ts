export const baseRoutes = {
    testing: '/testing/all-data',
    blogs: '/blogs',
    posts: '/posts',
    users: '/users',
    auth: '/auth',
    comments: '/comments',
    security: '/security',
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
        passwordRecovery: '/password-recovery',
        newPassword: '/new-password',
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
        likeStatus: '/:id/like-status',
    },
    comments: {
        main: '/',
        id: '/:id',
        likeStatus: '/:id/like-status',
    },
    users: {
        main: '/',
        id: '/:id',
    },
    security: {
        main: '/',
        devices: '/devices',
        devicesId: '/devices/:id',
    },
} as const;
