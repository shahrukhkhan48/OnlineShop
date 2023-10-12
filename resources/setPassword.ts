import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { USER_POOL_CONFIG, POST_CDK_DEPLOY_CONFIG } from './config';

const {
    ADMIN_USERNAME: adminUsername,
    ADMIN_USER_PASSWORD: adminUserPassword,
    CUSTOMER_USERNAME: customerUsername,
    CUSTOMER_USER_PASSWORD: customerUserPassword,
    REGION: region
} = USER_POOL_CONFIG;

const {
    USER_POOL_ID: userPoolId,
} = POST_CDK_DEPLOY_CONFIG;

const cognitoServiceProvider = new CognitoIdentityServiceProvider({ region });

const setUserPassword = async (
    username: string,
    password: string
): Promise<void> => {
    try {
        await cognitoServiceProvider.adminSetUserPassword({
            UserPoolId: userPoolId,
            Username: username,
            Password: password,
            Permanent: true
        }).promise();

        console.log(`Password set successfully for user: ${username}`);
    } catch (err) {
        console.error(`Error setting password for user ${username}:`, err);
    }
};

setUserPassword(adminUsername, adminUserPassword);
setUserPassword(customerUsername, customerUserPassword);
