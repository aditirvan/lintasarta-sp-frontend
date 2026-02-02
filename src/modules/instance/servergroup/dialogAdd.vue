<template>
    <v-dialog max-width="500" v-model="dialog">
      <v-card class="pt-7">
        <v-card-text>
          <div class="headline font-weight-bold font--text">{{ editMode ? 'Edit' : 'Create' }} Server Group</div>
        </v-card-text>      
        <v-card-text class="pb-0">
          <v-row>          
            <v-col cols="6" class="pt-0">
              <p class="font-weight-bold font--text">Name
                <small class="error--text" v-if="$v.name.$errors.length ">&nbsp;*{{ $v.name.$errors[0].$message }}</small>
              </p>
              <v-text-field
                maxlength="100"
                v-model="name"
                :disabled="editMode"
                placeholder="Name"
                flat
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pt-0">
              <p class="font-weight-bold font--text">Policy
                <small class="error--text" v-if="$v.policy.$errors.length ">&nbsp;*{{ $v.policy.$errors[0].$message }}</small>
              </p>
              <v-select id="policy" placeholder="Select Policy" :items="policies" v-model="policy" outlined single-line append-icon="mdi-chevron-down" />           
            </v-col>                     
          </v-row>
        </v-card-text>      
        <v-card-text>
          <v-row>
            <v-col
              ><v-btn
                depressed
                height="45"
                block
                class="accent"
                @click="
                  () => {
                    resetForm()
                    $emit('input', false);
                  }
                "
                >Cancel</v-btn
              ></v-col
            >
            <v-col
              ><v-btn
                id="Add"
                depressed
                height="45"
                block
                class="secondary"
                @click="save"
                :disabled="isServerGroupLoading"
                >
                  <beat-loader v-if="isServerGroupLoading" size="10px" color="white" :loading="isServerGroupLoading"/>
                  <span v-else>
                    {{ editMode ? 'Save Changes' : 'Add' }}
                  </span> 
                </v-btn>
              </v-col
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  <script>
  import { computed, onMounted, ref, watch } from "@vue/composition-api";
  const { required, maxLength, minValue, maxValue, minLength } = require("@vuelidate/validators");
  import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from 'vuex-composition-helpers'
  import { SERVERGROUP } from '../servergroup/namespace'
  import localstorage from "@/lib/localstorage";
  const allowedTypes = ["application/json"];
  const useVuelidate = require("@vuelidate/core").default;
  export default {
    props: ["value", 'selectedServerGroup'],
    setup(props, { root, emit }) {
      const {
        setopendialogcommonsuccess,
      } = useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonsuccess",
      ])
      // Reset Form if create success
      root.$on('resetFormServerGroup', () => {
        resetForm()
      })
      const policies = ref([
          {
              text: "Affinity",
              value: "affinity",
          },
          {
              text: "Anti Affinity",
              value: "anti-affinity",
          },
          {
              text: "Soft Affinity",
              value: "soft-affinity",
          },
          {
              text: "Soft Anti Affinity",
              value: "soft-anti-affinity",
          },
      ]);
      const {
        isServerGroupLoading,
      } = useNamespacedState(SERVERGROUP, [
        "isServerGroupLoading",
      ])
      const editMode = ref(false)
      watch(() => props.selectedServerGroup, (val) => {
        if (val === null) {
          editMode.value = false
          resetForm()
        } else {
          editMode.value = true
          name.value = props.selectedServerGroup.name
          policy.value = props.selectedServerGroup.policy        
        }
      })
      const dialog = computed({
        get: () => props.value,
        set: (val) => {
          emit("input", val);
        },
      })
      const name = ref(null)    
      const policy = ref(null)    
      const $v = useVuelidate(
        {
          name: {
            required,
            minLength: minLength(5),
          },        
          policy: { 
            required,
            minLength: minLength(5),
          },        
        },
        { 
          name,        
          policy,        
        }
      )
      const resetForm = () => {
        name.value = null            
        policy.value = null        
        $v.value.$reset()
      }
      const save = async () => {
        $v.value.$touch()
        if ($v.value.$invalid) return false
        const projObj = JSON.parse(localstorage.getItem("currentProj"));
        const payload = {
          name: name.value,        
          policy: policy.value,     
          project_id: projObj.id,   
        }      
        emit('create', payload)
      }    
      return {
        resetForm,
        editMode,
        dialog,
        save,
        isServerGroupLoading,
        $v,
        name,
        policy,      
        policies,
      }
    },
  }
  </script>
  <style lang="scss" scoped>
  .titletext {
    font-weight: 700;
    font-size: 12px;
  }
  .v-input--is-disabled {
    ::v-deep .v-input__slot {
      background: #f1f2f2;
    }
  }
  </style>