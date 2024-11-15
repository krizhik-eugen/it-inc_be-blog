import { Router } from "express";
import { blogsController } from "../controllers";
import { blogsValidators } from "../middlewares";

export const blogsRouter = Router();

blogsRouter.get('/',
    blogsController.getAllBlogs
);

blogsRouter.post('/',
    ...blogsValidators.postRequest,
    blogsController.createNewBlog
);

blogsRouter.get('/:id',
    blogsController.getBlog
);

blogsRouter.put('/:id',
    ...blogsValidators.putRequest,
    blogsController.updateBlog
);

blogsRouter.delete('/:id',
    blogsController.deleteBlog
);
