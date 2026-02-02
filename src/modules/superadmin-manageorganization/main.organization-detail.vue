<template>
  <router-view v-if="currentOrg" :currentOrg="currentOrg" />
</template>
<script lang="ts">
import localstorage from "@/lib/localstorage";
import { defineComponent } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { SUPERADMIN } from "../superadmin/namespace";
import { fetchorgbyid } from "./fetchorgbyid";
export default defineComponent({
  setup() {
    const { setCurrentOrg, setCurrentProj } = useNamespacedMutations(
      SUPERADMIN,
      ["setCurrentOrg", "setCurrentProj"]
    );
    const { currentOrg } = useNamespacedState(SUPERADMIN, ["currentOrg"]);
    const { organizationDPById } = useNamespacedActions("ORGANIZATIONDP", ["organizationDPById"]);
    const { orgDPById } = useNamespacedGetters("ORGANIZATIONDP", ["orgDPById"])
    return {
      setCurrentOrg,
      setCurrentProj,
      currentOrg,
      organizationDPById,
      orgDPById,
    };
  },

  beforeRouteUpdate: function (to: any, from: any, next: any) {
    if (to.name.match(/^organization-detail-orgnizationid-projectname/))
      return next();
    fetchorgbyid(to.params.organizationid)
      .then(async(response) => {
        const org = response?.data.data;
        if(org.dekaprime_organization_id){
          await this.organizationDPById({orgDpId: org.dekaprime_organization_id })
          localStorage.setItem('orgDP', JSON.stringify(this.orgDPById))
        }
        const currentProj = localstorage.getItem("currentProj");
        this.setCurrentOrg(org);
        if (currentProj) this.setCurrentProj(JSON.parse(currentProj));
        next();
      })
      .catch(() => {
        next("/notfound");
      });
  },
  beforeRouteEnter: function (to: any, from: any, next: any) {
    fetchorgbyid(to.params.organizationid)
      .then((response) => {
        const org = response?.data.data;
        next(async(vm: any) => {
          if(org.dekaprime_organization_id){
            await vm.organizationDPById({orgDpId: org.dekaprime_organization_id })
            localStorage.setItem('orgDP', JSON.stringify(vm.orgDPById))
          }
          const currentProj = localstorage.getItem("currentProj");
          vm.setCurrentOrg(org);
          if (currentProj) vm.setCurrentProj(JSON.parse(currentProj));
        });
      })
      .catch(() => {
        next("/notfound");
      });
  },
});
</script>