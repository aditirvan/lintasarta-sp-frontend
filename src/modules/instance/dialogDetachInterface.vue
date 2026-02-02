<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Detach Interface</div>
      </v-card-text>      

      <v-card-text>
        <p class="titletext">Port</p>
        <v-select
          id="selectedVPCPort"
          placeholder="Select Port"
          :items="vpcportItems"
          v-model="selectedVPCPort"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="selectedVPCPortError"
        />
      </v-card-text>                      

      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="
                () => {
                  $emit('input', false);
                }
              "
              :disabled="loading"
            >
              <!-- loading indicator -->
              <beat-loader
                v-if="loading"
                :loading="loading"
                :color="'white'"
                :size="'10px'"
                class="ml-2"
              />

              Cancel
            </v-btn>
          </v-col>

          <v-col>
            <v-btn
              id="Add"
              depressed
              height="45"
              block
              class="secondary"
              @click="processDetachInterface"
              :disabled="loading"
            >
              <!-- loading indicator -->
              <beat-loader
                v-if="loading"
                :loading="loading"
                :color="'white'"
                :size="'10px'"
                class="ml-2"
              />

              Detach
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <dialogFloatingIpConfirmation
      v-if="isShowConfirmDialog"
      :data="confirmDialogData"
      v-model="isShowConfirmDialog"
      @confirm="
        () => {
          submit();
          isShowConfirmDialog = false;
        }
      "
    />
  </v-dialog>
</template>

<script>
import { computed, ref, onMounted } from "@vue/composition-api";
import api from "@/lib/api";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { INSTANCE } from "./namespace";
import { useVoucher } from '@/modules/voucher/useVoucher'
import dialogFloatingIpConfirmation from "../network/floatingip/dialogFloatingIpConfirmation.vue";
import libProject from "@/lib/project";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { useVpc } from "./compositionapi/usevpc";
import localstorage from "@/lib/localstorage";

export default {
  props: ["value", "item"],
  components: {
    dialogFloatingIpConfirmation,
  },
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });
    const loading = ref(false);
    const projJson = localstorage.getItem("currentProj");
    const projObj =  projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};    

    const useComposable = {      
      ...useVpc(),
    };

    async function getVpcs() {      
      const vpcports = await useComposable.fetchvpcports(props.item.id);
      vpcportItems.value = vpcports.map((vpcport) => {
        return {
          text: vpcport.vpc_name + " ("+vpcport.ip_address+")",
          value: vpcport,
        };
      });
    }    
    
    const selectedVPCPort = ref("");
    const selectedVPCPortError = ref("");
    
    const vpcportItems = ref([]);
    const isShowConfirmDialog = ref(false);
    const confirmDialogData = ref(null);
    const floatingIpDiscount  = ref(0);    
    
    const { fetchPaginatedInstances, detachInterface } = useNamespacedActions(INSTANCE, [
      "fetchPaginatedInstances",
      "detachInterface",
    ]);

    const detachInterfaceIns = async (obj) => {
      loading.value = true;
      try {
        const response = await detachInterface(obj); 
        emit("input", false);
        if (response.status === 200) await fetchPaginatedInstances();
      } catch (error) {
        
      }
      loading.value = false;
    };

    const processDetachInterface = async () => {    
      if (!selectedVPCPort.value) {
        selectedVPCPortError.value = "Value is required";
      } else {
        detachInterfaceIns({        
          instance_id: props.item.id,      
          port_id: selectedVPCPort.value.id,          
          project_id: projObj.id,          
          vpc_id: selectedVPCPort.value.vpc_id,          
        });
      }                      
    };

    const submit = () => {
      detachInterfaceIns({
        instance_id: props.item.id,        
        port_id: selectedVPCPort.value.id,          
        project_id: projObj.id,         
        vpc_id: selectedVPCPort.value.vpc_id,           
      });
    };

    onMounted(async () => {    
      getVpcs();
    })

    return {      
      submit,
      confirmDialogData,
      processDetachInterface,
      detachInterfaceIns,
      dialog,
      loading,      
      selectedVPCPort,
      selectedVPCPortError,      
      isShowConfirmDialog,
      vpcportItems,
    };
  },
  computed: {
    
  },
  methods: {    
  },
  mounted() {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
</style>
