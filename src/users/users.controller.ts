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
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) protected loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: UserService,
		@inject(TYPES.IConfigService) private configService: ConfigService,
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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	login = async (
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HttpError(401, 'Authorization error', '[Login]'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	};

	register = async (
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'User already exists', '[Register]'));
		}
		this.ok(res, { email: result.email, id: result.id });
	};

	private signJWT = (email: string, secret: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	};

	info = async ({ email }: Request, res: Response): Promise<void> => {
		const userInfo = await this.userService.getUserInfo(email);
		this.ok(res, { id: userInfo?.id, email: userInfo?.email });
	};
}
