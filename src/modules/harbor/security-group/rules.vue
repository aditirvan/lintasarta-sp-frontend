<template>
    <v-container fluid class="pa-7">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <div class="title">Inbound Rule</div>
          <v-spacer />
          <router-link v-if="!read_only" :to="{
              path: `/harbor/detail/${$route.params.harborid}/securitygroup/${$route.params.sg_id}/edit`,
            }">
            <v-btn style="height: 45px; width: 150px" class="success" depressed>
              Edit Rule
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
      <div style="width: auto; height: 28px" />
      <v-data-table
        :headers="rules.header"
        :items="inboundRules"
        :items-per-page="10"
        class="elevation-0"
        hide-default-footer
      >
        <template v-slot:item.range="{ item }">
          <div style="display:inline-block;width:75px;margin-right:1rem;">
            <v-badge
              :content="`Min: ${item.port_range_min ? item.port_range_min : 'Any'}`"
              color="blue"
            ></v-badge>
          </div>
          <div style="display:inline-block;width:75px;margin-right:1rem;">
            <v-badge
              :content="`Max: ${item.port_range_max ? item.port_range_max : 'Any'}`"
              color="red"
            ></v-badge>
          </div>
        </template>
        <template v-slot:item.protocol="{ item }">
          <span> {{ item.protocol ? item.protocol : 'Any'  }} </span>
        </template>
        <template v-slot:item.type="{ item }">
            <span v-if="item.type == 'tcp'">Custom TCP Rule</span>
            <span v-else-if="item.type == 'udp'">Custom UDP Rule</span>
            <span v-else-if="item.type == 'icmp'">All ICMP Rule</span>
            <span v-else>{{ item.type ? item.type : 'Any' }}</span>
        </template>
        <template v-slot:item.remote_ip_prefix="{ item }">
          <div>
            {{ item.sources ? item.sources : 'Any' }}
          </div>
        </template>
        <template v-slot:footer="{ props }">
          <custom-footer-datatable :props="props" />
        </template>
      </v-data-table>
      <div style="width: auto; height: 28px" />
      <!-- <v-row>
        <v-col class="d-flex flex-row align-center">
          <div class="title">Outbound Rule</div>
          <v-spacer />
        </v-col>
      </v-row>
      <div style="width: auto; height: 28px" />
  
      <v-data-table
        :headers="rules.headerOutbound"
        :items="outboundRules"
        :items-per-page="10"
        class="elevation-0 mb-4"
        hide-default-footer
      >
        <template v-slot:item.range="{ item }">
            <div style="display:inline-block;width:75px;margin-right:1rem;">
              <v-badge
                :content="`Min: ${item.port_range_min ? item.port_range_min : 'Any'}`"
                color="blue"
              ></v-badge>
            </div>
            <div style="display:inline-block;width:75px;margin-right:1rem;">
              <v-badge
                :content="`Max: ${item.port_range_max ? item.port_range_max : 'Any'}`"
                color="red"
              ></v-badge>
            </div>
        </template>
        <template v-slot:item.type="{ item }">
            <span v-if="item.type == 'tcp'">Custom TCP Rule</span>
            <span v-else-if="item.type == 'udp'">Custom UDP Rule</span>
            <span v-else-if="item.type == 'icmp'">All ICMP Rule</span>
            <span v-else>{{ item.type ? item.type : 'Any'}}</span>
        </template>
        <template v-slot:item.remote_ip_prefix="{ item }">
          <div>
            {{ item.sources ? item.sources : 'Any' }}
          </div>
        </template>
        <template v-slot:item.protocol="{ item }">
          <span> {{ item.protocol ? item.protocol : 'Any'  }} </span>
        </template>
        <template v-slot:footer="{ props }">
          <custom-footer-datatable :props="props" />
        </template>
      </v-data-table> -->
    </v-container>
  </template>
  
  <script>
  import { reactive, ref, watch } from "@vue/composition-api";
  import { AccessControl } from "@/lib/middleware";
  
  export default {
    props: ['security'],
    setup(props, context) {
      const access_control = new AccessControl(context.root.$store);
      const read_only = ref(access_control.is_read_mode('Project Security'));
      const inboundRules = ref([])
      const outboundRules = ref([])
  
      watch(() => props.security, item => {
        inboundRules.value = item.filter(x => x.direction == 'ingress')
        outboundRules.value = item.filter(x => x.direction == 'egress')
      })
      
      const rules = reactive({
        header: [
          { text: "Type", value: "type", width: '200px'},
          { text: "Protocol", value: "protocol", width: '120px'},
          { text: "Ethertype", value: "ethertype", width: '120px'},
          { text: "Port Range", value: "range", width: '250px'},
          { text: "Source", value: "remote_ip_prefix"},
          { text: "Description", value: "description"}
        ],
        headerOutbound: [
          { text: "Type", value: "type", width: '200px'},
          { text: "Protocol", value: "protocol", width: '120px'},
          { text: "Ethertype", value: "ethertype", width: '120px'},
          { text: "Port Range", value: "range", width: '250px'},
          { text: "Destination", value: "remote_ip_prefix" },
          { text: "Description", value: "description"}
        ],
      });
  
      return {
        read_only,
  
        rules,
        inboundRules,
        outboundRules
      };
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 21px;
    line-height: 140%;
    color: #556272;
  }
  .v-data-table {
    ::v-deep table {
      border-bottom: 1px solid #e0e0e0;
    }
  }
  </style>