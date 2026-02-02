<template>
  <v-dialog v-model="dialog"  max-width="500">
    <v-card>
      
      <v-card-title class="pb-7" > 
                        <div class="headline font-weight-bold font--text">Attach to Instance</div>
</v-card-title>
      <v-card-text>
        <p class="font-weight-bold">Choose a Instance</p>
        <v-select
                  id="SelectInstance"
                  v-model="projectselected"
                  outlined
                  :items="selectprojects"
                  placeholder="Select Project"
                  
                >
                </v-select>
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
              :disabled="!projectselected"
              @click="
                () => {
                  if(projectselected){
                  $emit('confirm',projectselected)
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
import { useProjects } from '../project/useprojects'
export default {
  props: ["value"],
  setup(){
    const Composable = {
        ...useProjects()
        }
    return {
      ...Composable
    }
  },
  created(){
    this.fetchprojects()
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