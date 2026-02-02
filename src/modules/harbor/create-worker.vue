<template>
  <v-dialog max-width="670" v-model="dialog">
    <v-card ref="form" class="pt-7">
        <v-card-text>
          <div class="headline font-weight-bold font--text">{{ header == 'add' ? 'Add' : 'Edit' }} Worker</div>
        </v-card-text>
         <v-card-text>
          <!-- <v-col cols="12" md="6"> -->
            <p class="font-weight-bold">Flavor Worker</p>
            <v-slide-group class="py-4 pt-0" show-arrows="always" mandatory style="margin-bottom:-25px; margin-left:-20px;">
              <template v-slot:prev>
                <span aria-hidden="true" class="v-icon notranslate v-icon--disabled theme--light">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg">
                    <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
                  </svg>
                </span>
              </template>
              <template v-slot:next>
                <span aria-hidden="true" class="v-icon notranslate theme--light">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                  </svg>
                </span>
              </template>
              <v-col class="d-flex pt-0 flex-wrap pb-0">
                <v-card
                      v-if="listFlavorDekaHarbor.length === 0"
                      width="170"
                      height="175"
                      border-color="primary"
                      outlined
                      class="rounded-lg select-flavor mb-5"
                      style="display: flex; align-items: center;"
                      disabled
                    >
                    <v-card-text class="pb-0 text-center">
                      <p class="mb-0">There is no available flavor</p>
                    </v-card-text>
                </v-card>
                <v-sheet
                      v-if="listFlavorDekaHarbor.length"
                      max-width="100%"
                      class="mt-0"
                      id="col_instanceselected"
                    >
                      <v-slide-group
                        class="py-4 pt-0"
                        active-class="success"
                        show-arrows
                      >
                        <v-card
                          v-for="(item, index) in listFlavorDekaHarbor"
                          :key="'flavor-'+index"
                          @click="
                        () => {
                          flavordkh = item;
                        }
                      "
                          border-color="primary"
                          outlined
                          class="rounded-lg select-flavor"
                          :class="{
                        selected: isObjectEqual(flavordkh, item),
                      }"
                          style="margin-right: 20px; min-width: 170px"
                          :style="{
                        // border: $v.flavordkh.$errors.length ? '1px solid #eb5757 !important' : '',
                      }"
                        >
                          <v-card-text class="pb-0 text-center">
                            <p class="ma-0 pb-2">{{item.name}}</p>
                          </v-card-text>
                          <v-divider />
                          <div>
                            <v-card-text class="pb-0 text-center">
                              <p class="font-weight-bold mb-0">
                                {{ `${toIDRWithDotFormat(item.price_per_month)}/mo` }}
                              </p>
                              <p>
                                {{ `${toIDRWithDotFormat(item.price_per_hour)}/hour` }}
                              </p>
                            </v-card-text>
                            <v-divider />
                            <v-card-text
                              class="m-0 p-0 text-center"
                              style="padding: 20px"
                            >
                              <p class="fz-12 p-0" style="margin-bottom: 0">
                                <b>{{ item.vcpu }} CPU</b> / {{ item.ram }} GB
                                Memory
                                <br />
                              </p>
                              <p
                                v-if="item.outOfStock"
                                class="mb-0"
                                style="font-size: 10px"
                              >
                                Out of Stock
                              </p>
                            </v-card-text>
                          </div>
                        </v-card>
                      </v-slide-group>
                    </v-sheet>
              </v-col>
            </v-slide-group>
            <span v-if="$v.flavordkh.$errors.length" class="red--text">{{ $v.flavordkh.$errors[0].$message }}</span>
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">
            Count Node
            <v-tooltip class="ml-2" right max-width="45%">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="grey"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-information
                </v-icon>
              </template>
              <p class="white--text my-1">
              Maximum creating node is 10
              </p>
            </v-tooltip>
          </p>
          <v-text-field
            type="number"
            maxlength="100"
            placeholder="Count Node"
            flat
            outlined
            v-model="count"
            :error-messages="$v.count.$errors.length ? $v.count.$errors[0].$message : ''"
            ></v-text-field>
        </v-card-text>

        <v-card-text>
          <v-row>
            <v-col>
              <v-btn
              :disabled="isLoadingBtn"
              depressed
              height="45"
              block
              class="accent"
              @click="
                () => {
                  dialog = false
                }
              "
              >Cancel</v-btn>
            </v-col>
            <v-col>
              <v-btn
              :loading="isLoadingBtn"
              :disabled="isLoadingBtn"
              id="Add"
              depressed
              height="45"
              block
              class="secondary"
              @click="create"
              >{{ header == 'add' ? 'Create' : 'Update' }}</v-btn>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { onMounted, ref } from '@vue/composition-api';
import useVuelidate from '@vuelidate/core';
import { isObjectEqual } from '@/lib/object'
import { toIDRWithDotFormat } from "@/lib/formatter";
import { required, minValue, maxValue } from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { HARBOR, HARBORBILLING } from './namespace';

export default {
  props: ["value", "header", "selectedItem"],
  setup(props, context) {
    const { createWorker, fetchFlavors } = useNamespacedActions(HARBOR, ["createWorker", "fetchFlavors"])
    const { isLoadingBtn, getFlavors } = useNamespacedGetters(HARBOR, ["isLoadingBtn", "getFlavors"])
    const { getFlavorDekaHarbor } = useNamespacedActions(HARBORBILLING, ["getFlavorDekaHarbor"]);
    const { listFlavorDekaHarbor } = useNamespacedGetters(HARBORBILLING, ["listFlavorDekaHarbor"]);

    const { harborid } = context.root._route.params;
    const userId = JSON.parse(localStorage.getItem("userId"))
    const currentProj = JSON.parse(localStorage.getItem('currentProj'))

    const { dialog } = useDialog(props, context)
    const count = ref()
    const flavorWorker = ref()
    const flavordkh = ref()
    const flavors = ref([
      {
        text: "1 VCPU/2GB RAM", 
        value: "m1.small"
      },
      {
        text: "2 VCPU/4GB RAM",
        value: "m1.medium"
      },
      {
        text: "2 VCPU/8GB RAM",
        value: "m1.large"
      },
      {
        text: "4 VCPU/16GB RAM",
        value: "m1.xlarge"
      },
      {
        text: "8 VCPU/32GB RAM",
        value: "m1.2xlarge"
      },
      ])

    const $v = useVuelidate(
      {
        count:{ required, minValue: minValue(1), maxValue: maxValue(10) },
        flavordkh: { required },
      },
      {
        count,
        flavordkh
      })

    const create = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return

      let payload = {
        user_id: userId,
        openstack_project_id: currentProj.openstack_project_id,
        organization_id: currentProj.organization_id,
        harbor_id: harborid,
        count: parseInt(count.value),
        item_id: flavordkh.value.id,
        flv_id: flavordkh.value.flavor_id,
        flavor: flavordkh.value.name,
        add_item_relation: true,
      }
      // console.log(payload)
      let resp = await createWorker(payload)
      // console.log(resp)
      if(resp.status == 200){
        context.emit('refreshTable')
        dialog.value = false
      }else{
        console.log(resp)
        dialog.value = false
      }
    }

    onMounted(async() => {
      fetchFlavors()
      const paramsFlavorHarbor = new URLSearchParams();
      paramsFlavorHarbor.append("service_name", "Additional Node");
      paramsFlavorHarbor.append("project_id", currentProj.id);
      getFlavorDekaHarbor(paramsFlavorHarbor)
    })

    return{
      dialog,
      count,
      create,
      $v,
      isLoadingBtn,
      flavors,
      flavorWorker,
      getFlavors,
      listFlavorDekaHarbor,
      flavordkh,
      isObjectEqual,
      toIDRWithDotFormat,
    }
  },
}
</script>

<style scoped>
.selected {
  border-color: #2c94d2;
}
</style>