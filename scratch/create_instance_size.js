const { db } = require('../src/lib/firebase')
const instancesize = [
    {
        size: '10GB',
        price: {
            month: 2000000,
            hour: 100000
        }
    },
    {
        size: '20GB',
        price: {
            month: 4000000,
            hour: 200000
        }
    },
    {
        size: '50GB',
        price: {
            month: 8000000,
            hour: 400000
        }
    },
    {
        size: '100GB',
        price: {
            month: 10000000,
            hour: 500000
        }
    }
]
instancesize.forEach(e=>{
    db.collection("instancesize").add(e)
})