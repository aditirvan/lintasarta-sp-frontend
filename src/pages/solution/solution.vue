<template>
    <v-container fluid class="d-flex fill-height justify-center
">

        <h1>Not Found</h1>
        </v-container>
</template>

<script>
export default {
    setup(props, context){
        const $router = context.root.$router
        function signout(){
            context.root.$auth
            .signOut().then(()=>{
                $router.replace('/')
            })
        }
        
        
        return {
            signout
        }
    }
}
</script>