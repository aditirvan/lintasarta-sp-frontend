const { data: images } = require('./images.json')
const lodash = require('lodash')
const groupByVendor = lodash.groupBy(images, 'vendor')
const { db } = require('../src/lib/firebase')

images.forEach(e=>{
    db.collection("images").add(e)
})