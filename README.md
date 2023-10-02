
# OnlineShop GraphQL API

This repository contains the GraphQL API for an online shop. It includes operations for managing products, categories, and placing orders.

## Prerequisites

1. Install Node.js and npm.
2. AWS CLI configured with the necessary access rights.
3. AWS CDK Toolkit installed.
4. Postman for API testing (optional).

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/shahrukhkhan48/OnlineShop.git
   ```

2. Navigate to the project directory:
   ```
   cd OnlineShop-dev_graphql
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables:
    - Ensure that `TABLE_NAME` is set with the correct DynamoDB table name.

## Populating the Database

To populate the DynamoDB table with initial data:

```bash
ts-node resources/populateDynamoDB.ts
```

## Setting User Passwords

To set initial passwords for users:

```bash
node resources/setPassword.js
```

## Deploying with AWS CDK

1. Bootstrap the CDK toolkit (only needed once per AWS account):
   ```bash
   cdk bootstrap
   ```

2. Deploy the stack:
   ```bash
   cdk deploy
   ```

3. (Optional) To destroy the stack:
   ```bash
   cdk destroy
   ```

## Using the APIs

### Via Postman

1. Import the `resources/GrpahQL_postman_collection.json` collection to Postman.
2. Set up environment variables in Postman, such as `jwt_token`.
3. Use the imported requests to test various operations, like adding products or placing orders.

### Via AWS AppSync Console

1. Navigate to the [AWS AppSync Console](https://console.aws.amazon.com/appsync/).
2. Select your API.
3. Use the Query Editor to execute GraphQL operations. Sample requests and mutations are provided in the `GrpahQL_postman_collection.json` file.


## API Operations

- **Queries**:
    - `listCategories`: Lists all product categories.
    - `getCategoryById`: Fetches a specific product category by its ID.
    - `listProductsByCategory`: Lists products under a specific category.
    - `getProductById`: Fetches a specific product by its ID.

- **Mutations**:
    - `addProduct`: Adds a new product.
    - `addCategory`: Adds a new product category.
    - `updateProduct`: Updates an existing product's details.
    - `updateCategory`: Updates an existing product category's details.
    - `deleteProduct`: Deletes a specific product.
    - `deleteCategory`: Deletes a specific product category.
    - `placeOrder`: Places a new order.
