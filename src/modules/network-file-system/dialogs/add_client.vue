<template>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pb-4">Add Instance Client</div>
        </v-card-title>
        <v-card-text class="pb-0">
          <p class="font-weight-bold">Client Name</p>
          <v-text-field
            maxlength="30"
            placeholder="Input Name"
            single-line
            outlined
            v-model="nameInstance"
            @change="
              () => {
                $v.nameInstance.$touch();
              }
            "
            :error-messages="$v.nameInstance.$errors.length ? $v.nameInstance.$errors[0].$message : ''"
            ></v-text-field>
        </v-card-text>
        <v-card-text flat class="pb-0">
          <p class="font-weight-bold">Network Subnet</p>
          <v-row>
            <v-col md="6" class="py-0">
              <v-text-field
              maxlength="30"
              placeholder="Input IP"
              single-line
              outlined
              v-model="selectedInstance"
              @change="
                () => {
                  $v.selectedInstance.$touch();
                }
              "
              :error-messages="$v.selectedInstance.$errors.length ? $v.selectedInstance.$errors[0].$message : ''">
              </v-text-field>
            </v-col>
            <v-col md="6" class="py-0">
              <v-select
              :items="itemsIp"
              maxlength="30"
              prefix="/"
              placeholder="Network Size"
              single-line
              outlined
              v-model="subnetIP"
              :error-messages="$v.subnetIP.$errors.length ? $v.subnetIP.$errors[0].$message : ''">
              </v-select>
            </v-col>
          </v-row>
          <!-- <v-select :items="instances" outlined placeholder="Choose Client"
            item-text="name"
            item-value="id"
            :loading="instancesLoading"
              v-model="selectedInstance"
              :error-messages="$v.selectedInstance.$errors.length ? $v.selectedInstance.$errors[0].$message : ''">
              <template v-slot:selection="{ item }"> {{ item.instanceName }} ({{ item.ipv4 }}) </template>
              <template v-slot:item="{ item }"> {{ item.instanceName }} ({{ item.image.name }}) </template>
            </v-select> -->

        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-btn color="accent" block depressed height="50" :disabled="isLoading" @click="dialog = false"> Cancel </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
              :loading="isLoading"
              :disabled="isLoading"
                color="primary"
                block
                height="50"
                @click="
                  () => {
                    addClient();
                  }
                "
                depressed>
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>


<script>
import { ref, computed, onMounted, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { NFS } from "@/modules/network-file-system/namespace";
import { INSTANCE } from "@/modules/instance/namespace";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { isValidIPv4 } from "@/lib/inputValidator";

export default {
  props: ["value", "nfs_id"],
  setup(props, context) {
    const selectedInstance = ref();
    const nameInstance = ref();
    const instancesLoading = ref(true)
    const path = ref(null);
    const isLoading = ref(false)
    const { addNFSClient, getNFSClientList } = useNamespacedActions(NFS, ["addNFSClient", "getNFSClientList"]);
    const { fetchPaginatedInstances } = useNamespacedActions(INSTANCE, ["fetchPaginatedInstances"]);
    const { instances } = useNamespacedState(INSTANCE, ["instances"]);

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        context.emit("input", val);
      },
    });
    
    const subnetIP = ref()
    const itemsIp = ["8", "16", "24", "29", "32"]

    async function addClient() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      let payload = {
        network_subnet: selectedInstance.value + '/' + subnetIP.value,
        name: nameInstance.value
      }
      // console.log(payload)
      isLoading.value = true
      let res = await addNFSClient({
        id: props.nfs_id,
        payload: payload
      });
      if (res && (res.status === 200 || res.status === 201)) {
        await getNFSClientList({ params: { id: props.nfs_id } });
      }
      isLoading.value = false
      dialog.value = false;
    }

    const regexPrefixAllowed = /^(?:[0-9]|[12]\d|32)$/;
    const $v = useVuelidate(
      {
        selectedInstance: {
          required,
          regex: {
            $message: "Invalid ip value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
              // return /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}?(\/([0-9]{1,3}))/.test(
                val
              );
            },
          },
          // ip: helpers.withMessage(
          //   ({$model}) => {
          //     if($model){
          //       let splitIp = $model.split("/")
          //       if (splitIp.length == 2){
          //         if (!isValidIPv4(splitIp[0])){
          //           return 'Not valid IPv4'
          //         }
          //         if (!regexPrefixAllowed.test(splitIp[1])){
          //           return 'Not valid Prefix for IPv4'
          //         }
          //       }else{
          //         return 'Not valid IPv4'
          //       }
          //     }
          //   }, 
          //   (val) => {
          //     let splitIp = val.split("/")
          //     if (splitIp.length > 2){
          //       return false
          //     }else if (splitIp.length == 1){
          //       if (!isValidIPv4(splitIp[0])){
          //         return false
          //       }
          //     }else if (splitIp.length == 2){
          //       if (!isValidIPv4(splitIp[0])){
          //         return false
          //       }
          //       if (!regexPrefixAllowed.test(splitIp[1])){
          //         return false
          //       }
          //     }
          //     return true
          // })
        },
        nameInstance: { required },
        subnetIP: { required },
      },
      { selectedInstance, nameInstance, subnetIP }
    );

    watch(dialog, async (newVal, oldVal)=>{
      if (newVal){
        instancesLoading.value = true
        await fetchPaginatedInstances({limit:500, state: "ACTIVE", state_with_paginate:false})
        instancesLoading.value = false
      }
    })

    return {
        instancesLoading,
        instances,
        selectedInstance,
        path,
        dialog,
        nameInstance,
        $v,
        isLoading,
        addClient,
        subnetIP,
        itemsIp
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>