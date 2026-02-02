<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Add User</div>
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
          v-mask="[/[1-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/,' ' ,/[0-9]/, /[0-9]/, /[0-9]/]"
          v-model="phone"
          placeholder="Enter Phone Number"
          prefix="+62"
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
          :error-messages="emailErrors.length ? emailErrors[0].$message : ''"
          @keyup="onEnter"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Select Organization</p>
        <v-autocomplete
          :search-input.sync="searchorganization"
          v-model="org"
          :items="organizations"
          outlined
          item-text="name"
          item-value="id"
          placeholder="Select Organization"
          attach="#SelectOrgAttach"
          :error-messages="orgErrors.length ? orgErrors[0].$message : ''"
        >
          <template v-slot:append-outer>
            <div id="SelectOrgAttach"></div>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Select Projects</p>
        <v-autocomplete
          return-object
          :search-input.sync="searchprojectbyorg"
          v-model="projectsselected"
          :items="projects"
          outlined
          item-text="name"
          class="selectproject"
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
          :error-messages="roleselectedErrors.length?roleselectedErrors[0].$message:''"
          :items="selectroles"
          placeholder="Select Role"
          flat
          outlined
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
              id="Add"
              depressed
              height="45"
              block
              class="secondary"
              @click="addUser"
              >Add</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useUser } from "./useUser";
import { computed, onMounted, ref, watch } from "@vue/composition-api";
import { useRoles } from "../organization/userole";
import {useNamespacedMutations} from 'vuex-composition-helpers'
const { required, email: vemail, numeric, minLength } = require("@vuelidate/validators");
import { useProjects } from "../project/useprojects";

const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value"],
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });
    const Composable = {
      ...useUser(),
      ...useRoles(),
      ...useProjects(),
    };
    const statusselect = ref([
      { value: "joined", text: "active" },
      { value: "", text: "inactive" },
    ]);
    const status = ref(null);
    const phonemember = ref("");
    const {
      name,
      email,
      phone,
      org,
      searchorganization,
      projectsselected,
      addmember,
      fetchorganizations,
      fetchRoles,
      roles,
      selectroles,
      roleselected,
      fetchprojects
    } = Composable;
    const emailalreadyexist = ref("");
    const emaildetectedasfree = ref('')
    onMounted(() => {
      fetchorganizations();
      fetchRoles()
    });
    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        email: {
          required,
          vemail,
          conditional: {
            $message: ()=>emailalreadyexist.value,
            $validator: () => {
              return !emailalreadyexist.value;
            },
          },
          conditional1:{
            $message: ()=>emaildetectedasfree.value,
            $validator: () => {
              return !emaildetectedasfree.value;
            },
          }
        },
        phone: { required, custom:{
          $message: "value min 10 number",
          $validator: (val)=>val.replaceAll(' ','').length > 10
        } },
        org: { required },
        roleselected: {required}
      },

      { name, email, phone, org, roleselected}
    );
    watch(email, (val) => {
      emailalreadyexist.value = "";
      $v.value.email.$reset();
    });
    watch(org,(val)=>{
      fetchRoles({currentOrg:{id:val}, page:1,itemsPerPage:-1})
      fetchprojects({id:val, itemsPerPage:-1, page:1});
    })

    const role_name = ref('');
    const role_id = ref('');
    watch(roleselected,(val)=>{
      selectroles.value.forEach((k) => {
        if(val==k.value){
          role_name.value=k.text;
        }
      });
      if(role_name.value=='Owner'){
        role_id.value=1;
      }else{
        role_id.value=2;
      }
    })

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
    const Errors = createErrors({ name, email, phone, org,  roleselected});
    const {
      setopendialogcommonsuccess,
    } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);

    

    return {
      role_id,
      role_name,
      selectroles,
      roleselected,
      searchorganization,
      ...Composable,
      ...Errors,
      statusselect,
      status,
      dialog,
      addUser: () => {
        $v.value.$touch();
        if ($v.value.$errors.length) return;
        const data = {
          full_name: name.value,
          email: email.value.toLowerCase(),
          phone_number: "+62" + phone.value.replaceAll(' ',''),
          organization_id: org.value,
          projects: projectsselected.value.map((x) => ({
            project_id: x.id,
            openstack_project_id: x.openstack_project_id,
            status: "add",
          })),
          role_id: role_id.value,
          organization_role_id: roleselected.value
        };
        addmember(data)
          .then(() => {
            dialog.value = false;
            emit("added");
            setopendialogcommonsuccess(true)
          })
          .catch((e) => {
            const data = e.response.data.data;
            if (data == "Email was ready exist") {
              emailalreadyexist.value = 'Email already exist';
            }
            if(data == 'email detected as free email provider domain'){
              emaildetectedasfree.value = 'Cannot use this email'
            }
          });
      },
    };
  },
  created() {
    this.fetchRoles();
  },
  methods: {
    onEnter(e) {
      this.email = this.email.toLowerCase();
    },
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
