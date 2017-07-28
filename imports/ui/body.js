import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Dates } from '../api/dates.js';

import './e_date.js';
import './clock.js';
import './body.html';


Template.body.helpers({
    dates() {
        return Dates.find({}, { sort: { createdAt: -1 } });
    },
    getClockObj() {
        const momentNow = moment(Session.get('now'), "DD/MM/YYYY HH:mm:ss");

        return {
            year: momentNow.format("YYYY"),
            month: momentNow.format("MMMM"),
            day: momentNow.day(),
            dayName: momentNow.format("dddd"),
            hours: momentNow.format("HH"),
            minutes: momentNow.format("mm"),
            seconds: momentNow.format("ss"),
        };
    },
});

Template.body.onRendered(() => {
    initDateTimePickers();
});

Template.body.events({
    'submit .new-exp-date'(event) {
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const date = $(target).find('#date').val();
        const time = $(target).find('#time').val();
        const description = $(target).find('#description').val();

        if (date && time && description) {
            const dateExp = moment(moment(new Date(date)).format('YYYY-MM-DD') + ' ' + moment(time, 'hh:mm').format('HH:mm:ss')).valueOf();

            console.log(dateExp, moment(dateExp).format());

            if (moment.now() < dateExp) {
                Dates.insert({
                    date: dateExp,
                    description,
                    userId: getUserId(),
                    createdAt: new Date(), // current time
                });

                $(target)[0].reset();
                $(target).find('LABEL').removeClass('active');

                if (!Meteor.isDevelopment) {
                    analytics.track("add event", {
                        eventName: description,
                        data: {
                            date: dateExp,
                            description,
                            userId: getUserId(),
                            createdAt: new Date(), // current time
                        }
                    });
                }
            } else {
                Materialize.toast('You can not wait for what has already happened', 5000, 'red')
            }
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
        twelvehour: false
    });
};