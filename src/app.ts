import express from 'express';
import { addTestsRoutes } from './routes/tests';
import { addCoursesRoutes } from './routes/courses';
import { db } from './db/db';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

addCoursesRoutes(app, db);
addTestsRoutes(app, db);
