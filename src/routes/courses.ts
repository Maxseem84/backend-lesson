import express, { Response } from 'express';
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
import { HTTP_STATUSES } from '../utils';

const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  };
};

export const getCoursesRouter = (db: DBType) => {
  const router = express.Router();
  router.get('/', (req: RequestWithQuery<QueryCoursesModel>, res: Response<CourseViewModel[]>) => {
    const courses = db.courses;
    const title = typeof req.query.title === 'string' ? req.query.title.toLowerCase() : undefined;
    if (title) {
      return res.json(
        courses.filter((c) => c.title.toLowerCase().includes(title)).map(getCourseViewModel),
      );
    }
    return res.json(courses.map(getCourseViewModel));
  });

  router.get(
    '/:id',
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

  router.post('/', (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {
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
  });

  router.put(
    '/:id',
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

  router.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
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

  return router;
};

// export const getInterestingRouter = () => {
//   const router = express.Router();
//   router.get('/books', (req: Request, res: Response) => {
//     return res.json({ title: 'its books handler' });
//   });

//   router.get('/:id', (req: Request, res: Response) => {
//     return res.json({ title: 'data by id: ' + req.params.id });
//   });

//   return router;
// };
