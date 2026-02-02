<template>
  <v-container
    v-if="item"
    class="container"
    style="font-family: 'Fira Sans'; padding: 0 2rem 2rem 2rem"
  >
    <v-row>
      <v-col
        cols="12"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <img
          style="width: 200px"
          id="logo"
          v-bind:src="require('@/assets/image_40.png')"
        />

        <p
          class="primary--text"
          style="
            font-weight: bold;
            margin-bottom: 0;
            font-size: 42px;
            letter-spacing: 2px;
          "
        >
          SUMMARY MONTHLY
        </p>
      </v-col>
    </v-row>

    <p class="primary--text text-spacing">
      <b>PT. Aplikanusa Lintasarta</b>
    </p>

    <p class="text-spacing"><b>Business VAT ID</b> : {{ item.detail.project.vat_id }}</p>

    <p class="text-spacing"><b>Address</b> : {{ org.address }}</p>

    <p class="text-spacing"><b>Report ID</b> : {{ item.detail.id }}</p>

    <p class="text-spacing"><b>Status</b> : {{ item.detail.status }}</p>

    <p class="text-spacing">
      <b>Billing Account</b> : {{ item.detail.billing_account }}
    </p>

    <div
      :style="{
        marginTop: '8px',
        padding: '10px',
        backgroundColor: '#1f60a8',
        color: 'white',
      }"
    >
      <b>Services</b>
    </div>

    <v-row>
      <v-col>
        <b>Service Name</b>
      </v-col>
      <v-col>
        <b>Service Type</b>
      </v-col>
      <v-col v-if="item.detail.project.postpaid_type !== 'fixed'" :style="{ textAlign: 'right' }">
        <b>Price</b>
      </v-col>
      <v-col v-if="item.detail.project.postpaid_type !== 'fixed'">
        <b>Usage</b>
      </v-col>
      <v-col v-if="item.detail.project.postpaid_type !== 'fixed'" :style="{ textAlign: 'right' }">
        <b>Discount Value</b>
      </v-col>
      <v-col v-if="item.detail.project.postpaid_type !== 'fixed'" :style="{ textAlign: 'right' }">
        <b>Total</b>
      </v-col>
    </v-row>
    <v-divider :style="{ backgroundColor: 'black', color: 'black' }" />
    <v-row
      v-for="(service, i) in item.services"
      :key="'service-' + i"
      class="row-bb"
    >
      <v-col>
        <b>{{ service.service_name }}</b>
      </v-col>
      <v-col>
        <b v-if="titleCase(service.service_type) == 'OS CHARGING'">
          OPERATING SYSTEM
        </b>
        <b v-else>{{ titleCase(service.service_type) }}</b>
      </v-col>
      <v-col v-if="item.detail.project.postpaid_type !== 'fixed'" :style="{ textAlign: 'right' }">
        <b v-if="service.price && service.price_unit">
          IDR {{ service.price.toLocaleString("id-ID") }} 
          /
          {{ service.price_unit }}
        </b>
        <b v-else>-</b>
      </v-col>
      <v-col v-if="item.detail.project.postpaid_type !== 'fixed'">
        <b>{{ service.usage }}</b>
      </v-col>
      <v-col v-if="item.detail.project.postpaid_type !== 'fixed'" :style="{ textAlign: 'right' }">
        <b>  {{ service.discount_value ? `IDR ${service.discount_value.toLocaleString("id-ID")}` : "-" }} </b>
      </v-col>
      <v-col v-if="item.detail.project.postpaid_type !== 'fixed'" :style="{ textAlign: 'right' }">
        <b> {{ service.billed ? `IDR ${service.billed.toLocaleString("id-ID")}` : "-" }} </b>
      </v-col>
    </v-row>

    <!-- totals -->
    <v-row>
      <v-col>
        <!-- empty (for spacing) -->
      </v-col>

      <v-col>
        <v-row :style="{ backgroundColor: '#ECEFF1' }">
          <v-col>
            <b>Subtotal</b>
          </v-col>
          <v-col :style="{ textAlign: 'right' }">
            <b> IDR {{ item.detail.price.toLocaleString("id-ID") }} </b>
          </v-col>
        </v-row>

        <div :style="{ marginTop: '4px' }"></div>

        <v-row :style="{ backgroundColor: '#ECEFF1' }">
          <v-col>
            <b>Total Discount</b>
          </v-col>
          <v-col :style="{ textAlign: 'right' }">
            <b> IDR {{ item.detail.total_discount.toLocaleString("id-ID") }} </b>
          </v-col>
        </v-row>

        <div :style="{ marginTop: '4px' }"></div>

        <v-row
          :style="{ backgroundColor: '#ECEFF1'}"
        >
          <v-col>
            <b> Credit </b>
          </v-col>
          <v-col :style="{ textAlign: 'right' }">
            <b :style="{ color: 'red' }">
              IDR {{ item.detail.credit.toLocaleString("id-ID") }}
            </b>
          </v-col>
        </v-row>

        <div :style="{ marginTop: '4px' }"></div>

        <v-row
          v-if="isPostpaid"
          class="mt-4"
          :style="{ backgroundColor: '#ECEFF1' }"
        >
          <v-col>
            <b> PPN ({{ item.detail.ppn }}%) </b>
          </v-col>
          <v-col :style="{ textAlign: 'right' }">
            <b>
              IDR
              {{
                item.detail.ppn_value ? item.detail.ppn_value.toLocaleString("id-ID") : "0"
              }}
            </b>
          </v-col>
        </v-row>

        <div :style="{ marginTop: '4px' }"></div>

        <v-row
          class="mt-4"
          :style="{ backgroundColor: '#1f60a8' }"
        >
          <v-col>
            <b :style="{ color: 'white' }">Total</b>
          </v-col>
          <v-col :style="{ textAlign: 'right' }">
            <b :style="{ color: 'white' }">
              IDR {{ item.detail.billed.toLocaleString("id-ID") }}
            </b>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import localstorage from "@/lib/localstorage";

export default {
  props: ["item"],
  computed: {
    org() {
      return JSON.parse(localstorage.getItem("currentOrg"));
    },
    isPostpaid() {
      let currentProj = JSON.parse(localStorage.getItem('currentProj'))
      return (
        currentProj && currentProj.payment_method === "postpaid"
      );
    },
  },
  methods: {
    titleCase(s) {
      if(s == "OBJECT_STORAGE"){
        return "Deka Box";
      }

      return s
        .toLowerCase()
        .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
        .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase()) // First char after each -/_
        .toUpperCase();
    },
  },
};
</script>

<style scoped>
.text-spacing {
  padding: 2px 0;
}

.text-spacing {
  display: flex;
}

.text-spacing b {
  width: 200px;
}

.row-bb {
  border-bottom: 1px solid #e0e0e0;
  color: #333333;
}

.mt-4 {
  margin-top: 8px;
}

* {
  font-size: 12px;
}
</style>
