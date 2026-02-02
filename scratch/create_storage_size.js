const { db } = require('../src/lib/firebase')
const storagesize = [
    {
        size: '10GB',
        spec: `128 GB / 16 CPUs
        4.69 TB NVMe SSDs
        10 TB transfer`,
        price: {
            month: 2000000,
            hour: 100000
        }
    },
    {
        size: '20GB',
        spec: `256 GB / 32 CPUs
        4.69 TB NVMe SSDs
        10 TB transfer`,
        price: {
            month: 4000000,
            hour: 200000
        }
    },
    {
        size: '20GB',
        spec: `500 GB / 32 CPUs
        4.69 TB NVMe SSDs
        10 TB transfer`,
        price: {
            month: 4000000,
            hour: 200000
        }
    },
    {
        size: '20GB',
        spec: `1 TB / 32 CPUs
        4.69 TB NVMe SSDs
        10 TB transfer`,
        price: {
            month: 4000000,
            hour: 200000
        }
    }
]
storagesize.forEach(e=>{
    db.collection("storagesize").add(e)
})