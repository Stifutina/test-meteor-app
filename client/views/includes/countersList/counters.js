import { Dates } from '/imports/api/dates.js';
import './counters.html';

Template.countersList.helpers({
    dates() {
        return Dates.find({}, { sort: { createdAt: -1 } });
    }
});