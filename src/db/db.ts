export type CourseType = {
  id: number;
  title: string;
  studentsCount: number;
};

export type DBType = {
  courses: CourseType[];
};

export const db: DBType = {
  courses: [
    { id: 1, title: 'front-end', studentsCount: 10 },
    { id: 2, title: 'back-end', studentsCount: 10 },
    { id: 3, title: 'automation qa', studentsCount: 10 },
    { id: 4, title: 'devops', studentsCount: 10 },
  ],
};
