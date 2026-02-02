<template>
  <v-container fluid>
    <v-row>
      <v-col lg="6" md="8" cols="12" class="pa-0">
        <v-card flat class="pa-3 rounded-lg">
          <v-card-text
            ><div v-if="Role" class="headline font-weight-bold font--text">
              Edit Role
            </div>
            <div v-else class="headline font-weight-bold font--text">
              Create Role
            </div>
          </v-card-text>
          <v-card-text>
            <p class="titletext">
              Role Name<span :class="{ 'error--text': $v.name.$errors.length }"
                >*</span
              >
            </p>
            <v-text-field
              maxlength="50"
              v-model="name"
              placeholder="Type Role Name"
              outlined
              class="mb-4"
              :error-messages="
                $v.name.$errors.length ? $v.name.$errors[0].$message : ''
              "
            ></v-text-field>
            <p class="titletext">
              Description<span
                :class="{ 'error--text': $v.desc.$errors.length }"
                >*</span
              >
            </p>
            <v-textarea
              v-model="desc"
              placeholder="Type Description Here"
              outlined
              maxlength="255"
              :error-messages="
                $v.desc.$errors.length ? $v.desc.$errors[0].$message : ''
              "
            ></v-textarea>
            <v-divider class="mt-10"></v-divider>
            <br />
            <p :class="{ 'error--text': privilegesmin !== '' }">
              <span class="titletext">Privileges* </span>
              <span v-if="privilegesmin">{{ privilegesmin }}</span>
            </p>

            <v-row>
              <v-col class="top-left-border rounded-tl-lg">Access</v-col>
              <v-col class="top-center-border">Permission</v-col>
              <v-col class="top-center-border">Editor</v-col>
              <v-col class="top-right-border rounded-tr-lg">Viewer</v-col>
            </v-row>
            <v-row
              v-for="(p, i) in privilleges"
              :key="i"
            >
            <!-- :class="{ hidden: role != 'Superadmin' && p.name == 'Dekaprime' }"
            > -->
              <v-col
                class="bottom-left-border"
                :class="{ 'rounded-bl-lg': i + 1 == privilleges.length }"
                >{{ p.name }}</v-col
              >
              <v-col class="bottom-right-border">
                <v-switch
                  @change="(e) => swatch(e, p)"
                  hide-details=""
                  v-model="p.rule"
                ></v-switch>
              </v-col>
              <v-col class="bottom-right-border">
                <v-radio-group hide-details="" v-model="p.rule">
                  <v-radio value="editor" class="justify-center"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col
                class="bottom-right-border"
                :class="{ 'rounded-br-lg': i + 1 == privilleges.length }"
              >
                <v-radio-group hide-details="" v-model="p.rule">
                  <v-radio value="viewer" class="justify-center"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <div class="d-flex flex-row pt-7">
              <v-btn
                depressed
                width="150"
                height="50"
                class="accent flex-grow-1"
                @click="$router.go(-1)"
                >Cancel</v-btn
              >
              <v-spacer />
              <v-btn
                id="SaveRole"
                depressed
                width="150"
                height="50"
                class="secondary flex-grow-1"
                @click="
                  () => {
                    CreateRole();
                  }
                "
                >Save Role</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { computed, reactive, ref, watch } from "@vue/composition-api";
import {
  useActions,
  useGetters,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import {
  useNamespacedState,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { ROLEPERMISSION } from "./namespace";
import Vue from "vue";
import localstorage from "@/lib/localstorage";

export default {
  setup(props, { root }) {
    const role = localstorage.getItem("role");
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));

    const route = root.$route;
    const Role = ref("");
    const listprivilages = [
      "Alerting",
      "Balance",
      "Billing",
      "CDN",
      "Deka AST",
      "Deka Harbor",
      "Dekaprime",
      "Dekarock",
      "DNS",
      "Images",
      "Instance",
      "Manage Role",
      "Manage Service",
      "Network",
      "Object Storage",
      "Organization",
      "Project",
      "Rdbms",
      "Registry",
      "Security",
      "SSL",
      "Storage",
      "Ticket",
      "Voucher",
      "Deka Agent",
      "NFS",
      "Deka POP"
    ];
    // if (role == "Superadmin") {
    //   listprivilages.push(

    //   );
    // } else {
    //   listprivilages.push(
    //     "Instance",
    //     "Storage",
    //     "Object Storage",
    //     "Images",
    //     "Network",
    //     "Alerting",
    //     "Security",
    //     "Billing",
    //     "Organization",
    //     "Manage Role",
    //     "Project",
    //     "Ticket",
    //     "DNS"
    //   );
    // }

    // hardcode privileges
    const privilleges = ref(
      listprivilages.map((x) => ({
        name: x,
        viewer: false,
        editor: false,
        disable: true,
        rule: "",
      }))
    );
    const name = ref("");
    const desc = ref("");
    const { submit } = useActions({
      submit: "ROLEPERMISSION/createRole",
    });

    if (route.name == "editrole" || route.name == "superadmineditrole") {
      let { selectedrole } = useNamespacedState(ROLEPERMISSION, [
        "selectedrole",
      ]);
      Role.value = selectedrole.value;
      name.value = selectedrole.value.name;
      desc.value = selectedrole.value.description;
      selectedrole.value.privilages.forEach((element) => {
        privilleges.value.forEach((e, i) => {
          if (element.name == e.name) {
            e.viewer = element.viewer;
            e.editor = element.editor;
            e.rule = (e.viewer && "viewer") || (e.editor && "editor");
            e.disable = e.rule ? false : true;
          }
        });
      });
    }

    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        desc: { required },
        // selectedprivilleges: {
        //   minselect: { $message:"select at least one", $validator: (val)=>val.length }
        // },
      },
      {
        name,
        desc,
        // selectedprivilleges
      }
    );
    const { userprofile } = useNamespacedState(ROLEPERMISSION, ["userprofile"]);
    const { createRole, editRole } = useNamespacedActions(ROLEPERMISSION, [
      "createRole",
      "editRole",
    ]);
    const { setopendialogcommonwarning } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonwarning",
    ]);
    const { opendialogcommonwarning, messagecommonwarning } =
      useNamespacedState("DASHBOARD", [
        "opendialogcommonwarning",
        "messagecommonwarning",
      ]);
    const privilegesmin = ref("");
    watch(
      privilleges,
      (val) => {
        privilegesmin.value = "";
      },
      { deep: true }
    );
    const CreateRole = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const privilegesselected = privilleges.value.slice().map((x) => {
        x.viewer = !!(x.rule == "viewer");
        x.editor = !!(x.rule == "editor");
        x.disable = !x.editor && !x.viewer;
        return x;
      });

      for (let p = 0; p < privilleges.value.length; p++) {
        if (privilleges.value[p].disable == false) {
          break;
        }
        if (
          p + 1 == privilleges.value.length &&
          privilleges.value[p].disable == true
        ) {
          privilegesmin.value = "please select at least one";
          return;
        }
      }

      const Value = {
        name: name.value,
        description: desc.value,
        organization_id: currentOrg.id,
        privilages: privilegesselected,
      };

      if (role == "Superadmin") {
        Value.organization_id = currentOrg.id;
      } else {
        Value.organization_id = userprofile.value.organization_id;
      }

      if (Role.value) {
        Value.id = Role.value.id;
        editRole(Value).then(() => {
          if (role == "Superadmin") {
            root.$router.replace("/organization-detail/" + currentOrg.id);
          } else {
            root.$router.replace("/role-permission");
          }
        });
      } else {
        createRole(Value)
          .then(() => {
            if (role == "Superadmin") {
              root.$router.replace("/organization-detail/" + currentOrg.id);
            } else {
              root.$router.replace("/role-permission");
            }
          })
          .catch((e) => {
            messagecommonwarning.value = e.response.data.data;
            setopendialogcommonwarning(true);
          });
      }

      // data.level = userrole.value.level + 1
      // data.privileges = data.privileges.map(x=>x.name)
      // submit(data).then(()=>{
      //   root.$router.replace('/role-permission')
      // })
    };
    const swatch = (event, p) => {
      if (!event) {
        p.rule = null;
      } else {
        p.rule = "viewer";
      }
    };
    return {
      privilegesmin,
      privilleges,
      Role,
      $v,
      swatch,
      name,
      desc,
      submit,
      CreateRole,
      role,
    };
  },
  beforeRouteEnter(to, from, next) {
    const selectedrole =
      Vue.store._modules.root._children.ROLEPERMISSION.state.selectedrole;
    const role = localstorage.getItem("role");
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    if (to.name == "editrole" || to.name == "superadmineditrole") {
      if (selectedrole) {
        next();
      } else {
        if (role == "Superadmin") {
          next("/organization-detail/" + currentOrg.id);
        } else {
          next("/role-permission");
        }
      }
    } else {
      next();
    }
  },
};
</script>
<style lang="scss" scoped>
.headline {
  font-weight: 600;
  font-family: "Poppins", sans-serif;
}
.titletext {
  font-weight: 700;
}
.v-input--switch {
  padding: 0px;
}
.top-left-border {
  border-top: 1px solid #a5b3bf;
  border-left: 1px solid #a5b3bf;
  border-right: 1px solid #a5b3bf;
  border-bottom: 1px solid #a5b3bf;
  text-align: center;
}

.top-center-border {
  border-top: 1px solid #a5b3bf;
  border-right: 1px solid #a5b3bf;
  border-bottom: 1px solid #a5b3bf;
  text-align: center;
}
.top-right-border {
  border-top: 1px solid #a5b3bf;
  border-right: 1px solid #a5b3bf;
  border-bottom: 1px solid #a5b3bf;
  text-align: center;
}
.bottom-left-border {
  border-left: 1px solid #a5b3bf;
  border-right: 1px solid #a5b3bf;
  border-bottom: 1px solid #a5b3bf;
  text-align: center;
}
.bottom-right-border {
  border-right: 1px solid #a5b3bf;
  border-bottom: 1px solid #a5b3bf;
  text-align: center;
}
.v-input--selection-controls {
  margin-top: 0;
}
.v-input--switch {
  ::v-deep .v-input__slot {
    justify-content: center;
  }
}
</style>
