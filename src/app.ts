import express, { Express } from 'express';
import { Server } from 'http';
import { UsersController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { json } from 'body-parser';
import { ExceptionFilter } from './errors/exception.filter';

@injectable()
export class App {
	app: Express;
	server: Server;
	port = 8000;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: UsersController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: ExceptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleWare(): void {
		this.app.use(json());
	}

	useRoute(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch);
	}

	public async init(): Promise<void> {
		this.useMiddleWare();
		this.useRoute();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log('Server started on port', this.port);
	}
}
