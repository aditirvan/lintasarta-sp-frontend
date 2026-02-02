<template>
  <div>
    <p class="font-weight-bold fz-21 mt-4">Floating IP Detail</p>

    <v-data-table
      class="datatable-services"
      :headers="tblHeaders"
      :items="tblItems"
      :items-per-page="10"
      hide-default-footer
    >
      <template v-slot:item.ip_address="{ item }">
        {{ item.ip_address }}
      </template>

      <template v-slot:item.total="{ item }"> {{ item.total }} x </template>

      <template v-slot:item.discount_value="{ item }">
        {{ item.discount_value ? toIDRWithDotFormat(item.discount_value) : '-' }}
      </template>
      
      <template v-slot:item.billed="{ item }">
        {{ toIDRWithDotFormat(item.billed) }}
      </template>

      <template v-slot:item.price="{ item }">
        {{ toIDRWithDotFormat(item.price.value) }} / {{ item.price.per }}
      </template>

      <template v-slot:item.created_at="{ item }">
        {{ $moment(item.created_at).format("DD/MM/YYYY HH:mm:ss") }}
      </template>
      <template v-slot:item.deleted_at="{ item }">
        <div v-if="item.deleted_at">
          {{ $moment(item.deleted_at).format("DD/MM/YYYY HH:mm:ss") }}
        </div>
        <div v-else>-</div>
      </template>

      <template v-slot:item.usage="{ item }">
        <div v-if="!item.usage">-</div>
        <div v-else>{{ item.usage }}</div>
      </template>

      <template v-if="!isPostpaidFixed" v-slot:body.append>
        <tr style="border: none">
          <td
            v-for="number in tblHeaders.length - 1"
            :key="'storage-total-' + number"
            class="border-bottom-none"
          />

          <td class="border-bottom-none">
            <div>
              <p class="font-weight-bold">Total</p>
            </div>
            <div class="d-flex flex-row justify-start">
              {{
                tblItems.length
                  ? toIDRWithDotFormat(
                      tblItems.reduce((total, item) => total + item.billed, 0)
                    )
                  : "0"
              }}
            </div>
          </td>
        </tr>
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
      if (this.isPostpaidFixed) {
        const width = "20%";

        return [
          { text: "Service Name", value: "name", width },
          { text: "Specification", value: "specification", width },
          { text: "Created At", value: "created_at", width },
          { text: "Deleted At", value: "deleted_at", width },
        ];
      } else if (this.$route.params.billing_type === "fixed") {
        const width = 100 / 4 + "%";

        return [
          { text: "Service Name", value: "name", width },
          { text: "Total", value: "total", width },
          { text: "Total Price", value: "billed", width },
        ];
      } else {

        return [
          { text: "Service Name", value: "name" },
          { text: "Specification", value: "specification" },
          { text: "Price", value: "price" },
          { text: "Created At", value: "created_at" },
          { text: "Deleted At", value: "deleted_at" },
          { text: "Usage", value: "usage" },
          { text: "Discount Value", value: "discount_value" },
          { text: "Billed", value: "billed" },
        ];
      }
    },
  },
};
</script>
