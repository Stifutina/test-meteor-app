import { Dates } from '/imports/api/dates.js';
import './counters.html';

Template.countersList.helpers({
    dates() {
        var query;

        if (Meteor.user()) {
            query = {};
            if (!Meteor.user().profile.isAdmin) {
                query = {
                    userId: Meteor.user()._id
                }
            }
            return Dates.find(query, { sort: { createdAt: -1 } });
        } else {
            return []
        }
    }
});