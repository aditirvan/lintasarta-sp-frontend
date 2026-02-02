<template>
  <div>
    <v-card class="rounded-lg mt-3" flat>
      <v-card-text>
        <v-row>
          <v-col class="px-5 pb-0">
            <p class="mb-2 fz-21 font-weight-bold">{{ loadBalancer.name }}</p>
            <p class="mb-0">
              in {{ loadBalancer.region }} / {{ loadBalancer && loadBalancer.instances ? loadBalancer.instances.length : 0 }} {{ loadBalancer && loadBalancer.instances && loadBalancer.instances.length > 1 ? 'instances' : 'instance' }} / {{ loadBalancer.vpc ? loadBalancer.vpc.name : '-' }} / Gateway: {{ loadBalancer.vpc ? loadBalancer.vpc.ip_gateway : '-' }} / Internal: {{ loadBalancer.engine ? loadBalancer.engine.loadbalancer.vip_address : '-' }} / 
              <span v-if="!loadBalancer.floating_ip_id" 
             
              @click="
                () => {
                  validateprivilages([
                    'Network',
                    'editor',
                  ]).then(() => {
                    enableFloatingIP(loadBalancer.id)
                  });
                }
              "
              class="linkpointer" style="font-size:12px;font-weight:bold">Enable Floating IP</span>
              <span v-else>External: {{ loadBalancer.floating_ip.ip_address }}</span>
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider/>
      <v-card-text class="py-0">
        <v-row>
          <v-col>
            <p class="mb-0" style="font-size: 12px">
              <span style="font-weight: 700">Status:
                <span v-if="loadBalancer.status == 'updating'">Updating</span> 
                <span v-else-if="loadBalancer.engine.loadbalancer.admin_state_up">{{ loadBalancer.engine.loadbalancer.admin_state_up ? 'UP' : 'DOWN' }}</span>
                <span v-else>-</span>
              </span>
            </p>
          </v-col>
          <v-col>
            <p class="mb-0 " style="font-size: 12px">
              <span style="font-weight: 700">Provisioning Status: {{ loadBalancer.engine.loadbalancer.provisioning_status ? loadBalancer.engine.loadbalancer.provisioning_status : '-'  }}</span>
            </p>
          </v-col>
          <v-col>
            <p class="mb-0 " style="font-size: 12px">
              <span style="font-weight: 700">Operating Status: {{ loadBalancer.engine.loadbalancer.operating_status ? loadBalancer.engine.loadbalancer.operating_status : '-'  }}</span>
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div style="height: 30px; width: auto" />
    <v-card flat class="rounded-lg">
      <v-tabs height="64" slider-size="4">
        <v-tab :to="`/network/loadbalancer/${loadbalancer_id}/instances`" class="px-8 fz-14">Instances</v-tab>
        <v-tab :to="`/network/loadbalancer/${loadbalancer_id}/settings`" class="px-8 fz-14">Settings</v-tab>
        <!-- <v-tab class="px-8 fz-14">Graphs</v-tab> -->
      </v-tabs>
      <v-divider />
      <v-tabs-items v-model="$route.path">
        <v-tab-item :value="`/network/loadbalancer/${loadbalancer_id}/instances`">
          <instancetab
            v-if="loadBalancer"
            :key="loadBalancer.id"
            :loadbalancer="loadBalancer"
            @addinstance="openDialogAddInstance = true"
            @removeInstance="(instance_id) => {
              openDialogRemoveInstance = true
              instanceIDToRemove = instance_id
            }"
          ></instancetab>
        </v-tab-item>

        <!-- <v-tab-item>
          <graphtab />
        </v-tab-item> -->

        <v-tab-item :value="`/network/loadbalancer/${loadbalancer_id}/settings`">
          <settingstab 
            v-if="loadBalancer"
            :key="loadBalancer.id" 
            :loadBalancer="loadBalancer" 
          />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <dialogAddInstanceToLoad
      v-model="openDialogAddInstance"
      :loadBalancer="{
        name: loadBalancer.name,
        vpc_name: loadBalancer.vpc.name,
        instances: loadBalancer.instance_ids
      }"
      :instances="instancesInVPC"
      @attach="(instance) => addInstance(instance)"
    />
    <dialogRemoveInstance
      v-model="openDialogRemoveInstance"
      :loadBalancer="{
        name: loadBalancer.name,
      }"
      @remove="() => {
        openDialogRemoveInstance = false
        removeInstance()
      }"
    />
  </div>
</template>
<script>
import { onMounted, ref } from "@vue/composition-api";
import dialogAddInstanceToLoad from "./dialogAddInstanceToLoad.vue";
import dialogRemoveInstance from "./dialogRemoveInstance.vue";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { NETWORKLOADBALANCER } from "../namespace";
import instancetab from "./instance_tab.vue";
import { useLoadBalancer } from '../useLoadBalancer'
// import graphtab from './graph_tab.vue'
import settingstab from "./settings_tab.vue";

export default {
  components: {
    instancetab,
    settingstab,
    dialogAddInstanceToLoad,
    dialogRemoveInstance,
  },
  setup(props, context) {
    const { loadbalancer_id } = context.root.$route.params
    const { assignFloatingIP, fetchLoadBalancerByID, loadBalancer, updateLoadBalancer, fetchCertificates } = useLoadBalancer()
    const tabs = ref('instance')
    const instancesInVPC = ref([])
    
    const { vpc } = useNamespacedState('NETWORKVPC', ['vpc'])
    const { DETAIL_VPC: fetchVPCByID } = useNamespacedActions('NETWORKVPC', ['DETAIL_VPC'])
    
    const openDialogAddInstance = ref(false)
    const openDialogRemoveInstance = ref(false)
    const instanceIDToRemove = ref(null)


    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);


    onMounted(async () => {
      await fetchLoadBalancerByID(loadbalancer_id)
      await fetchVPCByID({ id: loadBalancer.value.vpc_id })
      if(vpc.value) instancesInVPC.value = vpc.value.instances
    })

    const enableFloatingIP = async (id) => {
      const response = await assignFloatingIP({ id })
    }
    
    const addInstance = async (instance) => {
      const { id, name, algorithm, sticky_session, health_check, rules, instance_ids } = loadBalancer.value
      const payload = {
        id,
        name,
        algorithm,
        sticky_session,
        health_check,
        rules: rules.map(x => {
          return {
            protocol: x.protocol,
            port: x.port,
            instance_port: x.instance_port,
            instance_protocol: x.instance_protocol,
          }
        }),
        instance_ids: [...loadBalancer.value.instance_ids, instance]
      }

      const response = await updateLoadBalancer(payload)
      if (response.status == 200) openDialogAddInstance.value = false
    }

    const removeInstance = async () => {
      const { id, name, algorithm, sticky_session, health_check, rules, instance_ids } = loadBalancer.value
      const payload = {
        id,
        name,
        algorithm,
        sticky_session,
        health_check,
        rules: rules.map(x => {
          return {
            protocol: x.protocol,
            port: x.port,
            instance_port: x.instance_port,
            instance_protocol: x.instance_protocol,
          }
        }),
        instance_ids: instance_ids.filter(x => x != instanceIDToRemove.value)
      }

      const response = await updateLoadBalancer(payload)
      if (response.status == 200) openDialogAddInstance.value = false
    }
    
    return {
      tabs,
      headerload: ref([
        { text: "Name", value: "name" },
        { text: "Status", value: "status" },
        { text: "IP Address", value: "ip" },
        {
          text: "Action",
          value: "action",
          sortable: false,
          align: "center",
          width: 150,
        },
      ]),
      ...useLoadBalancer(),
      addInstance,
      removeInstance,
      enableFloatingIP,
      instanceIDToRemove,
      loadbalancer_id,
      openDialogAddInstance,
      openDialogRemoveInstance,
      instancesInVPC,
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    };
  },
};
</script>
