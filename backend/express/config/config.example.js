module.exports.config = {
  from: 'sender@domain.com', // The email address that is sending the email.
  region: 'us-east-1', // The region to send service requests to
  sendingRate: 1, // How many messages per second is allowed to be delivered to SES
};
