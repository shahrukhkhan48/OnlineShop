import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';
import * as cognito from '@aws-cdk/aws-cognito';
import {CfnUserPoolUserToGroupAttachmentProps} from "@aws-cdk/aws-cognito";

export class OnlineShopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add('Owner', 'shahrukh.khan@trilogy.com');

    const userPool = new cognito.UserPool(this, 'MyUserPool', {
      // ... any other user pool configurations you need
    });

    // Base Lambda configuration
    const lambdaConfig = {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    };

    // Individual Lambda functions
    const getProductLambda = new lambdaNodejs.NodejsFunction(this, 'GetProductHandler', {...lambdaConfig, entry: 'lib/handlers/getProduct.ts'});
    const getCategoryLambda = new lambdaNodejs.NodejsFunction(this, 'GetCategoryHandler', {...lambdaConfig, entry: 'lib/handlers/getCategory.ts'});
    const addCategoryLambda = new lambdaNodejs.NodejsFunction(this, 'AddCategoryHandler', {...lambdaConfig, entry: 'lib/handlers/addCategory.ts'});
    const deleteCategoryLambda = new lambdaNodejs.NodejsFunction(this, 'DeleteCategoryHandler', {...lambdaConfig, entry: 'lib/handlers/deleteCategory.ts'});
    const getAllCategoriesLambda = new lambdaNodejs.NodejsFunction(this, 'GetAllCategoriesHandler', {...lambdaConfig, entry: 'lib/handlers/getAllCategories.ts'});
    const listProductsByCategoryLambda = new lambdaNodejs.NodejsFunction(this, 'ListProductsByCategoryHandler', {...lambdaConfig, entry: 'lib/handlers/listProductsByCategory.ts'});
    const addProductLambda = new lambdaNodejs.NodejsFunction(this, 'AddProductHandler', {...lambdaConfig, entry: 'lib/handlers/addProduct.ts'});
    const updateProductLambda = new lambdaNodejs.NodejsFunction(this, 'UpdateProductHandler', {...lambdaConfig, entry: 'lib/handlers/updateProduct.ts'});
    const deleteProductLambda = new lambdaNodejs.NodejsFunction(this, 'DeleteProductHandler', {...lambdaConfig, entry: 'lib/handlers/deleteProduct.ts'});
    const updateCategoryLambda = new lambdaNodejs.NodejsFunction(this, 'UpdateCategoryHandler', {...lambdaConfig, entry: 'lib/handlers/updateCategory.ts'});

// Define AppSync API with USER_POOL authorization
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'online-shop-api',
      schema: appsync.Schema.fromAsset('lib/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: userPool, // Replace with your Cognito User Pool
          },
        },
      },
      xrayEnabled: true,
    });


    // Connect Lambda functions to AppSync as data sources
    const getProductDs = api.addLambdaDataSource('getProductDs', getProductLambda);
    const getCategoryDs = api.addLambdaDataSource('getCategoryDs', getCategoryLambda);
    const addCategoryDs = api.addLambdaDataSource('addCategoryDs', addCategoryLambda);
    const deleteCategoryDs = api.addLambdaDataSource('deleteCategoryDs', deleteCategoryLambda);
    const listProductsByCategoryDs = api.addLambdaDataSource('listProductsByCategoryDs', listProductsByCategoryLambda);
    const addProductDs = api.addLambdaDataSource('addProductDs', addProductLambda);
    const updateProductDs = api.addLambdaDataSource('updateProductDs', updateProductLambda);
    const deleteProductDs = api.addLambdaDataSource('deleteProductDs', deleteProductLambda);
    const updateCategoryDs = api.addLambdaDataSource('updateCategoryDs', updateCategoryLambda);
    const getAllCategoriesDs = api.addLambdaDataSource('getAllCategoriesDs', getAllCategoriesLambda);

    // Create resolvers to map GraphQL operations to Lambda functions
    getProductDs.createResolver({
      typeName: 'Query',
      fieldName: 'getProductById',
    });
    getCategoryDs.createResolver({
      typeName: 'Query',
      fieldName: 'getCategoryById',
    });
    addCategoryDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'addCategory',
    });
    deleteCategoryDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteCategory',
    });
    listProductsByCategoryDs.createResolver({
      typeName: 'Query',
      fieldName: 'listProductsByCategory',
    });
    addProductDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'addProduct',
    });
    updateProductDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateProduct',
    });
    deleteProductDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteProduct',
    });
    updateCategoryDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateCategory',
    });
    getAllCategoriesDs.createResolver({
      typeName: 'Query',
      fieldName: 'listCategories',
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

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
    });

    const adminGroup = new cognito.CfnUserPoolGroup(this, 'AdminGroup', {
      groupName: 'Admin',
      userPoolId: userPool.userPoolId,
      description: 'Admin group with elevated privileges',
    });

    const AdminUser = new cognito.CfnUserPoolUser(this, 'AdminUser', {
      userPoolId: userPool.userPoolId,
      username: 'shahrukh.khan',
      userAttributes: [
        { name: 'email', value: 'shahrukh.khan@trilogy.com' },
      ],
    });

    new cognito.CfnUserPoolUserToGroupAttachment(this, 'UserGroupAttachment', <CfnUserPoolUserToGroupAttachmentProps>{
      userPoolId: userPool.userPoolId,
      username: AdminUser.username,
      groupName: adminGroup.groupName,
    }).addDependsOn(AdminUser);

    const guestUser = new cognito.CfnUserPoolUser(this, 'GuestUser', {
      userPoolId: userPool.userPoolId,
      username: 'guest',
      userAttributes: [
        { name: 'email', value: 'guest@trilogy.com' },
      ],
    });

  }
}
