import { DynamoDB } from 'aws-sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { POST_CDK_DEPLOY_CONFIG } from './config';

const products = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'categories.json'), 'utf-8'));

const dynamoDB = new DynamoDB.DocumentClient({
  region: POST_CDK_DEPLOY_CONFIG.DYNAMODB_REGION
});

const TABLE_NAME = POST_CDK_DEPLOY_CONFIG.DYNAMODB_TABLE_NAME;

async function populateCategories() {
  for (const category of categories) {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        PK: 'CATEGORIES',
        SK: `CATEGORY#${category.Id}`,
        ...category
      }
    };
    console.log('Adding category with ID:', category.Id);

    await dynamoDB.put(params).promise();
  }
}

// Function to populate products to DynamoDB
async function populateProducts() {
  for (const product of products) {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        PK: `PRODUCT#${product.Id}`,
        SK: `PRODUCT#${product.Id}`,
        GSI1PK: `CATEGORY#${product.Category}`,
        GSI1SK: `PRODUCT#${product.Id}`,
        ...product
      }
    };
    console.log('Adding product with ID:', product.Id);

    await dynamoDB.put(params).promise();
  }
}

// Main function to execute the script
async function main() {
  try {
    await populateCategories();
    await populateProducts();
    console.log('Data successfully populated to DynamoDB!');
  } catch (error) {
    console.error('Error populating data:', error);
  }
}

main();
