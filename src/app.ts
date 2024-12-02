import express from 'express';
import { baseRoutes } from './configs';
import { postsRouter } from './posts';
import { testingRouter } from './testing';
import { blogsRouter } from './blogs';
import { usersRouter } from './users';
// import cors from 'cors';

export const app = express();

app.use(express.json());
// app.use(cors());

app.use(baseRoutes.testing, testingRouter);
app.use(baseRoutes.posts, postsRouter);
app.use(baseRoutes.blogs, blogsRouter);
app.use(baseRoutes.users, usersRouter);
