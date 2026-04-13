export interface User {
  _id?: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
