const { db } = require('../src/lib/firebase')
const region = [{ region: 'China (Hong Kong)', city:'Hong Kong', regionid:'cn-hongkong'},
{ region: 'Singapore (Singapore)', city:'Singapore', regionid:'ap-southeast-1'},
{ region: 'Australia (Sydney)', city:'Sydney', regionid:'ap-southeast-2'},
{ region: 'Malaysia (Kuala Lumpur)', city:'Kuala Lumpur', regionid:'ap-southeast-3'},
{ region: 'Indonesia (Jakarta)', city:'Jakarta', regionid:'ap-southeast-5'},
{ region: 'India (Mumbai)', city:'Mumbai', regionid:'ap-south-1'},
{ region: 'Japan (Tokyo)', city:'Tokyo', regionid:'ap-northeast-1'},
{ region: 'US (Silicon Valley)', city:'Silicon Valley', regionid:'us-west-1'},
{ region: 'US (Virginia)', city:'Virginia', regionid:'us-east-1'},
{ region: 'Germany (Frankfurt)', city:'Frankfurt', regionid:'eu-central-1'},
{ region: 'UK (London)', city:'London', regionid:'eu-west-1'},
{ region: 'UAE (Dubai)', city:'Dubai', regionid:'me-east-1'}]

region.forEach(e=>{
    db.collection("region").add(e)
})