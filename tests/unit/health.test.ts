import request from 'supertest';
import app from '../../src/core/app';

describe('health', () => {
  it('responds with ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
