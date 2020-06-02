// somando um novo tipo a interface Request
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
