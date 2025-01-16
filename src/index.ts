import { Hono } from 'hono';

export interface Env {
  DB: D1Database; // Binding cho D1 database
}

const app = new Hono<{ Bindings: Env }>();

// Định nghĩa endpoint
app.get('/api/beverages', async (c) => {
  const db = c.env.DB;
  
  try {
    // Truy vấn D1 database
    const { results } = await db
      .prepare('SELECT * FROM Customers WHERE CompanyName = ?')
      .bind('Bs Beverages')
      .all();

    return c.json(results); // Trả về kết quả dạng JSON
  } catch (error) {
    console.error(error);
    return c.text('Failed to fetch data', 500);
  }
});

// Endpoint mặc định
app.all('*', (c) => c.text('Call /api/beverages to see everyone who works at Bs Beverages'));

export default app;
