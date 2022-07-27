declare namespace Express {
	export interface Request {
		email: string;
		iat: number | undefined;
		id: number;
	}
}
