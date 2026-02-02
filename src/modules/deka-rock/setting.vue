<template>
  <div>
    <v-row>
      <v-col cols="12">
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
                <v-select :items="listDay" item-text="name" item-value="name" v-model="day" placeholder="Choose Day" outlined></v-select>
              </v-col>
              <v-col cols="6">
                <p class="font-weight-bold">Time Slot</p>
                <v-select
                  :items="listTime"
                  item-text="name"
                  item-value="value"
                  v-model="time"
                  placeholder="Choose Time"
                  outlined
                  hint="Time is displayed in GMT+7"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-card-actions>
                <v-btn
                  height="45"
                  width="150"
                  depressed
                  class="secondary fz-14"
                  :disabled="!day || !time"
                  @click="
                    () => {
                      validateprivilages(['Dekarock', 'editor', true]).then(() => {
                        save();
                      });
                    }
                  "
                >
                  Save
                </v-btn>
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
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { DEKAROCK } from "./namespace";

export default {
  setup(props, context) {
    const { postMaintenance, getSettingMaintenace } = useNamespacedActions(DEKAROCK, ["postMaintenance", "getSettingMaintenace"]);
    const { settingMaintenance } = useNamespacedState(DEKAROCK, ["settingMaintenance"]);
    const { validateprivilages } = useNamespacedActions("HOMEPAGE", ["validateprivilages"]);

    onMounted(() => {
      getSettingMaintenace(context.root.$route.params.id);
    });
    const day = computed({
      get: () => settingMaintenance.value.day,
      set: (val) => {
        settingMaintenance.value.day = val;
      },
    });

    const time = computed({
      get: () => `${settingMaintenance.value.start}-${settingMaintenance.value.end}`,
      set: (val) => {
        const timeRange = val.split("-");
        settingMaintenance.value.start = timeRange[0];
        settingMaintenance.value.end = timeRange[1];
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
    const save = () => {
      const timeRange = time.value.split("-");
      const start = timeRange[0];
      const end = timeRange[1];
      const body = {
        maintainable_time: {
          start: start,
          end: end,
          day: day.value,
        },
      };
      const params = {
        id: context.root.$route.params.id,
        body: body,
      };
      postMaintenance(params);
    };
    return {
      listDay,
      listTime,
      day,
      time,
      save,
      settingMaintenance,
      validateprivilages,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
