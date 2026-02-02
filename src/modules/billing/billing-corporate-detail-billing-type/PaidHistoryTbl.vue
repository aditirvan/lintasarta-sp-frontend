<template>
  <div>
    <p class="font-weight-bold fz-21 mt-4">Payment</p>

    <v-data-table
      class="datatable-services"
      :headers="tblHeaders"
      :items="tblItems"
      :items-per-page="10"
      hide-default-footer
    >
      <template v-slot:item.created_at="{ item }">
        {{ $moment(item.created_at).format("DD/MM/YYYY HH:mm:ss") }}
      </template>

      <template v-slot:item.amount="{ item }" class="mr-2">
        {{ toIDRWithDotFormat(item.amount) }}
      </template>

      <template v-slot:footer="{ props }" v-if="tblItems.length > 10">
        <custom-footer-datatable :props="props" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup(props, context) {
    return {
      toIDRWithDotFormat,
    };
  },
  props: ["tblItems", "isPostpaidFixed"],
  computed: {
    tblHeaders() {
      return [
        { text: "Paid At", value: "created_at", width:"75%" },
        { text: "Amount", value: "amount" },
      ]
    },
  },
};
</script>
