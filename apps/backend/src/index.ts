import express from 'express';
import config from './config';
import { admin, adminRouter } from './admin'
import { errorHandler } from './middleware/errorHandler';
import { router as catRouter } from './modules/cat/router';
import { router as tableRouter } from './modules/table/router';
import { router as bookingRouter } from './modules/booking/router';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import chalk from 'chalk';
import path from 'path';

const app = express();
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/admin/custom.css', express.static(path.join(__dirname, 'admin/admin-custom.css')));

app.use(admin.options.rootPath, adminRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/cats', catRouter);
app.use('/tables', tableRouter);
app.use('/bookings', bookingRouter);

app.use(errorHandler);

const PORT = config.app.PORT || 8080;
app.listen(PORT, () => console.log(chalk.green(`Server running on port ${PORT}`)));