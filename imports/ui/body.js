import { Template } from 'meteor/templating';

import { Dates } from '../api/dates.js';

import './expected_date.html';
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
    'submit .new-exp-date'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const date = $(target).find('#date').val();

        console.log(date);

        /*Tasks.insert({
            text,
            createdAt: new Date(), // current time
        });*/

        // Clear form
        $(target).find('#date').val('');
    }
});

initDateTimePickers = () => {
    $('._datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
    });

    $('._timepicker').clockpicker();
};