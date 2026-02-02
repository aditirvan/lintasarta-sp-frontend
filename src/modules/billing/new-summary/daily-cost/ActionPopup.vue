<template>
  <v-dialog v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <h6 class="text-h6 font-weight-bold text-capitalize">
          {{ titleCase(labelServiceName) }}
        </h6>
        <v-data-table
          hide-default-footer
          :headers="tblHeaders"
          :items-per-page="10"
          :items="item"
          class="mt-8"
        >
        <template v-slot:item.name="{ item }">
            {{ item.name || "N/A" }}
          </template>

          <template v-slot:item.specification="{ item }">
            <!-- {{ item.package.vcpu }} vCPU / {{ item.package.ram }} GB Memory -->
            {{ item.specification }}
          </template>

          <template v-slot:item.type="{ item }">
            {{ item.status.toUpperCase() }}
          </template>

          <template v-slot:item.price="{ item }">
            {{ toIDRWithDotFormat(item.price.value) }}
            <span>/ {{ item.price.unit }}</span>
          </template>

          <template v-slot:item.usage="{ item }">
            {{ item.usage }}
          </template>

          <template v-slot:item.discount="{ item }">
            {{ item.discount ? `${item.discount}%` : '-' }}
          </template>

          <template v-slot:item.discount_value="{ item }">
            {{ toIDRWithDotFormat(item.discount_value) }}
          </template>

          <template v-slot:item.billed="{ item }">
            {{ toIDRWithDotFormat(item.billed) }}
          </template>

          <template v-if="project.postpaid_type !== 'fixed'" v-slot:body.append>
            <tr style="border: none" v-if="item.length">
              <td
                v-for="number in tblHeaders.length - 2"
                :key="'total-' + number"
                class="border-bottom-none"
              />

              <td class="border-bottom-none">
                <div class="d-flex flex-row justify-end font-weight-bold">
                  Total
                </div>
              </td>

              <td class="border-bottom-none">
                <div class="d-flex flex-row justify-end font-weight-bold">
                  {{ toIDRWithDotFormat(total) }}
                </div>
              </td>
            </tr>
          </template>

          <template v-slot:footer="{ props }" v-if="item.length">
            <custom-footer-datatable :props="props" />
            <v-btn
              depressed
              height="45"
              block
              class="secondary mt-3"
              color="accent"
              @click="
                () => {
                  $emit('input', false);
                }
              "
            >
              Close
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { capitalCase } from "capital-case";
import { defineComponent, computed } from "@vue/composition-api";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default defineComponent({
  props: ["value", "item", "serviceName"],
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });
    const labelServiceName = computed(() => {
      return (
        props.serviceName
      );
    });
    const total = computed(() => {
      let billed = 0;
      props.item.forEach((e) => {
        billed += e.billed;
      });
      return billed;
    });
    const tblHeaders = computed(() => {
      let currentProj = JSON.parse(localStorage.getItem('currentProj'))

      return currentProj.postpaid_type !== 'fixed' ? [
        { text: "Service Name", value: "name", sortable: false },
        { text: "Specification", value: "specification", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Billing Type", value: "billing_type", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Usage", value: "usage", sortable: false },
        { text: "Discount", value: "discount", sortable: false },
        { text: "Discount Value", value: "discount_value", sortable: false },
        { text: "Billed Estimate", value: "billed", align: "end" },
      ] : [
        { text: "Service Name", value: "name", sortable: false },
        { text: "Specification", value: "specification", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Billing Type", value: "billing_type", sortable: false },
        { text: "Usage", value: "usage", sortable: false },
      ];
    });
    const project = computed(() => {
      let currentProj = localStorage.getItem('currentProj');
      return JSON.parse(currentProj);
    });
    const titleCase = (s) => {
      if(s == "OBJECT_STORAGE"){
        return "Deka Box";
      }


      return s
        .toLowerCase()
        .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
        .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase()); // First char after each -/_
    };
    return {
      dialog,
      tblHeaders,
      labelServiceName,
      total,
      titleCase,
      toIDRWithDotFormat,
      project,
    };
  },
});
</script>
