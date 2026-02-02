const { db } = require('../src/lib/firebase')
const faker = require('faker')
for(i=0;i<100;i++){
    db.collection("tags").add({
        text:faker.name.firstName()})
}
