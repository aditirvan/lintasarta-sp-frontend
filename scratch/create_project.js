import faker from 'faker';
import {db } from '../src/lib/firebase'
const projects = []
for(let i=0;i<10;i++){
projects.push({
    name: faker.name.findName()
})
}

projects.forEach(e=>{
    db.collection("project").add(e)
})