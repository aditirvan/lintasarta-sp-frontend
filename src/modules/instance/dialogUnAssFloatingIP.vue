<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Unassign Floating IP</div>
      </v-card-text>                        

      <v-card-text>
        <p class="titletext">IP Address</p>
        <v-select
          id="selectedVPCPortFloatingIP"
          placeholder="Select IP Address"
          :items="vpcportfloatingipItems"
          v-model="selectedVPCPortFloatingIP"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="selectedVPCPortFloatingIPError"
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
              @click="() => {
                    unassignFloatingIP();                    
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

              Unassign
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>    
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
import libProject from "@/lib/project";
import localstorage from "@/lib/localstorage";
import { useVpc } from "./compositionapi/usevpc";

export default {
  props: ["value", "item"],
  components: {
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
    const selectedVPCPortFloatingIP = ref("")
    const selectedVPCPortFloatingIPError = ref("");
    const vpcportfloatingipItems = ref([]);    

    const { addfloatingip, UNASSIGN_FLOATING_IP } = useNamespacedActions(
      "NETWORKFLOATINGIP",
      ["addfloatingip", "UNASSIGN_FLOATING_IP"]
    );    
    const { fetchPaginatedInstances } = useNamespacedActions(INSTANCE, [
      "fetchPaginatedInstances",
    ]);

    const useComposable = {      
      ...useVpc(),
    };    

    async function getVpcPorts() {      
      const vpcportfloatingips = await useComposable.fetchvpcportfloatingips(props.item.id);
        vpcportfloatingipItems.value = vpcportfloatingips.map((vpcportfip) => {
            return {
                text: vpcportfip.vpc_name + " (" + vpcportfip.vpc_name_port + "/" + vpcportfip.ip_address_internal + ")" + " (" + vpcportfip.ip_address + ")",
                value: vpcportfip.floating_ip_id,
            };
        });
    }

    const unassignFloatingIP = async () => {        
        loading.value = true;            
        try {
            let response = await UNASSIGN_FLOATING_IP(selectedVPCPortFloatingIP.value);
            emit("input", false);
            if (response.status === 200) await fetchPaginatedInstances();                  
        } catch (error) {
            console.log(error);
        }
        loading.value = false;
    };    

    onMounted(async () => {            
      getVpcPorts();
    })

    return {
      dialog,
      loading,            
      vpcportfloatingipItems,
      selectedVPCPortFloatingIP,
      selectedVPCPortFloatingIPError,
      unassignFloatingIP,
    };
  },
  computed: {        
  },
  methods: {    
    onChangeHandler(e) {      
    },
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
