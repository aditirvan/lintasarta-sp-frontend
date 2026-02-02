const { db } = require('../src/lib/firebase')
const faker = require('faker')
const vpcs =[]
for(i=0;i<5;i++){
    vpcs.push({
        vpcid: 'vpc_' + faker.random.alphaNumeric(9),
        name: faker.name.lastName().toLowerCase()
    })
}

vpcs.forEach(e=>{
    db.collection("vpc").add(e)
})