import { Router } from 'express';
import { blogsController } from '../controllers';
import { authValidator, blogsValidators } from '../middlewares';

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
