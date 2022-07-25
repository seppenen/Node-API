import { IUserService } from './user.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	public async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const user = new User(email, name);
		const salt = this.configService.get('SALT');
		await user.setPassword(password, Number(salt));
		const exists = await this.usersRepository.find(email);
		if (exists) {
			return null;
		}
		return this.usersRepository.create(user);
	}

	public async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const exist = await this.usersRepository.find(email);
		if (!exist) {
			return false;
		}
		const newUser = new User(exist.email, exist.name, exist.password);
		return newUser.comparePassword(password);
	}
}
