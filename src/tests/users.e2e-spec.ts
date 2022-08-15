import { App } from '../app';
import { boot } from '../main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('UsersService', () => {
	it('Register - error', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'ewwmailsse@dss.ee',
			name: 'sd sd',
			password: '1',
		});
		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const result = await request(application.app).post('/users/login').send({
			email: 'ewwmailsse@dss.ee',
			password: '123456',
		});
		expect(result.body.jwt).not.toBeNull();
	});

	it('Login - error', async () => {
		const result = await request(application.app).post('/users/login').send({
			email: 'ewwmailsse@dss.ee',
			password: '1234561',
		});
		expect(result.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'ewwmailsse@dss.ee',
			password: '123456',
		});
		const result = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(result.body.email).toBe('ewwmailsse@dss.ee');
	});

	it('Info - error', async () => {
		const result = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer 123`);
		expect(result.statusCode).toBe(401);
	});
});

afterAll(async () => {
	await application.close();
});
