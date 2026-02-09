import express from 'express';
import { getTestsRouter } from './routes/tests';
import { getCoursesRouter } from './routes/courses';
import { db } from './db/db';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/courses', getCoursesRouter(db));
app.use('/__tests__', getTestsRouter(db));
