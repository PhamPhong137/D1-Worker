import { Hono } from 'hono';

export interface Env {
  DB: D1Database; // Binding cho D1 database
}

const app = new Hono<{ Bindings: Env }>();

app.get('/api/beverages', async (c) => {
  const db = c.env.DB;
  
  try {
    const { results } = await db
      .prepare('SELECT * FROM Customers WHERE CompanyName = ?')
      .bind('Bs Beverages')
      .all();

    return c.json(results); 
  } catch (error) {
    console.error(error);
    return c.text('Failed to fetch data', 500);
  }
});
app.get('/api/listall', async (c) => {
	const db = c.env.DB;
	
	try {
	  const { results } = await db
		.prepare('SELECT * FROM Customers')
		.all();
  
	  return c.json(results); 
	} catch (error) {
	  console.error(error);
	  return c.text('Failed to fetch data', 500);
	}
  });

app.all('*', (c) => c.text('Call /api/beverages to see everyone who works at Bs Beverages'));

export default app;
