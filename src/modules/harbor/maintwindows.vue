<template>
  <div>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row class="d-flex justify-center"
              ><v-col>
                <div class="headline font-weight-bold font--text">Maintenance Windows</div>
              </v-col>
            </v-row>
            <v-row>
              <v-card-text class="pt-0 mt-0"> Please select your preferred time settings when we could work on regular maintenance. </v-card-text>
            </v-row>
            <v-row class="mb-5">
              <v-col cols="6">
                <p class="font-weight-bold">Day of the week</p>
                <v-select
                :items="listDay"
                item-text="name"
                v-model="day"
                item-value="name"
                placeholder="Choose Day"
                :error-messages="$v.day.$errors.length ? $v.day.$errors[0].$message : ''"
                outlined></v-select>
              </v-col>
              <v-col cols="6">
                <p class="font-weight-bold">Time Slot</p>
                <v-select
                  :items="listTime"
                  item-text="name"
                  item-value="value"
                  placeholder="Choose Time"
                  outlined
                  v-model="time"
                  hint="Time is displayed in GMT+7"
                  persistent-hint
                  :error-messages="$v.time.$errors.length ? $v.time.$errors[0].$message : ''"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-card-actions>
                <v-btn height="45" width="150" depressed class="secondary fz-14" @click="() => {
                  validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                  save()
                  })
                }" :loading="isLoadingBtn" :disabled="isLoadingBtn"> Save </v-btn>
              </v-card-actions>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "@vue/composition-api";
import { required, } from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import useVuelidate from '@vuelidate/core';
import { HARBOR } from './namespace';

export default {
  setup(props, context) {
    const { fetchMaintWindows, saveMaintenanceWindows } = useNamespacedActions(HARBOR, ["fetchMaintWindows", "saveMaintenanceWindows"]);
    const { getMaintWindows, isLoadingBtn } = useNamespacedGetters(HARBOR, ["getMaintWindows", "isLoadingBtn"]);
    const { maintWindows } = useNamespacedState(HARBOR, ["maintWindows"]);
    const {
        validateprivilages,
      } = useNamespacedActions("HOMEPAGE", [
        "validateprivilages",
      ]);
    const { harborid } = context.root._route.params;

    onMounted(() => {
      fetchMaintWindows({harbor_id: harborid})
    });
    const day = computed({
      get: () => getMaintWindows.value.day,
      set: (val) => {
        maintWindows.value.day = val;
        return val
      },
    });

    const time = computed({
      get: () => `${getMaintWindows.value.start_time}-${getMaintWindows.value.end_time}`,
      set: (val) => {
        const timeRange = val.split("-");
        maintWindows.value.start_time = timeRange[0];
        maintWindows.value.end_time = timeRange[1];
        return val;
      },
    });
    const listDay = ref([
      { name: "Sunday", value: "sunday" },
      { name: "Monday", value: "monday" },
      { name: "Tuesday", value: "tuesday" },
      { name: "Wednesday", value: "wednesday" },
      { name: "Thursday", value: "thursday" },
      { name: "Friday", value: "friday" },
      { name: "Saturday", value: "saturday" },
    ]);
    const listTime = ref([
      { name: "12:00 AM - 02:00 AM", value: "12:00 AM-02:00 AM" },
      { name: "02:00 AM - 04:00 AM", value: "02:00 AM-04:00 AM" },
      { name: "04:00 AM - 06:00 AM", value: "04:00 AM-06:00 AM" },
      { name: "06:00 AM - 08:00 AM", value: "06:00 AM-08:00 AM" },
      { name: "08:00 AM - 10:00 AM", value: "08:00 AM-10:00 AM" },
      { name: "10:00 AM - 12:00 PM", value: "10:00 AM-12:00 PM" },
      { name: "12:00 PM - 02:00 PM", value: "12:00 PM-02:00 PM" },
      { name: "02:00 PM - 04:00 PM", value: "02:00 PM-04:00 PM" },
      { name: "04:00 PM - 06:00 PM", value: "04:00 PM-06:00 PM" },
      { name: "06:00 PM - 08:00 PM", value: "06:00 PM-08:00 PM" },
      { name: "08:00 PM - 10:00 PM", value: "08:00 PM-10:00 PM" },
      { name: "10:00 PM - 12:00 AM", value: "10:00 PM-12:00 AM" },
    ]);
    const $v = useVuelidate(
      {
        day: { required },
        time: { required }
      },
      {
        day,
        time
      })
    const save = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return

      const timeRange = time.value.split("-");
      const start = timeRange[0];
      const end = timeRange[1];
      let payload = {
        day: day.value,
        start_time: start,
        end_time: end,
      }
      let params = {
        harborid: harborid,
        body: payload
      }
      // console.log(params)
      saveMaintenanceWindows(params)
    };
    return {
      listDay,
      listTime,
      day,
      time,
      save,
      $v,
      isLoadingBtn,
      validateprivilages
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
