import { Dates } from '/imports/api/dates.js';

Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('/', function () {
        Meteor.subscribe('user.custom', Meteor.userId());
        this.render('clock', {to: 'clock'});
        this.render('countersList', {
            waitOn: () => {
                Meteor.subscribe('user.custom', Meteor.userId())
            }
        });
    });
    this.route('expDateDetails/:_id', function() {
        this.render('expDateDetails', {
            data: function () {
                return Dates.findOne({_id: this.params._id, userId: Meteor.userId()})
            }
        })
    });
    this.route('/add', function () {
        if (typeof Meteor.userId() === 'string' && Meteor.userId() !== null) {
            this.render('addExpDateForm');
        } else {
            Router.go('/login')
        }
    });
    this.route('/fly', function () {
        this.render('fly');
    });

    this.route('/login', {
        waitOn: () => {
            Meteor.subscribe('user.custom', Meteor.userId())
        },
        data: () => {
            Meteor.users.find(Meteor.user())
        }
    });
});