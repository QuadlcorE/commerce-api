# Commerce API

A RESTful API for e-commerce applications, built with Node.js, Express, and MongoDB.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16.x or higher recommended)
- [npm](https://www.npmjs.com/) (version 8.x or higher)
- [MongoDB](https://www.mongodb.com/) (version 5.x or higher)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/commerce-api.git
   cd commerce-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URL=mongodb://localhost:27017/commerce_db
   JWT_SECRET=your_secure_jwt_secret_here
   PORT=5000
   ```

   - `MONGODB_URL`: Connection string for your MongoDB instance
   - `JWT_SECRET`: Secret key for JWT authentication (use a strong, random string)
   - `PORT`: Server port (default: 5000)

4. **Start the development server**
   ```bash
   npm start
   ```

   For development with hot-reload:
   ```bash
   npm run dev
   ```

## API Features

- User authentication (register/login)
- Product management
- Shopping cart functionality
- Order processing
- User profile management

## Database Setup

Ensure MongoDB is running locally or update the `MONGODB_URL` in your `.env` to point to your MongoDB instance.

## Environment Variables

| Variable      | Required | Description                          | Example                     |
|---------------|----------|--------------------------------------|-----------------------------|
| MONGODB_URL   | Yes      | MongoDB connection string            | mongodb://localhost:27017   |
| JWT_SECRET    | Yes      | Secret for JWT token signing         | complex-secret-key-123      |
| PORT          | No       | Port for the API server              | 5000                        |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
