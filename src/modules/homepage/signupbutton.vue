<template>
    
    <v-btn depressed class="mx-3 primary text-body-2 rounded-lg" 
    style="text-transform: none; border: 1px solid primary"
     @click="loginorsignup('signup')">Sign Up</v-btn>
</template>
<script>
import {  useMutations } from 'vuex-composition-helpers';
import LoginOrSignup from './loginorsignup'
export default {
    setup(props, context){
        const router = context.root.$options.router
        const {setloginorsignup} = useMutations({
            setloginorsignup: 'HOMEPAGE/setloginorsignup'
        })

        const loginorsignup = LoginOrSignup(router, setloginorsignup)
        return{
            loginorsignup
        }
    }
}
</script>