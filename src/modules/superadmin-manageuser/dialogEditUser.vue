<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Edit User</div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Full Name</p>
        <v-text-field
          maxlength="100"
          v-model="name"
          placeholder="Enter Name"
          flat
          outlined
          :error-messages="nameErrors.length ? nameErrors[0].$message : ''"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Phone Number</p>
        <v-text-field
          v-mask="[
            /[1-9]/,
            /[0-9]/,
            /[0-9]/,
            ' ',
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
            ' ',
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
            ' ',
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
          ]"
          v-model="phone"
          prefix="+62"
          placeholder="Enter Phone Number"
          flat
          outlined
          :error-messages="phoneErrors.length ? phoneErrors[0].$message : ''"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Email</p>
        <v-text-field
          maxlength="50"
          v-model.trim="email"
          placeholder="Enter Email"
          flat
          outlined
          disabled
          :error-messages="emailErrors.length ? emailErrors[0].$message : ''"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Select Organization</p>
        <v-autocomplete
          disabled
          :search-input.sync="searchorganization"
          v-model="org"
          :items="organizations"
          outlined
          item-text="name"
          item-value="id"
          placeholder="Select Organization"
          attach="#attach"
          :error-messages="orgErrors.length ? orgErrors[0].$message : ''"
        >
          <template v-slot:append-outer>
            <div id="attach"></div>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Select Projects</p>
        <v-autocomplete
          :search-input.sync="searchprojectbyorg"
          v-model="projectsselected"
          :items="projectcombined"
          outlined
          item-text="name"
          item-value="id"
          placeholder="Select Projects"
          attach="#SelectProjAttach"
          multiple
         
        >
          <template v-slot:append-outer>
            <div id="SelectProjAttach"></div>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Select Role</p>
        <v-select
          v-model="roleselected"
          :items="selectroles"
          placeholder="Select Role"
          flat
          item-value="value"
          item-text="text"
          outlined
        ></v-select>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Status User</p>
        <v-select
          placeholder="Status User"
          flat
          outlined
          v-model="status"
          :items="statusselect"
        ></v-select>
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
              @click="addUser"
              >Update</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useUser } from "@/modules/superadmin-manageuser/useUser";
import { ref, computed, watch, onMounted } from "@vue/composition-api";
import { useRoles } from "@/modules/organization/userole";

import { useDialog } from "@/composable/usedialog";
import { useNamespacedMutations } from "vuex-composition-helpers";
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import useVuelidate from "@vuelidate/core";
const { required, email: vemail, numeric, minLength } = require("@vuelidate/validators");

export default {
  props: ["value", "memberselectedvalue"],
  setup(props, { emit, root }) {
    const { dialog } = useDialog(props, { emit });
    const Composable = {
      ...useUser(),
      ...useRoles(),
    };
    const statusselect = ref([
      { value: "active", text: "Active" },
      { value: "deactive", text: "Inactive" },
    ]);
    const status = ref(props.memberselectedvalue.status)
    const phonemember = ref("");
    const {
      name,
      email,
      phone,
      org,
      role,
      projectsselected,
      fetchprojects,
      projects,
      editmember,
      fetchRoles,
      selectroles,
      roleselected
    } = Composable;
    name.value = props.memberselectedvalue.fullname || "";
    email.value = props.memberselectedvalue.email || "";
    phone.value =
      props.memberselectedvalue.phone_number.replace("+62", "") || "";
    role.value = props.memberselectedvalue.role_id;
    org.value = props.memberselectedvalue.organization_id;
    roleselected.value = props.memberselectedvalue.organization_role_id
    onMounted(() => {
      fetchprojects({
        id: props.memberselectedvalue.organization_id,
        itemsPerPage: -1,
      });
      fetchRoles({ page: 1, itemsPerPage: -1, currentOrg:{id:props.memberselectedvalue.organization_id}});
    });

    const { setorganizations } = useNamespacedMutations(SUPERADMINMANAGEORG, [
      "setorganizations",
    ]);
    setorganizations([props.memberselectedvalue.organization]);
    const projectcombined = computed(() => {
      const userproject = props.memberselectedvalue.userproject.map(
        (x) => x.project
      );
      return userproject.concat(projects.value);
    });
    projectsselected.value = props.memberselectedvalue.userproject.map(
      (x) => x.project.id
    );

    
    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        email: {
          required,
          vemail,
        },
        phone: {
          required,
          custom:{
            $message: "value min 10 number",
            $validator: (val)=>val.replaceAll(' ','').length > 10
          }
        },
        org: { required },
      },
      { name, email, phone, org }
    );

    const role_name = ref('');
    const role_id = ref('');


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
    const Errors = createErrors({ name, email, phone, org });
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);
    return {
      projectcombined,
      ...Composable,
      ...Errors,
      statusselect,
      status,
      dialog,
      selectroles,
      addUser: async () => {

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

        $v.value.$touch();
        if ($v.value.$errors.length) return;
        const oldprojects = props.memberselectedvalue.userproject.map(
          (x) => x.project.id
        );



        const newprojects = projectsselected.value.filter(
          (x) => !oldprojects.includes(x)
        );
        const deletedproject = oldprojects.filter(
          (x) => !projectsselected.value.includes(x)
        );
        let currentproject = newprojects.map((x) => ({
          project_id: x,
          status: "add",
        }));
        
        console.log(currentproject);
        
        currentproject = currentproject.concat(
          deletedproject.map((x) => ({ project_id: x, status: "delete" }))
        );
        
        const Value = {
          id: props.memberselectedvalue.id,
          full_name: name.value,
          organization_id: org.value,
          email: email.value.toLowerCase(),
          role_id:role_id.value,
          phone_number: "+62" + phone.value.replaceAll(" ", ""),
          projects: currentproject,
          organization_role_id: roleselected.value,
          status: status.value,
        };
        return await editmember(Value).then(() => {
          dialog.value = false;
          emit("updated");
          setopendialogcommonsuccess(true);
        });
      },
    };
  },

  created() {
    this.fetchRoles();
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
