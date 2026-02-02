<template>
  <v-container fluid class="d-flex fill-height justify-center
">

    <v-btn @click="signout">
      logout
    </v-btn>
  </v-container>
</template>

<script>
import { useNamespacedActions } from 'vuex-composition-helpers'
import { HOMEPAGE } from '../homepage/namespace'

export default {
  setup(props, context) {
    const { logout } = useNamespacedActions(HOMEPAGE, 'logout')
    const $router = context.root.$router

    function signout() {
      logout.then(() => {
        $router.replace('/')
      })
    }

    return {
      signout
    }
  }
}
</script>