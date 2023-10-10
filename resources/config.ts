export const AWS_CONFIG = {
    OWNER_EMAIL: 'shahrukh.khan@trilogy.com',
    CUSTOMER_EMAIL: 'customer@trilogy.com',
    SES_REGION: 'us-east-1',
    SES_ACCOUNT_ID: '856284715153',
};

// Cognito User Pool & User Configurations.
export const USER_POOL_CONFIG = {
    ADMIN_USERNAME: AWS_CONFIG.OWNER_EMAIL,
    CUSTOMER_USERNAME: AWS_CONFIG.CUSTOMER_EMAIL,
    REGION: AWS_CONFIG.SES_REGION,
    ADMIN_USER_PASSWORD: 'Admin!123',
    CUSTOMER_USER_PASSWORD: 'Cust!123',
};


export const POST_CDK_DEPLOY_CONFIG = {
    USER_POOL_ID: `${AWS_CONFIG.SES_REGION}_JfxNxxcXh`,
    DYNAMODB_REGION: AWS_CONFIG.SES_REGION,
    DYNAMODB_TABLE_NAME: 'OnlineShopStack-OnlineShopTable008A5D70-5HUPT5P63JXS',
};
