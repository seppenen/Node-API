import { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { IExceptionFilter } from './exception.filter.interface';
import { HttpError } from './http.error';
import { ILogger } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch = (error: Error | HttpError, req: Request, res: Response, next: NextFunction): void => {
		if (error instanceof HttpError) {
			this.logger.error('Error', error.context, error.code, error.message);
			res.status(error.code).send({ error: error.message });
		} else {
			this.logger.error('Error', error.message);
			res.status(500).send({ error: error.message });
		}
	};
}
