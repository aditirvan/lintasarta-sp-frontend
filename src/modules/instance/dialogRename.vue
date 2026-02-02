<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Rename Instance</div>
      </v-card-text>      

      <v-card-text>
        <p class="titletext">Instance Name</p>        
        <v-text-field
            maxlength="50"
            id="instanceName"
            v-model="instanceName"
            :error-messages="instanceNameError"
            outlined
            placeholder="Input Instance Name"
        ></v-text-field>
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
              @click="processRename"
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

              Save
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
} from "vuex-composition-helpers";
import { INSTANCE } from "./namespace";
import dialogFloatingIpConfirmation from "../network/floatingip/dialogFloatingIpConfirmation.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";

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
        
    const isShowConfirmDialog = ref(false);
    const confirmDialogData = ref(null);

    const instanceName = ref("");    
    const instanceNameError = ref("");
    
    const { fetchPaginatedInstances, saverenameinstance } = useNamespacedActions(INSTANCE, [
      "fetchPaginatedInstances", "saverenameinstance",
    ]);

    const saveRenameInstance = async (obj) => {
      loading.value = true;
      try {
        const response = await saverenameinstance(obj); 
        emit("input", false);
        if (response.status === 200) await fetchPaginatedInstances();
      } catch (error) {
        
      }
      loading.value = false;
    };

    const processRename = async () => {      
      if (!instanceName.value) {
        instanceNameError.value = "Value is required";
      }else {        
        saveRenameInstance({
        id: props.item.id,            
        name: instanceName.value,
        });
      }
    };

    const submit = () => {
        saveRenameInstance({
        id: props.item.id,        
        name: instanceName.value,
      });
    };

    onMounted(async () => {      
      instanceName.value = props.item.instanceName
    })

    return {
      submit,
      confirmDialogData,
      saverenameinstance,
      processRename,
      saveRenameInstance,
      dialog,
      loading,      
      isShowConfirmDialog,
      toIDRWithDotFormat,
      instanceName,
      instanceNameError,
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
