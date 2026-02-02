<template>
  <v-container fluid class="pa-8">  
    <v-card flat class="rounded-lg" v-if="instances && instances.length">
      <v-card-text class="pa-0">
        <div class="d-flex mb-3" style="justify-content:space-between;align-items:center;">
          <p class="fz-21 font-weight-bold">Instances</p>
          <v-btn
            color="secondary"
            dark
            depressed
            height="44"
            width="103"
            class="mb-2"
            @click="
              () => {
                validateprivilages([
                  'Network',
                  'editor',
                ]).then(() => {
                  $emit('addinstance')
                });
              }
            "
            >
              <span class="fz-14 fw-600">Add</span>
          </v-btn>
        </div>
        <v-data-table
          id="DataTableListInstance"
          :hide-default-footer="true"
          :headers="headers"
          :items="instances"
          :items-per-page="10"
          class="elevation-0"
        >
          <template v-slot:item.name="{ item }">
            <div class="d-flex instance-name">
              <v-icon class="mr-3" color="primary">mdi-circle</v-icon>
              <div>
                <router-link :to="{ path: `/project/lintasarta/${item.id}/` }"
                  ><span class="primary--text">{{
                    item.name
                  }}</span></router-link
                >
                <p>
                  {{ item.package_instance ? item.package_instance.vcpu : 'N/A' }} vCPU / {{ item.package_instance ? item.package_instance.ram : 'N/A' }} GB RAM / {{ item.root_disk_package ? item.root_disk_package.volume_size : item.package_instance ? item.package_instance.root_disk : '-' }} GB Root Disk
                </p>
              </div>
            </div>
          </template>
          <template v-slot:item.ip="{ item }">
              <span class="ipaddress">Internal<span class="tik"> : </span></span
              ><span>{{ item.ip_address_internal }}</span>
              <br>
              <span class="ipaddress">Gateway<span class="tik"> : </span></span
              ><span>{{ item.vpc.ip_gateway }}</span>
              <br>
              <span class="ipaddress" v-if="item.floating_ip">External <span class="tik"> : </span></span
              >{{ item.floating_ip ? item.floating_ip.ip_address : '' }}
          </template>
          <template v-slot:item.createddate="{ item }">
            {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
          </template>
          <template v-slot:item.region="{ item }">
            {{ item.region.toUpperCase() }}
          </template>
          <template v-slot:item.action="{ item }">
            <span 
              class="linkpointer error--text"
              
              @click="
                () => {
                  validateprivilages([
                    'Network',
                    'editor',
                  ]).then(() => {
                    $emit('removeInstance', item.id)
                  });
                }
              "

            >
              Remove
            </span>
          </template>
          <template v-slot:footer="{ props }">
            <custom-footer-datatable :props="props" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card v-else class="rounded-lg pa-8" outlined>
      <v-card-text class="px-8 text-center">
        <p class="fz-16 font-weight-bold mb-0">
          Add instance to Load Balancer
        </p>
      </v-card-text>
      <v-card-text
        class="py-0 px-8 text-center"
        style="max-width: 687px; margin: auto"
      >
        <p class="accent--text">
          The Load Balancer will distribute traffic between specific Instance.
          Instance can be selected by name or by tag and must be located in the
          same datacenter as the Load Balancer.
        </p></v-card-text
      >
      <v-card-text class="text-center">
        <v-btn
         
           @click="
                () => {
                  validateprivilages([
                    'Network',
                    'editor',
                  ]).then(() => {
                    $emit('addinstance');
                  });
                }
              "
          class="secondary"
          height="55"
          width="465"
          depressed
          ><span class="fz-14 font-weight-bold">Choose Instance</span></v-btn
        >
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { computed, ref, onMounted } from "@vue/composition-api";
import { useNamespacedActions } from "vuex-composition-helpers";


export default {
  props: ["opendialogaddinstancetoload", "loadbalancer"],
  setup (props) {

    const disabledField = ref(false);
    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);

    validateprivilagesyncnew(["Network", "editor"]).then((res) => {
      disabledField.value = res;
    });

    return {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      activemenuinstance: ref(),
      instances: computed(() => {
        return props.loadbalancer.instances;
      }),
      headers: ref([
        { text: "Name", value: "name" },
        { text: "IP Address", value: "ip" },
        { text: "Region", value: "region" },
        { text: "Created Date", value: "createddate" },
        { text: "Action", value: "action" },
      ]),
    };
  },
};
</script>