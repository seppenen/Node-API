import { User } from './users.entity';
import { UserModel } from '@prisma/client';

export interface IUsersRepository {
	create(user: User): Promise<UserModel>;
	find(email: string): Promise<UserModel | null>;
}
