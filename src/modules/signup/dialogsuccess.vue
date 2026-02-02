<template>
    <v-dialog
      v-model="value"
      persistent
      max-width="500"
    >
      
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-4">mdi-checkbox-marked-circle</v-icon>Success
        </v-card-title>
        <v-card-text class="pb-0">
          <p class="font-weight-bold">Registration Success!</p>
          <p>We already sent email confirmation to <strong>{{ email }}</strong>. Please check your email to continue the registration.</p>
          </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            
            <v-col>
              <v-btn
            color="primary"
            block
            @click="()=>{$emit('close')}"
          >
            Close
          </v-btn>
            </v-col>
          </v-row>
          
          
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
    props:['value', 'email']
}
</script>