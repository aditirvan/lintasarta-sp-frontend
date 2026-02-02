"use strict";
exports.__esModule = true;
var firebase_1 = require("../src/lib/firebase");
var auth_1 = require("./auth");
var create_privileges_1 = require("./create_privileges");
var Admin = {
    desc: '',
    name: 'Admin',
    privileges: create_privileges_1.privileges.map(function (x) { return x.name; }),
    level: 1
};
auth_1.login().then(function () {
    return firebase_1.db.collection('role').add(Admin);
}).then(function () {
    process.exit();
});
