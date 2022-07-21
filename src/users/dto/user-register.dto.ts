import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Email is not valid' })
	public email: string;

	@IsString({ message: 'Password is not valid' })
	public password: string;

	@IsString({ message: 'Name is not valid' })
	public name: string;
}
