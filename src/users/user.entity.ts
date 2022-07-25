import { compareSync, hash } from 'bcryptjs';

export class User {
	private _password: string;

	constructor(private _email: string, private _name: string, passwordHash?: string) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	public async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
	}

	get password(): string {
		return this._password;
	}
	public async comparePassword(password: string): Promise<boolean> {
		return compareSync(password, this._password);
	}
}
