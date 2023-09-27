import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';

class OnlineShopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define a new Lambda function using Node.js and TypeScript
    const getCategoryLambda = new lambdaNodejs.NodejsFunction(this, 'GetCategoryHandler', {
      entry: 'lib/handlers/getCategory.ts',  // Path to our handler file
      handler: 'handler',
    });

    // Create an API Gateway to expose the Lambda function
    const api = new apigateway.LambdaRestApi(this, 'Endpoint', {
      handler: getCategoryLambda,
    });
  }
}

export default OnlineShopStack;
