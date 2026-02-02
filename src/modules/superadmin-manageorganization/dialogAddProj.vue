<template>
  <v-dialog v-model="dialog" width="550">
    <v-card color="basil" class="pa-7" flat>
      <v-card-text class="pa-1">
        <p class="font-weight-bold" style="font-size: 12px">Project Name</p>
        <v-text-field
          id="projname"
          outlined
          class="mb-3"
          maxlength="30"
          placeholder="Enter Name"
          v-model="projname"
          :error-messages="createErrorMessage('projname')
          "
        >
       
        </v-text-field>
        <p class="font-weight-bold" style="font-size: 12px">
          Description Project
        </p>
        <v-textarea
          id="projdesc"
          maxlength="255"
          outlined
          v-model="projdesc"
          :error-messages="createErrorMessage('projdesc')
          "
          placeholder="Enter Description"
        ></v-textarea>
      </v-card-text>
      <v-card-text class="pa-1">
        <v-row>
          <v-col>
            <v-btn
              depressed
              @click="
                () => {
                  dialog = false;
                }
              "
              height="50"
              block
              color="accent"
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col>
            <!-- <v-btn
              id="CreateProj"
              depressed
              height="50"
              @click="()=>{submitproj().then((e)=>{
                $emit('added')
                dialog = false
              })}"
              block
              color="secondary"
              >Create</v-btn
            > -->
            <v-btn
                id="CreateProj"
                depressed
                height="50"
                block
                class="rounded-lg secondary"
                @click="()=>{submitproj()}"
                color="secondary"
                >Create</v-btn
              >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <dialogfailcreate :message="messagefailcreate" v-model="opendialogfailcreate" />
  </v-dialog>
</template>
<script >
import { useDialog } from "@/composable/usedialog";
import dialogfailcreate from "../project/dialogFailCreate";
import { defineComponent } from "@vue/composition-api";
import { useUser } from "../superadmin-manageuser/useUser";
// import { useaddproj } from "../superadmin/useaddproj";
import {computed, ref} from '@vue/composition-api'
import { required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import { useNamespacedState, useNamespacedActions, useNamespacedMutations } from 'vuex-composition-helpers'
//import {State} from '../organization/organization.store'
import { SUPERADMINMANAGEORG } from '../superadmin-manageorganization/namespace'
import { SUPERADMIN } from '../superadmin/namespace'

export default defineComponent({
  components: { dialogfailcreate },
  props: ["value"],
  setup(props, context) {

    const { dialog } = useDialog(props, context);
    const projname = ref('')
    const org = ref()
    const projdesc = ref('')
    //const projorgname = ref('')
    //const { organizations } = useNamespacedState<any>(SUPERADMINMANAGEORG,['organizations'])
    const { fetchorganizations, addproject } = useNamespacedActions(SUPERADMINMANAGEORG,['fetchorganizations','addproject'])


    const $v = useVuelidate(
      {
        projname: {
            required, alpha: {
                $message: 'value must alpha or alphanumeric',
                $validator:(v)=>{
                    let val = v 
                    return /^[a-zA-Z0-9- ]+$/.test(val)
                }
            }
        },
        projdesc: { required }
      },
      {
        projname,
        projdesc,
      }
    );

    function createErrorMessage(element) {
      return $v.value[element].$errors.length
        ? $v.value[element].$errors[0].$message
        : "";
    }

    const projnameErrors = computed(()=>{
        return $v.value.projname.$errors
    })
    const projdescErrors = computed(()=>{
        return $v.value.projdesc.$errors
    })
    const {currentOrg} = useNamespacedState(SUPERADMIN,['currentOrg'])
    const {
        setopendialogcommonsuccess,
      } = useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonsuccess",
      ]);

      const opendialogfailcreate = ref(false);
      const messagefailcreate = ref('')


    const submitproj = async()=>{
        $v.value.$touch()
        console.log($v.value)
        if($v.value.$errors.length) return Promise.reject("error")
        let org = currentOrg.value
        const Value = {
            name: projname.value,
            description: projdesc.value,
            organization_id: org.id
        }
        await addproject(Value)
        .then((e)=>{
            context.emit('added');
            dialog.value = false;
            projname.value='';
            projdesc.value='';
            setopendialogcommonsuccess(true)
        })
        .catch((e) => {
            const { data } = e.response.data;
            dialog.value = false;
            console.log(data);
            messagefailcreate.value = 'project already exist, please create with another name';
            opendialogfailcreate.value = true;
            //alert('project already exist, please create with another name');
            projname.value='';
            projdesc.value='';
            //if(!e.response) return
            //const { data } = e.response.data;
           
            
        });
        
      }
    
   

    return {
      dialog,projname,createErrorMessage, projdesc, submitproj,opendialogfailcreate,messagefailcreate,
        projnameErrors, projdescErrors,
    };
  },
});
</script>
