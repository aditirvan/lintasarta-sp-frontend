<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Instance Flavors
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-data-table
          hide-default-footer
          :headers="flavorHeader"
          :items="flavorItems"
          disable-pagination
          v-if="flavorItems && flavorItems.length"
        >
          <template v-slot:item.flavor_name="{ item }">
            <div>
              {{item.package_instance.flavor_name}}
            </div>
          </template>
          <template v-slot:item.discount="{ item }">
            <div>
              {{item.discount}}%
            </div>
          </template>
        </v-data-table>
        <p v-else class="mb-0">
          Instance flavors doesn't have any discount
        </p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="12">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  dialog = false
                }
              "
            >
              <span class="fz-14">Cancel</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang='ts'>
  import { ref } from "@vue/composition-api";
import { useDialog } from '@/composable/usedialog'
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: ["value", 'flavors'],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context)
    
    const flavorHeader = ref([
      { text: "Flavor Name", value: "flavor_name", sortable:false },
      { text: "Percentage", value: "discount", align:"end", sortable:false }
    ]);

    const flavorItems = ref(props.flavors)

    return {
      dialog,
      flavorHeader,
      flavorItems
    }
  },
});
</script>