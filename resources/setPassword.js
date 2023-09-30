
const cognitoidentityserviceprovider = require('aws-sdk/clients/cognitoidentityserviceprovider');

const userPoolId = 'us-east-1_gUEKnHS9S';  // Replace with your User Pool ID
const adminUsername = 'shahrukh.khan@trilogy.com';
const customerUsername = 'customer@trilogy.com';
const adminUserPassword = 'Admin!123';
const customerUserPassword = 'Cust!123';
const region = 'us-east-1';

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
