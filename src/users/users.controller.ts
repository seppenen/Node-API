import { BaseController } from '../common/base.controller';
import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';

import { ILogger } from '../logger/logger.interface';
import { IUserController } from './user.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { UserService } from './user.service';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) protected loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: UserService,
	) {
		super(loggerService);
		this.bindRouter([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/err', method: 'get', func: this.err, middlewares: [] },
		]);
	}

	login = (req: Request<{}, {}, UserLoginDto>, res: Response): void => {
		this.ok(res, 'Login');
	};

	register = async (
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'User already exists'));
		}
		this.ok(res, result);
	};

	err = (req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): void => {
		console.log(req.body);
		next(new HttpError(401, 'Authorization failed', 'Login'));
	};
}
