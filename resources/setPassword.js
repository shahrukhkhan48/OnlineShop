import { userPoolId, adminUsername, adminUserPassword, customerUsername, customerUserPassword,  region } from './config';

const cognitoidentityserviceprovider = require('aws-sdk/clients/cognitoidentityserviceprovider');

const cognitoServiceProvider = new cognitoidentityserviceprovider({region: region});

cognitoServiceProvider.adminSetUserPassword({
    UserPoolId: userPoolId,
    Username: adminUsername,
    Password: adminUserPassword,
    Permanent: true
}, (err, data) => {
    if (err) {
        console.error("Error setting password for admin user:", err);
    } else {
        console.log("Password set successfully for admin user");
    }
});

cognitoServiceProvider.adminSetUserPassword({
    UserPoolId: userPoolId,
    Username: customerUsername,
    Password: customerUserPassword,
    Permanent: true
}, (err, data) => {
    if (err) {
        console.error("Error setting password for customer user:", err);
    } else {
        console.log("Password set successfully for customer user");
    }
});
