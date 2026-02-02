<template>
  <v-dialog  persistent max-width="500" v-model="dialog">
    <v-card>
      <v-toolbar
          color="default"
        >
        
          <v-toolbar-title>Are you absolutely suresss?</v-toolbar-title>
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
          <b>{{ project.name }}</b> repository, wiki, issues, comments, packages,
          secrets, workflow runs, and remove all team assosiations.
        </p>
        <p>
          This will not change your billing plan. If you want to downgrade, you
          can do so in your Billing Settings.
        </p>
        <p>
          Please type <b>{{ project.name }}</b> to confirm
        </p>
      </v-card-text>
      <v-card-text>
        <v-text-field :error-messages="$v.inputprojectname.$errors.length > 0 ? $v.inputprojectname.$errors[0].$message:''" v-model="inputprojectname" outlined></v-text-field>
        <v-btn @click="()=>Iunderstand()" depressed class="error" block
          >I understand the consequences, delete this repository</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { defineComponent, ref } from "@vue/composition-api";
import { useDialog } from "@/composable/usedialog";
import {
  useGetters,
  useMutations,
  useNamespacedMutations,
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";

import {required} from '@vuelidate/validators'
import { PROJECT } from "./namespace";
import { SUPERADMINMANAGEORG } from "@/modules/superadmin-manageorganization/namespace";
import useVuelidate from "@vuelidate/core";
import localstorage from "@/lib/localstorage";
export default defineComponent({
  props: ["value", "project"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    const { deleteproject } = useNamespacedActions(PROJECT, ["deleteproject"]);
        const { setprojectname,setCurrentProj } = useNamespacedMutations(PROJECT, [
      "setprojectname","setCurrentProj",
    ]);

    const { fetchprojects, fetchorganization } = useNamespacedActions(
      SUPERADMINMANAGEORG,
      ["fetchprojects", "fetchorganization"]
    );

    const inputprojectname = ref("");
    const $v = useVuelidate(
      {
        inputprojectname: {required, conditional:{
            $message:'wrong input',
            $validator:(val)=>{
                return val == props.project.name
            }
        }},
      },
      { inputprojectname }
    );

    return {
        $v,
      setprojectname,
      setCurrentProj,
      inputprojectname,
      Iunderstand: async () => {
          $v.value.$touch()
          if($v.value.$errors.length) return
        return deleteproject(props.project)
          .then(() => {
            localStorage.removeItem('projectname');
            localStorage.removeItem('projectid');
            localStorage.removeItem('currentProj');
            setprojectname('');
            setCurrentProj('');
            dialog.value = false;


            if (localStorage.getItem("role") == "Superadmin") {
              const currentOrg = JSON.parse(localStorage.getItem('currentOrg') || '{}')
              if (currentOrg) {
                fetchprojects({ id: currentOrg.id, itemsPerPage: 10 });
                context.root.$router.replace(`/organization-detail/` + currentOrg.id);
                
              } else {
                context.root.$router.replace(`/`);  
              }
            } else {
              context.root.$router.replace(`/project`);
            }
            
          })
          .catch((e) => {
            context.emit("error", e.response);
          });
      },
      dialog,
    };
  },
});
</script>
