import { Express, Response } from 'express';
import {
  RequestWithQuery,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../types';
import { CreateCourseModel } from '../models/CreateCourseModel';
import { QueryCoursesModel } from '../models/QueryCoursesModel';
import { CourseViewModel } from '../models/CourseViewModel';
import { UpdateCourseModel } from '../models/UpdateCourseModel';
import { URIParamsCourseIdModel } from '../models/URIParamsCoursIdModel';
import { CourseType, DBType } from './../db/db';

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  };
};

export const addCoursesRoutes = (app: Express, db: DBType) => {
  app.get(
    '/courses',
    (req: RequestWithQuery<QueryCoursesModel>, res: Response<CourseViewModel[]>) => {
      const courses = db.courses;
      const title = typeof req.query.title === 'string' ? req.query.title.toLowerCase() : undefined;
      if (title) {
        return res.json(courses.filter((c) => c.title.toLowerCase().includes(title)));
      }
      return res.json(courses.map(getCourseViewModel));
    },
  );

  app.get(
    '/courses/:id',
    (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      }
      const course = db.courses.find((c) => c.id === id);
      if (!course) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      }
      return res.json(getCourseViewModel(course));
    },
  );

  app.post(
    '/courses',
    (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {
      const title = req.body.title;
      if (typeof title !== 'string' || !title.trim()) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      }
      const createdCourse: CourseType = {
        id: Date.now(),
        title: title.trim(),
        studentsCount: 0,
      };
      db.courses.push(createdCourse);
      res.status(HTTP_STATUSES.CREATED_201).json(getCourseViewModel(createdCourse));
    },
  );

  app.put(
    '/courses/:id',
    (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>, res: Response) => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      }
      const title = req.body.title;
      if (typeof title !== 'string' || !title.trim()) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      }
      const course = db.courses.find((c) => c.id === id);
      if (!course) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      }
      course.title = title.trim();
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
  );

  app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    }
    const initialLength = db.courses.length;
    db.courses = db.courses.filter((c) => c.id !== id);
    if (db.courses.length === initialLength) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });
};
