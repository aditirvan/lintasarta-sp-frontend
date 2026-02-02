<template>
  <div>
    <Summary v-if="projectID === 'all-project'" />

    <v-row v-else>
      <v-col
        cols="12"
        v-if="project"
      >
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="12" class="py-0">
                <p class="project-name">
                  {{ project.name || "" }}
                </p>
              </v-col>
              <v-col class="d-flex mb-2 pt-0">
                <div>
                  <p class="font-weight-bold fz-21 mb-4 mr-4">
                    Cost for {{ moment(selectedDate).format("DD MMMM YYYY") }}*
                  </p>
                  <p>
                    *This is the current cost for your usage this billing
                    period. A breakdown of your cost is available below.
                  </p>
                </div>
                <v-spacer />
                <div v-if="!isFullcycle" class="summary-billed">
                  <b class="font--text">Billed</b>
                  <p class="total-billed">
                    {{ toIDRWithDotFormat(totalBilled) }}
                  </p>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="total primary--text"></div>
              </v-col>
            </v-row>
            <br />
            <div>
              <p class="font-weight-bold fz-21">Service Detail</p>
              <v-data-table
                class="datatable-services"
                :headers="postpaidFixed ? serviceHeadersFixed: serviceHeaders"
                :items="services"
                hide-default-footer
                disable-pagination
              >
                <template v-slot:item.name="{ item }">
                  <span class="linkpointer">
                    {{item.service_name ? `${item.service_type_name}: ${item.service_name}` : `${item.service_type_name}`}}
                  </span>
                </template>

                <template v-slot:item.price="{ item }">
                  {{ `${toIDRWithDotFormat(item.price)} / ${item.price_unit}` }}
                </template>
                <template v-slot:item.usage="{ item }">
                  <div v-if="item.usage">
                    <span>{{ item.usage }}</span>
                  </div>
                  <div v-else-if="paymentPostpaid">
                    <span v-if="item.usage_days">{{
                      item.usage_days > 1
                        ? `${item.usage_days} days`
                        : `${item.usage_days} day`
                    }}</span>
                    <span v-else>-</span>
                  </div>
                  <div v-else>
                    <span v-if="item.usage_hours">{{
                      item.usage_hours > 1
                        ? `${item.usage_hours} hours`
                        : `${item.usage_hours} hour`
                    }}</span>
                    <span v-else>-</span>
                  </div>
                </template>
                <template v-slot:item.discount="{ item }">
                  {{ item.discount ? `${item.discount}%` : '-' }}
                </template>
                <template v-slot:item.discount_value="{ item }">
                  {{ item.discount_value ? toIDRWithDotFormat(item.discount_value) : '-' }}
                </template>
                <template v-slot:item.billed="{ item }">
                  {{ toIDRWithDotFormat(item.billed) }}
                </template>
                <template v-if="!postpaidFixed" v-slot:body.append>
                  <tr style="border: none">
                    <td
                      v-for="number in serviceHeaders.length - 2"
                      :key="'total-' + number"
                      class="border-bottom-none"
                    />

                    <td class="border-bottom-none">
                      <div class="d-flex flex-row justify-end font-weight-bold">
                        Total
                      </div>
                    </td>

                    <td class="border-bottom-none">
                      <div class="d-flex flex-row justify-end font-weight-bold">
                        {{ toIDRWithDotFormat(totalBilled) }}
                      </div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </div>

          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <billingdetail />

    <!-- <dialogInstanceDetail
      title="Instance Detail"
    />

    <dialogInstanceDetail
      title="Storage Detail"
    /> -->

    <!-- <dialogSpecificationinfo v-model="opendialogSpecificationinfo" /> -->
  </div>
</template>

<script>
import billingdetail from "./billingdetail";
import {
  ref,
  watch,
  onMounted,
  computed,
  reactive,
} from "@vue/composition-api";
import {
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { toIDRWithDotFormat } from "@/lib/formatter";
import moment from "moment";
import Summary from "./billing-corporate-detail-history/Summary.vue";
import localstorage from '@/lib/localstorage';

const isDevModePrepaid = true;

export default {
  components: {
    billingdetail,
    Summary,
  },
  data: () => ({
    dates: {
      start: new Date(),
      end: new Date(),
    },
    isDevModePrepaid,
    loading: false,
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(" - ");
    },
    isFullcycle() {
      return (
        this.project.postpaid_fixed_type &&
        this.project.postpaid_fixed_type === "full_cycle"
      );
    },
  },
  setup(props, context) {
    const { id: projectID, date: selectedDate } = context.root.$route.params;
    const { fetchBillingHistory2 } =
      useNamespacedActions("BILLING", [
        "fetchBillingHistory2",
      ]);

    const { projectBilling, billing } = useNamespacedState("BILLING", [
      "projectBilling",
      "billing",
    ]);

    const serviceHeaders = ref([
      { text: "Service Name", value: "name" },
      { text: "Specification", value: "specification", sortable: false },
      { text: "Price", value: "price", width: '150px' },
      { text: "Billing Type", value: "billing_type", sortable: false },
      { text: "Usage", value: "usage", sortable: false },
      { text: "Discount", value: "discount", sortable: false, width: '20px' },
      { text: "Discount Value", value: "discount_value", sortable: false },
      { text: "Billed", value: "billed", align: "end", width: '150px' },
    ]);

    const serviceHeadersFixed = ref([
      { text: "Service Name", value: "name" },
      { text: "Specification", value: "specification", sortable: false },
      { text: "Billing Type", value: "billing_type", sortable: false },
    ]);

    const paymentPostpaid = ref(false);

    let billServices = ref([]);
    const services = ref([]);
    const projJson = localstorage.getItem('currentProj')
    const projObj = projJson && projJson !== 'undefined' ? JSON.parse(projJson) : {}
    const project = ref(projObj);
    const totalBilled = ref(0) 

    const resetDataServices = () => {
      services.value = []
    };

    watch(projectBilling, (bills) => {
      resetDataServices();
      if (!bills.length) return;
      let bill = bills[0];
      const project = projectBilling.value[0].project;
      
      if (bill.instances) services.value = [...bill.instances.map(service => (
        {
          ...service, 
          name: service.instance.name, 
          spec: `${service.package_instance.vcpu} vCPU / ${service.package_instance.ram} GB Memory`,
          price: project.payment_method === 'prepaid' ? 
            `${toIDRWithDotFormat(service.package_instance.price_per_hours)}/hour` : 
            `${toIDRWithDotFormat(service.package_instance.price_per_day)}/day`,
          service_type: 'Instance'
        }
      ))]
      if (bill.storages) services.value = [...services.value, ...bill.storages.map(service => (
        {
          ...service, 
          name: service.storage.name, 
          billing_type: service.storage.billing_type, 
          spec: `${service.package_storage.volume_size} GB (${service.storage.type.name})`,
          price: project.payment_method === 'prepaid' ? 
            `${toIDRWithDotFormat(service.package_storage.price_per_hours)}/hour` : 
            `${toIDRWithDotFormat(service.package_storage.price_per_day)}/day`,
          service_type: 'Storage'
        }
      ))]
      if (bill.object_storages) services.value = [...services.value, ...bill.object_storages.map(service => (
        {
          ...service, 
          name: service.object_storage.name, 
          billing_type: service.object_storage.billing_type, 
          spec: `${service.package_object_storage.object_storage_size} GB`,
          price: project.payment_method === 'prepaid' ? 
            `${toIDRWithDotFormat(service.package_object_storage.price_per_hours)}/hour` : 
            `${toIDRWithDotFormat(service.package_object_storage.price_per_day)}/day`,
          service_type: 'Object Storage'
        }
      ))]
      if (bill.root_disks) services.value = [...services.value, ...bill.root_disks.map(service => (
        {
          ...service, 
          name: service.instance.name, 
          billing_type: service.instance.billing_type,
          spec: `${service.package_storage.volume_size} GB (${service.package_storage.type.name})`,
          price: project.payment_method === 'prepaid' ? 
            `${toIDRWithDotFormat(service.package_storage.price_per_hours)}/hour` : 
            `${toIDRWithDotFormat(service.package_storage.price_per_day)}/day`,
          service_type: 'Root Disk'
        }
      ))]
      if (bill.operating_systems) services.value = [...services.value, ...bill.operating_systems.map(service => (
        {
          ...service, 
          name: service.operating_system.name, 
          billing_type: service.operating_system.billing_type,
          spec: `${service.version.version_name}`,
          price: `${toIDRWithDotFormat(service.operating_system.price)}/month`,
          service_type: 'Operating System'
        }
      ))]
      if (bill.slbs) services.value = [...services.value, ...bill.slbs.map(service => (
        {
          ...service, 
          name: service.slb.slb_instance_name, 
          spec: `${service.slb.slb_instance.vcpu} vCPU / ${service.slb.slb_instance.ram} GB Memory`,
          price: project.payment_method === 'prepaid' ? 
            `${toIDRWithDotFormat(service.slb.slb_instance.price_per_hour)}/hour` : 
            `${toIDRWithDotFormat(service.slb.slb_instance.price_per_day)}/day`,
          service_type: 'Slb'
        }
      ))]
      if (bill.deka_rock) services.value = [...bill.deka_rock.map(service => (
        {
          ...service, 
          name: `${service.openshift.name} - ${service.machine_set.worker_id}`, 
          spec: `${service.machine_set.total_worker} (${service.package_rock_worker.vcpu} vCPU / ${service.package_rock_worker.ram} GB Memory)`,
          price: project.payment_method === 'prepaid' ? 
            `${toIDRWithDotFormat(service.package_rock_worker.price_per_hour)}/hour` : 
            `${toIDRWithDotFormat(service.package_rock_worker.price_per_day)}/day`,
          service_type: 'Deka Rock'
        }
      ))]
      
      if (bill.other) {
        if (bill.other.snapshot.history) services.value = [...services.value, ...bill.other.snapshot.history.map(service => (
          {
            ...service, 
            name: service.service_name, 
            billing_type: service.billing_type,
            spec: `${service.total} GB`,
            price: project.payment_method === 'prepaid' ? 
              `${toIDRWithDotFormat(service.price)}/hour` : 
              `${toIDRWithDotFormat(service.price)}/day`,
            service_type: 'Snapshot'
          }
        ))]
        if (bill.other.daily_backup.history) services.value = [...services.value, ...bill.other.daily_backup.history.map(service => (
          {
            ...service, 
            name: service.service_name, 
            billing_type: service.billing_type,
            spec: `${service.total} GB`,
            price: project.payment_method === 'prepaid' ? 
              `${toIDRWithDotFormat(service.price)}/hour` : 
              `${toIDRWithDotFormat(service.price)}/day`,
            service_type: 'Daily Backup'
          }
        ))]
        if (bill.other.floating_ip.history) services.value = [...services.value, ...bill.other.floating_ip.history.map(service => (
          {
            ...service, 
            name: service.ip_address, 
            billing_type: service.billing_type,
            spec: `${service.total} x ${service.type}`,
            price: `${toIDRWithDotFormat(service.price)}/${service.unit}`,
            service_type: 'Floating IP'
          }
        ))]
        if (bill.other.manage_service.history) services.value = [...services.value, ...bill.other.manage_service.history.map(service => (
          {
            ...service, 
            name: service.package_name, 
            billing_type: service.billing_type,
            spec: service.description,
            usage: service.usage,
            price: `${toIDRWithDotFormat(service.price)}`,
            service_type: 'Manage Service'
          }
        ))]
        if (bill.other.manage_service_addon.history) services.value = [...services.value, ...bill.other.manage_service_addon.history.map(service => (
          {
            ...service, 
            name: service.package_name, 
            billing_type: service.billing_type,
            spec: service.description,
            usage: service.usage,
            price: `${toIDRWithDotFormat(service.price)}`,
            service_type: 'Manage Service Addon'
          }
        ))]
      }

      if (bill.openvpns) services.value = [...services.value, ...bill.openvpns.map(service => (
        {
          ...service, 
          name: service.openvpn.instance_name, 
          spec: `-`,
          price: project.payment_method === 'prepaid' ? 
            `${toIDRWithDotFormat(service.openvpn.open_vpn_user_create[0].price_per_hour)}/hour` : 
            `${toIDRWithDotFormat(service.openvpn.open_vpn_user_create[0].price_per_day)}/day`,
          service_type: 'OpenVPN User'
        }
      ))]

      if (bill.ipsecs) services.value = [...services.value, ...bill.ipsecs.map(service => (
        {
          ...service, 
          name: service.vpn_ipsec.instance_name, 
          spec: `-`,
          price: project.payment_method === 'prepaid' ? 
            `${toIDRWithDotFormat(service.vpn_ipsec.vpn_ipsec_p2.price_per_hour)}/hour` : 
            `${toIDRWithDotFormat(service.vpn_ipsec.vpn_ipsec_p2.price_per_day)}/day`,
          service_type: 'VPN IPSec Phase 2'
        }
      ))]
   
      paymentPostpaid.value = bill.project.payment_method == "postpaid";
    });

    const sortedBillingHistory = computed(() => {
      return projectBilling.value.sort((a, b) => {
        if (a.date > b.date) return -1;
        return 1;
      });
    });

    const currentPeriod = ref("");
    let from = ref(null);
    let to = ref(null);

    const postpaidFixed = ref(false);

    onMounted(async () => {
      await fetchBillingHistory2({
        project_id: projectID,
        date: selectedDate,
      });
      services.value = projectBilling.value.services || []
      totalBilled.value = projectBilling.value.billed;
      from.value = moment(selectedDate);
      to.value = moment(selectedDate);
      currentPeriod.value = `${from.value.format(
        "DD MMMM YYYY"
      )} - ${to.value.format("DD MMMM YYYY")}`;

      const isPostpaidFixed = project.value && project.value.postpaid_type === "fixed";

      if (isPostpaidFixed) {
        postpaidFixed.value = true;
      }
    });
    
    return {
      projectID,
      postpaidFixed,
      selectedDate,
      services,
      project,
      totalBilled,
      projectBilling,
      paymentPostpaid,
      billing,
      billServices,
      currentPeriod,
      toIDRWithDotFormat,
      moment,
      serviceHeaders,
      serviceHeadersFixed,
      vcalendar: ref(false),
    };
  },
};
</script>

<style>
.border-bottom-none {
  border: none !important;
}
</style>

<style lang="scss" scoped>
.summary-billed {
  padding: 1.5rem;
  background: rgba(44, 148, 210, 0.02);
  border: 1px solid #2c94d2;
  border-radius: 10px;
  min-width: 300px;
}

.summary-billed p {
  font-size: 36px;
  color: #1f60a8;
  font-weight: 600;
  margin-bottom: 0;
}

.project-name {
  font-weight: bold;
  font-size: 21px;
  display: block;
  color: #1f60a8;
}

.history {
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 140%;
  color: #556272;
}
.total {
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  line-height: 140%;
  color: #556272;
}
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.page-content {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #556272;
}

.detail-btn {
  cursor: pointer;
}

.date {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #a5b3bf;
}

.amount {
  font-style: normal;
  font-weight: bold;
  line-height: 140%;
  color: #556272;
  font-size: 14px;
}

.detail {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 140%;
  color: #1f60a8;
}

.bill-title {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 160%;
  color: #556272;
}

.history-billing {
  table-layout: auto;
}

.history-billing tr {
  border-bottom: thin solid;
}

td {
  height: 60px !important;
}

.v-data-table {
  ::v-deep table {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > td,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
  font-size: 14px;
}
</style>
