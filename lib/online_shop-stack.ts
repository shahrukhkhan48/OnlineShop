import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';
import * as cognito from '@aws-cdk/aws-cognito';
import {CfnUserPoolUserToGroupAttachmentProps} from "@aws-cdk/aws-cognito";
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn_tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as sqs from '@aws-cdk/aws-sqs';

export class OnlineShopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add('Owner', 'shahrukh.khan@trilogy.com');

    const userPool = new cognito.UserPool(this, 'OnlineShopUserPool', {
      // ... any other user pool configurations you need
    });

    // DynamoDB table setup for products and categories
    const onlineShopTable = new dynamodb.Table(this, 'OnlineShopTable', {
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Using on-demand billing mode
    });

// Add Global Secondary Index to support reading products by category
    onlineShopTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {
        name: 'GSI1PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI1SK',
        type: dynamodb.AttributeType.STRING,
      },
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
      environment: {
        TABLE_NAME: onlineShopTable.tableName,
        STATE_MACHINE_ARN: '',
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
    // const placeOrderLambda = new lambdaNodejs.NodejsFunction(this, 'PlaceOrderHandler', {...lambdaConfig, entry: 'lib/handlers/placeOrder.ts'});
    const processOrderLambda = new  lambdaNodejs.NodejsFunction(this, 'ProcessOrderLambda', {...lambdaConfig, entry: 'lib/handlers/processOrder.ts'});



// Modify the State Machine definition to handle failures
    const orderProcessingStateMachine = new sfn.StateMachine(this, 'OrderProcessingStateMachine', {
      definition: new sfn.Task(this, 'Process Order Task', {
        task: new sfn_tasks.InvokeFunction(processOrderLambda),
      }).addCatch(new sfn.Fail(this, 'Fail and Send to DLQ', {
        error: 'ORDER_PROCESSING_FAILED',
        cause: 'The order processing failed and is sent to DLQ',
      }), {
        errors: ['States.TaskFailed'],
        resultPath: '$.error-info',
      }),
      // Additional configurations...
    });

    lambdaConfig.environment.STATE_MACHINE_ARN = orderProcessingStateMachine.stateMachineArn;
    const placeOrderLambda = new lambdaNodejs.NodejsFunction(this, 'PlaceOrderHandler', {...lambdaConfig, entry: 'lib/handlers/placeOrder.ts'});

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
    const placeOrderDs = api.addLambdaDataSource('PlaceOrderDs', placeOrderLambda);

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
    placeOrderDs.createResolver({
      typeName: "Mutation",
      fieldName: "placeOrder",
    });


    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
      description: 'The URL for the AppSync API',
    });

    new cdk.CfnOutput(this, 'StackRegion', {
      value: this.region,
      description: 'The region where the stack is deployed',
    });


    const adminGroup = new cognito.CfnUserPoolGroup(this, 'AdminGroup', {
      groupName: 'Admin',
      userPoolId: userPool.userPoolId,
      description: 'Admin group with elevated privileges',
    });

    const customerGroup = new cognito.CfnUserPoolGroup(this, 'CustomerGroup', {
      groupName: 'Customer',
      userPoolId: userPool.userPoolId,
      description: 'Customer group with basic privileges',
    });

    const adminUser = new cognito.CfnUserPoolUser(this, 'AdminUser', {
      userPoolId: userPool.userPoolId,
      username: 'shahrukh.khan@trilogy.com',
      userAttributes: [
        { name: 'email', value: 'shahrukh.khan@trilogy.com' },
      ],
    });

    new cognito.CfnUserPoolUserToGroupAttachment(this, 'AdminUserGroupAttachment', <CfnUserPoolUserToGroupAttachmentProps> {
      userPoolId: userPool.userPoolId,
      username: adminUser.username,
      groupName: adminGroup.groupName,
    }).addDependsOn(adminUser);

    const customerUser = new cognito.CfnUserPoolUser(this, 'CustomerUser',  {
      userPoolId: userPool.userPoolId,
      username: 'customer@trilogy.com',
      userAttributes: [
        { name: 'email', value: 'customer@trilogy.com' },
      ],
    });

    new cognito.CfnUserPoolUserToGroupAttachment(this, 'CustomerUserGroupAttachment', <CfnUserPoolUserToGroupAttachmentProps>{
      userPoolId: userPool.userPoolId,
      username: customerUser.username,
      groupName: customerGroup.groupName,
    }).addDependsOn(customerUser);


    const userPoolClient = userPool.addClient('AppClient', {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        callbackUrls: ['https://www.getpostman.com/oauth2/callback'],
        logoutUrls: ['https://www.getpostman.com/oauth2/callback'],
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
      }
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'The Client ID for the User Pool App Client',
    });

    const userPoolDomain = new cognito.UserPoolDomain(this, 'UserPoolDomain', {
      userPool: userPool,
      cognitoDomain: {
        domainPrefix: 'onlineshopapp',
      }
    });

    new cdk.CfnOutput(this, 'UserPoolHostedUILoginUrl', {
      value: `https://${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com/login?response_type=token&client_id=${userPoolClient.userPoolClientId}&redirect_uri=https://www.getpostman.com/oauth2/callback`,
      description: 'The URL for the User Pool Hosted UI Login',
    });


    new cdk.CfnOutput(this, 'TableName', {
      value: onlineShopTable.tableName,
      description: 'DynamoDB Table Name',
    });

    // Granting Lambda functions permissions to interact with the DynamoDB table
    onlineShopTable.grantReadWriteData(getProductLambda);
    onlineShopTable.grantReadWriteData(getCategoryLambda);
    onlineShopTable.grantReadWriteData(addCategoryLambda);
    onlineShopTable.grantReadWriteData(deleteCategoryLambda);
    onlineShopTable.grantReadWriteData(getAllCategoriesLambda);
    onlineShopTable.grantReadWriteData(listProductsByCategoryLambda);
    onlineShopTable.grantReadWriteData(addProductLambda);
    onlineShopTable.grantReadWriteData(updateProductLambda);
    onlineShopTable.grantReadWriteData(deleteProductLambda);
    onlineShopTable.grantReadWriteData(updateCategoryLambda);
    onlineShopTable.grantReadWriteData(placeOrderLambda);
    orderProcessingStateMachine.grantStartExecution(placeOrderLambda);

    // Grant SES permissions
    processOrderLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    }));

    // Optionally, if you need to specify the email identity ARN:
    const emailIdentityArn = 'arn:aws:ses:us-east-1:856284715153:identity/shahrukh.khan@trilogy.com';

    processOrderLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: [emailIdentityArn],
    }));
    const dlq = new sqs.Queue(this, 'OrderProcessingDLQ');
  }
}
