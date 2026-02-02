<template>
  <div>
    <!-- <div
      :style="{
        marginTop: '8px',
        padding: '10px',
        backgroundColor: '#1f60a8',
        color: 'white',
      }"
    >
      <b>{{ title }}</b>
    </div> -->

    <v-row :style="{marginTop: '12px'}">
      <v-col :md="isPostpaidFixed? 6 : 3">
        <b>Service Name</b>
      </v-col>
      <v-col>
        <b>Specification</b>
      </v-col>
      <v-col v-if="!isPostpaidFixed" >
        <b>Price</b>
      </v-col>
      <v-col v-if="!isPostpaidFixed">
        <b>Usage</b>
      </v-col>
      <v-col v-if="!isPostpaidFixed" style="text-align: right;">
        <b>Discount Value</b>
      </v-col>
      <v-col v-if="!isPostpaidFixed" style="text-align: right;">
        <b>Billed</b>
      </v-col>
    </v-row>
    <v-divider :style="{ backgroundColor: 'black', color: 'black' }" />

    <v-row
      v-for="(l, index) in list"
      :key="'l-' + l.service_name + index"
      class="row-bb"
    >
      <v-col :md="isPostpaidFixed? 6 : 3">
        <b>{{ `${l.service_type_name} : ${l.service_name}` || "-" }}</b>
      </v-col>
      <v-col>
        <b>{{ l.specification || "-" }}</b>
      </v-col>
      <v-col v-if="!isPostpaidFixed">
        <b v-if="l.price && l.price_unit">
          IDR {{ l.price.toLocaleString("id-ID") }}
          /
          {{ l.price_unit }}
        </b>

        <b v-else>-</b>
      </v-col>
      <v-col v-if="!isPostpaidFixed">
        <b>{{ l.usage || "-" }}</b>
      </v-col>
      <v-col v-if="!isPostpaidFixed" style="text-align: right;">
        <b>{{ l.discount_value ? `IDR ${l.discount_value.toLocaleString("id-ID")}` : "-" }}</b>
      </v-col>
      <v-col v-if="!isPostpaidFixed" style="text-align: right;">
        <b>{{ l.billed ? `IDR ${l.billed.toLocaleString("id-ID")}` : "-" }}</b>
      </v-col>
    </v-row>

    <!-- <v-row v-if="!isPostpaidFixed && list.length">
      <v-col
        v-for="number in isPostpaidFixed ? 2 : 4"
        :key="'total-invoice-' + number"
      />

      <v-col style="marginTop:8px; text-align:right;">
        <b>Total</b>
      </v-col>

      <v-col>
        <p style="font-weight:bold; marginTop:8px; text-align:right;">
          IDR
          {{
            list
              .reduce((total, item) => total + item.billed, 0)
              .toLocaleString("id-ID")
          }}
        </p>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
export default {
  props: ["title", "list", "isPostpaidFixed"],
};
</script>

<style scoped>
.row-bb {
  border-bottom: 1px solid #e0e0e0;
  color: #333333;
}
</style>
