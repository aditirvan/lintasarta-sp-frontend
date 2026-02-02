<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Add New User</div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Full Name</p>
        <v-text-field
          maxlength="50"
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
          v-model.trim="emailmember"
          placeholder="Enter Email"
          flat
          outlined
          @change="
            () => {
              $v.emailmember.$reset();
            }
          "
          :error-messages="createErrorMessage('emailmember')"
          @keyup="onEnter"
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
          flat
          outlined
          v-model="phone_number"
          placeholder="Phone Number"
          required
          prefix="+62"
          style="margin-bottom: 22px"
          :error-messages="
            $v.phone_number.$errors.length
              ? $v.phone_number.$errors[0].$message
              : ''
          "
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Select Project</p>
        <v-select
          class="selectsproject"
          v-model="projectsselected"
          :error-messages="createErrorMessage('projectsselected')"
          :items="selectprojects"
          return-object
          placeholder="Select Project"
          flat
          outlined
          multiple
        >
          <template v-slot:selection="{ item }">
            {{ $lodash.truncate(item.text, { length: 50 }) }}
          </template>
        </v-select>
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
            ><v-btn
              @click="
                () => {
                  dialog = false;
                }
              "
              depressed
              height="45"
              block
              class="accent"
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
              >Add</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useMember } from "./usemember";
import { computed, onMounted, ref, watch } from "@vue/composition-api";
import { useProjects } from "../project/useprojects";
import { useRoles } from "./userole";
import { useNamespacedState } from 'vuex-composition-helpers';
import { ROLEPERMISSION } from './namespace';
const { required, email, minLength } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value", "organization"],
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });
    const Composable = {
      ...useMember(),
      ...useProjects(),
      ...useRoles(),
    };

    const {
      membername,
      emailmember,
      projectsselected,
      roleselected,
      selectroles,
      addmember,
      fetchRoles,
      phone_number,
    } = Composable;

    phone_number.value = "";
    membername.value = "";
    emailmember.value = "";

    roleselected.value = "";

    onMounted(() => {
      fetchRoles({ page: 1, itemsPerPage: -1 });
    });
    const emailalreadyexist = ref("");
    const emaildetectedasfree = ref("");
    const { userrole } = useNamespacedState(ROLEPERMISSION, ["userrole"]);

    const $v = useVuelidate(
      {
        phone_number : {required},
        membername: {
          required,
          minLength: minLength(5),
        },
        emailmember: { required, email, conditional:{
          $message:'email already exist',
          $validator:()=>{
            return !emailalreadyexist.value
          }
        }, conditional2:{
          $message:'cannot use this email',
          $validator:()=>{
            return !emaildetectedasfree.value
          }
        } },
        projectsselected: { },
        roleselected: { required },
      },
      {
        phone_number,
        membername,
        emailmember,
        projectsselected,
        roleselected,
      }
    );
    function createErrorMessage(element) {
      return $v.value[element].$errors.length
        ? $v.value[element].$errors[0].$message
        : "";
    }
    watch(emailmember, (val) => {
      emailalreadyexist.value = "";
      emaildetectedasfree.value = "";
      $v.value.emailmember.$reset();
    });
    const role_name = ref("");
    const role_id = ref("");

    function addMember() {
      selectroles.value.forEach((k) => {
        if (roleselected.value == k.value) {
          role_name.value = k.text;
        }
      });
      if (role_name.value == "Owner") {
        role_id.value = 1;
      } else {
        role_id.value = 2;
      }
      $v.value.$touch();
      if ($v.value.$invalid) return;
      let Value = {
        role_id: role_id.value,
        full_name: membername.value,
        phone_number: "+62" + phone_number.value.replaceAll(" ", ""),
        email: emailmember.value.toLowerCase(),
        projects: projectsselected.value.map((x) => ({
          project_id: x.value,
          openstack_project_id: x.openstack_project_id,
          status: "add",
        })),
        organization_role_id: roleselected.value,
      };

      return addmember(Value)
        .then(() => {
          membername.value = "";
          emailmember.value = "";
          projectsselected.value = "";
          roleselected.value = "";
          phone_number.value = "";
          $v.value.$reset();
          dialog.value = false;
          emit("added");
        })
        .catch((e) => {
          const { data } = e.response.data;
          if (data.includes("Maximum member")) {
            this.$store.dispatch("HOMEPAGE/showErrorToast", data);
          } else if (data == "Email was ready exist") {
            emailalreadyexist.value = "Email already exist";
          } else if (data == "Email already exist") {
            emailalreadyexist.value = "Email already exist";
          } else if (data == "email detected as free email provider domain") {
            emaildetectedasfree.value =
              "Your email domain provider is restricted. Please use your company or other email domain provider.";
          } else {
            this.$store.dispatch("HOMEPAGE/showErrorToast", data);
          }
        });
    }
    return {
      userrole,
      $v,
      emailalreadyexist,
      ...Composable,
      dialog,
      addMember,
      createErrorMessage,
    };
  },
  watch: {
    dialog() {
      if (this.organization) {
        this.fetchprojects({ id: this.organization.id, itemsPerPage: -1 });
      } else {
        this.fetchprojects();
      }
      this.fetchRoles({ page: 1, itemsPerPage: -1 });
    },
  },
  methods: {
    onEnter(e) {
      this.emailmember = this.emailmember.toLowerCase();
    },
  },
};
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
}
.selectproject {
  ::v-deep input {
    position: absolute;
  }
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>
