<template>
    <v-app>
        <Sidemenu />
        <Header />
        <Content />
    </v-app>
</template>


<script>

import Sidemenu from './Sidemenu'
import Header from './Header.vue'
import Content from './Content'

export default {
    components : {
        Sidemenu,
        Header,
        Content
    }
}
        
</script>