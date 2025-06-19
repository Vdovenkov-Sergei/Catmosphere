import express from 'express';
import config from './config';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());


app.use(errorHandler);

const PORT = config.app.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
