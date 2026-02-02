<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="pb-7">
        <div class="headline font-weight-bold font--text">
          Advanced CORS Options
        </div>
      </v-card-title>
       <v-card-text >
        <p class="font-weight-bold">Bucket Name</p>
        <v-text-field 
          maxlength="50" 
          outlined 
          placeholder="Bucket Name"
          v-model="bucketName"
          readonly
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Origin</p>
        <p>Origin must include http or https and a valid domain</p>
        <v-text-field 
          maxlength="50" 
          outlined 
          placeholder="http://example.com" 
          v-model="AllowedOrigin"
          :error-messages="$v.AllowedOrigin.$errors.length ? $v.AllowedOrigin.$errors[0].$message : ''"
        ></v-text-field>
      </v-card-text>
      <v-card-text class="pb-0">
        <p class="font-weight-bold">Allowed Methods
          <small style="font-weight:normal;" class="error--text" v-if="$v.AllowedMethod.$errors.length">* {{ $v.AllowedMethod.$errors.length ? $v.AllowedMethod.$errors[0].$message : '' }}</small>
        </p>
        <v-row style="margin-top:-35px">
          <v-col>
            <v-checkbox 
              v-model="AllowedMethod" 
              value="GET" 
              label="GET"
            ></v-checkbox>
          </v-col>
          <v-col><v-checkbox 
            v-model="AllowedMethod" 
            value="PUT" 
            label="PUT"
          ></v-checkbox></v-col>
          <v-col>
            <v-checkbox 
              v-model="AllowedMethod" 
              value="DELETE" 
              label="DELETE"
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox 
              v-model="AllowedMethod" 
              value="POST" 
              label="POST"
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox 
              v-model="AllowedMethod" 
              value="HEAD" 
              label="HEAD"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text >
        <p class="font-weight-bold">Allowed Headers</p>
        <v-text-field 
          maxlength="50" 
          outlined 
          placeholder="Header Name" 
          v-model="AllowedHeader"
          :error-messages="$v.AllowedHeader.$errors.length ? $v.AllowedHeader.$errors[0].$message : '' "
        ></v-text-field>
      </v-card-text>
     


      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn depressed
              height="50"
              color="accent"
              block
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn depressed
              height="50"
              color="secondary"
              block
              @click="create"
            >
              Save Option
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import { useObjectStorage } from "./composableapi/useobjectstorage";
const useVuelidate = require("@vuelidate/core").default;
const { required, requiredIf, helpers } = require("@vuelidate/validators");
import { ref } from "@vue/composition-api"

export default {
  props: ['value', 'objectStorageID','bucketName'],
  setup (props, context) {

    const Composable = {
      ...useObjectStorage()
    };

    const AllowedOrigin = ref('')
    const AllowedMethod = ref([])
    const AllowedHeader = ref('')

    const $v = useVuelidate({
      AllowedOrigin: { required },
      AllowedMethod: { required },
      AllowedHeader: { required },  
    }, {
      AllowedOrigin,
      AllowedMethod,
      AllowedHeader,
    })

    const create = async () => {
      $v.value.$touch()
      if ($v.value.$invalid) return false;
      const payload = {
        AllowedOrigin: AllowedOrigin.value,
        AllowedMethod: AllowedMethod.value,
        AllowedHeader: AllowedHeader.value,
      }
      context.emit('addRule', payload)
      AllowedOrigin.value = ''
      AllowedMethod.value = []
      AllowedHeader.value = ''
      $v.value.$reset()
    }

    return {
      ...Composable,
      $v,
      AllowedOrigin,
      AllowedMethod,
      AllowedHeader,
      create,
    };
  },
  computed: {
    dialog: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("close", val);
      },
    },
  },
};
</script>

<style scoped lang="scss">
button {
  ::v-deep .v-btn__content {
    font-size: 14px;
  }
}
.v-input--checkbox {
  ::v-deep label {
    font-size: 12px;
  }
}
</style>
