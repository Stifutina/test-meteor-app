import { Template } from 'meteor/templating';

import { Dates } from '../api/dates.js';

import './e_date.js';
import './body.html';


Template.body.helpers({
    dates() {
        return Dates.find({}, { sort: { createdAt: -1 } });
    },
});

Template.body.onRendered(() => {
    initDateTimePickers();
});

Template.body.events({
    'click ._submit'(event) {
        $(event.target).closest('FORM').trigger('submit');
    },
    'submit .new-exp-date'(event) {
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const date = $(target).find('#date').val();
        const time = $(target).find('#time').val();
        const description = $(target).find('#description').val();

        if (date && time && description) {

            Dates.insert({
                date: moment.utc(moment(new Date(date)).format('YYYY-MM-DD') + ' ' + moment(time, 'hh:mmPM').format('hh:mm:ss')).valueOf(),
                description,
                userId: getUserId(),
                createdAt: new Date(), // current time
            });


            $(target)[0].reset();
            $(target).find('LABEL').removeClass('active');
        }
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

initDateTimePickers = () => {
    $('._datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
    });

    $('._timepicker').clockpicker({
        twelvehour: true
    });
};