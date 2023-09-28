import * as cdk from 'aws-cdk-lib';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class OnlineShopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);



    const getProductLambda = new NodejsFunction(this, 'GetProductHandler', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      entry: 'lib/handlers/getProduct.ts',
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });

    // Define a new Lambda function using Node.js and TypeScript
    const getCategoryLambda = new NodejsFunction(this, 'GetCategoryHandler', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      entry: 'lib/handlers/getCategory.ts',  // Path to our handler file
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ['aws-sdk'],
      },
    });

  }
}

export default OnlineShopStack;
