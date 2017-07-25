import { Template } from 'meteor/templating';

import { Dates } from '../api/dates.js';

import './e_date.html';

Template.date.events({
    'click .stop_counter-js'() {
        Dates.remove(this._id);
    },
});


Template.date.helpers({
    uniqueId() {
        return 'rand__' + (new Date(this.createdAt).getTime().toString(36))
    }
});