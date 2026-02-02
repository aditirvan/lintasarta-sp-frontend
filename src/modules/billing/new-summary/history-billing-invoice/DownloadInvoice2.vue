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
          INVOICE
        </p>
      </v-col>
    </v-row>

    <p class="primary--text text-spacing">
      <b>PT. Aplikanusa Lintasarta</b>
    </p>

    <p class="text-spacing"><b>Invoice ID</b> : {{ item.id }}</p>

    <p class="text-spacing"><b>Business VAT ID</b> : <span v-if="item.project"> {{ item.project.vat_id }} </span> <span v-else></span> </p>

    <p class="text-spacing"><b>Address</b> : {{ org.address }}</p>

    <p class="text-spacing">
      <b>Invoice Date</b> :
      {{ $moment(item.last_calculated_for).format("DD MMMM YYYY") }}
    </p>

    <p class="text-spacing">
      <b>Due Date</b> : {{ $moment(item.due_date).format("DD MMMM YYYY") }}
    </p>

    <p class="text-spacing"><b>Status</b> : {{ item.payment_status }}</p>

    <p class="text-spacing">
      <b>Billing Account</b> : {{ item.billing_account }}
    </p>

    <!-- instance -->
    <ServiceTable
      v-if="list && list.length"
      :list="list"
      :is-postpaid-fixed="isPostpaidFixed"
    />

    <!-- payments -->
    <Payments
      v-if="payments && payments.length"
      :payments="payments"
    />

    <!-- totals -->
    <v-row>
      <v-col cols="8"/>
      <v-col cols="4">
        <v-row :style="{ backgroundColor: '#ECEFF1' }">
          <v-col>
            <b>Subtotal</b>
          </v-col>
          <v-col :style="{textAlign:'right'}">
            <b> {{ toIDRWithDotFormat(item.price ? item.price : 0 ) }} </b>
          </v-col>
        </v-row>

        <div :style="{marginTop: '4px'}"/>

        <v-row :style="{ backgroundColor: '#ECEFF1' }">
          <v-col>
            <b>Total Discount</b>
          </v-col>
          <v-col :style="{textAlign:'right'}">
            <b> {{ toIDRWithDotFormat(item.total_discount ? item.total_discount : 0 ) }} </b>
          </v-col>
        </v-row>

        <div :style="{marginTop: '4px'}"/>

        <v-row :style="{ backgroundColor: '#ECEFF1' }">
          <v-col>
            <b>PPN ({{ item.ppn }}%)</b>
          </v-col>
          <v-col :style="{textAlign:'right'}">
            <b>{{ toIDRWithDotFormat(item.ppn_value) }}</b>
          </v-col>
        </v-row>

        <div :style="{marginTop: '4px'}"/>

        <v-row 
          v-if="this.totalPayment !== null && this.totalPayment !== 0" 
          :style="{ backgroundColor: '#ECEFF1' }"
        >
          <v-col>
            <b>Payment Total</b>
            <!-- <b>PPN (123%)</b> -->
          </v-col>
          <v-col :style="{color:'#ff0000', textAlign:'right'}">
            <b> {{ toIDRWithDotFormat(this.totalPayment) }}</b>
            <!-- <b>123</b> -->
          </v-col>
        </v-row>

        <div :style="{marginTop: '4px'}"/>

        <v-row
          :style="{ backgroundColor: '#ECEFF1' }"
          v-if="item.stamp"
        >
          <v-col>
            <b>Biaya Materai</b>
          </v-col>
          <v-col :style="{textAlign:'right'}">
            <b
              >IDR
              {{
                item.stamp_value
                  ? toIDRWithDotFormat(item.stamp_value)
                  : toIDRWithDotFormat(10000)
              }}</b
            >
          </v-col>
        </v-row>

        <div :style="{marginTop: '4px'}"/>

        <v-row
          :style="{ backgroundColor: '#1f60a8' }"
        >
          <v-col>
            <b :style="{ color: 'white' }">Total</b>
          </v-col>
          <v-col :style="{textAlign: 'right'}">
            <b :style="{ color: 'white' }">
              {{ toIDRWithDotFormat(item.billed) }}
            </b>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row
      :style="{ backgroundColor: '#ECEFF1', marginTop: '8px' }"
    >
      <v-col :style="{ padding: '20px' }">
        <b :style="{ marginLeft: '8px', marginBottom: '8px', fontSize: '16px' }"
          >Informasi Pembayaran</b
        >
        <ol :style="{ marginLeft: '20px', marginTop: '8px' }">
          <li>
            Invoice berlaku sebagai faktur pajak sesuai peraturan Direktur
            Jenderal Pajak Nomor PER-13/PJ/2019 tanggal 2 Juli 2019. Untuk
            pengisian e-SPT PPN gunakan pilihan "Dokumen yang dipersamakan
            dengan faktur pajak" pada bagian Dokumen transaksi" dan masukkan
            nomor tagihan pada bagian "Nomor dokumen"
          </li>
          <li v-if="item.stamp">
            Ijin pembubuhan tanda bea materai lunas dengan sistem komputerisasi
            nomor : {{ item.stamp }}, Tanggal
            {{
              item.stamp_expire_date
                ? $moment(item.stamp_expire_date).format("DD MMMM YYYY")
                : "-"
            }}.
          </li>
          <li>
            Mohon mencantumkan nama perusahaan dan nomor invoice pada bukti
            transfer
          </li>
          <li>
            Invoice ini berlaku sebagai kuitansi yang sah setelah pembayaran
            diterima
          </li>
          <li>
            Jika pelunasan invoice belum kami terima hingga batas waktu 5 hari
            setelah jatuh tempo maka kami akan melakukan pemutusan sementara
            (Isolir)
          </li>
          <li>
            Dokumen ini tidak memerlukan tandatangan asli oleh pejabat berwenang
            karena dicetak secara komputerisasi
          </li>
        </ol>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import localstorage from "@/lib/localstorage";
import ServiceTable from "./download-invoice2/ServiceTable.vue";
import Payments from "./download-invoice2/Payments.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  props: ["item", "list", "payments", "totalPayment"],
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
  components: {
    ServiceTable,
    Payments,
  },
  computed: {
    org() {
      return JSON.parse(localstorage.getItem("currentOrg"));
    },
    isPostpaidFixed() {
      let currentProj = JSON.parse(localStorage.getItem('currentProj'))
      const postpaidFixed =
      currentProj && currentProj.postpaid_type === "fixed";

      return postpaidFixed;
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

.mt-4 {
  margin-top: 8px;
}

* {
  font-size: 12px;
}
</style>
