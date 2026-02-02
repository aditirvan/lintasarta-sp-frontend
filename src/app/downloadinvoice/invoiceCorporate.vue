<template>
  <v-container
    class="container"
    style="font-family: 'Fira Sans'; padding: 2rem"
  >
    <v-row>
      <v-col
        cols="12"
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        "
      >
        <img
          style="width: 200px; margin-top: 1.5rem"
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
      <v-col cols="12">
        <div
          class="primary--text"
          style="
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 0;
            padding-bottom: 8px;
          "
        >
          {{ organization.name }}
        </div>
        <div style="margin-bottom: 8px">
          <b>NPWP/NPPKP :</b> {{ organization.npwp_corporate }}
        </div>
        <div style="margin-bottom: 0">
          {{ organization.address }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <table class="information">
          <tr>
            <td
              style="font-weight: 600; padding-right: 10px; padding-bottom: 5px"
            >
              No. Invoice
            </td>
            <td>: &nbsp; {{ billing.invoice_number }}</td>
          </tr>
          <tr>
            <td
              style="font-weight: 600; padding-right: 10px; padding-bottom: 5px"
            >
              Tanggal Invoice
            </td>
            <td>
              : &nbsp; {{ moment(billing.date_end).format("DD MMMM YYYY") }}
            </td>
          </tr>
          <tr>
            <td
              style="font-weight: 600; padding-right: 10px; padding-bottom: 5px"
            >
              Total Tagihan
            </td>
            <td>
              : &nbsp; {{ toIDRWithDotFormat(Math.round(billing.billed)) }}
            </td>
          </tr>
          <tr>
            <td
              style="font-weight: 600; padding-right: 10px; padding-bottom: 5px"
            >
              Periode
            </td>
            <td>
              : &nbsp;
              {{
                billing
                  ? `${moment(billing.date_start).format(
                      "MMMM YYYY"
                    )} - ${moment(billing.date_end).format("MMMM YYYY")}`
                  : ""
              }}
            </td>
          </tr>
        </table>
      </v-col>
      <v-col cols="12" md="6">
        <table class="information">
          <tr>
            <td
              style="font-weight: 600; padding-right: 10px; padding-bottom: 5px"
            >
              Jatuh Tempo
            </td>
            <td>
              : &nbsp;
              {{
                moment(billing.date_end).add(5, "days").format("DD MMMM YYYY")
              }}
            </td>
          </tr>
          <tr>
            <td
              style="font-weight: 600; padding-right: 10px; padding-bottom: 5px"
            >
              Nama Pelanggan
            </td>
            <td>: &nbsp; {{ billing.user ? billing.user.fullname : "" }}</td>
          </tr>
          <tr>
            <td
              style="font-weight: 600; padding-right: 10px; padding-bottom: 5px"
            >
              NPWP/NPPKP
            </td>
            <td>
              : &nbsp; {{ billing.user ? billing.user.npwp_privacy : "" }}
            </td>
          </tr>
          <tr>
            <td
              style="font-weight: 600; padding-right: 10px; padding-bottom: 5px"
            >
              Alamat Pelanggan
            </td>
            <td>: &nbsp; {{ billing.user ? billing.user.address : "" }}</td>
          </tr>
        </table>
      </v-col>
    </v-row>

    <div
      style="
        margin-top: 2rem;
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: bold;
      "
    >
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
          <tr v-for="item in billing.details" :key="item.project.id">
            <td>{{ item.project.name }}</td>
            <td>{{ toIDRWithDotFormat(item.billed) }}</td>
          </tr>
          <tr class="blue-row">
            <td>Total Tagihan</td>
            <td>
              {{
                billing.billed
                  ? toIDRWithDotFormat(billing.price)
                  : toIDRWithDotFormat(0)
              }}
            </td>
          </tr>
          <tr>
            <td>PPN {{ billing.ppn ? `(${billing.ppn}%)` : "" }}</td>
            <td>
              {{
                billing.ppn_value
                  ? toIDRWithDotFormat(Math.round(billing.ppn_value))
                  : "-"
              }}
            </td>
          </tr>
          <tr class="blue-row">
            <td>Total Tagihan Bulan</td>
            <td>{{ toIDRWithDotFormat(Math.round(billing.billed)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="html2pdf__page-break"></div>
    <div style="margin: 4rem 0 3rem; background: #f1f2f2; padding: 1.5rem">
      <p style="font-size: 16px; font-weight: bold; margin-bottom: 8px">
        Informasi Pembayaran
      </p>
      <ol style="font-size: 12px">
        <li style="padding-bottom: 4px">
          Invoice berlaku sebagai faktur pajak sesuai peraturan Direktur
          Jenderal Pajak Nomor PER-13/PJ/2019 tanggal 2 Juli 2019. Untuk
          pengisian e-SPT PPN gunakan pilihan "Dokumen yang dipersamakan dengan
          faktur pajak" pada bagian Dokumen transaksi" dan masukkan nomor
          tagihan pada bagian "Nomor dokumen"
        </li>
        <li style="padding-bottom: 4px">
          Invoice ini berlaku sebagai kuitansi yang sah setelah pembayaran
          diterima
        </li>
        <li style="padding-bottom: 4px">
          Jika pelunasan invoice belum kami terima hingga batas waktu 5 hari
          setelah jatuh tempo maka kami akan melakukan pemutusan sementara
          (Isolir)
        </li>
        <li style="padding-bottom: 4px">
          Dokumen ini tidak memerlukan tandatangan asli oleh pejabat berwenang
          karena dicetak secara komputerisasi
        </li>
      </ol>
    </div>
    <div style="background: #1f60a8; color: #fff; padding: 1.5rem">
      <p
        style="
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          margin-bottom: 8px;
        "
      >
        Hubungi kami melalui Contact Center 14052 atau email
        support@lintasarta.co.id untuk :
      </p>
      <ul style="font-size: 12px">
        <li style="padding-bottom: 4px">Permintaan terminasi layanan</li>
        <li style="padding-bottom: 4px">Permintaan perubahan layanan</li>
        <li style="padding-bottom: 4px">
          Perubahan data atau ketidaksesuaian nilai tagihan
        </li>
        <li style="padding-bottom: 4px">Konfirmasi permbayaran tagihan</li>
        <li style="padding-bottom: 4px">Dan Informasi lainnya</li>
      </ul>
    </div>
    <div class="html2pdf__page-break"></div>
    <v-row>
      <v-col
        cols="12"
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        "
      >
        <img
          style="width: 200px; margin-top: 16px"
          id="logo"
          v-bind:src="require('@/assets/image_40.png')"
        />
        <p
          class="primary--text"
          style="
            margin-bottom: 0;
            font-weight: bold;
            font-size: 42px;
            letter-spacing: 2px;
          "
        >
          INVOICE
        </p>
      </v-col>
      <v-col
        cols="12"
        style="margin-top: 3rem"
        v-for="(item, iteration) in billing.details"
        :key="item.project.id"
      >
        <div class="projects-item primary--bg">
          <span class="sub-title">Project Name</span><br />
          <span class="font-weight-bold fz-16">{{ item.project.name }}</span>
        </div>
        <table class="services">
          <thead>
            <tr>
              <th style="font-size: 11px; background: #fff">Service Name</th>
              <th style="font-size: 11px; background: #fff">Billing Type</th>
              <th style="font-size: 11px; background: #fff">Service Type</th>
              <th style="font-size: 11px; background: #fff">Specification</th>
              <th style="font-size: 11px; background: #fff">Price</th>
              <th style="font-size: 11px; background: #fff">Usage</th>
              <th style="font-size: 11px; background: #fff">Billed</th>
            </tr>
          </thead>
          <tbody style="font-size: 10px">
            <!-- EMPTY ROW -->
            <tr style="text-align: center" v-if="isProjectEmpty(item)">
              <td colspan="7">No data available</td>
            </tr>
            <!-- INSTANCES -->
            <tr v-for="row in item.instances" :key="row.instance_id">
              <td style="word-wrap: break-word">{{ row.instance.name }}</td>
              <td style="word-wrap: break-word">
                {{ getBillingTypeLabel(row.billing_type) }}
                {{ row.shift_to_monthly ? "*" : "" }}
              </td>
              <td style="word-wrap: break-word">Instance</td>
              <td style="word-wrap: break-word">
                <ul>
                  <li>{{ row.package_instance.vcpu }} vCPU</li>
                  <li>{{ row.package_instance.vcpu }} GB Memory</li>
                  <li>
                    {{ row.instance.root_disk_package.volume_size }} GB Root
                    Disk
                  </li>
                </ul>
              </td>
              <td style="word-wrap: break-word">
                <span v-if="row.billing_type == 'PPU'"
                  >{{
                    toIDRWithDotFormat(row.package_instance.price_per_hours)
                  }}
                  / hours</span
                >
                <span v-else>
                  {{
                    toIDRWithDotFormat(row.package_instance.price_per_month)
                  }}
                  / month<br />
                  {{
                    toIDRWithDotFormat(row.package_instance.price_per_hours)
                  }}
                  / hours
                </span>
              </td>
              <td style="word-wrap: break-word">
                <span v-if="row.billing_type == 'PPU' && row.usage_hours">{{
                  row.usage_hours > 1
                    ? `${row.usage_hours} hours`
                    : `${row.usage_hours} hour`
                }}</span>
                <span v-else>-</span>
              </td>
              <td style="word-wrap: break-word">
                {{ toIDRWithDotFormat(row.billed) }}
              </td>
            </tr>

            <!-- Root Disks -->
            <tr
              v-for="row in item.root_disks"
              :key="`root-disk-${row.instance_id}`"
            >
              <td style="word-wrap: break-word">
                {{ row.instance.name || "N/A" }}
              </td>
              <td style="word-wrap: break-word">
                {{
                  row.billing_type
                    ? getBillingTypeLabel(row.billing_type)
                    : "Monthly"
                }}
              </td>
              <td style="word-wrap: break-word">Root Disk</td>
              <td style="word-wrap: break-word">
                <ul>
                  <li>{{ row.package_storage.volume_size }} GB</li>
                </ul>
              </td>
              <td style="word-wrap: break-word">
                {{ toIDRWithDotFormat(row.package_storage.price_per_month) }} /
                month
              </td>
              <td style="word-wrap: break-word">
                <span v-if="row.usage_hours">{{
                  row.usage_hours > 1
                    ? `${row.usage_hours} hours`
                    : `${row.usage_hours} hour`
                }}</span>
                <span v-else>-</span>
              </td>
              <td style="word-wrap: break-word">
                {{ toIDRWithDotFormat(row.billed) }}
              </td>
            </tr>

            <!-- STORAGES -->
            <tr v-for="row in item.storages" :key="row.storage_id">
              <td style="word-wrap: break-word">
                {{ row.storage.name || "N/A" }}
              </td>
              <td style="word-wrap: break-word">
                {{
                  row.billing_type
                    ? getBillingTypeLabel(row.billing_type)
                    : "Monthly"
                }}
              </td>
              <td style="word-wrap: break-word">Storage</td>
              <td style="word-wrap: break-word">
                <ul>
                  <li>{{ row.package_storage.volume_size }} GB</li>
                </ul>
              </td>
              <td style="word-wrap: break-word">
                {{ toIDRWithDotFormat(row.package_storage.price_per_month) }} /
                month
              </td>
              <td>
                <span v-if="row.usage_hours">{{
                  row.usage_hours > 1
                    ? `${row.usage_hours} hours`
                    : `${row.usage_hours} hour`
                }}</span>
                <span v-else>-</span>
              </td>
              <td style="word-wrap: break-word">
                {{ toIDRWithDotFormat(row.billed) }}
              </td>
            </tr>

            <!-- OBJECT STORAGES -->
            <tr
              v-for="row in item.object_storages"
              :key="row.object_storage_id"
            >
              <td style="word-wrap: break-word">
                {{ row.object_storage.name }}
              </td>
              <td style="word-wrap: break-word">
                {{
                  row.billing_type
                    ? getBillingTypeLabel(row.billing_type)
                    : "Monthly"
                }}
              </td>
              <td style="word-wrap: break-word">Object Storage</td>
              <td style="word-wrap: break-word">
                <ul>
                  <li>
                    {{ row.package_object_storage.object_storage_size }} GB
                  </li>
                </ul>
              </td>
              <td style="word-wrap: break-word">
                {{
                  toIDRWithDotFormat(row.package_object_storage.price_per_month)
                }}
                / month
              </td>
              <td style="word-wrap: break-word">
                <span v-if="row.usage_hours">{{
                  row.usage_hours > 1
                    ? `${row.usage_hours} hours`
                    : `${row.usage_hours} hour`
                }}</span>
                <span v-else>-</span>
              </td>
              <td style="word-wrap: break-word">
                {{ toIDRWithDotFormat(row.billed) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          style="
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 8px;
            padding: 16px 0;
          "
        >
          <div class="primary--text" style="flex: 1; font-weight: bold"></div>
          <div style="flex: 1; font-size: 16px">
            <div class="box-total" style="display: inline-block; float: right">
              <span
                style="padding: 8px 0; font-weight: bold; margin-right: 2rem"
                >Total</span
              >
              <span style="padding: 8px 0; font-weight: bold">{{
                toIDRWithDotFormat(item.billed)
              }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="iteration != billing.details.length - 1"
          class="html2pdf__page-break"
        ></div>
      </v-col>
    </v-row>
  </v-container>
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
  props: ["billing", "organization"],
  setup(props, context) {
    // const {
    //   billing,
    //   projectBilling,
    // } = useNamespacedState('BILLING', [
    //   billing,
    //   projectBilling,
    // ])

    onMounted(() => {
      console.log(props.billing, props.organization);
      // var element = document.getElementById('invoice').innerHTML;
      var element = document.documentElement;
      var opt = {
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        pagebreak: {
          mode: ["css", "legacy"],
          after: [".html2pdf__page-break"],
          before: ["break-before"],
        },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        filename: `Invoice ${moment().format("DD MMMMM YYYY")}`,
      };
      var img = new Image();
      img.src = document.getElementById("logo").getAttribute("src");
    });
    return {
      toIDRWithDotFormat,
      moment,
      getBillingTypeLabel: (type) => {
        if (type == "PPU") return "Pay Per Use";
        else return type;
      },
      isProjectEmpty: (item) => {
        let instancesExists =
          item.instances && item.instances.length > 0 ? true : false;
        let rootDisksExists =
          item.storages && item.storages.length > 0 ? true : false;
        let storagesExists =
          item.root_disks && item.root_disks.length > 0 ? true : false;
        let objectStoragesExists =
          item.object_storages && item.object_storages.length > 0
            ? true
            : false;

        return (
          !instancesExists &&
          !rootDisksExists &&
          !storagesExists &&
          !objectStoragesExists
        );
      },
    };
  },
};
</script>
<style>
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

table.services thead tr th {
  background: #fff;
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

table th {
  border-radius: 0 0 0 0 !important;
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

table.summary-projects tbody tr.blue-row {
  background: #1f60a8;
}

table.summary-projects tbody tr.blue-row td {
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
