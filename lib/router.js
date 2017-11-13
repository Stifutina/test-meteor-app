import { Dates } from '/imports/api/dates.js';

Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('/', function () {
        this.render('clock', {to: 'clock'});
        this.render('countersList');
    });
    this.route('expDateDetails/:_id', function() {
        this.render('expDateDetails', {
            data: function () {
                console.log(this.params._id);
                return Dates.findOne({_id: this.params._id})
            }
        })
    });
    this.route('/add', function () {
        this.render('addExpDateForm');
    });
    this.route('/fly', function () {
        this.render('fly');
    });


    /*this.route('/login', function () {
        this.render('login')
    });*/
    this.route('/login', {
        waitOn: () => {
            Meteor.subscribe('myself', Meteor.userId())
        },
        data: () => {
            Meteor.users.find(Meteor.user())
        }
    });
});