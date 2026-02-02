<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Reassign Floating IP</div>
      </v-card-text>                        

      <!-- <v-card-text>
        <p class="titletext">Instance</p>
        <v-select
          id="resourceSelected"
          placeholder="Select Instance"
          :items="instanceItems"
          v-model="resourceSelected"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="resourceSelectedError"
        />
      </v-card-text> -->
      
      <v-card-text>
        <p class="titletext">IP Address</p>
        <v-select
          id="selectedVPCPort"
          placeholder="Select IP Address"
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
              @click="() => {
                    reassignFloatingIP();                                        
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

              Reassign
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
    // const resourceSelected = ref("")
    // const resourceSelectedError = ref("");
    const selectedVPCPort = ref("")
    const selectedVPCPortError = ref("");
    const vpcportItems = ref([]);
    // const instanceItems = ref([]);    

    const { fetchfloatingips, REASSIGN_FLOATING_IP } = useNamespacedActions(
      "NETWORKFLOATINGIP",
      ["fetchfloatingips", "REASSIGN_FLOATING_IP"]
    );    

    // const { fetchinstances } = useNamespacedActions(INSTANCE, [
    //   "fetchinstances",
    // ]);

    // const { instances } = useNamespacedState(INSTANCE, ["instances"]);
    
    // instanceItems.value = instances.value.map((instance) => {
    // return {
    //     text: instance.name,
    //     value: instance.id,
    // };
    // });  

    // const { fetchPaginatedInstances } = useNamespacedActions(INSTANCE, [
    //   "fetchPaginatedInstances",
    // ]);

    const useComposable = {      
      ...useVpc(),
    };    

    async function getVpcPorts() {      
      const vpcports = await useComposable.fetchvpcportattached(props.item.id);
      vpcportItems.value = vpcports.map((vpcport) => {
        return {
          text: `${vpcport.instance_name}, ${vpcport.vpc_name} (${vpcport.ip_address})`,
          value: vpcport.id,
        };
      });
    }

    const reassignFloatingIP = async () => {    
        // alert('asdasdsa');    
        loading.value = true;            
        try {
            const payload = {
                floating_ip_id: props.item.id,
                port_id: selectedVPCPort.value
            };
            let response = await REASSIGN_FLOATING_IP(payload);
            emit("input", false);
            if (response.status === 200) await fetchfloatingips();                  
        } catch (error) {
            
        }
        loading.value = false;
    };    

    onMounted(async () => {            
      getVpcPorts();
    //   fetchinstances();
    })

    return {
      dialog,
      loading,            
      vpcportItems,
      selectedVPCPort,
      selectedVPCPortError,
    //   resourceSelected,
    //   resourceSelectedError,
      reassignFloatingIP,
    //   fetchinstances,
    //   instances,
    //   instanceItems,
    fetchfloatingips,
    REASSIGN_FLOATING_IP
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
