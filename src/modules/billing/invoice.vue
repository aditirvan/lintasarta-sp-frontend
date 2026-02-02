<template>
  <div>
    <p v-if="loading" class="text-center">
      <beat-loader color="gray" size="10px" class="mr-2" />
    </p>

    <template v-else>
      <v-card v-if="detail" color="white" flat>
        <v-card-text class="pa-8">
          <h6 class="text-h6 font-weight-bold">Detail Invoice</h6>

          <v-row class="mt-4">
            <v-col>
              <b>Invoice ID</b>
              <p class="mt-4">
                {{ detail.id }}
              </p>
            </v-col>

            <v-col>
              <b>Status</b>
              <p
                class="mt-4"
                :class="{
                  'green--text': detail.status === 'PAID',
                }"
              >
                {{ detail.status }}
              </p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <b>Invoice Date</b>
              <p class="mt-4">
                {{ $moment(detail.created_at).format("DD MMMM YYYY") }}
              </p>
            </v-col>

            <v-col>
              <b>Due Date</b>
              <p class="mt-4">
                {{ $moment(detail.due_date).format("DD MMMM YYYY") }}
              </p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <b>Billing Account</b>
              <p class="mt-4">
                {{ detail.user.fullname }}
              </p>
            </v-col>

            <v-col>
              <b>Invoice Type</b>
              <p class="mt-4">
                PREPAID
                <!-- {{ detail.project.payment_method.toUpperCase() }} -->
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card v-if="detail" color="white" flat class="mt-8">
        <v-card-text class="pa-8">
          <!-- tbl -->
          <v-data-table
            :hide-default-footer="true"
            :headers="tblHeaders"
            :items-per-page="99999"
            :items="list"
            class="mt-8"
          >
            <template v-slot:item.amount="{ item }">
              <b> {{ toIDRWithDotFormat(item.amount) }}/pc </b>
            </template>

            <template v-slot:item.billed="{ item }">
              <b> {{ toIDRWithDotFormat(item.amount) }} </b>
            </template>
          </v-data-table>

          <!-- totals -->
          <v-row class="mt-4 mr-2 d-flex flex-row-reverse">
            <v-col cols="3">
              <v-row class="grey lighten-4">
                <v-col>
                  <b>Subtotal</b>
                </v-col>
                <v-col class="text-right">
                  <b> {{ toIDRWithDotFormat(detail.amount) }}</b>
                </v-col>
              </v-row>

              <v-row class="grey lighten-4 mt-1">
                <v-col>
                  <b>PPN ({{ detail.ppn }}%)</b>
                </v-col>
                <v-col class="text-right">
                  <b> {{ toIDRWithDotFormat(detail.ppn_value) }}</b>
                </v-col>
              </v-row>

              <v-row class="grey lighten-4 mt-1" v-if="detail.stamp">
                <v-col>
                  <b>Biaya Materai</b>
                </v-col>
                <v-col class="text-right">
                  <b>
                    {{
                      detail.stamp_value
                        ? toIDRWithDotFormat(detail.stamp_value)
                        : toIDRWithDotFormat(10000)
                    }}</b
                  >
                </v-col>
              </v-row>

              <v-row class="mt-1 primary">
                <v-col>
                  <b class="white--text">Total</b>
                </v-col>
                <v-col>
                  <b class="white--text text-right">
                    {{ toIDRWithDotFormat(detail.billed) }}</b
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="grey lighten-4 mt-4">
            <v-col class="pa-5">
              <h3 class="ml-2 mb-2">Informasi Pembayaran</h3>
              <ol>
                <li>
                  Invoice berlaku sebagai faktur pajak sesuai peraturan Direktur
                  Jenderal Pajak Nomor PER-13/PJ/2019 tanggal 2 Juli 2019. Untuk
                  pengisian e-SPT PPN gunakan pilihan "Dokumen yang dipersamakan
                  dengan faktur pajak" pada bagian Dokumen transaksi" dan
                  masukkan nomor tagihan pada bagian "Nomor dokumen"
                </li>
                <li v-if="detail.stamp">
                  Ijin pembubuhan tanda bea materai lunas dengan sistem
                  komputerisasi nomor : {{ detail.stamp }}, Tanggal
                  {{
                    detail.stamp_expire_date
                      ? $moment(detail.stamp_expire_date).format("DD MMMM YYYY")
                      : "-"
                  }}.
                </li>
                <li>
                  Mohon mencantumkan nama perusahaan dan nomor invoice pada
                  bukti transfer
                </li>
                <li>
                  Invoice ini berlaku sebagai kuitansi yang sah setelah
                  pembayaran diterima
                </li>
                <li>
                  Jika pelunasan invoice belum kami terima hingga batas waktu 5
                  hari setelah jatuh tempo maka kami akan melakukan pemutusan
                  sementara (Isolir)
                </li>
                <li>
                  Dokumen ini tidak memerlukan tandatangan asli oleh pejabat
                  berwenang karena dicetak secara komputerisasi
                </li>
              </ol>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script>
import api from "@/lib/api";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
  data() {
    return {
      tblHeaders: [
        { text: "Service Name", value: "service_name" },
        { text: "Qty", value: "qty" },
        { text: "Amount", value: "amount" },
        { text: "Total", value: "billed", align: "end" },
      ],
      list: [],
      detail: null,
      loading: false,
    };
  },
  methods: {
    async getInvoiceDetail() {
      this.loading = true;

      try {
        const id = this.$route.params.id;
        const res = await api.GET("/balance/history/invoice/detail/" + id);
        this.detail = res.data;
        const { description, amount, billed } = res.data;
        this.list = [
          { service_name: description, qty: "1 pc", amount, billed },
        ];
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying invoice detail"
        );
      }

      this.loading = false;
    },
  },
  mounted() {
    this.getInvoiceDetail();
  },
};
</script>
