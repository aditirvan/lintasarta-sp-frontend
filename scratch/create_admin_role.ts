import {db} from '../src/lib/firebase'
import {login} from './auth'
import {privileges} from './create_privileges'

const Admin = {
    desc: '',
    name: 'Admin',
    privileges: privileges.map(x=>x.name),
    level: 1
}
login().then(()=>{
    return db.collection('role').add(Admin)
}).then(()=>{
    process.exit()
})