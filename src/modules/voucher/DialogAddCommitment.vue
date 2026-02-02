<template>
  <v-dialog persistent max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div v-if="commitment" class="headline font-weight-bold font--text">
          Edit Commitment
        </div>
        <div v-else class="headline font-weight-bold font--text">
          Add New Commitment
        </div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Organization</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useVoucher } from "./useVoucher";
import { useProjects } from "@/modules/project/useprojects";
import { ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { useDialog } from "@/composable/usedialog";
import { required, email as Email } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import moment from 'moment'
import { toThousands, toPlain } from '@/lib/formatter'

export default {
  props: ['value', 'commitment'],
  setup(props, context) {

    return {
    };
  },
};
</script>
<style lang="scss" scoped>
.titletext {
  font-size: 12px;
  margin-bottom: 12px;
  font-weight: 700;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>