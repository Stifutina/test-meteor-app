/**
 * Created by phoenix on 28.07.17.
 */
import './clock.html';
import { Session } from 'meteor/session';

if (Meteor.isClient) {
    Meteor.setInterval(function() {
        Session.set('now', moment(Date.now()).format('DD/MM/YYYY HH:mm:ss'));
    }, 1000);
}

Template.clock.helpers({
    getClockObj() {
        if (Session.get('now')) {
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
        }
    }
});