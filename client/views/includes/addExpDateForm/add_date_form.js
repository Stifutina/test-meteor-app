import { Dates } from '/imports/api/dates.js';

import './add_date_form.html';

Template.addExpDateForm.onRendered(() => {
    initDateTimePickers();
});

Template.addExpDateForm.events({
    'submit .new-exp-date'(event) {
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const date = $(target).find('#date').val();
        const time = $(target).find('#time').val();
        const description = $(target).find('#description').val();

        if (date && time && description) {
            const dateExp = moment(moment(new Date(date)).format('YYYY-MM-DD') + ' ' + moment(time, 'hh:mm').format('HH:mm:ss')).valueOf();

            if (moment.now() < dateExp) {
                /* insert to db @todo make mvc */
                Dates.insert({
                    date: dateExp,
                    description,
                    userId: getUserId(),
                    createdAt: new Date(), // current time
                });

                $(target)[0].reset();
                $(target).find('LABEL').removeClass('active');

                /* track ga */
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
    },

    'click .cancel_add_event'(event) {
        const target = event.target;

        $(target).closest('FORM')[0].reset();
        $(target).closest('FORM').find('LABEL').removeClass('active');
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