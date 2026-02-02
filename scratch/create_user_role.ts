import {db} from '../src/lib/firebase'
import {login} from './auth'

let users = [{
    email:'arif2@gmail.com',
    uid:'JxQUvLzVBDVdVF9EuxM0wajFoW13',
    role_id:''
},{
    email:'test1@test.com',
    uid:'Nl7f2lPv0FOM2FGl7q0y08YF3E73',
    role_id:''
},{
    email:'ricko@gits.id',
    uid:'kmL5PWS9CTdJYhaBUbkY2aTrWKh1',
    role_id:''
},{
    email:'test@mail.com',
    uid:'qNueW7yzGKaBU4cfaewM5eHLZA02',
    role_id:''
}]
users = users.map(x=>{
    x.role_id = 'gtjqAyRfNl85EF7vc8JE'
    return x
})

login().then(()=>{
    return Promise.all(users.map(async(user)=>{
        return db.collection('user').add(user)
    }))
}).then(()=>{
    process.exit()
})