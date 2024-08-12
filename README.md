# E-Commerce API

## Description

This is an ecommerce store API that accepts users and an admin

## Features

- Admin can create, edit, view and delete products.
- Admin can also view all customers orders, approve or decline orders.
- Users can view all products
- get a single product, create orders and view orders created.
- This API supports pagination for products.
- Testing is done with jest.io an supertest.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/chidubem34/ecommerce-api.git
   ```
2. Navigate to the project directory:
   ```sh
   cd ecommerce-api
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables (create a `.env` file):

   ```env
   MONGODB_URL=your_mongoDB_connection_string
   AUTH_KEY=your_authentication_secret_or_key
   EMAIL_USERNAME=Your_email_for_sending_email_from_google
   EMAIL_PASSWORD=Your_email_app_password_for_sending_email_from_google
   CLOUD_NAME=Your_cloudinary_name
   API_KEY=Your_cloudinary_api_key
   API_SECRET=Your_cloudinary_api_secret

   ```

5. Start the application:

```sh
npm start
```

## Usage

### Admin

- **Create a product**: Admin can create a new product by sending a POST request to `/v1/product` with the product details.
- **get all product**: Admin can get all existing products by sending a GET request to `/v1/products/:page/:limit`
- **get single product**: Admin can get a product by sending a GET request to `/v1/product/:productId`
- **Update a product**: Admin can update an existing quiz by sending a PUT request to `/v1/product/:productId` with the updated details.
- **Delete a product**: Admin can delete a quiz by sending a DELETE request to `/v1/product/:productId`.
- **View all orders**: Admin can delete a quiz by sending a DELETE request to `/v1/admin/orders/:page/:limit`.
- **Approve an order**: Admin can delete a quiz by sending a DELETE request to `/v1/admin/order/:orderId`.

### Users

- **View all products**: Users can see all products by sending a GET request to `/v1/user/products/:page/:limit`.
- **Create a product order**: Users can create a product order by sending a POST request to `/v1//user/product/order`.
- **view their orders**: Users can view all their orders created by sending a GET to `/v1/user/orders/:page/:limit`.

## Dependencies used

- Jest
- Multer
- MongoDB
- Express.js
- Mongoose
- Supertest
- Cloudinary
- Node.js

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Documentation
- You can view the full documentation on postman with the link provided below
```sh
https://documenter.getpostman.com/view/36628575/2sA3s3HWw7
```
