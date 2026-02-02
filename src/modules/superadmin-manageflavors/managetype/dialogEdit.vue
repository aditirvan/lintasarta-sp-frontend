<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Edit New Type</div>
      </v-card-text>
    
       <v-card-text>
        <p class="titletext">Type Name</p>
        <v-text-field
          maxlength="100"
          v-model="name"
          placeholder="Type Name"
          flat
          outlined
          :error-messages="nameErrors.length ? nameErrors[0].$message : ''"
        ></v-text-field>
      </v-card-text>
     
    
      <v-card-text>
      <p class="titletext">Description</p>
      <v-textarea
            rows="5"
            id="description"
            flat
            outlined
            maxlength="255"
            v-model="description"
            placeholder="Description"
            required
            style="margin-bottom: 22px"
            :error-messages="descriptionErrors.length ? descriptionErrors[0].$message : ''"
          ></v-textarea>
      </v-card-text>


      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="
                () => {
                  $emit('input', false);
                }
              "
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn
              id="Update"
              depressed
              height="45"
              block
              class="secondary"
              @click="editType"
              >Update</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useType } from "./useType";
import { ref, computed, watch, onMounted } from "@vue/composition-api";

import { useDialog } from "@/composable/usedialog";
import { useNamespacedMutations } from "vuex-composition-helpers";
//import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import useVuelidate from "@vuelidate/core";
const { required, email: vemail, numeric, minLength } = require("@vuelidate/validators");

export default {
  props: ["value", "typeselectedvalue"],
  setup(props, { emit, root }) {
    const { dialog } = useDialog(props, { emit });
    const Composable = {
      ...useType(),
    };
    

    const name = ref('');
    const description = ref('')

    const {
      editFlavortype,
    } = Composable;

    
    name.value = props.typeselectedvalue.name || "";
    //console.log(name.value);
    description.value = props.typeselectedvalue.description || "";
    console.log(description.value);
    onMounted(() => {
      
    });


    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
       
        description: { required },
      },
      { name, description }
    );
    function createErrors(obj) {
      const key = Object.keys(obj);
      const res = {};
      key.forEach((k) => {
        res[k + "Errors"] = computed(() => {
          return $v.value[k].$errors;
        });
      });
      return res;
    }
    const Errors = createErrors({ name, description});
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);
    return {
      name,
      description,
      ...Composable,
      ...Errors,
      dialog,
      editType: async () => {
        $v.value.$touch();
        if ($v.value.$errors.length) return;
        
        const Value = {
          id: props.typeselectedvalue.id,
          name: name.value,
          description: description.value,
  
        };
        return await editFlavortype(Value).then(() => {
          dialog.value = false;
          emit("updated");
          setopendialogcommonsuccess(true);
        });
      },
    };
  },
  created() {
  },
};
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>