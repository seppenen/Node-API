import { IUserService } from './user.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
	public async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const user = new User(email, name);
		await user.setPassword(password);
		return user;
	}

	public async validateUser(dto: UserRegisterDto): Promise<boolean> {
		return true;
	}
}
