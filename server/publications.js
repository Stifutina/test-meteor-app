Meteor.publish('myself', (id) => {
    Meteor.users.find(id, {
        fields: {
            'services.google.given_name': 1,
            'services.google.picture': 1
        }
    })
});