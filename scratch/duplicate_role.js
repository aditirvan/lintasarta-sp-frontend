import {db} from '../src/lib/firebase'
import {login} from './auth'
login().then(()=>{
return db.collection('member').doc('jDW8nI06F63gBzc4AL8e').get()
})
.then((snapshot)=>{
    snapshot.ref.update({
        role: { id: 'li0kZPB1efVV98Xs9d4u',
        level: 1,
        name: 'Owner',
        privileges:
         [ 'Project',
           'Instance',
           'Storage',
           'Objectstorage',
           'Images',
           'Network',
           'Security',
           'Alerting',
           'Billing',
           'Organization',
           'Ticket',
           'Docs',
           'Notification',
           'Profile' ],
        desc: '' }
    })
})