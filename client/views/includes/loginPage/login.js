import { Template } from 'meteor/templating';

import './login.html';


Template.login.events({
    'click #google-login': (e) => {
        console.log('clicked google login');
        Meteor.loginWithGoogle({}, (err) => {
            if (err) {
                console.log('Meteor.loginWithGoogle Error', err);
            } else {
                console.log('Success login with google!');
            }
        })
    },
    'click #logout': (e) => {
        Meteor.logout((err) => {
            if (err) {
                console.log('Meteor.logout Error', err);
            } else {
                console.log('Success logout!');
            }
        })
    }
});


Template.login.helpers({});