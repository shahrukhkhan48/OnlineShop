
import { DynamoDB } from 'aws-sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read mock data from JSON files
const products = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'categories.json'), 'utf-8'));


const dynamoDB = new DynamoDB.DocumentClient({
  region: 'us-east-1'
});
// DynamoDB table name
const TABLE_NAME = 'OnlineShopStack-OnlineShopTable008A5D70-1XU04MP3BSOZ4';


// Function to populate categories to DynamoDB
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
