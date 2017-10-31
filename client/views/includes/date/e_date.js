import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Dates } from '/imports/api/dates.js';
import '/node_modules/d3/d3';
import RadialProgressChart from '/node_modules/radial-progress-chart/dist/radial-progress-chart';

import './e_date.html';

Template.date.onRendered(() => {
    let id = Template.instance().data._id;
    let dateStart = moment(Template.instance().data.createdAt).valueOf();
    let dateEnd = Template.instance().data.date;

    Meteor.setTimeout(() => {
        drawChart(id, dateStart, dateEnd);
    }, 1000);
});

Template.date.events({
    'click .stop_counter-js'() {
        if (confirm('Are you sure that you are not waiting for this?')) {
            Dates.remove(this._id);
        }
    },
});

Template.date.helpers({
    secondsLeft() {
        const then = moment(this.date).format('DD/MM/YYYY HH:mm:ss'); /* end date */
        const momentNow = moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss");
        const momentThen = moment(then,"DD/MM/YYYY HH:mm:ss");

        return Math.max(momentThen.diff(momentNow, 'seconds'), 0);
    },
    timeLeft() {
        /*const then = moment(this.date).format('DD/MM/YYYY HH:mm:ss'); /!* end date *!/
        const momentNow = moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss");
        const momentThen = moment(then,"DD/MM/YYYY HH:mm:ss");
        const diff = moment(momentThen.diff(momentNow)); /!* difference date *!/
        const allHours = momentThen.diff(momentNow, 'hours'); /!* difference in hours *!/
        const allSeconds = momentThen.diff(momentNow, 'seconds'); /!* difference in hours *!/

        const seconds = diff.seconds();
        const minutes = diff.minutes();
        const hours = allHours % 24;
        const days = parseInt(allHours / 24) % 7;
        const weeks = parseInt((allHours / 24) / 7) % 4;
        const months = momentThen.diff(momentNow, 'months') % 12;
        const years = momentThen.diff(momentNow, 'years');

        let result = {};

        if (allSeconds > 0) {
            result['years'] = years + ' years';
            result['months'] = months + ' months';
            result['weeks'] = weeks + ' weeks';
            result['days'] = days + ' days';
            result['hours'] = hours + ' hours';
            result['minutes'] = minutes + ' minutes';
            result['seconds'] = seconds + ' seconds';
        } else {
            result = false;
        }

        return  result;*/
    },
    prettyDate() {
        return moment(this.date).format('dddd, DD-MMMM-YYYY hh:mm:ss')
    },
    uniqueId() {
        return 'rand__' + (new Date(this.createdAt).getTime().toString(36))
    }
});


function drawChart(id, dateStart, dateEnd) {
    const contElem = document.querySelector('#id_'+id);
    let progressCharts = {};

    function fields() {
        const then = moment(dateEnd).format('DD/MM/YYYY HH:mm:ss'); /* end date */
        const momentNow = moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss");
        const momentThen = moment(then,"DD/MM/YYYY HH:mm:ss");
        const momentStartWaiting = moment(dateStart);
        const diff = moment(momentThen.diff(momentNow));
        const allHours = momentThen.diff(momentNow, 'hours');
        const allSeconds = momentThen.diff(momentNow, 'seconds'); /* difference in hours */
        const sumSecondsFromStart = momentThen.diff(momentStartWaiting, 'seconds');
        let timeUnits;

        /* result */
        const seconds = diff.seconds();
        const minutes = diff.minutes();
        const hours = allHours % 24;
        const days = parseInt(allHours / 24) % 7;
        const weeks = parseInt((allHours / 24) / 7) % 4;
        const months = momentThen.diff(momentNow, 'months') % 12;
        const years = momentThen.diff(momentNow, 'years');

        timeUnits = {
            seconds: [seconds, 60],
            minutes: [minutes, 60],
            hours: [hours, 24],
            days: [days, 7],
            weeks: [weeks, 4],
            months: [months, 12],
            years: [years, 100]
        };

        return  [allSeconds, timeUnits];
    }

    function init() {
        let [secondsLeft, timeUnits] = fields();

        if (secondsLeft <= 0) return false;

        Object.keys(timeUnits).forEach((key) => {
            if ((key === 'years' || key === 'months' || key === 'weeks') && timeUnits[key][0] === 0) {
                return false
            }

            let progress = (timeUnits[key][0] * 100) / timeUnits[key][1];
            let container = document.createElement('DIV');
            container.classList.add(key);
            container.classList.add('infoCounter');
            contElem.appendChild(container);

            progressCharts[key] = new RadialProgressChart(container, {
                diameter: 500,
                series: [{
                    labelStart: '',
                    value: 0,
                    color: {
                        linearGradient: {
                            x1: '0%',
                            y1: '100%',
                            x2: '50%',
                            y2: '0%',
                            spreadMethod: 'pad'
                        },
                        stops: [{
                            offset: '0%',
                            'stop-color': '#00DEFF',
                            'stop-opacity': 1
                        }, {
                            offset: '100%',
                            'stop-color': '#01b0ff',
                            'stop-opacity': 1
                        }]
                    }
                }],
                center: {
                    content: [function(value) {
                        return Math.round((value * timeUnits[key][1]) / 100)
                    }, key],
                    y: 30
                }
            });

        });
    }

    init();


    Meteor.setInterval(function() {
        let [secondsLeft, timeUnits] = fields();

        if (secondsLeft <= 0) return false;

        Object.keys(timeUnits).forEach((key) => {
            let progress = (timeUnits[key][0] * 100) / timeUnits[key][1];

            if ((key === 'years' || key === 'months' || key === 'weeks') && timeUnits[key][0] === 0) {
                return false
            }

            progressCharts[key].update(progress);

        });

        //console.log('progress', progress);
    }, 1000);
}
