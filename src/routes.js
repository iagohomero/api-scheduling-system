import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import ScheduleController from './app/controllers/ScheduleController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.post('/files', upload.single('avatar'), FileController.store);
routes.get('/providers', ProviderController.index);
routes.get('/schedules', ScheduleController.index);
routes.post('/schedules', ScheduleController.store);
routes.put('/users', UserController.update);

export default routes;
