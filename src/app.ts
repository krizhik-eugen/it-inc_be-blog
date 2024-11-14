import express from 'express';
import { baseRoutes } from './configs/routes-config';
import { testingRouter } from './routes/testing-router';
import { postsRouter } from './routes/posts-router';
import { blogsRouter } from './routes/blogs-router';
// import cors from 'cors';

export const app = express();

app.use(express.json());
// app.use(cors());

app.use(baseRoutes.testing, testingRouter);
app.use(baseRoutes.posts, postsRouter);
app.use(baseRoutes.blogs, blogsRouter);
