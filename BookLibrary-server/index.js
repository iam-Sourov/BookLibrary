require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

const corsOptions = {
  origin: [
    process.env.SITE_DOMAIN,
    process.env.FRONTEND_ORIGIN,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware to verify Supabase token (kept as verifyFireBaseToken for compatibility)
const verifyFireBaseToken = async (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).send({ message: 'Unauthorized access: missing token' });
  }
  try {
    const token = tokenHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(403).send({ message: 'Forbidden access: invalid token' });
    }
    req.decoded_email = user.email;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).send({ message: 'Forbidden access' });
  }
};

// Response mapping helper functions
const mapUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id.toString(),
    email: row.email,
    name: row.name,
    photoURL: row.photourl,
    role: row.role
  };
};

const mapBook = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id.toString(),
    title: row.title,
    author: row.author,
    price: Number(row.price),
    category: row.category,
    status: row.status,
    image: row.image,
    rating: Number(row.rating),
    description: row.description,
    email: row.email,
    added_date: row.added_date
  };
};

const mapOrder = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id.toString(),
    bookId: row.book_id,
    email: row.email,
    name: row.name,
    author: row.author,
    status: row.status,
    price: Number(row.price),
    payment_status: row.payment_status,
    transactionId: row.transaction_id,
    paymentDate: row.payment_date,
    bookTitle: row.book_title,
    image: row.image,
    created_at: row.created_at
  };
};

const mapWishlist = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id.toString(),
    bookId: row.book_id,
    userEmail: row.user_email
  };
};

const mapReview = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id.toString(),
    bookId: row.book_id,
    userEmail: row.user_email,
    userName: row.user_name,
    rating: Number(row.rating),
    reviewText: row.review_text,
    date: row.date
  };
};

// Database schema initialization
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        photourl TEXT,
        role VARCHAR(50) DEFAULT 'user'
      );
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        price NUMERIC(10, 2) NOT NULL,
        category VARCHAR(100),
        status VARCHAR(50),
        image TEXT,
        rating NUMERIC(3, 2) DEFAULT 1.0,
        description TEXT,
        email VARCHAR(255) NOT NULL,
        added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        book_id VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        author VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        price NUMERIC(10, 2) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'unpaid',
        transaction_id VARCHAR(255),
        payment_date TIMESTAMP,
        book_title VARCHAR(255),
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        book_id VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        book_id VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        user_name VARCHAR(255),
        rating INTEGER NOT NULL,
        review_text TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database schema verified and active.'); // reload 4
  } catch (err) {
    console.error('Failed to initialize database schema:', err);
  }
};

// --- USERS ROUTES ---
app.get('/users', verifyFireBaseToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.send(rows.map(mapUser));
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch users' });
  }
});

app.get('/users/role/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return res.status(404).send({ message: 'User not found', role: null });
    res.send({ role: rows[0].role || 'user' });
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    if (!newUser?.email) return res.status(400).send({ message: 'Missing email' });
    
    const { rows } = await pool.query(
      `INSERT INTO users (email, name, photourl, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) 
       DO UPDATE SET name = COALESCE(EXCLUDED.name, users.name), 
                     photourl = COALESCE(EXCLUDED.photourl, users.photourl) 
       RETURNING *`,
      [newUser.email, newUser.name, newUser.photoURL, newUser.role || 'user']
    );
    res.send({ acknowledged: true, insertedId: rows[0].id.toString() });
  } catch (err) {
    console.error('Error in POST /users:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.patch('/users/:id', verifyFireBaseToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) return res.status(400).send({ message: 'Invalid user ID format' });
    const updates = req.body;
    const keys = Object.keys(updates);
    if (keys.length === 0) return res.send({ matchedCount: 1, modifiedCount: 0 });
    
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, value] of Object.entries(updates)) {
      const dbKey = key === 'photoURL' ? 'photourl' : key;
      setClauses.push(`${dbKey} = $${i}`);
      values.push(value);
      i++;
    }
    values.push(userId);
    const query = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${i}`;
    const { rowCount } = await pool.query(query, values);
    res.send({ matchedCount: rowCount, modifiedCount: rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update user' });
  }
});

app.patch('/users/update/:email', verifyFireBaseToken, async (req, res) => {
  try {
    const email = req.params.email;
    if (req.decoded_email !== email) return res.status(403).send({ message: 'Forbidden access' });
    const updates = req.body;
    const { rowCount } = await pool.query(
      'UPDATE users SET name = $1, photourl = $2 WHERE email = $3',
      [updates.name, updates.photoURL, email]
    );
    res.send({ matchedCount: rowCount, modifiedCount: rowCount });
  } catch (err) {
    res.status(500).send({ message: 'Failed to update user' });
  }
});

// --- BOOKS ROUTES ---
app.get('/books', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.send(rows.map(mapBook));
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch books' });
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid Book ID format' });
    }
    const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Book not found' });
    }
    res.send(mapBook(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to get book' });
  }
});

app.get('/my-books/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const { rows } = await pool.query('SELECT * FROM books WHERE email = $1 ORDER BY added_date DESC', [email]);
    res.send(rows.map(mapBook));
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch books' });
  }
});

app.post('/books', verifyFireBaseToken, async (req, res) => {
  try {
    const newBook = req.body;
    const { rows } = await pool.query(
      'INSERT INTO books (title, author, price, category, status, image, rating, description, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [newBook.title, newBook.author, newBook.price, newBook.category, newBook.status, newBook.image, newBook.rating || 1.0, newBook.description, newBook.email]
    );
    res.send({ acknowledged: true, insertedId: rows[0].id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to add book' });
  }
});

app.delete('/books/:id', verifyFireBaseToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid Book ID' });
    const { rowCount } = await pool.query('DELETE FROM books WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).send({ message: 'Book Not Found' });
    res.send({ acknowledged: true, deletedCount: rowCount });
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete book' });
  }
});

app.patch('/books/:id', verifyFireBaseToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid Book ID' });
    
    const cleanData = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== undefined)
    );
    
    const keys = Object.keys(cleanData);
    if (keys.length === 0) return res.send({ matchedCount: 1, modifiedCount: 0 });
    
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, value] of Object.entries(cleanData)) {
      setClauses.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }
    values.push(id);
    
    const query = `UPDATE books SET ${setClauses.join(', ')} WHERE id = $${i}`;
    const { rowCount } = await pool.query(query, values);
    res.send({ matchedCount: rowCount, modifiedCount: rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update book' });
  }
});

app.patch('/books/status/:id', verifyFireBaseToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid Book ID' });
    const { status } = req.body;
    
    const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).send({ message: 'Book not found' });
    
    const book = rows[0];
    if (req.decoded_email !== book.email && req.decoded_email !== book.author) {
      return res.status(403).send({ message: 'Forbidden access' });
    }
    
    const { rowCount } = await pool.query('UPDATE books SET status = $1 WHERE id = $2', [status, id]);
    res.send({ matchedCount: rowCount, modifiedCount: rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update book status' });
  }
});

// --- ORDERS ROUTES ---
app.get('/orders', verifyFireBaseToken, async (req, res) => {
  try {
    const { email } = req.query;
    if (email && req.decoded_email !== email) return res.status(403).send({ message: 'Forbidden access' });
    
    let queryStr = 'SELECT * FROM orders';
    const params = [];
    if (email) {
      queryStr += ' WHERE email = $1';
      params.push(email);
    }
    queryStr += ' ORDER BY id DESC';
    
    const { rows } = await pool.query(queryStr, params);
    res.send(rows.map(mapOrder));
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch orders' });
  }
});

app.get('/orders/:author', verifyFireBaseToken, async (req, res) => {
  try {
    const author = req.params.author;
    const { rows } = await pool.query('SELECT * FROM orders WHERE author = $1 ORDER BY id DESC', [author]);
    res.send(rows.map(mapOrder));
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch librarian orders' });
  }
});

app.post('/orders', verifyFireBaseToken, async (req, res) => {
  try {
    const newOrder = req.body;
    if (req.decoded_email !== newOrder.email) return res.status(403).send({ message: 'Forbidden access' });
    
    const { rows: existsRows } = await pool.query('SELECT * FROM orders WHERE book_id = $1 AND email = $2', [newOrder.bookId, newOrder.email]);
    if (existsRows.length > 0) {
      return res.send({ message: 'You have already ordered this book', insertedId: null });
    }
    
    const { rows } = await pool.query(
      'INSERT INTO orders (book_id, email, name, author, price, status, payment_status, book_title, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [newOrder.bookId, newOrder.email, newOrder.name, newOrder.author, newOrder.price, newOrder.status || 'pending', newOrder.payment_status || 'unpaid', newOrder.bookTitle, newOrder.image]
    );
    res.send({ acknowledged: true, insertedId: rows[0].id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to create order' });
  }
});

app.delete('/orders/:id', verifyFireBaseToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid Order ID' });
    const { rowCount } = await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).send({ message: 'Order Not Found' });
    res.send({ message: 'Order Deleted Successfully', deletedId: id.toString() });
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete order' });
  }
});

app.patch('/orders/status/:id', verifyFireBaseToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid Order ID' });
    const { status } = req.body;
    const { rowCount } = await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    if (rowCount === 0) return res.status(404).send({ message: 'Order not found' });
    res.send({ matchedCount: rowCount, modifiedCount: rowCount });
  } catch (err) {
    res.status(500).send({ message: 'Failed to update order status' });
  }
});

app.patch('/orders/cancel/:id', verifyFireBaseToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid Order ID' });
    const { rowCount } = await pool.query("UPDATE orders SET status = 'cancelled' WHERE id = $1", [id]);
    if (rowCount === 0) return res.status(404).send({ message: 'Order not found' });
    res.send({ matchedCount: rowCount, modifiedCount: rowCount });
  } catch (err) {
    res.status(500).send({ message: 'Failed to cancel order' });
  }
});

// Payment & Stripe
app.post('/payment-checkout-session', async (req, res) => {
  const orderInfo = req.body;
  const price = parseInt(orderInfo.price) * 100;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: orderInfo.bookTitle,
              images: [orderInfo.image]
            },
            unit_amount: price
          },
          quantity: 1
        }
      ],
      customer_email: orderInfo.email,
      mode: 'payment',
      metadata: {
        orderId: orderInfo._id.toString(),
        userEmail: orderInfo.email
      },
      success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancel`
    });
    res.send({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Stripe session failed" });
  }
});

app.patch('/payment-success', async (req, res) => {
  try {
    const session_id = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const id = parseInt(session.metadata.orderId, 10);
      const transactionId = session.payment_intent;
      const { rowCount } = await pool.query(
        "UPDATE orders SET payment_status = 'paid', transaction_id = $1, payment_date = $2 WHERE id = $3",
        [transactionId, new Date(), id]
      );
      return res.send({ success: true, modifiedCount: rowCount });
    }
    res.send({ success: false });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Stripe retrieval failed" });
  }
});

app.get('/payments', async (req, res) => {
  try {
    const email = req.query.email;
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE email = $1 AND payment_status = 'paid' ORDER BY payment_date DESC",
      [email]
    );
    res.send(rows.map(mapOrder));
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch payments' });
  }
});

// --- REVIEWS ROUTES ---
app.post('/reviews', verifyFireBaseToken, async (req, res) => {
  try {
    const review = req.body;
    if (req.decoded_email !== review.userEmail) {
      return res.status(403).send({ message: 'Forbidden access' });
    }
    
    // Check purchase
    const { rows: purchasedRows } = await pool.query(
      'SELECT * FROM orders WHERE book_id = $1 AND email = $2',
      [review.bookId, review.userEmail]
    );
    if (purchasedRows.length === 0) {
      return res.status(403).send({ message: 'You can only review books you have purchased' });
    }
    
    // Check existing review
    const { rows: reviewRows } = await pool.query(
      'SELECT * FROM reviews WHERE book_id = $1 AND user_email = $2',
      [review.bookId, review.userEmail]
    );
    if (reviewRows.length > 0) {
      return res.status(409).send({ message: 'You have already reviewed this book.' });
    }
    
    const { rows } = await pool.query(
      'INSERT INTO reviews (book_id, user_email, user_name, rating, review_text) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [review.bookId, review.userEmail, review.userName, review.rating, review.reviewText]
    );
    res.send({ acknowledged: true, insertedId: rows[0].id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to submit review' });
  }
});

app.get('/reviews/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const { rows } = await pool.query('SELECT * FROM reviews WHERE book_id = $1 ORDER BY date DESC', [bookId]);
    res.send(rows.map(mapReview));
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch reviews' });
  }
});

// --- WISHLIST ROUTES ---
app.post('/wishlist', async (req, res) => {
  try {
    const wishlistItem = req.body;
    const { bookId, userEmail } = wishlistItem;
    const { rows: existsRows } = await pool.query('SELECT * FROM wishlist WHERE book_id = $1 AND user_email = $2', [bookId, userEmail]);
    if (existsRows.length > 0) {
      return res.status(409).send({ message: 'Book already in wishlist' });
    }
    const { rows } = await pool.query(
      'INSERT INTO wishlist (book_id, user_email) VALUES ($1, $2) RETURNING *',
      [bookId, userEmail]
    );
    res.send({ acknowledged: true, insertedId: rows[0].id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to add to wishlist' });
  }
});

app.get('/wishlist', async (req, res) => {
  try {
    const email = req.query.email;
    const { rows } = await pool.query('SELECT * FROM wishlist WHERE user_email = $1 ORDER BY id DESC', [email]);
    res.send(rows.map(mapWishlist));
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch wishlist' });
  }
});

app.delete('/wishlist/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid Wishlist ID' });
    const { rowCount } = await pool.query('DELETE FROM wishlist WHERE id = $1', [id]);
    res.send({ acknowledged: true, deletedCount: rowCount });
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete wishlist item' });
  }
});

// --- STATS ---
app.get('/stats', verifyFireBaseToken, async (req, res) => {
  try {
    const { rows: userStats } = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE role = 'admin') as admins,
        COUNT(*) FILTER (WHERE role = 'librarian') as librarians,
        COUNT(*) FILTER (WHERE role = 'user') as users
      FROM users
    `);
    
    const { rows: bookStats } = await pool.query('SELECT COUNT(*) as total_books FROM books');
    
    const { rows: orderStats } = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders,
        COUNT(*) FILTER (WHERE status = 'delivered') as completed_orders
      FROM orders
    `);
    
    res.send({
      totalUsers: Number(userStats[0].total_users),
      admins: Number(userStats[0].admins),
      librarians: Number(userStats[0].librarians),
      users: Number(userStats[0].users),
      books: Number(bookStats[0].total_books),
      totalOrders: Number(orderStats[0].total_orders),
      pendingOrders: Number(orderStats[0].pending_orders),
      cancelledOrders: Number(orderStats[0].cancelled_orders),
      completedOrders: Number(orderStats[0].completed_orders)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to load admin stats" });
  }
});

// Root
app.get('/', (req, res) => {
  res.send("Hello from Server");
});

// Initialize database schema and start server
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});