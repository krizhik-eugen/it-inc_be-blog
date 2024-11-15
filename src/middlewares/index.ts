import { authValidator } from './authMiddleware/authValidator';
import { blogsValidators } from './validationMiddleware/blogsRequestValidator';
import { postsValidators } from './validationMiddleware/postsRequestValidator';

export { authValidator, blogsValidators, postsValidators };
