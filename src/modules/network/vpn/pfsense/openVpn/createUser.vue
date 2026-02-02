<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex flex-row align-center">
        <p class="fz-18 mb-0" style="font-weight: 600">
          Create User OpenVPN
        </p>
        <v-spacer />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Username</p>
        <!-- <v-text-field
        v-model="rule.username"
        maxlength="50"
        placeholder="Username"
        single-line
        outlined
        @change="() => {
          $emit('dataRule', { name: 'create_user', username: rule.username })
        }"
        :error-messages="$v.rule.username.$errors.length?$v.rule.username.$errors[0].$message:''"
        ></v-text-field> -->
        <v-text-field
        :value="value.username"
        maxlength="50"
        placeholder="Username"
        single-line
        outlined
        @input="value.username = $event"
        :error-messages="$v.value.username.$errors.length?$v.value.username.$errors[0].$message:''"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Password</p>
        <!-- <v-text-field
        v-model="rule.password"
        maxlength="50"
        placeholder="Password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        @click:append="show1 = !show1"
        single-line
        outlined
        @change="() => {
          $emit('dataRule', { name: 'create_user', password: rule.password })
        }"
        :error-messages="$v.rule.password.$errors.length?$v.rule.password.$errors[0].$message:''"
        ></v-text-field> -->
        <v-text-field
        :value="value.password"
        maxlength="50"
        placeholder="Password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        @click:append="show1 = !show1"
        single-line
        outlined
        @input="value.password = $event"
        :error-messages="$v.value.password.$errors.length?$v.value.password.$errors[0].$message:''"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Confirm Password</p>
        <!-- <v-text-field
        v-model="rule.confirm_password"
        maxlength="50"
        placeholder="Password"
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show2 ? 'text' : 'password'"
        @click:append="show2 = !show2"
        single-line
        outlined
        @change="() => {
          $emit('dataRule', { name: 'create_user', confirm_password: rule.confirm_password })
        }"
        :error-messages="$v.rule.confirm_password.$errors.length?$v.rule.confirm_password.$errors[0].$message:''"
        ></v-text-field> -->
        <v-text-field
        :value="value.confirm_password"
        maxlength="50"
        placeholder="Password"
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show2 ? 'text' : 'password'"
        @click:append="show2 = !show2"
        single-line
        outlined
        @input="value.confirm_password = $event"
        :error-messages="$v.value.confirm_password.$errors.length?$v.value.confirm_password.$errors[0].$message:''"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Expiration date</p>
        <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
          <v-text-field
          v-model="dateFormatted"
          label="Choose a Date"
          readonly
          v-bind="attrs"
          v-on="on"
          outlined
          :error-messages="$v.value.expires.$errors.length?$v.value.expires.$errors[0].$message:''"
          ></v-text-field>
          </template>
          <v-date-picker
          :min="next_month"
          :value="value.expires"
          @input="value.expires = $event"
          @change="menu2 = !menu2"
          color="primary"
          ></v-date-picker>
          <!-- @change="() => {
            $emit('dataRule', { name: 'create_user', expires: rule.expires })
          }" -->
        </v-menu>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold">Description</p>
        <v-text-field
        :value="value.descr"
        outlined
        name="input-7-4"
        placeholder="Description"
        @input="value.descr = $event"
        :error-messages="$v.value.descr.$errors.length?$v.value.descr.$errors[0].$message:''"
        ></v-text-field>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
import moment from 'moment'
import { computed, ref } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core'
import {required, requiredIf, maxValue, sameAs, helpers, minLength} from '@vuelidate/validators'

export default {
  props: ["value","rule"],
  setup(props, context) {
    const next_month = moment(new Date()).format('YYYY-MM-DD')

    const $v = useVuelidate({
      value: {
        username:{ 
          $autoDirty: true,
          required,
          conditional: {
            $message: "Special character is not allowed",
            $validator: (val) => {
              return /^[A-Za-z0-9/\s/g\-]+$/g.test(val);
            },
          },
        },
        password: {
          required,
          $autoDirty: true,
          minLength: minLength(8),

        },
        confirm_password:{
          $autoDirty: true,
          required,
          confirm: helpers.withMessage(
            "The value must be the same as the password",
            val => { 
              let valid = true
              if(val != props.value.password){
                valid = false
              }
              
              return valid
            }
          ) 
        },
        expires:{ required },
        // descr: { required }
      }
    },
    {
      value: props.value
    })

    const formatDate = (date) => {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
    const parseDate = (date) => {
        if (!date) return null
        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
      
    const dateFormatted = computed(() => {
      return formatDate(props.value.expires)
    })
    
    
    return {
      $v,
      show1: ref(false),
      show2: ref(false),
      menu2: ref(false),
      next_month,
      dateFormatted,
      parseDate,
    }
  },
}
</script>
