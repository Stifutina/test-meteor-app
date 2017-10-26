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

    Meteor.setInterval(function() {
        updateChart(dateStart, dateEnd);
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


let progressChart;


function drawChart(id, dateStart, dateEnd) {
    const contElem = document.querySelector('#id_'+id);

    function fields() {
        const then = moment(dateEnd).format('DD/MM/YYYY HH:mm:ss'); /* end date */
        const momentNow = moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss");
        const momentThen = moment(then,"DD/MM/YYYY HH:mm:ss");
        const momentStartWaiting = moment(dateStart);
        const allSeconds = momentThen.diff(momentNow, 'seconds'); /* difference in hours */
        const sumSecondsFromStart = momentThen.diff(momentStartWaiting, 'seconds');

        return  [allSeconds, sumSecondsFromStart];
    }

    function init() {
        let [secondsLeft, allSeconds] = fields();
        let secondsGone = allSeconds - secondsLeft;
        let progress = (secondsGone * 100) / allSeconds;

        if (secondsLeft <= 0) return false;

        progressChart = new RadialProgressChart(contElem, {
            diameter: 200,
            series: [{
                labelStart: '',
                value: 0,
                animation : false,
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
                        'stop-color': '#ffff00',
                        'stop-opacity': 1
                    }, {
                        offset: '100%',
                        'stop-color': '#ff0000',
                        'stop-opacity': 1
                    }]
                }
            }],
            center: function(p) {
                return progress.toFixed(2) + ' %'
            }
        });

        progressChart.update(progress);
    }

    init();
}

function updateChart(dateStart, dateEnd) {
    function fields() {
        const then = moment(dateEnd).format('DD/MM/YYYY HH:mm:ss'); /* end date */
        const momentNow = moment(Session.get('now'),"DD/MM/YYYY HH:mm:ss");
        const momentThen = moment(then,"DD/MM/YYYY HH:mm:ss");
        const momentStartWaiting = moment(dateStart);
        const allSeconds = momentThen.diff(momentNow, 'seconds'); /* difference in hours */
        const sumSecondsFromStart = momentThen.diff(momentStartWaiting, 'seconds');

        return  [allSeconds, sumSecondsFromStart];
    }

    let [secondsLeft, allSeconds] = fields();
    let secondsGone = allSeconds - secondsLeft;
    let progress = (secondsGone * 100) / allSeconds;

    if (secondsLeft <= 0) return false;

    console.log('progress', progress);

    progressChart.update(progress);
}