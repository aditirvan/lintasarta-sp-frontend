<template>
  <div>
    <p v-if="loading" class="text-center">
      <beat-loader color="gray" size="10px" class="mr-2" />
    </p>
    
    <template v-else>
      <v-card v-if="detail" color="white" flat>
        <!-- <v-card color="white" flat> -->
        <v-card-text class="pa-8">
          <h6 class="text-h6 font-weight-bold">Detail Invoice</h6>
          
          <v-row class="mt-4">
            <v-col>
              <b>Invoice ID</b>
              <p class="mt-4">
                {{ detail.id }}
                <!-- detail.id -->
              </p>
            </v-col>

            <v-col>
              <b>Status</b>
              <p
                class="mt-4"
                :class="{
                  'green--text': detail.payment_status === 'PAID',
                }"
              >
                {{ detail.payment_status }}
              </p>

              <!-- <p class="mt-4">
                detail.status
              </p> -->
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <b>Invoice Date</b>
              <p class="mt-4">
                {{ $moment(detail.last_calculated_for).format("DD MMMM YYYY") }}
                <!-- $moment(detail.created_at).format("DD MMMM YYYY") -->
              </p>
            </v-col>

            <v-col>
              <b>Due Date</b>
              <p class="mt-4">
                {{ $moment(detail.due_date).format("DD MMMM YYYY") }}
                <!-- $moment(detail.due_date).format("DD MMMM YYYY") -->
              </p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <b>Billing Account</b>
              <p class="mt-4">
                <!-- {{ detail.user.fullname }} -->
                <!-- detail.user.fullname -->
                {{ detail.billing_account }}
              </p>
            </v-col>

            <v-col>
              <b>Invoice Type</b>
              <p class="mt-4">
                {{ detail.service_type.toUpperCase() }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card v-if="services" color="white" flat class="mt-8">
        <!-- <v-card color="white" flat class="mt-8"> -->
        <v-card-text class="pa-8">
          <!-- tbls -->
          <p class="font-weight-bold fz-21">Service Detail</p>
          <v-data-table
            class="datatable-services"
            :headers="isPostpaidFixed ? serviceHeadersFixed : serviceHeaders"
            :items="services"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:item.name="{ item }">
              <span class="linkpointer">
                {{item.service_name ? `${item.service_type_name}: ${item.service_name}` : `${item.service_type_name}`}}
              </span>
            </template>
            <template v-slot:item.discount_value="{ item }">
              {{ item.discount_value ? toIDRWithDotFormat(item.discount_value) : '-' }}
            </template>
            <template v-slot:item.price="{ item }">
              {{ toIDRWithDotFormat(item.price) }} / {{ item.price_unit }}
            </template>
            <template v-slot:item.billed="{ item }">
              {{ toIDRWithDotFormat(item.billed) }}
            </template>
            <template v-if="!isPostpaidFixed" v-slot:body.append>
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
                    {{
                      services.length
                        ? toIDRWithDotFormat(
                          services.reduce((total, item) => total + item.billed, 0)
                          )
                        : "0"
                    }}
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
          
          <PaidHistoryTbl
            v-if="payments.length"
            :tbl-items="payments"
            :is-postpaid-fixed="isPostpaidFixed"
          />

          <!-- totals -->
          <v-row v-if="detail" class="mt-4 mr-2 d-flex flex-row-reverse">
            <v-col cols="3">
              <v-row class="grey lighten-4">
                <v-col>
                  <b>Subtotal</b>
                </v-col>
                <v-col  class="text-right">
                  <b>{{ toIDRWithDotFormat(detail.price) }}</b>
                  <!-- <b>dummy</b> -->
                </v-col>
              </v-row>

              <v-row class="mt-1 grey lighten-4">
                <v-col>
                  <b>Discount</b>
                </v-col>
                <v-col  class="text-right">
                  <b>{{ toIDRWithDotFormat(detail.total_discount) }}</b>
                  <!-- <b>dummy</b> -->
                </v-col>
              </v-row>

              <v-row class="grey lighten-4 mt-1">
                <v-col>
                  <b>PPN ({{ detail.ppn }}%)</b>
                  <!-- <b>PPN (123%)</b> -->
                </v-col>
                <v-col  class="text-right">
                  <b>{{ toIDRWithDotFormat(detail.ppn_value) }}</b>
                  <!-- <b>123</b> -->
                </v-col>
              </v-row>

              <v-row v-if="this.totalPayment !== null && this.totalPayment !== 0" class="grey lighten-4 mt-1">
                <v-col>
                  <b>Payment Total</b>
                  <!-- <b>PPN (123%)</b> -->
                </v-col>
                <v-col class="error--text text-right">
                  <b> {{ toIDRWithDotFormat(this.totalPayment) }}</b>
                  <!-- <b>123</b> -->
                </v-col>
              </v-row>

              <v-row class="grey lighten-4 mt-4" v-if="detail.stamp">
                <v-col>
                  <b>Biaya Materai</b>
                </v-col>
                <v-col class="text-right">
                  <b>
                    IDR
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
                <v-col v-if="this.totalPayment !== null && this.totalPayment !== 0" class="text-right">
                  <b class="white--text">{{
                    toIDRWithDotFormat(detail.billed - this.totalPayment)
                  }}</b>
                </v-col>
                <v-col v-else class="text-right">
                  <b class="white--text">{{
                    toIDRWithDotFormat(detail.billed)
                  }}</b>
                  <!-- <b class="white--text">123</b> -->
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row v-if="detail" class="grey lighten-4 mt-4">
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

      <!-- <p v-else class="text-center">No data</p> -->
    </template>
  </div>
</template>

<script>
import api from "@/lib/api";
import PaidHistoryTbl from "./billing-corporate-detail-billing-type/PaidHistoryTbl.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";
import localstorage from "@/lib/localstorage";

export default {
  setup(props, context) {
    return {
      toIDRWithDotFormat,
    };
  },
  components: {
    PaidHistoryTbl,
  },
  data() {
    return {
      services: [],
      detail: null,
      payments: [],
      totalPayment: null,
      loading: true,
      tblHeaders: [
        { text: "Service Name", value: "service_name" },
        { text: "Specification", value: "specification" },
        { text: "Service Type", value: "service_type" },
        { text: "Price", value: "price" },
        { text: "Usage", value: "usage" },
        { text: "Billed", value: "billed" },
      ],
      serviceHeaders: [
        { text: "Service Name", value: "name" },
        { text: "specification", value: "specification", sortable: false },
        { text: "Price", value: "price", width: '150px' },
        { text: "Usage", value: "usage", sortable: false },
        { text: "Discount Value", value: "discount_value", sortable: false },
        { text: "Billed", value: "billed", align: "end"  },
      ],
      serviceHeadersFixed: [
        { text: "Service Name", value: "name" },
        { text: "specification", value: "specification", sortable: false },
      ]
    };
  },
  computed: {
    isPostpaidFixed() {
      if (!this.detail) return false

      const project = JSON.parse(localstorage.getItem("currentProj"));
      const postpaidFixed = project && project.postpaid_type === "fixed";
      return postpaidFixed;
    },
  },
  methods: {
    async getInvoiceDetail() {
      try {
        const id = this.$route.params.id;
        const res = await api.GET("/billing/v2/invoice/detail/" + id);
        const { detail, services, payments } = res.data;
        this.detail = detail;
        this.services = services;

        this.payments = payments
        this.payments.forEach(payment => {
          this.totalPayment += payment.amount
        })

        // const { description, amount, billed } = res.data;
        // this.list = [
        //   { service_name: description, qty: "1 pc", amount, billed },
        // ];
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying invoice detail"
        );
      }
    },
  },
  async mounted() {
    this.loading = true
    await this.getInvoiceDetail();
    this.loading = false
  },
};
</script>
