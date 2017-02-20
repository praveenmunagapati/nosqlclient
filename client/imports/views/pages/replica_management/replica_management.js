/**
 * Created by Sercan on 20.02.2017.
 */
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {FlowRouter} from "meteor/kadira:flow-router";
import Helper from "/client/imports/helper";
import "./replica_management.html";

const initReplicaSets = function () {
    Meteor.call("command", {replSetGetStatus: 1}, true, {}, function (err, result) {
        if (err || result.error) {
            Helper.showMeteorFuncError(err, result, "Couldn't fetch replica information");
            //TODO let user initialize replica set
        } else {
            console.log(result);
        }
    });
};

Template.replicaManagement.onRendered(function () {
    if (Session.get(Helper.strSessionCollectionNames) == undefined) {
        FlowRouter.go('/databaseStats');
        return;
    }

    let settings = this.subscribe('settings');
    let connections = this.subscribe('connections');

    this.autorun(() => {
        if (settings.ready() && connections.ready()) {
            initReplicaSets();
        }
    });
});