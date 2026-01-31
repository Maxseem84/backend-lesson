import express, { Request, Response } from 'express';
import {
  RequestWithQuery,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from './types';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

type CourseType = {
  id: number;
  title: string;
};

const db: { courses: CourseType[] } = {
  courses: [
    { id: 1, title: 'front-end' },
    { id: 2, title: 'back-end' },
    { id: 3, title: 'automation qa' },
    { id: 4, title: 'devops' },
  ],
};

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

app.get('/courses', (req: RequestWithQuery<{ title: string }>, res: Response<CourseType[]>) => {
  const courses = db.courses;
  const title = typeof req.query.title === 'string' ? req.query.title.toLowerCase() : undefined;
  if (title) {
    return res.json(courses.filter((c) => c.title.toLowerCase().includes(title)));
  }
  return res.json(courses);
});

app.get('/courses/:id', (req: RequestWithParams<{ id: string }>, res: Response<CourseType>) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  }
  const course = db.courses.find((c) => c.id === id);
  if (!course) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
  return res.json(course);
});

app.post('/courses', (req: RequestWithBody<{ title: string }>, res: Response<CourseType>) => {
  const title = req.body.title;
  if (typeof title !== 'string' || !title.trim()) {
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  }
  const createdCourse = {
    id: Date.now(),
    title: title.trim(),
  };
  db.courses.push(createdCourse);
  res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
});

app.delete('/courses/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
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

app.put(
  '/courses/:id',
  (req: RequestWithParamsAndBody<{ id: string }, { title: string }>, res: Response) => {
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

app.delete('/__tests__/data', (res: Response) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// const products = [
//   { id: 1, title: 'tomato' },
//   { id: 2, title: 'orange' },
// ];
// const addresses = [
//   { id: 1, value: 'Address 1' },
//   { id: 2, value: 'Address 2' },
// ];

// app.get('/products', (req: Request, res: Response) => {
//   if (req.query.title) {
//     const searchString = req.query.title.toString();
//     res.send(products.filter((obj) => obj.title.indexOf(searchString) > -1));
//   } else {
//     res.send(products);
//   }
// });

// app.get('/products/:id', (req: Request, res: Response) => {
//   const product = products.find((obj) => obj.id === Number(req.params.id));
//   if (product) {
//     res.send(product);
//   } else {
//     res.sendStatus(404);
//   }
// });

// app.post('/products', (req: Request, res: Response) => {
//   const newProduct = {
//     id: Date.now(),
//     title: req.body.title,
//   };
//   products.push(newProduct);
//   res.status(201).send(newProduct);
// });

// app.delete('/products/:id', (req: Request, res: Response) => {
//   const index = products.findIndex((obj) => obj.id === Number(req.params.id));
//   if (index !== -1) {
//     products.splice(index, 1);
//     res.sendStatus(204);
//   } else {
//     res.sendStatus(404);
//   }
// });

// app.put('/products/:id', (req: Request, res: Response) => {
//   const product = products.find((obj) => obj.id === Number(req.params.id));
//   if (product) {
//     product.title = req.body.title;
//     res.send(product);
//   } else {
//     res.sendStatus(404);
//   }
// });

// app.get('/addresses', (req: Request, res: Response) => {
//   res.send(addresses);
// });

// app.get('/addresses/:id', (req: Request, res: Response) => {
//   const address = addresses.find((obj) => obj.id === Number(req.params.id));
//   if (address) {
//     res.send(address);
//   } else {
//     res.sendStatus(404);
//   }
// });
