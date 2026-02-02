<template>
  <v-container fluid>
    <v-row>
      <v-col lg="6" md="8" cols="12">
        <v-card flat class="pa-3 rounded-lg">
          <v-card-text>
            <div class="headline font-weight-bold font--text">Edit Role</div>
          </v-card-text>
          <v-card-text>
            <v-form
              @submit.prevent="
                submit({
                  ref: doc_ref,
                  data: { name, desc, privilleges: selectedprivilleges },
                })
              "
            >
              <p class="titletext">Role Name*</p>
              <v-text-field
                maxlength="50"
                v-model="name"
                placeholder="Name"
                outlined
                required
              ></v-text-field>
              <div style="margin: 30px" />
              <p class="titletext">Description*</p>
              <v-textarea
                v-model="desc"
                placeholder="Description"
                outlined
                required
              ></v-textarea>
              <v-divider></v-divider>
              <br />
              <h2>Privileges</h2>
              <v-switch
                v-for="p in getprivilleges"
                :key="p.id"
                v-model="selectedprivilleges"
                color="primary"
                :label="p.name"
                :value="p.name"
              ></v-switch>
              <v-row>
                <v-col
                  ><v-btn
                    block
                    depressed
                    height="55"
                    class="accent"
                    @click="$router.go(-1)"
                    >Cancel</v-btn
                  ></v-col
                >
                <v-col>
                  <v-btn
                    block
                    depressed
                    height="55"
                    class="secondary"
                    type="submit"
                    >Save</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { reactive, ref } from "@vue/composition-api";
import { useActions, useGetters } from "vuex-composition-helpers";
import localstorage from "@/lib/localstorage";

export default {
  setup() {
    const doc_ref = reactive({});
    const name = ref("");
    const desc = ref("");
    const selectedprivilleges = reactive([]);
    const { submit, fetchPrivilleges, fetchRoles } = useActions({
      submit: "ROLEPERMISSION/editRole",
      fetchPrivilleges: "ROLEPERMISSION/fetchPrivilleges",
      fetchRoles: "ROLEPERMISSION/fetchRoles",
    });
    const { getroles, getprivilleges } = useGetters({
      getroles: "ROLEPERMISSION/getroles",
      getprivilleges: "ROLEPERMISSION/getprivilleges",
    });
    return {
      doc_ref,
      name,
      desc,
      submit,
      fetchPrivilleges,
      getroles,
      getprivilleges,
      selectedprivilleges,
      fetchRoles,
    };
  },
  created() {
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const options = ref({ orgId: currentOrg.id });
    this.fetchRoles(options.value).then(() => {
      console.log("this.$route ", this.$route);
      const { role_id } = this.$route.query;
      const role = this.getroles.filter((r) => r.id == role_id);
      if (role.length) {
        this.doc_ref = role[0].ref;
        this.name = role[0].name;
        this.desc = role[0].desc;
        this.selectedprivilleges = role[0].privilleges;
      }
    });
  },
};
</script>
<style scoped>
.headline {
  font-weight: 600;
  font-family: "Poppins", sans-serif;
}
.titletext {
  font-weight: 700;
}
</style>
