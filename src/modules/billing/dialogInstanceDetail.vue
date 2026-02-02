<template>
  <v-dialog v-model="dialog" max-width="1066">
    <v-card>
      <v-card-title class="font--text fz-21 font-weight-bold">{{
        title
      }}</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="list" hide-default-footer>
          <template v-slot:item.spec="{ item }">
            <div class="d-flex flex-row align-center">
              <!-- <v-icon style="cursor: pointer" small left id="actualcost"
              @click="emitinfo"
                >$vuetify.icons.infocircleIcon</v-icon
              > -->
              <div style="white-space: pre-line">
                {{ item.spec }} / {{ item.root_disk }}
              </div>
            </div>
          </template>
          <template v-slot:item.billingtype="{ item }">
            {{ item.billingtype }}
          </template>
          <template v-slot:body.append>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <div>
                  <p class="font-weight-bold">Total</p>
                  <p>
                    {{
                      toIDRWithDotFormat(
                        list.reduce((t, v) => t + v.billednumber, 0)
                      )
                    }}
                  </p>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-text>
        <v-btn
          dark
          block
          height="50"
          depressed
          outlined
          class="mb-4 secondary"
          @click="
            () => {
              dialog = false;
            }
          "
          >Close</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useDialog } from "@/composable/usedialog";
import { defineComponent, ref } from "@vue/composition-api";
import { useNamespacedGetters } from "vuex-composition-helpers";
import { BILLING } from "./namespace";
import { toIDRWithDotFormat } from "@/lib/formatter";
export default defineComponent({
  props: ["value", "list", "title"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    const { billingperservice } = useNamespacedGetters(BILLING, [
      "billingperservice",
    ]);

    const headers = ref([
      { text: "Service Name", value: "name", sortable: false },
      { text: "Spesification", value: "spec", sortable: false },
      { text: "Price", value: "price", sortable: false },
      { text: "Billing Type", value: "billingtype", sortable: false },
      { text: "Usage", value: "usage", sortable: false },
      { text: "Billed", value: "billed", align: "left", sortable: false },
    ]);
    return {
      toIDRWithDotFormat,
      headers,
      billingperservice,
      dialog,
      opendialogspecificationinfo: ref(false),
      emitinfo: () => {
        context.emit("info");
      },
    };
  },
});
</script>
