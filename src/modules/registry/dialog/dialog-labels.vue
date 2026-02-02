<template>
  <div>
    <v-dialog v-model="dialog" max-width="800">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
            <p class="fz-18 font-weight-bold mb-0">
              {{ type == "create" ? "ADD NEW LABELS" : "UPDATE NEW LABELS" }}
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Label Name</p>
          <v-text-field
            v-model="label"
            outlined
            placeholder="Label Name"
            :error-messages="$v.label.$errors.length ? $v.label.$errors[0].$message : ''"
          />
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Color</p>
          <v-color-picker
            dot-size="30"
            hide-inputs
            swatches-max-height="200"
            v-model="picker"
          ></v-color-picker>
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Description</p>
          <v-text-field
            v-model="desc"
            outlined
            placeholder="Description"
            :error-messages="$v.desc.$errors.length ? $v.desc.$errors[0].$message : ''"
          />
        </v-card-text>
        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="#CDCDCD"
                depressed
                block
                height="35"
                 @click="() => {
                            dialog = false
                            $emit('input', false);
                        }"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="primary"
                depressed
                block
                height="35"
                @click="onConfirm"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "../namespace";
import { ref,computed,onMounted } from "@vue/composition-api";
// import dialogConfirmDelete from "./dialog-confirm-delete.vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  props: ["value", "type", "item","projectid"],
  setup(props, { emit }) {
    const { createLabels,updateLabels } = useNamespacedActions(REGISTRY, ["createLabels","updateLabels"]);
    const dialog = computed({
        get: () => props.value,
        set: (val) => {
            if(!val){
                emit('clearItem', {})
            }
            emit("input", val);
            
        },
    });
    const picker = ref("");
    const label = ref("");
    const desc = ref("");
    const content_error = ref("")
 
    const onConfirm = async () => {
      $v.value.$touch();
      // console.log("==>",picker.value)
      content_error.value = $v.value.$errors.length ? "value is required" : ""
      if ($v.value.$errors.length) return;
      if(props.type=="create"){
        const params = {
          description: desc.value,
          color: picker.value.hex,
          scope: "p",
          name: label.value,
        };
        createLabels(params);
      }
      else if(props.type=="update"){
        
        var descriptions=desc.value
        if(picker.value.hex){
          var colors=picker.value.hex
        }
        else{
          var colors=picker.value
        }
          var names=label.value

        const params = { 
          description: descriptions,
          color: colors,
          scope: "p",
          name: names,
          id:props.item.id,
          project_id:props.item.project_id,
        };
        // console.log("=============params============", params)
        updateLabels(params);
      }      
      dialog.value = false
    }
    function onCancel() {
      $v.value.$reset();
      dialog.value = false
    }
    
    const $v = useVuelidate(
          {
              label: { required,},
              desc: { required,}
          },
          { 
              label,
              desc,
          }
      )
    onMounted(() => {
      // console.log("onMounted",props.item.project_id)
      // console.log("onMounted",props)
      picker.value =props.item.color
      label.value =props.item.name
      desc.value =props.item.description
    })
    return {
      dialog,
      onCancel,
      onConfirm,
      picker,
      desc,
      label,
      $v,
      content_error,
      createLabels,
      updateLabels,
      // updateLabel,
      // updateDesc,
      // updatePicker,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>