import { Template } from 'meteor/templating';

import { Tasks } from '../api/dates.js';

import './expected_date.html';

Template.task.events({
    'click .toggle-checked'() {
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {
            $set: { checked: ! this.checked },
        });
    },
    'click .delete'() {
        Tasks.remove(this._id);
    },
});


Template.task.helpers({
    uniqueId() {
        return 'rand__' + (new Date(this.createdAt).getTime().toString(36))
    }
});