<template>
  <div>
    <v-dialog persistent v-model="closeDialog" max-width="500">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <v-icon left>mdi-plus-box</v-icon>
            <p class="fz-18 font-weight-bold mb-0"> Add Labels</p>
            <v-spacer></v-spacer>
            <v-icon left @click="() => { $emit('update:closeDialog', false) }">mdi-close</v-icon>
          </div>
        </v-card-text>
        <v-card-text>
          <div class="text-center mt-2">
            <v-select
              v-model="dataSelected.labels"
              :items="itemsLsbels"
              label="Select Labels"
              item-text="name"
              item-value="id"
              multiple
              @change="setLabels($event)"
            ></v-select>
          </div>
        </v-card-text>
        <!-- <v-card-text>
          <v-row class="d-flex justify-end"> -->
            <!-- <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="#CDCDCD"
                depressed
                block
                height="35"
                @click="onCancel()"
              >
                Cancel
              </v-btn>
            </v-col> -->
            <!-- <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="primary"
                depressed
                block
                height="35"
                @click="onConfirm()"
              >
                Add
              </v-btn>
            </v-col> -->
          <!-- </v-row>
        </v-card-text> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { ref, onMounted, watch } from "@vue/composition-api";
import { REGISTRY } from "../namespace";
import { async } from "@firebase/util";
export default {
  props: {
    closeDialog: {
      type: Boolean,
      default: false,
    },
    dataSelected: {
      type: Object,
      default: () => {},
    },
    selecteds: {
      type: Object,
      default: () => {},
    },
    parameter: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    onMounted(async () => {

      const params = new URLSearchParams();
      params.append("page_size", 100);
      params.append("page",1);
      const payload = {
        param: params
      }
      await getListLabels(payload);
      itemsLsbels.value=listLabels.value
      // console.log("=======itemsLsbels dialog==========",itemsLsbels)
    });

    const itemsLsbels = ref([]);
      // // console.log("=======dataSelected.labels==========",dataSelected.labels)
      // console.log("=======props3==========",props)
      const digest=props.dataSelected.digest
      // console.log("=======labels==========",digest)
    // const selectLabels= ref([]);
    const {getListLabels,getDeletelabeling,getAddlabeling } =
      useNamespacedActions(REGISTRY, [
        "getListLabels","getDeletelabeling","getAddlabeling",
      ]);
      
    const { isLoading, listLabels } =
      useNamespacedGetters(REGISTRY, [
        "isLoading",
        "listLabels",
      ]);
      
    function setLabels(event){
      // console.log("=======props.selecteds==========",props.selecteds)
      
      for (const [key, value] of Object.entries(props.selecteds)) {
        // console.log(`${value}:`,event.includes(value));
        if(event.includes(value)!=true){
          this.$emit("update:closeDialog", false);
          const params = {
            name: props.parameter.name,
            project:props.parameter.project,
            digest:props.dataSelected.digest,
            id: value,
          };
          // console.log("=======setLabels params==========",params)
          getDeletelabeling(params)
          break
        }
      }
      event.forEach((val, index) => {
        // var valObj = props.selecteds.filter(function(elem){
        //     if(elem.id == value) return elem.Value;
        // });
        var x=0
        for (const [key, value] of Object.entries(props.selecteds)) {
          if(val==value){
            x++;
            // console.log(x)
          }
        }
        if(x==0){
          // console.log("forEach new value : ",val)
          this.$emit("update:closeDialog", false);
          const params = {
            name: props.parameter.name,
            project:props.parameter.project,
            digest:props.dataSelected.digest,
            body:{id: val},
          };
          // console.log("=======setLabels params==========",params)
          getAddlabeling(params)
          // break
        }
      });
       // console.log(event)
    };
      // // console.log("=======props.dataSelected.labels==========",props.dataSelected.labels)
      // selectLabels.value=props.dataSelected.labels
      // // console.log("=======selectLabels dialog==========",selectLabels)
    function onConfirm() {
      // this.$emit("update:closeDialog", false);
      // // console.log("=======props==========",props)
      
      // getListLabels()
      //   const params = {
      //     name: props.dataDelete.name,
      //     project: props.dataDelete.project,
      //     digest:props.dataDelete.digest,
      //   };
      //   getDeleteArtifact(params)
     
    }
    function onCancel() {
      this.$emit("update:closeDialog", false);
    }
    return {
      // props,
      onCancel,
      onConfirm,
      listLabels,
      getListLabels,
      setLabels,
      itemsLsbels,
      getDeletelabeling,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>