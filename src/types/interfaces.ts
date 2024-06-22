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
  name: string;
  userId : number
}
