import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';


import './e_date';
import './clock';
import './counters';
import './add_date_form';
import './body.html';

Template.body.onRendered(() => {
    Session.set('mainTemplate', 'countersList');
});

Template.body.helpers({
    getMainTemplate: () => {
        return Session.get('mainTemplate');
    }
});

Template.body.events({
    'click .add_event_modal'()  {
        Session.set('mainTemplate', 'addExpDateForm');
    }
});

setUserId = () => {
    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', Math.random().toString(36).slice(-14));
    }

    return localStorage.getItem('userId');
};

getUserId = () => {
    return (localStorage.getItem('userId')) || setUserId();
};