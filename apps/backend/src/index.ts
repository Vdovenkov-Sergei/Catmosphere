import express from 'express';
import config from './config';
import { admin, adminRouter } from './admin'
import { errorHandler } from './middleware/errorHandler';
import { router as catRouter } from './modules/cat/router';
import { router as tableRouter } from './modules/table/router';
import { router as bookingRouter } from './modules/booking/router';

const app = express();
app.use(express.json());

app.use(admin.options.rootPath, adminRouter)
app.use('/cats', catRouter);
app.use('/tables', tableRouter);
app.use('/bookings', bookingRouter);

app.use(errorHandler);

const PORT = config.app.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
