<template>
  <v-dialog persistent max-width="500" v-model="value">
    <v-card>
        <v-toolbar
          color="default"
        >
        
          <v-toolbar-title>Are you absolutely sure?</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
              <v-btn
                icon
                color="primary"
                @click="dialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        
      <!-- <v-card-title> Are you absolutely sure? </v-card-title> -->
     
      <v-card-text
        class="mb-2"
        style="
          border-top: 1px solid #ffc107;
          border-bottom: 1px solid #ffc107;
          background-color: rgba(255, 193, 7, 0.1);
        "
      >
        <div class="mt-4">
          <span class="warning--text"
            >Unexpected bad things will happen if you don't read this!</span
          >
        </div>
      </v-card-text>
      <v-card-text>
        <p>
          This action cannot be undone. This will permanently delete the
          <b>{{currentProj.name}}</b> repository, wiki, issues, comments, packages,
          secrets, workflow runs, and remove all team assosiations.
        </p>
        <!-- <p>
          This will not change your billing plan. If you want to downgrade, you
          can do so in your Billing Settings.
        </p> -->
        <p>
          Please type <b>{{currentProj.name}}</b> to confirm
        </p>
      </v-card-text>
      <v-card-text>
        <v-text-field :error-messages="$v.inputorgname.$errors.length > 0 ? $v.inputorgname.$errors[0].$message:''" v-model="inputorgname" outlined></v-text-field>
        <v-btn @click="()=>Iunderstand()" depressed class="error" block
          >I understand the consequences, delete this Deka AST</v-btn
        >
      </v-card-text>
    </v-card>
    <router-link
  id="buttonCancel"
  height="58"
  tag="button"
  depressed
  block
  :to="`/organization-detail/${curOrg.id}`"
  style="display: none;"
  >
  Cancel
  </router-link>
  </v-dialog>
</template>
<script>
import { defineComponent, ref } from "@vue/composition-api";
import { useDialog } from "@/composable/usedialog";
import { useNamespacedActions } from "vuex-composition-helpers";
import {required} from '@vuelidate/validators'
import { I3GIS} from "../sast/namespace";
import useVuelidate from "@vuelidate/core";
export default defineComponent({
  props: ["value", "project"],
  setup(props, context) {
    const projectName = ref("");
    const { dialog } = useDialog(props, context);
    const { deleteLimitI3gis } = useNamespacedActions(I3GIS, ["deleteLimitI3gis"]);
    const inputorgname = ref("");
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const curOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const userId = JSON.parse(localStorage.getItem("userId"));
    const reqData={
      organization_id:curOrg.id,
      project_id:currentProj.id,
      user_id:userId,
    }
    
    console.log("selected value ",props.value);

    console.log("selected project ",props.project);
    const $v = useVuelidate(
      {
        inputorgname: {required, conditional:{
            $message:'wrong input',
            $validator:(val)=>{
                return val == currentProj.name
            }
        }},
      },
      { inputorgname }
    );

    return {
        $v,
      inputorgname,
      Iunderstand: async () => {
          $v.value.$touch()
          console.log($v.value)
          if($v.value.$errors.length) return
        return deleteLimitI3gis(reqData)
          .then(() => {
            dialog.value = false;
                const cancelButton = document.getElementById("buttonCancel");
                if (cancelButton) {
                    cancelButton.click();
                }
          })
          .catch((e) => {
            context.emit("error", e.response);
          });
      },
      dialog,
      currentProj,
      curOrg
    };
  },
});
</script>
