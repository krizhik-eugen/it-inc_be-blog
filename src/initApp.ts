import express from 'express';
// import cors from 'cors';
import cookieParser from 'cookie-parser';
import { baseRoutes } from './app/configs';
import { testingRouter } from './features/testing/router';
import { postsRouter } from './features/posts/router';
import { blogsRouter } from './features/blogs/router';
import { usersRouter } from './features/users/router';
import { authRouter } from './features/auth/router';
import { commentsRouter } from './features/comments/router';
import { securityRouter } from './features/security/router';
import { userAuthIdentifier } from './app/middlewares/auth';

export const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.set('trust proxy', true);

app.use(userAuthIdentifier);
app.use(baseRoutes.auth, authRouter);
app.use(baseRoutes.blogs, blogsRouter);
app.use(baseRoutes.comments, commentsRouter);
app.use(baseRoutes.posts, postsRouter);
app.use(baseRoutes.testing, testingRouter);
app.use(baseRoutes.users, usersRouter);
app.use(baseRoutes.security, securityRouter);
