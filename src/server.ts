/**
 * Express server application
 */

import express, { Express, Request, Response } from 'express';
import { add, subtract, multiply, divide, capitalizeString } from './utils.js';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(express.json()); 

// Routes

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * API endpoint for addition
 */
app.post('/api/add', (req: Request, res: Response) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    res.status(400).json({ error: 'Both a and b must be numbers' });
    return;
  }
  const result = add(a, b);
  res.json({ operation: 'add', a, b, result });
});

/**
 * API endpoint for subtraction
 */
app.post('/api/subtract', (req: Request, res: Response) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    res.status(400).json({ error: 'Both a and b must be numbers' });
    return;
  }
  const result = subtract(a, b);
  res.json({ operation: 'subtract', a, b, result });
});

/**
 * API endpoint for multiplication
 */
app.post('/api/multiply', (req: Request, res: Response) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    res.status(400).json({ error: 'Both a and b must be numbers' });
    return;
  }
  const result = multiply(a, b);
  res.json({ operation: 'multiply', a, b, result });
});

/**
 * API endpoint for division
 */
app.post('/api/divide', (req: Request, res: Response) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    res.status(400).json({ error: 'Both a and b must be numbers' });
    return;
  }
  try {
    const result = divide(a, b);
    res.json({ operation: 'divide', a, b, result });
  } catch (error) {
    res.status(400).json({ error: 'Division by zero' });
  }
});

/**
 * API endpoint for string capitalization
 */
app.post('/api/capitalize', (req: Request, res: Response) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    res.status(400).json({ error: 'Text must be a string' });
    return;
  }
  const result = capitalizeString(text);
  res.json({ operation: 'capitalize', input: text, result });
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
export function startServer(): void {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export app for testing
export default app;

// Start the server only when run directly
const isMainModule = process.argv[1]?.includes('server') || 
                     process.argv[1]?.endsWith('tsx') ||
                     process.argv[1]?.endsWith('ts-node');

if (isMainModule) {
  startServer();
}
