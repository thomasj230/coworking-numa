import { Meteor } from 'meteor/meteor';
import Typeform from 'typeform-node-api';
import cron from 'cron';
import { HTTP } from 'meteor/http';

const timeZone = Meteor.settings.timeZone;
const typeForm_api_key = Meteor.settings.typeForm_api_key;
const typeForm_id = Meteor.settings.typeForm_id;
const slack_token = Meteor.settings.slack_token;

var typeForm_api = new Typeform(typeForm_api_key);

let sendInviteForSlack = Meteor.bindEnvironment(() => {
    typeForm_api.getFormResponses(typeForm_id, Meteor.bindEnvironment((data) => {
        data.responses.forEach((response) => {
            if(response.answers.textfield_32544220){
                var result = HTTP.post('https://numacoworking.slack.com/api/users.admin.invite?email=' + response.answers.textfield_32544220 + '&token=' + slack_token + '&set_active=true');
                console.log(result);
            }
        });
    }));
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
