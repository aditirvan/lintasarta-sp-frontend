<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Edit User</div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Full Name</p>
        <v-text-field
        maxlength="50"
          disabled
          v-model="membername"
          placeholder="Enter Name"
          flat
          outlined
          :error-messages="createErrorMessage('membername')"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Email</p>
        <v-text-field
          maxlength="50"
          disabled
          v-model.trim="emailmember"
          placeholder="Enter Email"
          flat
          outlined
          :error-messages="createErrorMessage('emailmember')"
        ></v-text-field>
      </v-card-text>
        <v-card-text>
        <p class="titletext">Phone Number</p>
        <v-text-field
            v-mask="[/[1-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/,' ' ,/[0-9]/, /[0-9]/, /[0-9]/]"
            flat
            outlined
            v-model="phone_number"
            placeholder="Phone Number"
            required
            prefix="+62"
            style="margin-bottom: 22px"
            :error-messages="createErrorMessage('phone_number')"
          ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Select Project</p>
        <v-select
          v-model="projectsselected"
          :error-messages="createErrorMessage('projectsselected')"
          :items="selectprojects"
          placeholder="Select Project"
          outlined
          multiple
          flat
        ></v-select>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Select Role</p>
        <v-select
          v-model="roleselected"
          :error-messages="createErrorMessage('roleselected')"
          :items="selectroles"
          placeholder="Select Role"
          flat
          outlined
        ></v-select>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col
            ><v-btn depressed height="45" block class="accent"
            @click="()=>{
                dialog = false
                }"
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn
              depressed
              height="45"
              block
              class="secondary"
              @click="addMember"
              >Save</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useMember } from "./usemember";
import { useProjects } from '../project/useprojects';
import { useRoles } from './userole';
import { useDialog } from '@/composable/usedialog';
import {useNamespacedMutations,useNamespacedState,} from 'vuex-composition-helpers'
import { onMounted,ref } from '@vue/composition-api';
const { required , email} = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;


export default {
  props: ["value",'memberselectedvalue'],
  setup(props, {emit}) {
    const { userrole } = useNamespacedState("ROLEPERMISSION", ["userrole"]);
    const {dialog} = useDialog(props, {emit})
    const Composable = {
      ...useMember(),
      ...useProjects(),
      ...useRoles()
    }
    const {editmember, fetchRoles} = Composable
    onMounted(()=>{
      fetchRoles({page:1, itemsPerPage:-1})
    })
    const { membername, emailmember,selectroles, projectsselected,roleselected, fetchmembers, phone_number } = Composable
    phone_number.value = props.memberselectedvalue.phone_number.replace("+62", "")
    membername.value = props.memberselectedvalue.fullname
    emailmember.value = props.memberselectedvalue.email
    if(userrole.value=='Superadmin'){
      projectsselected.value = props.memberselectedvalue.user_project.map(x=>x.project_id)
    }else{
      projectsselected.value = props.memberselectedvalue.user_project.map(x=>x.id)
    }
    roleselected.value = props.memberselectedvalue.organization_role_id
    console.log(props.memberselectedvalue)
    const $v = useVuelidate({
      phone_number: {required},
      membername: {},
      emailmember: {},
      projectsselected: {required},
      roleselected: {required}
    },{
      phone_number,
      membername,emailmember,projectsselected,roleselected
    })
    function createErrorMessage(element) {
      return $v.value[element].$errors.length
        ? $v.value[element].$errors[0].$message
        : "";
    }
    const {
      setopendialogcommonsuccess,
      setopendialogcommonwarning,
      setmessagecommonwarning,
    } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
      "setopendialogcommonwarning",
      "setmessagecommonwarning",
    ]);
    const role_name = ref('');
    const role_id = ref('');
    
    const addMember = async()=>{
      selectroles.value.forEach((k) => {
        if(roleselected.value==k.value){
          role_name.value=k.text;
        }
      });
      if(role_name.value=='Owner'){
        role_id.value=1;
      }else{
        role_id.value=2;
      }

      $v.value.$touch()
      if($v.value.$invalid) return
      
      let oldprojects="";
      if(userrole.value!='Superadmin'){
        oldprojects = props.memberselectedvalue.project.map(x=>x.id )
      }else{
        oldprojects = props.memberselectedvalue.user_project.map(x=>x.project.id)
      }
      const newprojects = projectsselected.value.filter(x => !oldprojects.includes(x));
      const deletedproject = oldprojects.filter(x => !projectsselected.value.includes(x));
      let currentproject = newprojects.map(x=>({project_id:x, status:"add"}))
      currentproject = currentproject.concat(deletedproject.map((x)=>({project_id:x, status:"delete"}))) 
      const Value = {
        role_id: role_id.value,
        phone_number : "+62"+ phone_number.value.replaceAll(" ",''),
        id: props.memberselectedvalue.id,
        projects: currentproject,
        organization_role_id: roleselected.value,
      }
      return await editmember(Value).then(()=>{
        dialog.value = false
        emit('updated')
        setopendialogcommonsuccess(true)
      }).catch(err => {
        dialog.value = false
        emit('updated')
        if (!err.response){
          setmessagecommonwarning("internal server error")
        }
        if (err.response.status >= 400 && err.response.status < 500){
          let msg = err.response.data.data;
          setmessagecommonwarning(msg)
        }else if (err.response.status >= 500){
          setmessagecommonwarning("internal server error")
        }
        setopendialogcommonwarning(true)
      })
    }
    return {
      ...Composable,
      dialog,
      addMember,
      createErrorMessage,
      userrole
    };
  },
  created(){
    const params = {
      itemsPerPage: 999,
    }
    this.fetchprojects(params);
  }
};
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
}
.v-input--is-disabled{
::v-deep .v-input__slot{
  background: #F2F2F2
}
}
</style>
