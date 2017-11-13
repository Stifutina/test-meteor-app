Accounts.onCreateUser(function (options, user) {
    user.profile = options.profile;
    user.profile.isAdmin = false;

    return user;
});

Meteor.publish('user.custom', (id) => {
    Meteor.users.find(id, {
        fields: {
            'services.google.given_name': 1,
            'services.google.picture': 1
        }
    })
});