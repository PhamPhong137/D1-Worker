import { Hono } from 'hono';
import { drizzle } from "drizzle-orm/d1"
import { posts } from './db/schema';
import { eq } from 'drizzle-orm';

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

app.post('/api/add-customer', async (c) => {
	const db = c.env.DB;

	const companyName = 'Bs Beverages';
	const contactName = 'John Doe';

	try {
		const result = await db
			.prepare('INSERT INTO Customers (CompanyName, ContactName) VALUES (?, ?)')
			.bind(companyName, contactName)
			.run();

		return c.json({ message: 'Customer added successfully', result });
	} catch (error) {
		console.error(error);
		return c.text('Failed to insert data', 500);
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


  app.
  get('/posts', async (c) => {
    const db = drizzle(c.env.DB);
    const result = await db.select().from(posts).all();
    return c.json(result);
  })
  .get('/posts/:id', async (c) => {
    const db = drizzle(c.env.DB);
    const id = Number(c.req.param('id'));
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return c.json(result);
  })
  .post('/posts', async (c) => {
    const db = drizzle(c.env.DB);
    const { title, content } = await c.req.json();
    const result = await db
      .insert(posts)
      .values({ title, content })
      .returning();
    return c.json(result);
  });



app.all('*', (c) => c.text('Call /api/beverages to see everyone who works at Bs Beverages'));

export default app;
