<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Default Gateway</p> </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-column">
          <v-row>
            <v-col md="6">
              <p class=" font-weight-bold font-italic">Select a network to be the default gateway</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="5" class=" d-flex">
              <p class="mr-8 font-weight-bold">Configure network delay</p>
            </v-col>
            <v-col md="7" sm="12">
              <v-switch
              class="mt-0 mb-1"
              v-model="value.enabledConfigure"
              inset
              hide-details
              >
              </v-switch>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="6" sm="12" class="pb-0">
              <p class="font-weight-bold pb-0">External Network</p>
            </v-col>
            <v-col md="6" sm="12" class="pb-0">
              <p class="font-weight-bold pb-0">Default Gateway</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6" sm="12" class="pt-0">
              <!-- <v-autocomplete
              v-model="value.externalNetwork"
              :items="itemsNetwork"
              item-text="name"
              item-value="id"
              return-object
              outlined
              single-line
              clearable
              ></v-autocomplete> -->
              <v-card class="bs mb-2 scroll" elevation="1">
                <div>
                  <v-list dense class="pb-0">
                    <v-list-item-group>
                      <v-list-item v-for="(item, i) in itemsNetwork.itemsNetworkDefault" :key="i">
                        <v-list-item-content class="py-0" >
                          <!-- <v-list-item-title v-text="item.name" class="fz-14-i"></v-list-item-title> -->
                          <v-radio-group :disabled="!value.enabledConfigure" class="my-0 py-0" dense hide-details v-model="value.externalNetwork">
                            <v-radio
                            :key="i"
                            :value="item"
                            >
                              <template v-slot:label>
                                <div class="fz-12" :class="{ 'black--text': value.enabledConfigure }"> {{ item.name }} </div>
                              </template>
                            </v-radio>
                          </v-radio-group>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
              </v-card>
              <p class="red--text font-italic" v-if="$v.rule.defaultGateway.$errors.length">*Please choose the default gateway</p>
            </v-col>
            <v-col md="6" sm="12" class="pt-0">
              <v-card class="bs mb-2 scroll" elevation="1">
                <div>
                  <v-list dense class="pb-0">
                    <v-list-item-group >
                      <v-list-item v-for="(item, i) in value.itemsDefault" :key="i">
                        <v-list-item-content class="py-0">
                          <!-- <v-list-item-title v-text="item.gateway" class="fz-14-i"></v-list-item-title> -->
                          <v-radio-group :disabled="!value.enabledConfigure" class="my-0 py-0" dense hide-details v-model="value.defaultGateway">
                            <v-radio
                            :key="i"
                            :value="item"
                            >
                              <template v-slot:label>
                                <div class="fz-12" :class="{ 'black--text': value.enabledConfigure }"> {{ item.gateway }} </div>
                              </template>
                            </v-radio>
                          </v-radio-group>
                        </v-list-item-content>
                        <!-- <v-list-item-icon>
                          <v-icon small color="red" @click="deleteApp(i)">mdi-close</v-icon>
                        </v-list-item-icon> -->
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <!-- <v-row >
            <v-col md="5" sm="12">
              <p class="font-weight-bold">Default Gateway</p>
            </v-col>
            <v-col md="6" sm="12">
              <v-select
              v-model="value.defaultGateway"
              :items="value.itemsDefault"
              item-text="gateway"
              item-value="gateway"
              return-object
              outlined
              ></v-select>
            </v-col>
          </v-row> -->
        </div>

        <!-- <div class="d-flex">
          <v-row >
            <v-col md="6">
              <p class="font-weight-bold">External Network</p>
              <v-select
              :items="[]"
              outlined
              dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row >
            <v-col md="6">
              <p class="font-weight-bold">Default Gateway</p>
              <v-select
              :items="[]"
              outlined
              dense
              ></v-select>
            </v-col>
          </v-row>
        </div> -->

        <div class="d-flex flex-column">
          <v-row class="">
            <v-col md="5" sm="12" class="py-0 d-flex">
              <p class="mt-4 mr-8 font-weight-bold">Use default gateway for DNS relay</p>
            </v-col>
            <v-col md="7" sm="12">
              <v-switch
              class="mt-0 mb-1"
              v-model="value.enabledUseDns"
              inset
              hide-details
              >
              </v-switch>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-12 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 7" class="white--text fz-12" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api';
import useVuelidate from '@vuelidate/core';
import { required, minValue, requiredIf } from '@vuelidate/validators'

export default {
  props: ["value", "step", "itemsNetwork"],
  setup(props, context) {

    const headers = ref([
      { text: '', value: 'id' },
      { text: "External Network/Subnet", value: "externalNetwork", sortable: false },

    ])
    const dummyOrg = ref([
      {id: 1, externalNetwork: 'Jihan', },
    ])

    const radioTable = ref();

    const $v = useVuelidate(
      {
        rule: {
          defaultGateway: { required: requiredIf(() => props.value.enabledConfigure) },
        }
      },
      {
        rule: props.value,
      })

    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    
    return{
      prev,
      next,
      headers,
      dummyOrg,
      radioTable,
      $v,
    }
  },
}
</script>

<style lang="scss" scoped>
.bs {
  box-shadow: none !important;
  border: 1px solid rgb(2 0 0 / 12%);
}
.scroll {
  height: 150px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}

.fz-14-i {
  font-size: 14px !important;
}
</style>