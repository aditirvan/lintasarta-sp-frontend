<template>
  <v-card flat class="rounded-lg elevation-0 mb-5 pt-6 pb-5 px-7">
    <v-card-text class="pa-0">
      <div class="headline font-weight-bold font--text pb-4">
        Remaining Quota Restore
      </div>

      <v-row>
        <v-col cols="12" sm="6">
          <div class="blue-box-info d-flex">
            <div class="w-50">
              <p class="card-title">
                Total
              </p>

              <p class="card-idr">{{ restoreTotal }}x</p>
            </div>

            <div class="w-50 second-child-box">
              <p class="card-title">
                Expired Date
              </p>

              <p class="card-idr">
                {{ $moment(restoreExpiredDate).format('YYYY-MM-DD') }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['restoreTotal', 'restoreExpiredDate']
};
</script>

<style scoped>
.blue-box-info {
  /* width: 50%; */
  border: 1px solid #2c94d2;
  border-radius: 10px;
  background-color: rgba(31, 96, 168, 0.02);
  margin-bottom: 28px;
}

.card-title {
  margin-bottom: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
}

.card-idr {
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
  color: #1f60a8;
}

.w-50 {
  width: 50%;
  padding: 25px;
}

.second-child-box {
  border-left: 1px dashed #2c94d2;
}
</style>
