<template>
  <v-dialog
      v-model="value"
      persistent
      max-width="500"
  >

    <v-card class="pt-10">
      <v-card-text style="padding: 0">
        <h1 class="text-center" v-html="title"></h1>
        <p style="font-size: 20px; line-height: 27px; text-align: center; margin-top: 20px; color: #A5B3BF" v-html="message"></p>
      </v-card-text>
      <v-card-actions style="padding: 0">
        <v-row class="ma-2">
          <v-col>
            <v-btn
                color="primary"
                block
                @click="()=>{$emit('close')}"
            >
              OK
            </v-btn>
          </v-col>
        </v-row>


      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ['value', 'title', 'message']
}
</script>