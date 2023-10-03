
# OnlineShop GraphQL API

The OnlineShop GraphQL API provides an interface to manage an online store, including operations for managing products, categories, and order placements. 

Upon placing an order, AWS Lambda and Step Functions are utilized for order processing and fulfillment, potentially triggering additional workflows like sending confirmation emails via Amazon SES.

## Prerequisites

- **Node.js and npm**: JavaScript runtime and package manager.
- **AWS CLI**: Command-line tool for interacting with AWS services.
- **AWS CDK**: Open-source software development framework to define cloud infrastructure in code.
- **Postman** (Optional): API development and testing tool.
- **AWS Account**: Set up with the appropriate permissions for Lambda, SES, Step Functions, and DynamoDB.
- **SES Email Identity**: Verify an email identity to send emails via Amazon SES.

Ensure the AWS CLI and AWS CDK are configured with the necessary access keys and region.

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/shahrukhkhan48/OnlineShop.git
   ```

2. Navigate to the project directory:
   ```
   cd OnlineShop
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
      Order Processing and Fulfillment
      When an order is placed:


## Order Processing and Fulfillment

Upon placing an order via the `placeOrder` mutation, a Lambda function is triggered to process the order. The function performs several tasks:

- Sends an order confirmation email to the customer using **Amazon SES**. Ensure that the email identity used for sending emails is verified in SES.
- Triggers an **AWS Step Function** for further order processing and fulfillment, potentially involving multiple steps and Lambda functions for different stages of the order lifecycle.

Ensure that the IAM roles associated with the Lambda function and Step Function have the necessary permissions to interact with SES and any other AWS services involved in order processing and fulfillment.
