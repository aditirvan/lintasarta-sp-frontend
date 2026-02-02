<template>
  <v-dialog v-model="value" scrollable persistent max-width="85%">
    <v-card>
      <v-card-title>
        <h1 class="card-title">
          Cost for {{ $moment(date).format("DD/MM/YYYY") }}
        </h1>
      </v-card-title>

      <v-card-text>
        <p class="mb-30px">
          *This is the current Cost for your usage this billing period. A
          breakdown of your cost is available below
        </p>

        <p class="idr">IDR {{ billed }}</p>

        <h1 class="card-title mb-30px">
          Instance Detail
        </h1>

        <v-data-table
          :headers="instanceDetailHeaders"
          :items="instanceDetails"
          :items-per-page="5"
          class="elevation-0 mb-30px"
          hide-default-footer
        />

        <h1 class="card-title mb-30px">
          Storage Detail
        </h1>

        <v-data-table
          :headers="storageDetailHeaders"
          :items="storageDetails"
          :items-per-page="5"
          class="elevation-0 mb-30px"
          hide-default-footer
        />
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn
              depressed
              height="45"
              block
              class="secondary"
              @click="
                () => {
                  $emit('input', false);
                }
              "
            >
              Close
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value", "date", "billed", "instanceDetails", "storageDetails"],
  data() {
    return {
      instanceDetailHeaders: [
        { text: "Service Name", value: "service_name", sortable: false },
        { text: "Spesification", value: "spesification", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Usage", value: "usage", sortable: false },
        { text: "Billed", value: "billed", sortable: false },
      ],
      storageDetailHeaders: [
        { text: "Service Name", value: "service_name", sortable: false },
        { text: "Spesification", value: "spesification", sortable: false },
        { text: "Type", value: "type", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Billed", value: "billed", sortable: false },
      ],
      otherDetailHeaders: [
        { text: "Service Name", value: "service_name", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Total Size", value: "total_size", sortable: false },
        { text: "Total Price", value: "total_price", sortable: false },
      ],
      otherDetails: [
        {
          id: "1",
          service_name: "Snapshot",
          total: "10 x",
          total_size: "100 GB",
          total_price: "IDR 1,000,000",
        },
        {
          id: "2",
          service_name: "Restore",
          total: "10 x",
          total_size: "100 GB",
          total_price: "IDR 1,000,000",
        },
        {
          id: "3",
          service_name: "Whatsapp Notification",
          total: "10 x",
          total_size: "100 GB",
          total_price: "IDR 1,000,000",
        },
      ],
    };
  },
};
</script>

<style scoped>
.card-title {
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: 29px;
  letter-spacing: 0em;
  text-align: left;
}

.idr {
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
  color: #1f60a8;
  margin-bottom: 27px;
}

.mb-30px {
  margin-bottom: 30px;
}
</style>
