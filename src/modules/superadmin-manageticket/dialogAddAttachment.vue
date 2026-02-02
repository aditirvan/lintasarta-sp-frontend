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
          placeholder="Enter Name"
          flat
          outlined
        ></v-text-field>
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
import { computed, onMounted, ref, watch } from "@vue/composition-api";
import {useNamespacedMutations} from 'vuex-composition-helpers'
const { required, email: vemail, numeric } = require("@vuelidate/validators");

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
        name: { required },
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
      selectroles,
      roleselected,
      searchorganization,
      ...Composable,
      ...Errors,
      statusselect,
      status,
      dialog,
      addUser: () => {
        console.log(roleselected.value)
        $v.value.$touch();
        if ($v.value.$errors.length) return;
        const data = {
          full_name: name.value,
          email: email.value,
          phone_number: "+62" + phone.value.replaceAll(' ',''),
          organization_id: org.value,
          projects: projectsselected.value.map((x) => ({
            project_id: x.id,
            openstack_project_id: x.openstack_project_id,
            status: "add",
          })),
          role_id: roleselected.value,
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
};
</script>
