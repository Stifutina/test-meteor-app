import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Dates } from '../api/dates.js';

import './e_date.html';


if (Meteor.isClient) {
    Meteor.setInterval(function() {
        Session.set('now', moment(Date.now()).format('DD/MM/YYYY HH:mm:ss'));
    }, 1000);
}


Template.date.events({
    'click .stop_counter-js'() {
        if (confirm('Are you sure that you are not waiting for this?')) {
            Dates.remove(this._id);
        }
    },
});


Template.date.helpers({
    timeLeft() {
        const then = moment(this.date).format('DD/MM/YYYY HH:mm:ss'); /* end date */
        const momentNow = moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss");
        const momentThen = moment(then,"DD/MM/YYYY HH:mm:ss");
        const diff = moment(momentThen.diff(momentNow)); /* difference date */
        const allHours = momentThen.diff(momentNow, 'hours'); /* difference in hours */

        const seconds = diff.seconds();
        const minutes = diff.minutes();
        const hours = allHours % 24;
        const days = parseInt(allHours / 24) % 7;
        const weeks = parseInt((allHours / 24) / 7) % 4;
        const months = momentThen.diff(momentNow, 'months') % 12;
        const years = momentThen.diff(momentNow, 'years');

        let result = {};

        result['years'] = ((years > 0) ? years + ' years' : '');
        result['months'] = ((months > 0) ? months + ' months' : '');
        result['weeks'] = ((weeks > 0) ? weeks + ' weeks' : '');
        result['days'] = ((days > 0) ? days + ' days' : '');
        result['hours'] = ((hours > 0) ? hours + ' hours' : '');
        result['minutes'] = ((minutes > 0) ? minutes + ' minutes' : '');
        result['seconds'] = ((seconds > 0) ? seconds + ' seconds' : '');

        return  result;
    },
    prettyDate() {
        return moment(this.date).format('dddd, DD-MMMM-YYYY hh:mm:ss')
    },
    uniqueId() {
        return 'rand__' + (new Date(this.createdAt).getTime().toString(36))
    }
});