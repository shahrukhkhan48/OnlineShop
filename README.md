
# AWS Serverless Task

The OnlineShop GraphQL API provides an interface to manage an online store, including operations for managing products, categories, and order placements. 

Upon placing an order, AWS Lambda and Step Functions are utilized for order processing and fulfillment, potentially triggering additional workflows like sending confirmation emails via Amazon SES.

## Prerequisites

- **Node.js and npm**: JavaScript runtime and package manager.
- **AWS CLI**: Command-line tool for interacting with AWS services.
- **AWS CDK**: Open-source software development framework to define cloud infrastructure in code.
- **Postman** (Optional): API development and testing tool.
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



**Default User Credentials**

There are two user roles with default credentials for initial setup and testing:

- **Admin**
    - Username: `shahrukh.khan@trilogy.com`
    - Password: `Admin!123`

- **Customer**
    - Username: `customer@trilogy.com`
    - Password: `Cust!123`

Ensure to change these credentials for production use and always store sensitive information securely.


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

4. Pick up the DynamoDB table name from CDK Deploy and configure it in resources/populateDynamoDB.ts


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

### Queries

- **`listCategories`**:
    - **Description**: Retrieve all available product categories in the shop.
    - **Use Case**: Useful for displaying available categories to customers or for filtering products by category.

- **`getCategoryById`**:
    - **Description**: Retrieve a specific category using its unique ID.
    - **Use Case**: Use this query when you need detailed information about a specific category, such as when editing category details.
    - **Input**:
        - `id` (Required): The unique identifier of the category.

- **`listProductsByCategory`**:
    - **Description**: List all products under a specified category.
    - **Use Case**: Ideal for filtering products to display to users based on their selected category.
    - **Input**:
        - `categoryId` (Required): The unique identifier of the category.

- **`getProductById`**:
    - **Description**: Retrieve details of a specific product using its ID.
    - **Use Case**: Useful when you need detailed information about a specific product, such as displaying product details to customers or for editing purposes.
    - **Input**:
        - `id` (Required): The unique identifier of the product.

### Mutations

- **`addProduct`**:
    - **Description**: Add a new product to the store.
    - **Input**:
        - `product` (Required): An object containing details of the new product such as name, description, price, and category ID.

- **`addCategory`**:
    - **Description**: Create a new product category.
    - **Input**:
        - `category` (Required): An object containing details of the new category such as name and description.

- **`updateProduct`**:
    - **Description**: Update the details of an existing product.
    - **Use Case**: Use this mutation to update product information, such as price changes, updating descriptions, or changing its category.
    - **Input**:
        - `product` (Required): An object containing the ID of the product to update and the fields to update with new values.

- **`updateCategory`**:
    - **Description**: Update the details of an existing product category.
    - **Input**:
        - `category` (Required): An object containing the ID of the category to update and the fields to update with new values.

- **`deleteProduct`**:
    - **Description**: Remove a product from the store.
    - **Use Case**: Use this mutation to remove listings that are no longer available or relevant from the store.
    - **Input**:
        - `id` (Required): The unique identifier of the product to delete.

- **`deleteCategory`**:
    - **Description**: Remove a product category.
    - **Use Case**: Use this mutation to remove categories that are no longer relevant or in use, ensuring to migrate any products within the category to a new category first.
    - **Input**:
        - `id` (Required): The unique identifier of the category to delete.

- **`placeOrder`**:
    - **Description**: Place a new order, triggering order processing workflows.
    - **Use Case**: This mutation is utilized when a customer finalizes their order, triggering back-end workflows for order processing, email confirmations, and potentially further order fulfillment processes.
    - **Input**:
        - `order` (Required): An object containing order details, such as the shipping address and an array of product IDs and quantities.

          ```
          mutation MyMutation {
            placeOrder(order: {
              ShippingAddress: "Mumbai, India", 
              OrderDetails: [
                {ProductId: "01H98D66KWBM9SJF7T11Q9Z2D1", Quantity: 10},
                {ProductId: "01H98D66QSTAXVBDA739YWZ3TY", Quantity: 3}
              ]
            })
          }
          ```

## Order Processing and Fulfillment

Upon placing an order via the `placeOrder` mutation, a Lambda function is triggered to process the order. The function performs several tasks:

- Sends an order confirmation email to the customer using **Amazon SES**. Ensure that the email identity used for sending emails is verified in SES.
- Triggers an **AWS Step Function** for further order processing and fulfillment, potentially involving multiple steps and Lambda functions for different stages of the order lifecycle.

Ensure that the IAM roles associated with the Lambda function and Step Function have the necessary permissions to interact with SES and any other AWS services involved in order processing and fulfillment.


## Troubleshooting

### Issue: Unauthorized Error during API calls
Ensure that:
- You have set up the initial passwords using `node resources/setPassword.js`.
- You are using the correct JWT token for authorization.
- Your IAM roles and policies are configured correctly.

### Issue: SES Email Sending Errors
Ensure that:
- The email address or domain used in SES is verified.
- The IAM role attached to the Lambda function has permission to send emails using SES.
- SES is set up in the same region where you are deploying your AWS resources.

### Issue: Step Functions Execution Error
Ensure that:
- The IAM role has the correct policies to execute Step Functions.
- The state machine ARN in your Lambda function points to the correct Step Function.
