/**
 * Integration tests for Express server
 */

import request from 'supertest';
import app from '../server';

describe('Express Server', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/add', () => {
    it('should add two numbers', async () => {
      const response = await request(app).post('/api/add').send({ a: 2, b: 3 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 5);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/add')
        .send({ a: 'not a number', b: 3 });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/subtract', () => {
    it('should subtract two numbers', async () => {
      const response = await request(app)
        .post('/api/subtract')
        .send({ a: 5, b: 3 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 2);
    });
  });

  describe('POST /api/multiply', () => {
    it('should multiply two numbers', async () => {
      const response = await request(app)
        .post('/api/multiply')
        .send({ a: 3, b: 4 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 12);
    });
  });

  describe('POST /api/divide', () => {
    it('should divide two numbers', async () => {
      const response = await request(app)
        .post('/api/divide')
        .send({ a: 10, b: 2 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 5);
    });

    it('should return 400 when dividing by zero', async () => {
      const response = await request(app)
        .post('/api/divide')
        .send({ a: 10, b: 0 });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Division by zero');
    });
  });

  describe('POST /api/capitalize', () => {
    it('should capitalize a string', async () => {
      const response = await request(app)
        .post('/api/capitalize')
        .send({ text: 'hello world' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 'Hello world');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
