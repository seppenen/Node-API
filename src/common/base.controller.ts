import { Response, Router } from 'express';
import 'reflect-metadata';
import { IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
export { Router } from 'express';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	public send<T>(res: Response, code: number, message: T): Response {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): Response {
		return this.send(res, 200, message);
	}

	get router(): Router {
		return this._router;
	}

	protected bindRouter(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log('Binding route', route.path, route.method);
			const middleware = route.middlewares?.map((middleware) => middleware.execute);
			const pipeline = middleware ? [...middleware, route.func] : route.func;
			this.router[route.method](route.path, pipeline);
		}
	}
}
