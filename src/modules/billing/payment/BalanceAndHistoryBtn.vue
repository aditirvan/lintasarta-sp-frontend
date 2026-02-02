<template>
  <v-card flat class="rounded-lg pa-4 mt-3">    
    <v-card-text>
      <div
        class="d-flex flex-column flex-md-row justify-space-between align-center"
      >
        <p class="fz-21 font-weight-bold">Balance</p>

        <div>
          <v-btn
            outlined
            depressed
            color="secondary"
            style="margin-bottom: 20px"
            height="45"
            max-width="197"
            to="/balance/transaction-history"
            class="mr-4"
          >
            History Transaction
          </v-btn>

          <v-btn
            outlined
            depressed
            color="secondary"
            style="margin-bottom: 20px"
            height="45"
            max-width="197"
            to="/balance/history"
            class="mr-4"
          >
            Balance History
          </v-btn>
        </div>
      </div>

      <v-row>
        <v-col cols="12" md="6">
          <div class="balance-card">
            <p class="card-title">The Remaining Balance ({{balance.project_name}})</p>

            <p :class="balance.accumulated_balance > 0 ? 'card-idr' : 'card-idr-minus'">{{ toIDRWithDotFormat(balance.accumulated_balance) }}</p>
            <v-row>
                <p class="card-title pl-3"> 
                  Current Balance : 
                  <span class="primary--text">{{ toIDRWithDotFormat(balance.current_balance) }}</span>
                </p>
                <p class="card-title pl-3"> 
                  Outstanding : 
                  <span class="error--text">{{ toIDRWithDotFormat(balance.total_outstanding) }}</span>
                </p>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { toIDRWithDotFormat } from "@/lib/formatter";
import localstorage from "@/lib/localstorage";

export default {
  props: ["balance"],
  setup() {    
    return {
      toIDRWithDotFormat,
    };
  },
};
</script>

<style scoped>
.balance-card {
  width: 100%;
  padding: 23px 20px;
  border: 1px solid #1f60a8;
  border-radius: 10px;
  background-color: rgba(31, 96, 168, 0.02);
  margin-bottom: 28px;
  margin-right: 20px;
}

.card-title {
  margin-bottom: 10px;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
}

.card-idr {
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
  color: #1f60a8;
}

.card-idr-minus {
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
  color: red;
}
</style>
