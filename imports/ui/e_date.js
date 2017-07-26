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
        Dates.remove(this._id);
    },
});


Template.date.helpers({
    secondsLeft() {
        const then = moment.utc(this.date).format('DD/MM/YYYY HH:mm:ss');
        let allHours = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss"), 'hours');
        let hours = moment.utc(moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss"))).hours();
        let minutes = moment.utc(moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss"))).minutes();
        let seconds = moment.utc(moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss"))).seconds();

        let days = parseInt(allHours / 24) % 7;
        let weeks = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss"), 'weeks');
        let months = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss"), 'months');
        let years = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss"), 'years');

        let result = '';

        (years > 0) && (result += years + ' years, ');
        (months > 0) && (result += months + ' months, ');
        (weeks > 0) && (result += weeks + ' weeks, ');
        (days > 0) && (result += days + ' days, ');
        (hours > 0) && (result += hours + ' hours, ');
        (minutes > 0) && (result += minutes + ' minutes, ');
        (seconds > 0) && (result += seconds + ' seconds');

        return  result;
    },
    prettyDate() {
        return moment.utc(this.date).format('YYYY-MM-DD hh:mm:ss')
    },
    uniqueId() {
        return 'rand__' + (new Date(this.createdAt).getTime().toString(36))
    }
});