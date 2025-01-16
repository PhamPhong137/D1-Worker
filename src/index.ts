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

app.all('*', (c) => c.text('Call /api/beverages to see everyone who works at Bs Beverages'));

export default app;
