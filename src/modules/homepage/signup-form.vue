<template>
  <v-card-text>
    <v-container>
      <v-col class="justify-center">
        <h2 style="text-align: center">Sign Up Now</h2>
        <v-form ref="form" class="my-5" lazy-validation>
          <!-- <v-text-field
          flat
          outlined
          label="Name"
          required
        ></v-text-field> -->

          <v-text-field
							maxlength="50"
              flat
              outlined
              v-model.trim="email"
              label="E-mail"
              required
          ></v-text-field>

          <v-text-field
              flat
              outlined
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Passsword"
              hint="At least 8 characters"
              counter
              @click:append="show1 = !show1"
          ></v-text-field>

          <v-btn
              block
              depressed
              color="primary"
              class="mr-4 text-capitalize font-weight-bold"
              @click="Signup"
          >
            Signup
          </v-btn>
          <br/>
          <v-btn
              block
              depressed
              class="mr-4 text-capitalize primary--text font-weight-bold"
              :style="{
              'background-color': 'white',
              'text-transform': 'none',
              border: '2px solid ' + primary,
            }"

          >
            Signup with google
          </v-btn>
        </v-form>
      </v-col>
    </v-container>


  </v-card-text>
</template>
<script>
import {ref} from '@vue/composition-api'

export default {
  setup(props, context) {
    // const $router = context.root.$router
    const $auth = context.root.$auth
    const primary = context.root.$vuetify.theme.themes.light.primary;
    const email = ref('')
    const password = ref('')
    const Signup = function () {
      $auth.createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            // $router.replace('/dashboard')
          })
    }
    const show1 = ref(false)
    return {
      primary,
      email,
      password,
      show1,
      Signup
    };

  },
};
</script>