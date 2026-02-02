<template>
  <v-dialog v-model="dialog" width="552">
    <v-card>
      <v-card-title class="font-weight-bold fz-21">
        Detail Flavors
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="8">
            <p class="font-weight-bold">Flavor Name</p>
            <p>{{ item.flavor_name }}</p>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-bold">Type</p>
            <p>{{ item.type.name }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <p class="font-weight-bold">Region</p>
            <p>{{ item.region }}</p>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-bold">Usage Limit</p>
            <p>
              {{
                item.usage_limit == -1
                  ? "Unlimited"
                  : `${item.usage}/${item.usage_limit}`
              }}
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <p class="font-weight-bold">ID</p>
            <p>{{ item.id }}</p>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-bold">vCPU</p>
            <p>{{ item.vcpu }} vCPU</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <p class="font-weight-bold">Memory</p>
            <p>{{ item.ram }} GB</p>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-bold">Root Disk</p>
            <p>{{ item.root_disk }} GB</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <p class="font-weight-bold">Ephermeral Disk</p>
            <p>{{ item.ephermeral_disk }} GB</p>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-bold">Swap Disk</p>
            <p>{{ item.swap_disk }} GB</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <p class="font-weight-bold">Price</p>
            <p class="mb-0">
              {{ toIDRWithDotFormat(item.price_per_month) }} /month
            </p>
            <p>{{ toIDRWithDotFormat(item.price_per_hours) }} /hours</p>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-bold">GPU Unit</p>
            <p>{{ item.gpu }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <p class="font-weight-bold">Status</p>
            <p>{{ item.status == "active" ? "Active" : "Inactive" }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-btn
          @click="
            () => {
              dialog = false;
            }
          "
          block
          depressed
          class="accent"
          >Close</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useDialog } from "@/composable/usedialog";
import { defineComponent } from "@vue/composition-api";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default defineComponent({
  // setup(props, context) {
  //   return {
  //     toIDRWithDotFormat,
  //   };
  // },
  props: ["value", "item"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    return {
      dialog,
      toIDRWithDotFormat,
    };
  },
});
</script>
