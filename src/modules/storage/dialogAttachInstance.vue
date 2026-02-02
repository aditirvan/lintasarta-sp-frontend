<template>
  <v-dialog v-model="dialog"  max-width="500">
    <v-card>
      <v-card-title class="pb-7" > 
      <div class="headline font-weight-bold font--text">Attach to Instance</div>
</v-card-title>
      <v-card-text>
        <p class="font-weight-bold">Choose a Instance</p>
        <v-autocomplete
          id="SelectInstance"
          v-model="instanceselected"
          outlined
          :items="instancesAll"
          placeholder="Select an Instance"
          
        >
        <template v-slot:selection="{ item }">
          {{ item.text }}
        </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              height="50"
              color="accent"
              block
              depressed
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
            <v-btn
              depressed
              height="50"
              color="secondary"
              block
              :disabled="!instanceselected"
              @click="
                () => {
                  if(instanceselected){
                  $emit('confirm',instanceselected)
                  $emit('close');  
                  }
                  
                }
              "
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useCreatedInstance } from "../instance/compositionapi/usecreatedinstance";
import { onMounted } from '@vue/composition-api'
export default {
  props: ["value"],
  setup(){
    const Composable = useCreatedInstance()
    const { fetchinstances } = Composable
    
    onMounted(() => {
      fetchinstances({limit: 999})
    })
    return {
      ...Composable
    }
  },
  created(){
  },
  computed:{
    dialog:{
      get:function(){
        return this.value
      },
      set:function(val){
        this.$emit('close',val)
      }
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