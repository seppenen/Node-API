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
		expect(res.status).toBe(422);
	});
});

afterAll(async () => {
	await application.close();
});
