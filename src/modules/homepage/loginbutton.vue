<template>
    <div v-if="$vuetify.breakpoint.xsOnly">
    <v-btn depressed 

    color="primary"
     class="mx-3 text-body-2 rounded-lg login-button" 
    style="width:100%"
     @click="loginorsignup('login')">login</v-btn>
    </div>
</template>

<script>
import {  useMutations } from 'vuex-composition-helpers';
import LoginOrSignup from './loginorsignup'
export default {
    setup(props, context){
        const primary = context.root.$vuetify.theme.themes.light.primary
        const router = context.root.$options.router
        const {setloginorsignup} = useMutations({
            setloginorsignup: 'HOMEPAGE/setloginorsignup'
        })
        const loginorsignup = LoginOrSignup(router, setloginorsignup)
        return{
            primary,
            loginorsignup
        }
    }
}
</script>