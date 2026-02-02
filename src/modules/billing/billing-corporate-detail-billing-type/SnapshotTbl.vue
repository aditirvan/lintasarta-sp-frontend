<template>
  <div>
    <p class="font-weight-bold fz-21 mt-4">Snapshot Detail</p>

    <v-data-table
      class="datatable-services"
      :headers="tblHeaders"
      :items="tblItems"
      :items-per-page="10"
      hide-default-footer
    >
      <template v-slot:item.name="{ item }">
        <span class="linkpointer">{{ item.name || "N/A" }}</span>
      </template>
      <template v-slot:item.specification="{ item }">
        {{ item.specification }}
      </template>

      <template v-slot:item.status="{ item }">
        {{ item.status ? item.status : "-" }}
      </template>

      <template v-slot:item.price="{ item }">
        {{ toIDRWithDotFormat(item.price.value) }}/
        {{ item.price.per }}
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
        <div v-if="item.usage === ''">-</div>
        <div v-else>{{ item.usage }}</div>
      </template>

      <template v-slot:item.discount_value="{ item }">
        {{ item.discount_value ? toIDRWithDotFormat(item.discount_value) : '-' }}
      </template>

      <template v-slot:item.billed="{ item }">
        {{ toIDRWithDotFormat(item.billed) }}
      </template>

      <template v-if="!isPostpaidFixed" v-slot:body.append>
        <tr style="border: none">
          <td class="border-bottom-none"></td>
          <td class="border-bottom-none"></td>
          <td class="border-bottom-none"></td>
          <td class="border-bottom-none"></td>
          <td class="border-bottom-none"></td>
          <td class="border-bottom-none"></td>
          <td class="border-bottom-none">
            <div>
              <p class="font-weight-bold">Total</p>
            </div>
            <div class="d-flex flex-row justify-start">
              {{
                toIDRWithDotFormat(
                tblItems.length ? 
                  tblItems.reduce((total, item) => total + item.billed, 0)
                  : 0
                )
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
        const width = 100 / 6 + "%";

        return [
          { text: "Service Name", value: "name", width },
          { text: "Specification", value: "specification", width },
          { text: "Created At", value: "created_at", width },
          { text: "Deleted At", value: "DeletedAt", width },
          // { text: "Usage", value: "usage", width },
        ];
      } else if (this.$route.params.billing_type === "fixed") {
        const width = 100 / 6 + "%";

        return [
          { text: "Service Name", value: "name", width },
          { text: "Specification", value: "specification", width },
          // { text: "Price", value: "price", width },
          { text: "Created At", value: "created_at", width },
          { text: "Deleted At", value: "deleted_at", width },
          // { text: "Usage", value: "usage", width },
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
