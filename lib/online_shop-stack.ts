import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';

export class OnlineShopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define AppSync API
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'online-shop-api',
      schema: appsync.Schema.fromAsset('lib/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });

    // Define getProduct Lambda function using NodejsFunction
    const getProductLambda = new lambdaNodejs.NodejsFunction(this, 'GetProductHandler', {
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

    // Define getCategory Lambda function using NodejsFunction
    const getCategoryLambda = new lambdaNodejs.NodejsFunction(this, 'GetCategoryHandler', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      entry: 'lib/handlers/getCategory.ts',
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ['aws-sdk'],
      },
    });

    // Connect Lambda functions to AppSync as data sources
    const getProductDs = api.addLambdaDataSource('getProductDs', getProductLambda);
    const getCategoryDs = api.addLambdaDataSource('getCategoryDs', getCategoryLambda);

    // Create resolvers to map GraphQL operations to Lambda functions
    getProductDs.createResolver({
      typeName: 'Query',
      fieldName: 'getProductById',
    });
    getCategoryDs.createResolver({
      typeName: 'Query',
      fieldName: 'getCategoryById',
    });

    // Outputs
    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
      description: 'The URL for the AppSync API',
    });
    new cdk.CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey || '',
      description: 'The API key for the AppSync API',
    });
    new cdk.CfnOutput(this, 'StackRegion', {
      value: this.region,
      description: 'The region where the stack is deployed',
    });
  }
}
