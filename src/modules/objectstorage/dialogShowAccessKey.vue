<template>
  <v-dialog v-model="dialog"  max-width="500">
    <v-card v-if="accessKey">
      <v-card-title class="pb-7" > 
        <div class="headline font-weight-bold font--text">Your New Access Key</div>
      </v-card-title>
      <v-card-text>
        <p class="font-weight-bold">Access Key ID</p>
        <v-text-field
          id="accessKeyID"
          maxlength="50"
          :value="accessKey.access_key"
          outlined
          filled
          readonly
          flat
          solo
          hide-details
          class="v-input-append"
        >
          <template v-slot:append>
            <v-btn depressed
              @click="copyText('accessKeyID')"
              class="secondary"
              width="100"
              height="56"
              style="position: relative; right: -12px;border-radius: 0 4px 4px 0"
              >Copy</v-btn
            >
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Secret Access Key</p>
        <v-text-field
          id="secretAccessKey"
          maxlength="50"
          :value="accessKey.secret_access_key"
          outlined
          filled
          readonly
          flat
          solo
          hide-details
          class="v-input-append"
        >
          <template v-slot:append>
            <v-btn depressed
              @click="copyText('secretAccessKey')"
              class="secondary"
              width="100"
              height="56"
              style="position: relative; right: -12px;border-radius: 0 4px 4px 0"
              >Copy</v-btn
            >
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="12">
            <v-btn depressed
              height="50"
              color="secondary"
              block
              @click="
                () => {
                  $emit('close')
                }
              "
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

import { ref } from '@vue/composition-api'
export default {
  props: ['value', 'accessKey'],
  computed:{
    dialog:{
      get:function(){
        return this.value
      },
      set:function(val){
        this.$emit('close', val)
      }
    }
  },
  setup(props, context) {
    const copyText = (id) => {
      var copyText = document.getElementById(id);

      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */

      /* Copy the text inside the text field */
      document.execCommand("copy");
      context.root.$store.dispatch('HOMEPAGE/showSuccessToast', 'Copied to clipboard', { root: true })
    }

    return {
      copyText
    }
  }
};
</script>
<style scoped lang="scss">
  button{
    ::v-deep .v-btn__content{
    font-size: 14px;
  }
}

</style>