<template>
  <v-main style="margin-top: 65px">
    <v-container
      fluid
      :style="{
        'background-image': 'url(' + require('@/assets/RegisterPage.png') + ')',
        'background-position': 'bottom right',
        'padding-bottom': '50px',
        'background-size': 'contain',
        height: '100%',
      }"
    >
      <v-row>
        <v-col cols="12" class="d-flex pt-7 justify-center">
          <v-card
            style="
              background: #ffffff;
              box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
              border-radius: 20px;
            "
            width="460"
          >
            <loginform />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useNamespacedActions } from 'vuex-composition-helpers'
import { ref } from '@vue/composition-api'
import loginform from './login-form.vue'
import {VERIFYEMAIL} from './namespace'
export default defineComponent({
    components:{loginform},
    
})
</script>