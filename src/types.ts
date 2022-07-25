import { IConfigService } from './config/config.service.interface';

export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	IUserController: Symbol.for('IUserController'),
	IExceptionFilter: Symbol.for('IExceptionFilter'),
	IUserService: Symbol.for('IUserService'),
	IConfigService: Symbol.for('IConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	UsersRepository: Symbol.for('IUsersRepository'),
};
