import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.ILogger) protected logger: ILogger) {
		this.client = new PrismaClient();
	}
	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('Prisma connected');
		} catch (error) {
			this.logger.error('Unable to connect Prisma', error);
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$connect();
	}
}
