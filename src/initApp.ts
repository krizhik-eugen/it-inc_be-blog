import express from 'express';
import { baseRoutes } from './app/configs';
import { testingRouter } from './features/testing';
import { postsRouter } from './features/posts';
import { blogsRouter } from './features/blogs';
import { usersRouter } from './features/users';
import { authRouter } from './features/auth';
import { commentsRouter } from './features/comments';
import cookieParser from 'cookie-parser';
// import cors from 'cors';

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
