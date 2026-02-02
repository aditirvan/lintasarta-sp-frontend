import {auth} from '../src/lib/firebase'
export const login =  async()=>{
    return auth.signInWithEmailAndPassword(
        'arif2@gmail.com','arif2@gmail.com'
    )
}