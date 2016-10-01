import { Meteor } from 'meteor/meteor';
import request from 'request';
import { Typeform } from 'typeform-node-api';
import cron from 'cron';
const timeZone = Meteor.settings.timeZone;
const typeForm_api_key = Meteor.settings.typeForm_api_key;
const typeForm_id = Meteor.settings.typeForm_id;

var typeForm_api = new Typeform(typeForm_api_key);

let sendInviteForSlack = Meteor.bindEnvironment(() => {
    typeForm_api.getFormResponses(typeForm_id, function(data){
        console.log(data);
    });
});

const cronInviteSlack = new cron.CronJob({
    cronTime: '00 * * * * *',
    onTick: sendInviteForSlack,
    start: false,
    timeZone: timeZone
});

Meteor.startup(() => {
    cronInviteSlack.start();
});
