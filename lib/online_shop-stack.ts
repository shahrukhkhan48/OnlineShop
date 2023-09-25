import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';

class OnlineShopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'ProductAPI');

    // Categories

    const fetchAllCategoriesLambda = new lambdaNodejs.NodejsFunction(this, 'FetchAllCategoriesFunction', {
      entry: 'lib/handlers/fetch-all-categories.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'ES2020',
      }
    });

    const getCategoryByIdLambda = new lambdaNodejs.NodejsFunction(this, 'GetCategoryByIdFunction', {
      entry: 'lib/handlers/get-category-by-id.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'ES2020',
      }
    });

    const listProductsByCategoryLambda = new lambdaNodejs.NodejsFunction(this, 'ListProductsByCategoryFunction', {
      entry: 'lib/handlers/list-products-by-category.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'ES2020',
      }
    });

    const categoryResource = api.root.addResource('categories');
    categoryResource.addMethod('GET', new apigateway.LambdaIntegration(fetchAllCategoriesLambda));

    const singleCategoryResource = categoryResource.addResource('{categoryId}');
    singleCategoryResource.addMethod('GET', new apigateway.LambdaIntegration(getCategoryByIdLambda));

    const productsUnderCategoryResource = singleCategoryResource.addResource('products');
    productsUnderCategoryResource.addMethod('GET', new apigateway.LambdaIntegration(listProductsByCategoryLambda));


    // Products


    const fetchAllProductsLambda = new lambdaNodejs.NodejsFunction(this, 'FetchAllProductsFunction', {
      entry: 'lib/handlers/fetch-all-products.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'ES2020',
      }
    });

    const addProductLambda = new lambdaNodejs.NodejsFunction(this, 'AddProductFunction', {
      entry: 'lib/handlers/add-product.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'ES2020',
      }
    });



    const productResource = api.root.addResource('product');
    const singleProductResource = productResource.addResource('{id}');

    productResource.addMethod('GET', new apigateway.LambdaIntegration(fetchAllProductsLambda));
    productResource.addMethod('POST', new apigateway.LambdaIntegration(addProductLambda));

    const getProductByIdLambda = new lambdaNodejs.NodejsFunction(this, 'GetProductByIdFunction', {
      entry: 'lib/handlers/get-product-by-id.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'ES2020',
      }
    });

    const updateProductLambda = new lambdaNodejs.NodejsFunction(this, 'UpdateProductFunction', {
      entry: 'lib/handlers/update-product.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'ES2020',
      }
    });

    singleProductResource.addMethod('GET', new apigateway.LambdaIntegration(getProductByIdLambda));
    singleProductResource.addMethod('PUT', new apigateway.LambdaIntegration(updateProductLambda));

    // Add other resources and methods



  }
}

export { OnlineShopStack };
