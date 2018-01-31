export interface User {
  dschoolid: number;
  email: string;
  email_verif: boolean;
  freemoney: number;
  name: string;
  profilepic: string;
  totalvalue: number;
  uid: number;
}

export interface Value {
  time: number;
  totalvalue: number;
}

export interface UserResponse {
  data: User;
  values?: Value[];
}