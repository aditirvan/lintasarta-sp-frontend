import {db } from '../src/lib/firebase'
import {login} from './auth'
export const privileges = [
    {name:'Project',permissions:['project-view']},
    {name:'Instance',permissions:['instance-view']},
    {name:'Storage',permissions:['storage-view']},
    {name:'Objectstorage',permissions:['objectstorage-view']},
    {name:'Images',permissions:['images-view']},
    {name:'Network',permissions:['network-view']},
    {name:'Security',permissions:['security-view']},
    {name:'Alerting',permissions:['alerting-view']},
    {name:'Billing',permissions:['billing-view']},
    {name:'Organization',permissions:['organization-view']},
    {name:'Ticket',permissions:['ticket-view']},
    {name:'Docs',permissions:['docs-view']},
    {name:'Notification',permissions:['notification-view']},
    {name:'Profile',permissions:['profile-view']},
]
login().then(()=>{
    privileges.forEach(e=>{
        db.collection("privileges").add(e)
    })
})
