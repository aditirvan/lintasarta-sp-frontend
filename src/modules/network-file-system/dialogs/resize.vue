<template>
    <v-dialog v-model="dialog" max-width="800">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pb-4">Increase NFS Size</div>
        </v-card-title>
        <v-card-subtitle flat class="rounded-lg">

        <!-- <v-text-field
          maxlength="50"
          :error-messages="$v.size.$errors.length ? $v.size.$errors[0].$message : ''" 
          id="Size"
          v-model="size"
          @keydown="(ev) => (size = addGBText(ev, size))" outlined placeholder="Input Size">
        </v-text-field> -->

          <v-row>
            <v-col class="pb-0" cols="12">
              <p>
                <span class="font-weight-bold mb-0">Select size for your NFS. Must be greater than {{ nfs_detail.size }} GB. This change is not reversible</span>
                <span
                :class="{
                  'error--text': $v.selectedFlavor.$errors.length,
                }" class="ml-2" style="font-size: 10px; position: absolute" v-if="$v.selectedFlavor.$errors.length">
                *{{ $v.selectedFlavor.$errors[0].$message }}</span>
                <span
                :class="{
                  'error--text': $v.customQuota.$errors.length,
                }" class="ml-2" style="font-size: 10px; position: absolute" v-if="$v.customQuota.$errors.length">
                *{{ $v.customQuota.$errors[0].$message }}</span>
              </p>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-slide-group class="py-0" active-class="success" show-arrows>
                <v-col class="d-flex flex-row flex-wrap pb-0">
                  <v-card
                    tabindex="0"
                    min-width="120"
                    :class="{
                      bordererror: $v.selectedFlavor.$errors.length,
                      highlight: isCustomQuotaHighlighted,
                      selected: isCustomQuotaHighlighted,
                    }"
                    @click="
                      () => {
                        isCustomQuotaHighlighted = true;
                        selectedFlavor = null;
                      }
                    "
                    border-color="primary"
                    outlined
                    class="rounded-lg d-flex flex-column select-storage mb-4"
                    style="text-align: center; margin-right: 20px"
                  >
                    <v-card-text class="pb-0 pt-4 d-flex flex-column align-start m-0">
                      <!-- <div v-if="objectStorageDiscount && objectStorageDiscount > 0 && customQuota">
                        <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateCustomVolumeSize()) }}/mo</p>
                        <p class="font-weight-bold blue--text mb-1">{{ toIDRWithDotFormat(calculateCustomVolumeSize(objectStorageDiscount)) }}/mo</p>

                        <p class="body-2 mb-0" style="text-decoration: line-through">
                          {{ toIDRWithDotFormat(calculateCustomVolumeSize(undefined, "hour")) }}/hour
                        </p>
                        <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateCustomVolumeSize(objectStorageDiscount, "hour")) }}/hour</p>
                      </div> -->
                      <!-- <div>
                        <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateCustomVolumeSize()) }}/mo</p>
                        <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateCustomVolumeSize(undefined, "hour")) }}/hour</p>
                      </div> -->
                    </v-card-text>
                    <!-- <v-divider /> -->
                    <v-card-text class="pa-0 mt-auto">
                        <!-- @keydown="(ev) => (customQuota = addGBText(ev, customQuota))" -->
                      <v-text-field
                        v-model="customQuota"
                        maxlength="50"
                        class="px-4 pt-2 mt-2 label-bold"
                        style="width: 140px"
                        flat
                        suffix="GB"
                        label="Enter Size"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                      <!-- highlight: isCustomQuotaHighlighted,
                      selected: isCustomQuotaHighlighted, -->
                  <v-card 
                    v-for="flavor in flavor_list.filter(x => x.size > nfs_detail.size)"
                    class="rounded-lg select-storage mb-4"
                    width="120" 
                    :key="flavor.id" 
                    @click="() => {
                      selectedFlavor = flavor
                      isCustomQuotaHighlighted = false
                      customQuota = null
                    }" 
                    :class="{
                      bordererror: $v.selectedFlavor.$errors.length,
                      highlight: selectedFlavor && selectedFlavor.id == flavor.id,
                      selected: selectedFlavor && selectedFlavor.id == flavor.id,
                    }"
                    border-color="primary" 
                    outlined 
                    style="text-align: center; margin-right: 20px" 
                    :style="{border: $v.selectedFlavor.$errors.length ? '1px solid #eb5757 !important' : ''}">
                      <!-- <v-card-text class="pb-0 pt-5"> -->
                        <!-- <div>
                          <p class="font-weight-bold">
                            {{ flavor.name }}
                          </p>
                        </div> -->
                        <!-- <div>
                          <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateVolumeSize(flavor.month_price)) }}/mo</p>
                          <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateVolumeSize(flavor.hour_price)) }}/hour</p>
                        </div>
                      </v-card-text>
                      <v-divider /> -->
                      <!-- <v-card-text class="d-flex flavor-card">
                        <p class="mb-0">{{ flavor.storage_type }}</p>
                      </v-card-text>
                      <v-divider /> -->
                      <v-card-text class="d-flex flavor-card mt-2">
                      <!-- <v-text-field
                        v-model="size"
                        class="px-4 pt-2 input-center"
                        value="0"
                        label="Enter Size in GB"
                        @keydown="(ev) => (size = addGBText(ev, size))"
                        suffix="GB"
                        flat
                      >
                      </v-text-field> -->
                      <p class="mb-0">{{ flavor.size }} GB</p>
                    </v-card-text>
                    <!-- <v-card-text class="pa-0" v-else>
                      <v-text-field disabled value="0 GB" class="px-4 pt-2 input-center" max="0" flat> </v-text-field>
                    </v-card-text> -->
                  </v-card>
                </v-col>
              </v-slide-group>
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-card-actions>
          <v-row>
            <v-col cols="6">
              <v-btn color="accent" block depressed height="50" :disabled="resizeLoading" @click="dialog = false">Cancel</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
              :disabled="resizeLoading"
              :loading="resizeLoading"
                color="primary"
                block
                height="50"
                @click="() => {resize()}"
                depressed>
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>


<script>
import { ref, computed, onMounted } from "@vue/composition-api";
import { addGBText, removeGBText } from '@/lib/formatter';
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { NFS } from "@/modules/network-file-system/namespace";
import useVuelidate from "@vuelidate/core";
import { required, requiredIf, minValue, helpers } from "@vuelidate/validators";

export default {
  props: ["value", "nfs_detail", "nfs_id"],
  setup(props, context) {
    const resizeLoading = ref(false)
    const size = ref(0);
    const selectedFlavor = ref(null);
    const customQuota = ref(null);
    const isCustomQuotaHighlighted = ref(false);

    const { updateNFS, getNFSList, fetchFlavor } = useNamespacedActions(NFS, ["updateNFS", "getNFSList", "fetchFlavor"]);
    const { flavor_list } = useNamespacedState(NFS, ['flavor_list'])


    const $v = useVuelidate(
      {
        // size: { required },
        customQuota: {
          minimumVal: helpers.withMessage(`The minimum size allowed is ${parseInt(props.nfs_detail.size)+1} GB`, (val) => {
            if(selectedFlavor.value === null && isCustomQuotaHighlighted.value){
              if(val < (parseInt(props.nfs_detail.size)+1)){
                return false
              }
              return true
            }
            return true
          })
        },
        selectedFlavor: { 
          required: requiredIf((val) => {
            return customQuota.value === null && !isCustomQuotaHighlighted.value;
          }),
         },
      },
      { 
        // size
        selectedFlavor, customQuota 
      }
    );

    onMounted(async() => {
      await fetchFlavor({params:{minimal_size:props.nfs_detail.size}})
    })

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        context.emit("input", val);
      },
    });

    async function resize() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      let payload = {}
      if (selectedFlavor.value){
        // payload.flavor = selectedFlavor.value.id

        // HARDCODE
        payload.custom_flavor = {size:parseInt(selectedFlavor.value.size)}
      }else{
        payload.custom_flavor = {size:parseInt(customQuota.value)}
      }
      resizeLoading.value = true
      let res = await updateNFS({
        id: props.nfs_detail.id,
        payload: payload
      });
      resizeLoading.value = false
      if (res && res.status >= 200 && res.status <= 300) {
        await getNFSList({params:{project_id:props.nfs_detail.project_id}});
      }
      dialog.value = false;
    }

    return {
        resizeLoading,
        size,
        dialog,
        $v,
        flavor_list,
        addGBText,
        resize,
        selectedFlavor,
        customQuota,
        isCustomQuotaHighlighted
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
.select-storage {
  cursor: pointer;
  &.selected {
    border-color: #2c94d2;
    .v-divider {
      border-color: #2c94d2;
    }
  }
}
.bordererror {
  border: 1px solid red;
}
</style>