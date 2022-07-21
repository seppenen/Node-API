import { NextFunction, Response, Request } from 'express';

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
	err: (req: Request, res: Response, next: NextFunction) => void;
}
