<template>
  <div>
    <v-row v-show="!ready">
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7" class="pt-0">
                <div v-if="$route.params.sg_id" class="firewall-title">
                  Edit Security Group
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div>
                  <h3 class="text-center"><u>Loading ...</u></h3>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-show="ready">
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7" class="pt-0">
                <div class="firewall-title">
                  Edit Security Group
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <p class="font-weight-bold">Name</p>
                <v-text-field
                  maxlength="50"
                  ref="refname"
                  placeholder="Insert Name"
                  single-line
                  outlined
                  disabled
                  v-model="name"
                  :error-messages="
                    nameValidation.$errors.length
                      ? nameValidation.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <p class="font-weight-bold">Description</p>
                <v-textarea
                  maxlength="200"
                  ref="refdescription"
                  placeholder="Insert Description"
                  single-line
                  outlined
                  disabled
                  v-model="description"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="font-weight-bold fz-21 mb-0">Inbound Rule</p>
                <v-spacer />
                <v-btn
                  width="167"
                  class="success mr-4"
                  depressed
                  @click="addInbound()"
                  >New Rule
                </v-btn>
              </v-col>
            </v-row>
            <div class="balance-table">
              <v-simple-table style="min-height: 229px">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Ether Type</th>
                    <th>Protocol</th>
                    <th>
                      Port Range (Min/Max)
                      <v-tooltip class="" right max-width="45%">
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
                          allowed ports are only {{ SGRules.allowed_port }}
                        </p>
                      </v-tooltip>
                    </th>
                    <th>Sources</th>
                    <!-- <th>Description</th> -->
                    <th class="text-center">Action</th>
                  </tr>
                </thead>
                <tbody v-if="inbound && inbound.length">
                  <tr
                    class="row-rules"
                    style="vertical-align: top"
                    v-for="(rule, i) in inbound"
                    :key="i"
                  >
                    <td>
                      <v-select
                        v-model="rule.type"
                        :items="selecttype"
                        @change="changePort('inbound', rule.type, i)"
                        outlined
                      ></v-select>
                    </td>
                    <td>
                      <v-select
                        v-model="rule.ethertype"
                        :items="selectethertype"
                        outlined
                      ></v-select>
                    </td>
                    <td>
                      <v-text-field
                        maxlength="50"
                        outlined
                        v-model="rule.protocol"
                        :disabled="
                          [
                            'tcp',
                            'udp',
                            'icmp',
                            'HTTP',
                            'HTTPS',
                            'SSH',
                            '',
                          ].includes(rule.type)
                        "
                      ></v-text-field>
                    </td>
                    <td style="width:20%">
                      <v-row>
                        <v-col sm="12" md="6" style="padding: 0 !important">
                          <v-text-field
                            maxlength="50"
                            class="mr-2"
                            placeholder="Min"
                            outlined
                            v-model="rule.port_range_min"
                            :disabled="
                              ['HTTP', 'HTTPS', 'SSH', ''].includes(rule.type)
                            "
                          ></v-text-field>
                        </v-col>
                        <v-col sm="12" md="6" style="padding: 0 !important">
                          <v-text-field
                            maxlength="50"
                            placeholder="Max"
                            outlined
                            v-model="rule.port_range_max"
                            :disabled="
                              ['HTTP', 'HTTPS', 'SSH', ''].includes(rule.type)
                            "
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </td>
                    <td>
                      <v-text-field
                        maxlength="50"
                        outlined
                        v-model="rule.sources"
                        placeholder="0.0.0.0/0"
                      ></v-text-field>
                    </td>
                    <!-- <td>
                      <v-text-field
                        maxlength="50"
                        outlined
                        v-model="rule.description"
                        placeholder="Description"
                      ></v-text-field>
                    </td> -->
                    <td>
                      <v-btn
                      :disabled="i < lengthAllowedPort"
                        @click="
                          () => {
                            deleteInbound(i);
                          }
                        "
                        color="error"
                        depressed
                        width="167"
                        >Delete</v-btn
                      >
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="6" class="text-center">No data available</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </div>
            <br />

            <!-- <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="font-weight-bold fz-21 mb-0">Outbond Rule</p>
                <v-spacer />
                <v-btn
                  width="167"
                  class="success mr-4"
                  depressed
                  @click="addOutbound()"
                  >New Rule
                </v-btn>
              </v-col>
            </v-row>
            <div class="balance-table">
              <v-simple-table style="min-height: 229px">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Ether Type</th>
                    <th>Protocol</th>
                    <th>Port Range (Min/Max)</th>
                    <th>Destinations</th>
                    <th>Description</th>
                    <th class="text-center">Action</th>
                  </tr>
                </thead>
                <tbody v-if="outbound && outbound.length">
                  <tr
                    style="vertical-align: top"
                    class="row-rules"
                    v-for="(rule, i) in outbound"
                    :key="i"
                  >
                    <td>
                      <v-select
                        v-model="rule.type"
                        @change="changePort('outbound', rule.type, i)"
                        :items="selecttype"
                        outlined
                      ></v-select>
                    </td>
                    <td>
                      <v-select
                        v-model="rule.ethertype"
                        :items="selectethertype"
                        outlined
                      ></v-select>
                    </td>
                    <td>
                      <v-text-field
                        maxlength="50"
                        placeholder="22"
                        outlined
                        v-model="rule.protocol"
                        :disabled="
                          [
                            'tcp',
                            'udp',
                            'icmp',
                            'HTTP',
                            'HTTPS',
                            'SSH',
                            '',
                          ].includes(rule.type)
                        "
                      ></v-text-field>
                    </td>
                    <td>
                      <v-row>
                        <v-col sm="12" md="6" style="padding: 0 !important">
                          <v-text-field
                            maxlength="50"
                            class="mr-2"
                            placeholder="Min"
                            outlined
                            v-model="rule.port_range_min"
                            :disabled="
                              ['HTTP', 'HTTPS', 'SSH', ''].includes(rule.type)
                            "
                          ></v-text-field>
                        </v-col>
                        <v-col sm="12" md="6" style="padding: 0 !important">
                          <v-text-field
                            maxlength="50"
                            placeholder="Max"
                            outlined
                            v-model="rule.port_range_max"
                            :disabled="
                              ['HTTP', 'HTTPS', 'SSH', ''].includes(rule.type)
                            "
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </td>
                    <td>
                      <v-text-field
                        maxlength="50"
                        outlined
                        v-model="rule.sources"
                        placeholder="0.0.0.0/0"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-text-field
                        maxlength="50"
                        outlined
                        v-model="rule.description"
                        placeholder="Description"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-btn
                        color="error"
                        depressed
                        width="167"
                        @click="deleteOutbound(i)"
                        >Delete</v-btn
                      >
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="6" class="text-center">No data available</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </div> -->

            <br />
            <!-- <v-row>
              <v-col cols="6">
                <p class="font-weight-bold">Apply to Instance</p> -->
                <!-- <v-autocomplete
                  id="SelectInstance"
                  v-model="instancesselected"
                  :no-data-text="
                    isInstancesLoading ? 'Loading..' : 'No data available'
                  "
                  outlined
                  :items="
                    instances.filter((x) =>
                      ['ACTIVE', 'SHUTOFF'].includes(x.state)
                    )
                  "
                  item-text="instanceName"
                  item-value="id"
                  multiple
                  placeholder="Search for an instance"
                  @change="() => {}"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip>
                      <span>{{ item.instanceName }}</span>
                      <v-icon
                        @click.stop="
                          () => {
                            deleteselect(item.instanceName);
                          }
                        "
                        small
                        >mdi-close</v-icon
                      >
                    </v-chip>
                  </template>
                </v-autocomplete> -->
                <!-- <v-select
                  placeholder="Choose Instances"
                  append-icon="mdi-chevron-down"
                  :items="instanceSecurity"
                  item-text="name"
                  item-value="id"
                  v-model="instancesselected"
                  outlined
                  single-line
                  multiple
                ></v-select>
              </v-col>
            </v-row> -->

            <v-row>
              <v-col cols="6">
                <!-- <router-link to="/security"> -->
                  <v-btn
                  @click="$router.go(-1)"
                    :disabled="isLoadingBtn"
                    block
                    class="accent"
                    style="font-size: 16px"
                  >
                    Cancel
                  </v-btn>
                <!-- </router-link> -->
              </v-col>
              <v-col cols="6" v-if="user.role.toLowerCase() !== 'superadmin'">
                <v-btn
                  :disabled="isLoadingBtn"
                  :loading="isLoadingBtn"
                  @click="
                    () => {
                      UpdateSecurity();
                    }
                  "
                  block
                  class="secondary"
                  depressed
                  style="font-size: 16px"
                >
                  Save
                </v-btn>
              </v-col>
              <v-col cols="6" v-else>
                <v-btn
                  :disabled="isLoadingBtn"
                  :loading="isLoadingBtn"
                  @click="
                    () => {
                      UpdateSecurity();
                    }
                  "
                  block
                  class="secondary"
                  depressed
                  style="font-size: 16px"
                >
                  Save
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { useCreateSecurity } from "./useCreateSecurity";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { HARBOR } from "../namespace";
import { mapGetters } from "vuex";

export default defineComponent({
  components: {},
  setup(props, context) {
    const { fetchSecurityGroupRules } = useNamespacedActions(HARBOR, ["fetchSecurityGroupRules"])
    const { SGRules, inRules, outRules } = useNamespacedGetters(HARBOR, ["SGRules", "inRules", "outRules"])
    const ready = ref(false);
    const { harborid, sg_id } = context.root.$route.params;
    const Composable = {
      ...useCreateSecurity(props, context),
    };

    const instanceSecurity = ref([]);
    const {
      inbound,
      outbound,
      setSecurityEdit,
      instancesselected,
      fetchinstances,
    } = Composable;

    const lengthAllowedPort = ref()

    onMounted(async () => {
      ready.value = false
      await fetchSecurityGroupRules({harborid: harborid, sg_id: sg_id})
      setSecurityEdit(SGRules.value)

      inbound.value = inRules.value.length ? inRules.value : [] 
      outbound.value = outRules.value.length ? outRules.value : []
      let splitAllowedPort = SGRules.value.allowed_port.split(',')
      lengthAllowedPort.value = splitAllowedPort.length
      // const tempInstance = await fetchinstances({except_no_exist:true, no_detail:true, except_error:true});
      // if (tempInstance.instances){
      //   for (let index = 0; index < tempInstance.instances.length; index++) {
      //     const element = tempInstance.instances[index];
      //     instanceSecurity.value.push({id:element.id ,name:element.name})
      //   }
      // }
      ready.value = true
    });
    
    const changePort = (ref: any, type: any, index: number) => {
      const dataset = ref == "inbound" ? inbound : outbound;
      if (type === "SSH") {
        dataset.value[index].port_range_min = "22";
        dataset.value[index].port_range_max = "22";
        dataset.value[index].protocol = "TCP";
      } else if (type === "HTTP") {
        dataset.value[index].port_range_min = "80";
        dataset.value[index].port_range_max = "80";
        dataset.value[index].protocol = "TCP";
      } else if (type === "HTTPS") {
        dataset.value[index].port_range_min = "443";
        dataset.value[index].port_range_max = "443";
        dataset.value[index].protocol = "TCP";
      }  else if (type === "") {
        dataset.value[index].port_range_min = "0";
        dataset.value[index].port_range_max = "0";
        dataset.value[index].protocol = "Any";
      }else {
        dataset.value[index].port_range_min = "";
        dataset.value[index].port_range_max = "";
      }

      if (type === "icmp") dataset.value[index].protocol = "ICMP";
      else if (type === "udp") dataset.value[index].protocol = "UDP";
      else if (type === "tcp") dataset.value[index].protocol = "TCP";
    };

    const { isLoading } = useNamespacedState(HARBOR, [
      "isLoading",
    ]);

    const { isLoading: isInstancesLoading } = useNamespacedState("INSTANCE", [
      "isLoading",
    ]);

    return {
      ready,
      changePort,
      isLoading,
      isInstancesLoading,
      instanceSecurity,
      ...Composable,
      SGRules,
      lengthAllowedPort,
      deleteselect(text: string) {
        const index = instancesselected.value.findIndex((a: any) => {
          return a.instanceName == text;
        });
        instancesselected.value.splice(index, 1);
      },
    };
  },
  computed: {
    ...mapGetters({
      projectId: "PROJECT/getprojectid",
      user: "ROLEPERMISSION/getuser",
    }),
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.firewall-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.v-btn {
  height: 50px !important;
  font-size: 14px;
}

h4 {
  padding-bottom: 10px;
}

td,
th {
  width: 17%;
}

.row {
  align-items: center;
}
.v-data-table {
  ::v-deep table {
    border-bottom: 0.5px solid #e0e0e0;
  }
}

td {
  border-bottom: none !important;
  &:first-child {
    padding-left: 0 !important;
  }
  &:last-child {
    text-align: right;
  }
}
</style>

<style scoped>
.v-text-field input {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 140%;
  color: #556272;
}
.row-rules td {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
