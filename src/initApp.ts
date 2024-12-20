import express from 'express';
import { baseRoutes } from './app/configs';
import { testingRouter } from './domain/testing';
import { postsRouter } from './domain/posts';
import { blogsRouter } from './domain/blogs';
import { usersRouter } from './domain/users';
import { authRouter } from './domain/auth';
import { commentsRouter } from './domain/comments';
import { emailManager } from './app/managers';
import { HTTP_STATUS_CODES } from './constants';
// import cors from 'cors';

export const app = express();

app.use(express.json());
// app.use(cors());

app.use(baseRoutes.auth, authRouter);
app.use(baseRoutes.blogs, blogsRouter);
app.use(baseRoutes.comments, commentsRouter);
app.use(baseRoutes.posts, postsRouter);
app.use(baseRoutes.testing, testingRouter);
app.use(baseRoutes.users, usersRouter);
