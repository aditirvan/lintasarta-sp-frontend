<template>
  <v-main style="margin-top: 65px">
    <v-container
      fluid
      :style="{
        'background-image': 'url(' + require('@/assets/RegisterPage.png') + ')',
        'background-position': 'bottom right',
        'padding-bottom': '50px',
        'background-size': 'contain',
        height: '100%',
      }"
    >
      <v-row>
        <v-col cols="12" class="d-flex pt-7 justify-center">
          <v-card
            style="
              background: #ffffff;
              box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
              border-radius: 20px;
            "
          >
            <v-card-text>
              <h2 class="pa-2">Payment Status</h2>

              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr v-for="item in items" :key="item.name">
                      <td>{{ item.name }}</td>
                      <td>{{ item.content }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <v-btn
                block
                height="50"
                depressed
                color="secondary"
                class="mr-4 mt-7 text-capitalize font-weight-bold"
                to="/"
              >
                Back
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import api from "@/lib/api";

export default {
  data() {
    return {
      items: [],
    };
  },
  computed: {
    refNo() {
      return this.$route.query.RefNo;
    },
  },
  methods: {
    async fetchPaymentstatus() {
      try {
        const res = await api.GET("/payment/status/" + this.refNo);
        // console.log(res.data, "res.data fetchPaymentstatus");
        const { ref_no, amount, status, description, err_desc, payment_date } =
          res.data;

        let newItems = [];

        const date = this.$moment(payment_date);

        newItems[0] = { name: "Ref No.", content: ref_no };
        newItems[1] = {
          name: "Amount",
          content: "IDR " + amount.toLocaleString("id-ID"),
        };
        newItems[2] = { name: "Status", content: status };
        newItems[3] = { name: "Description", content: description };
        newItems[4] = { name: "", content: err_desc };
        newItems[5] = {
          name: "Payment Date",
          content: date.isValid() ? date.format("DD/MM/YYYY") : '-',
        };

        this.items = newItems;
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying payment status"
        );
      }
    },
  },
  mounted() {
    this.fetchPaymentstatus();
  },
};
</script>
