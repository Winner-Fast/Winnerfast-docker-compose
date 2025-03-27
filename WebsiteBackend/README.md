# WebsiteBackend

This project is the backend for the website, built using **NestJS**. It includes various modules for managing users, products, expenses, sales, and suppliers. The backend is connected to a PostgreSQL database using **TypeORM** and supports authentication with JWT and local strategy.

## Features

### 1. **User Authentication and Registration**
   - JWT-based authentication
   - User registration with validation
   - Login functionality

### 2. **Expenses Management**
   - CRUD operations for managing expenses
   - View, update, delete, and retrieve expenses by ID
   - Endpoint to fetch expenses statistics

### 3. **Product Management**
   - CRUD operations for products
   - View, update, delete, and retrieve product details by ID

### 4. **Sell Management**
   - Manage product sales
   - Sell products, retrieve sales data, and manage specific sale records

### 5. **Supplier Management**
   - CRUD operations for suppliers
   - View, update, delete, and retrieve supplier details by ID

### 6. **OTP (One Time Password) Module**
   - Generate and send OTP for user actions like login or registration
   - OTP expiration handling

### 7. **JWT-based Authentication**
   - Secure endpoints with JWT
   - Ensure authorized access to protected routes

## Prerequisites

To run this backend, you will need:

- **Node.js** (v16 or later)
- **NestJS** (installed globally)
- **PostgreSQL** (for the database)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Winner-Fast/WebsiteBackend

2. Install dependencies:
   ```bash
   npm install


3. Set up environment variables in .env:
   ```bash
POSTGRESQL_type
POSTGRESQL_HOST
POSTGRESQL_PORT
POSTGRESQL_USERNAME
POSTGRESQL_PASSWORD
DATABASE_NAME
TOKEN_SECRET

4. Start the application::
   ```bash
   npm run start:dev



The backend will be running on http://localhost:3000.



### Documentation api : https://documenter.getpostman.com/view/42587173/2sAYkLnHGw

Endpoints
Authentication
POST /auth/register

Register a new user.

Body: { "username": "example", "password": "password", "email": "email@example.com" }

POST /auth/login

Login and receive a JWT token.

Body: { "username": "example", "password": "password" }

User Management
GET /user

Get the logged-in user's details.

Requires JWT token in the Authorization header.

Expenses
POST /expenses

Create a new expense record.

Body: { "amount": 100, "description": "Expense details" }

GET /expenses

Get a list of expenses.

GET /expenses/:id

Get an expense by ID.

PUT /expenses/:id

Update an existing expense.

DELETE /expenses/:id

Delete an expense by ID.

Sell
POST /sell

Record a new sale.

GET /sell

Get a list of all sales.

GET /sell/:id

Get sale details by ID.

PUT /sell/:id

Update sale details by ID.

DELETE /sell/:id

Delete a sale by ID.



Product
POST /product

Add a new product.

GET /product

Get all products.

GET /product/:id

Get product details by ID.

PUT /product/:id

Update product details by ID.

DELETE /product/:id

Delete a product by ID.

Supplier
POST /supplier

Add a new supplier.

GET /supplier

Get all suppliers.

GET /supplier/:id

Get supplier details by ID.

PUT /supplier/:id

Update supplier details by ID.

DELETE /supplier/:id

Delete a supplier by ID.
