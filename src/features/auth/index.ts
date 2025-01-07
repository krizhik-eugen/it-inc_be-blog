import { authController, authService } from './composition-root';
import { authValidators } from './middlewares';
import { authRouter } from './router';

export { authController, authRouter, authService, authValidators };
