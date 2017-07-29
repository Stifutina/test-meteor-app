/**
 * Created by phoenix on 28.07.17.
 */
import './clock.html';

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