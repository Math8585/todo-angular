export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


export interface NormalisedUser {
  email: string;
  password: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user?: string;
  categoryId: string;
}

