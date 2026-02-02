"use strict";
exports.__esModule = true;
exports.privileges = void 0;
var firebase_1 = require("../src/lib/firebase");
var auth_1 = require("./auth");
exports.privileges = [
    { name: 'Project', permissions: ['project-view'] },
    { name: 'Instance', permissions: ['instance-view'] },
    { name: 'Storage', permissions: ['storage-view'] },
    { name: 'Objectstorage', permissions: ['objectstorage-view'] },
    { name: 'Images', permissions: ['images-view'] },
    { name: 'Network', permissions: ['network-view'] },
    { name: 'Security', permissions: ['security-view'] },
    { name: 'Alerting', permissions: ['alerting-view'] },
    { name: 'Billing', permissions: ['billing-view'] },
    { name: 'Organization', permissions: ['organization-view'] },
    { name: 'Ticket', permissions: ['ticket-view'] },
    { name: 'Docs', permissions: ['docs-view'] },
    { name: 'Notification', permissions: ['notification-view'] },
    { name: 'Profile', permissions: ['profile-view'] },
];
auth_1.login().then(function () {
    exports.privileges.forEach(function (e) {
        firebase_1.db.collection("privileges").add(e);
    });
});
