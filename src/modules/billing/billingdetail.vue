<template>
  <v-dialog v-model="openModal" width="1060px">
    <v-card class="rounded-lg" flat>
      <v-container class="pa-8">
        <div class="page-title">
          Cost for {{ $moment().format("MMMM") }} {{ $moment().format("YYYY") }}
        </div>
        <div class="page-content pt-3">
          this is the current Cost for your usage this billing period. A
          breakdown of your cost is available below
        </div>
        <v-row class="py-8">
          <v-col cols="9">
            <div class="total pl-5">IDR3,060,909.02</div>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-btn
              style="height: 45px; width: 160px"
              depressed
              class="secondary"
              >Download Invoice</v-btn
            >
          </v-col>
        </v-row>
        <br />
        <v-data-table
          :headers="headers"
          :items="billingperservice"
          hide-default-footer
        >
          <template v-slot:item.spec="{ item }">
            <div style="white-space: pre-wrap">{{ item.spec }}</div>
          </template>
          <template v-slot:item.billed="{ item }">
            <div class="d-flex flex-row">IDR <v-spacer />{{ item.billed }}</div>
          </template>
          <template v-slot:body.append>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <div>
                  <p class="font-weight-bold">Total</p>
                </div>
                <div class="d-flex flex-row justify-end">
                  IDR<v-spacer /> 600,000
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import billing from "./billing";
import { ref } from "@vue/composition-api";

export default {
  setup() {
    const { isOpen, closeModal } = billing();

    const { isOpen: openModal } = billing();

    const header = ref([
      { value: "date" },
      { value: "cpu" },
      { value: "ram" },
      { value: "storage" },
      { value: "ip" },
      { value: "ammount" },
    ]);

    const history = ref([
      {
        date: "30 Oktober 2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
      {
        date: "29 Oktober 2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
      {
        date: "28 Oktober 2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
      {
        date: "27 Oktober 2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
      {
        date: "26 Oktober 2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
      {
        date: "25 Oktober 2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
      {
        date: "24 Oktober 2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
    ]);

    const headers = ref([
      { text: "Service Name", value: "name", sortable: false },
      { text: "Service Type", value: "servicetype", sortable: false },
      { text: "Spesification", value: "spec", sortable: false },
      { text: "Price", value: "price", sortable: false },
      { text: "Billing Type", value: "billingtype", sortable: false },
      { text: "Usage", value: "usage", sortable: false },
      { text: "Billed", value: "billed", align: "left", sortable: false },
    ]);
    const billingperservice = [
      {
        name: "Lintas Service",
        servicetype: "Instance",
        spec: `256 GB / 32 CPUs
4.69 TB NVMe SSDs
10 TB transfer`,
        price: "IDR 1,000,000/mo",
        billingtype: "PPM",
        usage: "-",
        billed: "1,000,000",
      },
      {
        name: "Cloud Service",
        servicetype: "Storage",
        spec: `256 GB / 32 CPUs
4.69 TB NVMe SSDs
10 TB transfer`,
        price: "IDR 2,000,000/mo",
        billingtype: "PPU",
        usage: "30%",
        billed: "600,000",
      },
      {
        name: "VM Service",
        servicetype: "Instance",
        spec: `256 GB / 32 CPUs
4.69 TB NVMe SSDs
10 TB transfer`,
        price: "IDR 5,000,000/mo",
        billingtype: "PPU",
        usage: "-",
        billed: "5,000,000",
      },
    ];
    return {
      billingperservice,
      headers,
      isOpen,
      openModal,
      closeModal,
      history,
      header,
    };
  },
};
</script>


<style lang="scss" scoped>
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

.amount {
  font-style: normal;
  font-weight: bold;
  line-height: 140%;
  color: #556272;
  font-size: 14px;
}

.bill-title {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 160%;
  color: #556272;
}
.v-data-table {
  ::v-deep table {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }
}
</style>