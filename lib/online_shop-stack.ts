import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';

class OnlineShopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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

    const api = new apigateway.RestApi(this, 'ProductAPI');

    const categoryResource = api.root.addResource('categories');
    categoryResource.addMethod('GET', new apigateway.LambdaIntegration(fetchAllCategoriesLambda));

    const singleCategoryResource = categoryResource.addResource('{categoryId}');
    singleCategoryResource.addMethod('GET', new apigateway.LambdaIntegration(getCategoryByIdLambda));

    // Add other resources and methods



  }
}

export { OnlineShopStack };
