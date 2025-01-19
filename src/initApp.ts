import express from 'express';
// import cors from 'cors';
import cookieParser from 'cookie-parser';
import { baseRoutes } from './app/configs/routes-config';
import { authRouter } from './features/auth/api/auth-router';
import { blogsRouter } from './features/blogs/blogs-router';
import { commentsRouter } from './features/comments/comments-router';
import { postsRouter } from './features/posts/posts-router';
import { testingRouter } from './features/testing/testing-router';
import { usersRouter } from './features/users/api/users-router';
import { securityRouter } from './features/security/api/security-router';

export const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.set('trust proxy', true);

app.use(baseRoutes.auth, authRouter);
app.use(baseRoutes.blogs, blogsRouter);
app.use(baseRoutes.comments, commentsRouter);
app.use(baseRoutes.posts, postsRouter);
app.use(baseRoutes.testing, testingRouter);
app.use(baseRoutes.users, usersRouter);
app.use(baseRoutes.security, securityRouter);

app.get('/', (req, res: express.Response) => {
    res.json({
        version: 1,
    });
});
