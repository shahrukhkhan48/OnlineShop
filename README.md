
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



### Configuring Application Parameters

Before deploying your application, it's crucial to set up the configuration parameters. Navigate to the `resources/config.ts` file to update the following configurations:

#### AWS & SES Configurations
- `OWNER_EMAIL`: The email for the stack owner/administrator and used for Amazon SES.
- `CUSTOMER_EMAIL`: The default customer email.
- `SES_REGION`: The region for Amazon SES.
- `SES_ACCOUNT_ID`: Your AWS account ID for SES.

```typescript
export const AWS_CONFIG = {
    OWNER_EMAIL: 'shahrukh.khan@trilogy.com',
    CUSTOMER_EMAIL: 'customer@trilogy.com',
    SES_REGION: 'us-east-1',
    SES_ACCOUNT_ID: '856284715153',
};
```

#### Cognito User Pool & User Configurations
- `ADMIN_USERNAME` and `CUSTOMER_USERNAME`: Set these to the respective email addresses.
- `REGION`: AWS region for the User Pool, typically set to the SES region.
- `ADMIN_USER_PASSWORD` and `CUSTOMER_USER_PASSWORD`: Initial passwords for users. Ensure to store these securely, especially in production environments.

```typescript
export const USER_POOL_CONFIG = {
    ADMIN_USERNAME: AWS_CONFIG.OWNER_EMAIL,
    CUSTOMER_USERNAME: AWS_CONFIG.CUSTOMER_EMAIL,
    REGION: AWS_CONFIG.SES_REGION,
    ADMIN_USER_PASSWORD: 'Admin!123',
    CUSTOMER_USER_PASSWORD: 'Cust!123',
};
```

#### Post-CDK Deploy Configurations
- `USER_POOL_ID`: Formed using the region and a unique identifier.
- `DYNAMODB_REGION`: The region for DynamoDB, typically set to your SES region.
- `DYNAMODB_TABLE_NAME`: Name of the DynamoDB table.

**Note**: `USER_POOL_ID` and `DYNAMODB_TABLE_NAME` are often available after a CDK deployment and should be updated in the `config.ts` file accordingly.

```typescript
export const POST_CDK_DEPLOY_CONFIG = {
    USER_POOL_ID: `${AWS_CONFIG.SES_REGION}_gUEKnHS9S`,
    DYNAMODB_REGION: AWS_CONFIG.SES_REGION,
    DYNAMODB_TABLE_NAME: 'OnlineShopStack-OnlineShopTable008A5D70-1XU04MP3BSOZ4',
};
```

### Important Notes:
- Always ensure to handle sensitive data, such as passwords and email addresses, securely. Consider using services like AWS Secrets Manager in production.
- Always validate configurations before deploying to prevent potential issues.
- Update the `config.ts` file with the `USER_POOL_ID` and `DYNAMODB_TABLE_NAME` after running `cdk deploy` as these values are available in the output of the CDK deploy command.



## Deploying with AWS CDK

1. **Bootstrap the CDK toolkit (only needed once per AWS account):**
   ```bash
   cdk bootstrap
   ```

2. **Deploy the stack:**
   ```bash
   cdk deploy
   ```

3. **(Optional) To destroy the stack:**
   ```bash
   cdk destroy
   ```


4. **Update Configuration Post-Deployment:**

   After running `cdk deploy`, the output in your terminal will display the `UserPoolId` and the `DynamoDB` table name. Ensure to update the `resources/config.ts` file with these values.

    - **DynamoDB Table Name:** Locate the generated table name in the CDK deploy output and update `POST_CDK_DEPLOY_CONFIG.DYNAMODB_TABLE_NAME` in `config.ts`.

    - **UserPoolId:** Find the `UserPoolId` in the CDK deploy output and update `POST_CDK_DEPLOY_CONFIG.USER_POOL_ID` in `config.ts`.

   Example:
   ```typescript
   export const POST_CDK_DEPLOY_CONFIG = {
       USER_POOL_ID: 'extracted_user_pool_id_here',
       DYNAMODB_TABLE_NAME: 'extracted_dynamodb_table_name_here',
       // ...other configs
   };
   ```
   These values are crucial for configuring user pools and interacting with your DynamoDB table.


## Populating the Database

To populate the DynamoDB table with initial data:

```bash
ts-node resources/populateDynamoDB.ts
```


## Setting User Passwords

To set initial passwords for users:

```bash
ts-node resources/setPassword.ts
```


## Email Configuration

The OnlineShop application employs **Amazon Simple Email Service (SES)** for sending email notifications, such as order confirmations.

- **Verified Sender**: `shahrukh.khan@trilogy.com` is a verified email identity in SES, allowing it to send emails.
- **Non-Verified Receiver**: `customer@trilogy.com` is **not** verified and, therefore, cannot receive emails in the SES Sandbox environment. Ensure you verify all email addresses that are intended to send and receive emails during testing.

### Moving Out of SES Sandbox

To send emails to non-verified addresses and enhance your sending limits, it's imperative to move out of the Amazon SES Sandbox environment.

#### 1. Ensure Email Identity Verification

Make sure your sending email identity, such as `shahrukh.khan@trilogy.com`, is verified. This can be achieved in the SES console under "Identity Management."

#### 2. Submit a Request to Move Out of the Sandbox

- Navigate to the [SES Console](https://console.aws.amazon.com/ses/).
- Click on "Sending Statistics" in the left-hand navigation.
- Select "Request Production Access" and complete the form with pertinent details regarding your use case and expected email volume.
- AWS will typically respond to these requests within one business day.


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
