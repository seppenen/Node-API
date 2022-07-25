import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Email is not valid' })
	public email: string;
	@IsString({ message: 'Password is not valid' })
	public password: string;
}
