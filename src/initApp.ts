import express from 'express';
import { baseRoutes } from './app/configs';
import { testingRouter } from './testing';
import { postsRouter } from './posts';
import { blogsRouter } from './blogs';
import { usersRouter } from './users';
import { authRouter } from './auth/router/auth-router';
import { commentsRouter } from './comments/router';
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
