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
      {{ $moment(item.created_at).format("DD MMMM YYYY") }}
    </p>

    <p class="text-spacing">
      <b>Due Date</b> : {{ $moment(item.due_date).format("DD MMMM YYYY") }}
    </p>

    <p class="text-spacing"><b>Status</b> : {{ item.status }}</p>

    <p class="text-spacing">
      <b>Billing Account</b> : {{ item.user.fullname }}
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

    <v-row :style="{ borderBottom: '1px solid black' }">
      <v-col>
        <b>Service Name</b>
      </v-col>
      <v-col>
        <b>Qty</b>
      </v-col>
      <v-col>
        <b>Unit</b>
      </v-col>
      <v-col>
        <b>Amount</b>
      </v-col>
    </v-row>

    <v-row class="row-bb">
      <v-col>
        <b>{{ item.description }}</b>
      </v-col>
      <v-col>
        <b>1 pc</b>
      </v-col>
      <v-col>
        <b> {{ item.amount ? toIDRWithDotFormat(item.amount) : 0 }}/pc </b>
      </v-col>
      <v-col>
        <b> {{ item.amount ? toIDRWithDotFormat(item.amount) : 0 }} </b>
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
          <v-col>
            <b> {{ toIDRWithDotFormat(item.amount ? item.amount : 0 ) }} </b>
          </v-col>
        </v-row>

        <v-row
          class="mt-4"
          :style="{ backgroundColor: '#ECEFF1', marginTop: '8px' }"
        >
          <v-col>
            <b>PPN ({{ item.ppn }}%)</b>
          </v-col>
          <v-col>
            <b>{{ toIDRWithDotFormat(item.ppn_value) }}</b>
          </v-col>
        </v-row>

        <v-row
          class="mt-4"
          :style="{ backgroundColor: '#ECEFF1', marginTop: '8px' }"
          v-if="item.stamp"
        >
          <v-col>
            <b>Biaya Materai</b>
          </v-col>
          <v-col>
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

        <v-row
          class="mt-4"
          :style="{ backgroundColor: '#1f60a8', marginTop: '8px' }"
        >
          <v-col>
            <b :style="{ color: 'white' }">Total</b>
          </v-col>
          <v-col>
            <b :style="{ color: 'white' }">
              {{ toIDRWithDotFormat(item.billed) }}
            </b>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row
      class="mt-4"
      :style="{ backgroundColor: '#ECEFF1', marginTop: '8px' }"
    >
      <v-col class="pa-5" :style="{ padding: '20px' }">
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
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  props: ["item"],
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
  computed: {
    org() {
      return JSON.parse(localstorage.getItem("currentOrg"));
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
