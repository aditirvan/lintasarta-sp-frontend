<template>
  <div v-if="isCheckNewServiceLoading"/>
  <div v-else>
    <dialogPurchaseLowBalance 
      v-if="!newServiceAvailability.available"
      @onClose="onClose"
      :currentBalance="newServiceAvailability.balance"
      :minimalBalance="newServiceAvailability.bill_estimate"
    />

    <dialogPurchaseConfirmation 
      v-else
      @onClose="onClose"
      :actionName="actionName"
      :infoText="infoText()"
      @confirm="onAvailable" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useNamespacedGetters } from "vuex-composition-helpers";
import dialogPurchaseConfirmation from "@/modules/billing/dialogPurchaseConfirmation";
import dialogPurchaseLowBalance from "@/modules/billing/dialogPurchaseLowBalance";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default defineComponent({
  components: {
    dialogPurchaseConfirmation,
    dialogPurchaseLowBalance,
  },
  props: {
    onClose: {
      type: Function,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    actionName: {
      type: String,
      required: true,
    },
    onAvailable: {
      type: Function,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { newServiceAvailability, isCheckNewServiceLoading } = useNamespacedGetters('PROJECT', ["newServiceAvailability", "getprojectid"]);

    const infoText = () => {
      if (newServiceAvailability.value.unit !== "fixed" && newServiceAvailability.value) 
        return `If you agree, ${props.serviceName} will be charged for ${toIDRWithDotFormat(newServiceAvailability.value.bill_estimate)} ${ newServiceAvailability.value.unit === "one time" ? '' :  'per ' +  newServiceAvailability.value.unit }`
      else
        return `if you agree, ${props.serviceName} will be charged based on Fixed Price per Cycle.`
    }

    return {
      newServiceAvailability,
      isCheckNewServiceLoading,
      infoText,
    };
  },
});
</script>
