import { Router } from 'express';
import { blogsController } from '../controller';
import { authValidator } from '../../app-middlewares';
import { blogsValidators } from '../middlewares';

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getAllBlogs);

blogsRouter.post(
    '/',
    ...authValidator,
    ...blogsValidators.postRequest,
    blogsController.createNewBlog
);

blogsRouter.get('/:id', blogsController.getBlog);

blogsRouter.put(
    '/:id',
    ...authValidator,
    ...blogsValidators.putRequest,
    blogsController.updateBlog
);

blogsRouter.delete('/:id', ...authValidator, blogsController.deleteBlog);
