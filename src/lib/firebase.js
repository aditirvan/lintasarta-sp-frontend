"use strict";
exports.__esModule = true;
exports.db = exports.auth = void 0;
var app_1 = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
var firebaseConfig = {
    apiKey: "AIzaSyD1MvNhzmvN2sPXduJDdmOEjXgxnbAa1qk",
    authDomain: "gits-lintasarta.firebaseapp.com",
    databaseURL: "https://gits-lintasarta.firebaseio.com",
    projectId: "gits-lintasarta",
    storageBucket: "gits-lintasarta.appspot.com",
    messagingSenderId: "982939032240",
    appId: "1:982939032240:web:45d36e7f08f0e77c4eb975"
};
// Initialize Firebase
app_1["default"].initializeApp(firebaseConfig);
var auth = app_1["default"].auth();
exports.auth = auth;
var db = app_1["default"].firestore();
exports.db = db;
