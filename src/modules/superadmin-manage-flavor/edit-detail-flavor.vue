<template>
  <div>
    <v-dialog v-model="dialogEdit" max-width="900">
      <v-card class="rounded-lg elevation-0">
        <v-container class="px-7 py-4" fluid>
          <v-row v-if="statusAction == 'detail'">
            <v-col cols="12">
              <v-card class="rounded-lg" flat>
                <v-container fluid class="px-7 py-4">
                  <v-card flat outlined class="rounded-lg">
                    <v-row
                      ><v-col cols="12">
                        <v-card-text class="headline font-weight-bold font--text">Detail Flavor</v-card-text>
                        <v-divider></v-divider>
                        <v-card-text class="pb-0">
                          <v-row>
                            <v-col sm="12" md="6" class="pt-0 pb-0"
                              ><p class="mb-1">Name</p>
                              <span class="font-weight-bold font--text">{{ editFlavor.flavor_name }}</span>
                            </v-col>
                            <v-col sm="12" md="6" class="pt-0 pb-0"
                              ><p class="mb-1">Region</p>
                              <span class="font-weight-bold font--text">{{ editFlavor.region || "-" }}</span>
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <v-card-text class="pb-0">
                          <v-row>
                            <v-col sm="12" md="6" class="pt-0 pb-0"
                              ><p class="mb-1">Type</p>
                              <span class="font-weight-bold font--text">{{ getNameType(editFlavor.type_id) }}</span>
                            </v-col>
                            <v-col sm="12" md="6" class="pt-0 pb-0"
                              ><p class="mb-1">Status</p>
                              <span class="font-weight-bold font--text text-capitalize">{{ editFlavor.status }}</span>
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <v-card-text class="pb-0">
                          <v-row>
                            <v-col sm="12" md="6" class="pt-0 pb-0"
                              ><p class="mb-1">GPU</p>
                              <span class="font-weight-bold font--text">{{ editFlavor.gpu }} GB</span>
                            </v-col>
                            <v-col sm="12" md="6" class="pt-0 pb-0"
                              ><p class="mb-1">RAM</p>
                              <span class="font-weight-bold font--text">{{ editFlavor.ram }} GB</span>
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <v-card-text class="pb-0">
                          <v-row>
                            <v-col sm="12" md="6" class="pt-0 pb-0"
                              ><p class="mb-1">vCPU</p>
                              <span class="font-weight-bold font--text">{{ editFlavor.vcpu }} vCPU</span>
                            </v-col>
                            <v-col sm="12" md="6" class="pt-0 pb-0"
                              ><p class="mb-1">Description</p>
                              <span class="font-weight-bold font--text">{{ editFlavor.description }}</span>
                            </v-col>
                            <!-- <v-col sm="12" md="6" class="pt-0 pb-0"
                              ><p class="mb-1">Root Disk</p>
                              <span class="font-weight-bold font--text">{{ editFlavor.root_disk }}</span>
                            </v-col> -->
                          </v-row>
                        </v-card-text>

                        <br />
                        <br />
                        <br />
                        <br />
                        <v-card-text class="pb-0">
                          <v-row>
                            <v-col cols="6">
                              <v-btn depressed color="#a5b3bf" class="white--text" block height="50" @click="onCancel()">
                                <span class="fz-16">Back</span>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-container>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="statusAction == 'edit'">
            <v-col>
              <div class="headline font-weight-bold font--text">Edit Flavor</div>
            </v-col>

            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"
                  ><p class="font-weight-bold">Type</p>
                  <v-select outlined :items="listTypeFlavor" item-text="name" item-value="id" v-model="editFlavor.type_id" disabled></v-select>
                </v-col>
                <v-col sm="12" md="6" class="pt-0 pb-0">
                  <p class="font-weight-bold">Region</p>
                  <v-select :items="selectRegions" :value="editFlavor.region" item-text="text" item-value="text" outlined disabled></v-select>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"
                  ><p class="font-weight-bold">Name</p>
                  <v-text-field outlined :value="editFlavor.flavor_name" disabled></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"
                  ><p class="font-weight-bold">vCPU</p>
                  <v-text-field outlined :value="editFlavor.vcpu" suffix="Unit" disabled></v-text-field>
                </v-col>
                <v-col sm="12" md="6" class="pt-0 pb-0">
                  <p class="font-weight-bold">RAM</p>
                  <v-text-field outlined :value="editFlavor.ram" suffix="GB" disabled></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"
                  ><p class="font-weight-bold">GPU</p>
                  <v-text-field outlined :value="editFlavor.gpu" suffix="GB" disabled></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"
                  ><p class="font-weight-bold">Description</p>
                  <v-textarea
                    outlined
                    v-model="description"
                    @blur="$v.description.$touch()"
                    :error-messages="$v.description.$errors.length ? $v.description.$errors[0].$message : ''"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text class="pb-0">
              <v-row>
                <v-col>
                  <v-btn depressed color="#a5b3bf" class="white--text" block height="50" @click="onCancel()">
                    <span class="fz-16">Cancel</span>
                  </v-btn>
                </v-col>

                <v-col cols="6">
                  <v-btn depressed block height="50" class="secondary" @click="onSubmit()" :loading="loadingUpdateFlavor"
                    ><span class="fz-16">Submit</span></v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "@vue/composition-api";
import { minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEFLAVOR } from "./namespace";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
// import { SUPERADMINMANAGEPRICING } from "../superadmin-manage-pricing/namespace";
export default {
  props: {
    editFlavor: {
      type: Object,
      default: () => {},
    },
    statusAction: {
      type: String,
      default: "",
    },
    dialogEdit: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const { loadingUpdateFlavor, listTypeFlavor } = useNamespacedGetters(SUPERADMINMANAGEFLAVOR, ["loadingUpdateFlavor", "listTypeFlavor"]);
    const { getTypeFlavors, updateFlavor, fetchManageInstanceFlavors } = useNamespacedActions(SUPERADMINMANAGEFLAVOR, [
      "getTypeFlavors",
      "updateFlavor",
      "fetchManageInstanceFlavors",
    ]);
    const { selectregionsbystatus: selectRegions, fetchregionbystatus } = useRegion();

    onMounted(() => {
      getTypeFlavors();
      fetchregionbystatus();
    });

    const description = computed({
      get: () => props.editFlavor.description,
      set: (val) => {
        props.editFlavor.description = val;
      },
    });

    const onSubmit = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      const params = {
        id: props.editFlavor.id,
        body: { description: description.value },
      };
      console.log("params", params);
      const response = await updateFlavor(params);

      if (response.status == 200) {
        context.emit("update:dialog-edit", false);
      }
    };
    const $v = useVuelidate(
      {
        description: {
          required: helpers.withMessage("Description couldnt be empty.", (val) => {
            return val;
          }),
        },
      },
      {
        description,
      }
    );

    const getNameType = (val) => {
      const data = listTypeFlavor.value.find((ele) => ele.id == val);
      return data?.name;
    };
    const onCancel = () => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      fetchManageInstanceFlavors(params);
      context.emit("update:dialog-edit", false);
    };

    return {
      $v,
      onSubmit,
      loadingUpdateFlavor,
      selectRegions,
      getNameType,
      description,
      listTypeFlavor,
      onCancel,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
