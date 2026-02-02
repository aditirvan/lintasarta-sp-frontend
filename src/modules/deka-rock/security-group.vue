<template>
  <div>
    <SecurityGroupRoles v-if="selectedSecurityGroup" @select="SelectSecurityGroup" :security_group="selectedSecurityGroup" @set_mode="SetMode"></SecurityGroupRoles>
    <SecurityGroupList v-else @select="SelectSecurityGroup" @set_mode="SetMode"></SecurityGroupList>
  </div>
</template>


<script>
import { ref } from "@vue/composition-api";

import SecurityGroupList from "./security-group/groups.vue";
import SecurityGroupRoles from "./security-group/roles.vue";

export default {
  components: {
    SecurityGroupList,
    SecurityGroupRoles
  },
  setup(props, context) {
    const selectedSecurityGroup = ref(null);
    const mode = ref(null);
    function SelectSecurityGroup(data){
      if (data == null){
        mode.value = null;
      }
      selectedSecurityGroup.value = data
    }
    function SetMode(data){
      mode.value = data;
    }
    return {
      mode,
      selectedSecurityGroup,

      SelectSecurityGroup,
      SetMode
    }
  }
}

</script>