<template>
    <div>
    <v-dialog v-model="dialog" max-width="450">
        <v-card class="pa-7 rounded-lg">
            <v-card-title class="pa-0 mb-5">
                <div class="d-flex flex-row">
                    <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
                    <p
                        class="fz-18 font-weight-bold mb-0"
                    >
                        Delete Registry
                    </p>
                </div>
            </v-card-title>
            <!-- <div class="banner mb-5">
                <p class="mb-0" style="color: #f99c1d; font-weight: 600">
                Unexpected bad things will happen if you dont read this!
                </p>
            </div> -->
            <v-card-text class="pa-0 mb-4">
                <p class="mb-5">
                    <!-- <b>Delete the Registry?</b> -->
                    This will permanently delete
                <!-- </p>

                <p> -->
                    <br>
                Please type <b>{{ nameproject }}</b> to confirm
                </p>
                <v-text-field
                id="registryName"
                v-model="deleteType"
                flat
                outlined
                ></v-text-field>
            </v-card-text>
            <v-card-actions class="pa-0">
                <v-row class="ma-0">
                    <v-btn
                        id="confirm"
                        color="error"
                        block
                        height="50"
                        depressed
                        :disabled="disableBtn"
                        @click="validateRegistry"
                    >
                        I understand the consequences, delete this registry
                    </v-btn>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
import { REGISTRY } from "../namespace";
import { computed, ref, watch } from "@vue/composition-api";
export default {
 
  props: ["value", "head"],
  setup(props, { emit, root }) {
    const deleteType = ref("");
    const disableBtn = ref(true);
    const projects = ref(
      JSON.parse(localStorage.getItem("registry") || "{}")
    );
    const nameproject=projects.value.registry_name.toLowerCase().replace(/ /g, "-")
    // console.log("nameproject",nameproject)

    const dialog = computed({
        get: () => props.value,
        set: (val) => {
            if(!val){
                emit('clearItem', {})
            }
            emit("input", val);
            
        },
    });
    watch(deleteType, (val) => {
      return val == nameproject
        ? (disableBtn.value = false)
        : (disableBtn.value = true);
    });
    const { getDeleteRegistry } = useNamespacedActions(REGISTRY, [
      "getDeleteRegistry",
    ]);
    
    const validateRegistry = async () => {
      if (nameproject == deleteType.value) {
        disableBtn.value = true
        // console.log("==============ok===============")
        await getDeleteRegistry()
        dialog.value = false
        if(props.head == 'detail'){
            root.$router.replace("/registry");
        }
        disableBtn.value = false
        emit('refreshTable')
      }
    };
    

    return {
      projects,
      nameproject,
      validateRegistry,
      deleteType,
      getDeleteRegistry, 
      disableBtn,
      dialog,
    };
  },
};
</script>