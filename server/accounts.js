let settings = require('../settings.json');

ServiceConfiguration.configurations.remove({
    service: 'google'
});

ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: settings.public.OAuth.clientId,
    secret: settings.public.OAuth.clientSecret
});