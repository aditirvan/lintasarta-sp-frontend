<template>
  <v-app id="invoice">
    <v-container class="container">
      <v-row>
        <v-col
          cols="12"
          class="d-flex flex-row"
          style="align-items: center; justify-content: space-between"
        >
          <img
            class="mt-4"
            style="width: 200px"
            id="logo"
            v-bind:src="require('@/assets/image_40.png')"
          />
          <p
            class="mb-0 primary--text"
            style="font-weight: bold; font-size: 42px; letter-spacing: 2px"
          >
            INVOICE
          </p>
        </v-col>
        <v-col cols="12">
          <div class="primary--text font-weight-bold fz-14 mb-0 pb-2">
            PT. Aplikanusa Lintasarta
          </div>
          <div class="mb-2"><b>NPWP/NPPKP :</b> 01.329.929.2-092.000</div>
          <div class="mb-0">
            Menara Thamrin 12th Floor JL. MH. Thamrin Kav.3 Jakarta 10250
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <table class="information">
            <tr>
              <td>No. Invoice</td>
              <td>: &nbsp; 21/111196</td>
            </tr>
            <tr>
              <td>Tanggal Invoice</td>
              <td>: &nbsp; 25 Oktober 2021</td>
            </tr>
            <tr>
              <td>Total Tagihan</td>
              <td>: &nbsp; IDR. 86.054.932</td>
            </tr>
            <tr>
              <td>Periode</td>
              <td>: &nbsp; September 2021 - Oktober 2021</td>
            </tr>
          </table>
        </v-col>
        <v-col cols="12" md="6">
          <table class="information">
            <tr>
              <td>Jatuh Tempo</td>
              <td>: &nbsp; 05 Oktober 2021</td>
            </tr>
            <tr>
              <td>Nama Pelanggan</td>
              <td>: &nbsp; PT NIAGA NUSA ABADI</td>
            </tr>
            <tr>
              <td>NPWP/NPPKP</td>
              <td>: &nbsp; 31.599.068.9-004.000</td>
            </tr>
            <tr>
              <td>Alamat Pelanggan</td>
              <td>
                : &nbsp; JL PULO LENTUT NO.15 KIP PULO GADUNG KEL.RAWA TERATE,
                KEC.CAKUNG, JAKARTA TIMUR 13920
              </td>
            </tr>
          </table>
        </v-col>
      </v-row>

      <div class="font-weight-bold fz-16 mb-4" style="margin-top: 2rem">
        Ringkasan Tagihan
      </div>
      <div>
        <table class="summary-projects">
          <thead>
            <tr>
              <th>Kategori Layanan</th>
              <th>Nilai Tagihan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Project Lintasarta Development Apps</td>
              <td>IDR 2.600.000</td>
            </tr>
            <tr>
              <td>Project Rolling Development Apps</td>
              <td>IDR 2.700.000</td>
            </tr>
            <tr>
              <td>Project Service Development Apps</td>
              <td>IDR 2.800.000</td>
            </tr>
            <tr class="blue-row">
              <td>Total Tagihan</td>
              <td>IDR 8.000.000</td>
            </tr>
            <tr>
              <td>PPN (10%)</td>
              <td>IDR 800.000</td>
            </tr>
            <tr class="blue-row">
              <td>Total Tagihan Bulan</td>
              <td>IDR 8.800.000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="break-after"></div>
      <div class="payment-information">
        <p class="fz-16 font-weight-bold">Informasi Pembayaran</p>
        <ol class="fz-12">
          <li>
            Invoice berlaku sebagai faktur pajak sesuai peraturan Direktur
            Jenderal Pajak Nomor PER-13/PJ/2019 tanggal 2 Juli 2019. Untuk
            pengisian e-SPT PPN gunakan pilihan "Dokumen yang dipersamakan
            dengan faktur pajak" pada bagian Dokumen transaksi" dan masukkan
            nomor tagihan pada bagian "Nomor dokumen"
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
      </div>
      <div class="contact-information">
        <p class="fz-16 font-weight-bold">
          Hubungi kami melalui Contact Center 14052 atau email
          support@lintasarta.co.id untuk :
        </p>
        <ul class="fz-12">
          <li>Permintaan terminasi layanan</li>
          <li>Permintaan perubahan layanan</li>
          <li>Perubahan data atau ketidaksesuaian nilai tagihan</li>
          <li>Konfirmasi permbayaran tagihan</li>
          <li>Dan Informasi lainnya</li>
        </ul>
      </div>
      <div class="break-after"></div>
      <v-row>
        <v-col
          cols="12"
          class="d-flex flex-row"
          style="align-items: center; justify-content: space-between"
        >
          <img
            class="mt-4"
            style="width: 200px"
            id="logo"
            v-bind:src="require('@/assets/image_40.png')"
          />
          <p
            class="mb-0 primary--text"
            style="font-weight: bold; font-size: 42px; letter-spacing: 2px"
          >
            INVOICE
          </p>
        </v-col>
        <v-col cols="12" style="margin-top: 3rem">
          <div class="projects-item primary--bg">
            <span class="sub-title">Project Name</span><br />
            <span class="font-weight-bold fz-16"
              >Lintasarta Development Apps</span
            >
          </div>
          <table class="services">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Billing Type</th>
                <th>Service Type</th>
                <th>Specification</th>
                <th>Price</th>
                <th>Usage</th>
                <th>Billed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lintas Service</td>
                <td>PPU</td>
                <td>Instance</td>
                <td>256 GB</td>
                <td>IDR 1,840/hour</td>
                <td>102 hours</td>
                <td>IDR 1,000,000</td>
              </tr>
              <tr>
                <td>Lintas Apps</td>
                <td>PPU</td>
                <td>Instance</td>
                <td>256 GB</td>
                <td>IDR 1,840/hour</td>
                <td>102 hours</td>
                <td>IDR 300,000</td>
              </tr>
              <tr>
                <td>Lintas Chatbot</td>
                <td>PPU</td>
                <td>Instance</td>
                <td>256 GB</td>
                <td>IDR 1,840/hour</td>
                <td>102 hours</td>
                <td>IDR 300,000</td>
              </tr>
            </tbody>
          </table>
          <div
            class="w-100 d-flex py-4 mt-2"
            style="justify-content: space-between"
          >
            <div class="primary--text font-weight-bold">
              *Service usage (PPU) has exceeded 95% in one month, pricing will
              be shifted from hourly to monthly
            </div>
            <div class="box-total fz-16">
              <span class="py-2 font-weight-bold">Total</span>
              <span class="py-2 font-weight-bold">IDR 1.600.000</span>
            </div>
          </div>
        </v-col>
        <v-col cols="12" style="margin-top: 3rem">
          <div class="projects-item primary--bg">
            <span class="sub-title">Project Name</span><br />
            <span class="font-weight-bold fz-16"
              >Lintasarta Development Apps</span
            >
          </div>
          <table class="services">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Billing Type</th>
                <th>Service Type</th>
                <th>Specification</th>
                <th>Price</th>
                <th>Usage</th>
                <th>Billed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lintas Service</td>
                <td>PPU</td>
                <td>Instance</td>
                <td>256 GB</td>
                <td>IDR 1,840/hour</td>
                <td>102 hours</td>
                <td>IDR 1,000,000</td>
              </tr>
              <tr>
                <td>Lintas Apps</td>
                <td>PPU</td>
                <td>Instance</td>
                <td>256 GB</td>
                <td>IDR 1,840/hour</td>
                <td>102 hours</td>
                <td>IDR 300,000</td>
              </tr>
              <tr>
                <td>Lintas Chatbot</td>
                <td>PPU</td>
                <td>Instance</td>
                <td>256 GB</td>
                <td>IDR 1,840/hour</td>
                <td>102 hours</td>
                <td>IDR 300,000</td>
              </tr>
            </tbody>
          </table>
          <div
            class="w-100 d-flex py-4 mt-2"
            style="justify-content: space-between"
          >
            <div class="primary--text font-weight-bold">
              *Service usage (PPU) has exceeded 95% in one month, pricing will
              be shifted from hourly to monthly
            </div>
            <div class="box-total fz-16">
              <span class="py-2 font-weight-bold">Total</span>
              <span class="py-2 font-weight-bold">IDR 1.600.000</span>
            </div>
          </div>
        </v-col>
        <v-col cols="12" style="margin-top: 3rem">
          <div class="projects-item primary--bg">
            <span class="sub-title">Project Name</span><br />
            <span class="font-weight-bold fz-16"
              >Lintasarta Development Apps</span
            >
          </div>
          <table class="services">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Billing Type</th>
                <th>Service Type</th>
                <th>Specification</th>
                <th>Price</th>
                <th>Usage</th>
                <th>Billed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lintas Service</td>
                <td>PPU</td>
                <td>Instance</td>
                <td>256 GB</td>
                <td>IDR 1,840/hour</td>
                <td>102 hours</td>
                <td>IDR 1,000,000</td>
              </tr>
              <tr>
                <td>Lintas Apps</td>
                <td>PPU</td>
                <td>Instance</td>
                <td>256 GB</td>
                <td>IDR 1,840/hour</td>
                <td>102 hours</td>
                <td>IDR 300,000</td>
              </tr>
              <tr>
                <td>Lintas Chatbot</td>
                <td>PPU</td>
                <td>Instance</td>
                <td>256 GB</td>
                <td>IDR 1,840/hour</td>
                <td>102 hours</td>
                <td>IDR 300,000</td>
              </tr>
            </tbody>
          </table>
          <div
            class="w-100 d-flex py-4 mt-2"
            style="justify-content: space-between"
          >
            <div class="primary--text font-weight-bold">
              *Service usage (PPU) has exceeded 95% in one month, pricing will
              be shifted from hourly to monthly
            </div>
            <div class="box-total fz-16">
              <span class="py-2 font-weight-bold">Total</span>
              <span class="py-2 font-weight-bold">IDR 1.600.000</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import { onMounted, ref } from "@vue/composition-api";
import html2pdf from "html2pdf.js";
import { toIDRWithDotFormat } from "@/lib/formatter";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";

export default {
  setup(props, context) {
    // const {
    //   billing,
    //   projectBilling,
    // } = useNamespacedState('BILLING', [
    //   billing,
    //   projectBilling,
    // ])

    onMounted(() => {
      // var element = document.getElementById('invoice').innerHTML;
      var element = document.documentElement;
      var opt = {
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        pagebreak: {
          mode: ["css", "legacy"],
          after: [".break-after"],
          before: ["break-before"],
        },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        filename: `Invoice ${moment().format("DD MMMMM YYYY")}`,
      };
      var img = new Image();
      img.addEventListener("load", function () {});
      img.src = document.getElementById("logo").getAttribute("src");
    });
    return {
      toIDRWithDotFormat,
    };
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 2rem;
}

table.information tr td:first-child {
  font-weight: 600;
  padding-right: 10px;
  padding-bottom: 5px;
}

.primary--text {
  color: #1f60a8;
}

.primary--bg {
  background: #1f60a8;
  color: #fff;
}

.sub-title {
  color: rgba(255, 255, 255, 0.7);
}

.projects-item {
  padding: 1.5rem 2rem;
}

.firamono {
  font-family: Fira Mono;
}
.firasans {
  font-family: Fira Sans;
}
.v-data-table {
  ::v-deep th {
    border-bottom: solid 1px black !important;
  }
}

.fz-14 {
  font-size: 12px;
}

.fz-14 {
  font-size: 14px;
}

.fz-16 {
  font-size: 16px;
}

.box-total {
  background: #f1f2f2;
  padding: 1rem;
  border-radius: 6px;
}

ul,
ol {
  padding-left: calc(1rem + 2px) !important;
}

table.summary-projects,
table.services {
  border-collapse: collapse;
  width: 100%;
}

table.summary-projects thead tr th {
  background: #f1f2f2;
}

table.summary-projects thead tr th,
table.services thead tr th,
table.services tbody tr td,
table.summary-projects tbody tr td {
  padding: 1.5rem 2rem;
}

table.summary-projects tbody tr td,
table.services tbody tr td {
  border-bottom: 1px solid #e0e0e0;
}

table.services thead tr th {
  text-align: left;
  border-bottom: 1px solid black;
}

table.summary-projects thead tr th:first-child {
  text-align: left;
}

table.summary-projects thead tr th:last-child,
table.summary-projects tbody tr td:last-child {
  text-align: right;
}

table.summary-projects tbody tr td:last-child {
  font-weight: 600;
}

table.summary-projects tbody tr.blue-row td {
  background: #1f60a8;
  color: #fff;
  font-weight: 700;
}

.payment-information {
  margin: 4rem 0 3rem;
  background: #f1f2f2;
  padding: 1.5rem;
}

.contact-information {
  background: #1f60a8;
  color: #fff;
  padding: 1.5rem;
}
</style>
