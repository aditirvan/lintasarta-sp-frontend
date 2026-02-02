<template>
  <div>
    <v-card-text class="pb-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0">
          <v-card min-height="220">
            <v-list>
              <v-subheader class="fz-14 font-weight-bold">All Security Groups</v-subheader>
              <v-divider></v-divider>
              <v-list-item-group>
                <v-list-item v-for="(item, index) in securities.filter((x) => !listSecurity.map((f) => f.id).includes(x.id))" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn color="secondary" height="45" @click="addSecurity(item)">
                      <v-icon color="white">mdi-plus</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card></v-col
        >
        <v-col sm="12" md="6" class="pt-0 pb-0">
          <v-card min-height="220">
            <v-list>
              <v-subheader class="fz-14 font-weight-bold">Instance Security Groups</v-subheader>
              <v-divider></v-divider>
              <v-list-item-group>
                <v-list-item v-for="(item, index) in listSecurity" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn color="secondary" height="45" @click="deleteSecurity(index)">
                      <v-icon color="white">mdi-minus</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card></v-col
        >
      </v-row>
    </v-card-text>
    <v-card-text class="mt-4">
      <v-row class="d-flex justify-end">
        <!-- <v-col cols="3">
          <router-link to="/networking"> <v-btn color="#a5b3bf" class="white--text fz-16" block height="40"> Cancel </v-btn></router-link>
        </v-col> -->
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="fz-16" color="secondary" block outlined height="45" @click="prev()"> Previous </v-btn>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3">
          <v-btn class="white--text fz-16" color="secondary" block height="45" @click="next()"> Next </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { SECURITY } from "@/modules/security/namespace";
import { ref, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    dataSecurity: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { fetchsecurity } = useNamespacedActions(SECURITY, ["fetchsecurity"]);
    const { securities } = useNamespacedState(SECURITY, ["securities"]);
    onMounted(() => {
      fetchsecurity();
    });
    const selectSecurity = ref(props.dataSecurity.security_groups);
    const listSecurity = ref([]);
    const $v = useVuelidate(
      {
        selectSecurity: {
          required: helpers.withMessage("Security Groups couldnt be empty.", (val) => {
            return val;
          }),
        },
      },
      {
        selectSecurity,
      }
    );
    const addSecurity = (item) => {
      listSecurity.value.push(item);
    };
    const deleteSecurity = (index) => {
      listSecurity.value.splice(index, 1);
    };
    const next = () => {
      // $v.value.$touch();
      // if ($v.value.$errors.length) return;
      const payload = {
        security_groups: selectSecurity.value,
      };
      context.emit("get-data", payload);
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    return {
      prev,
      next,
      securities,
      selectSecurity,
      $v,
      addSecurity,
      listSecurity,
      deleteSecurity,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-btn.v-size--default {
  font-size: 16px;
}

::v-deep .v-list-item--link:before {
  background-color: none;
}
</style>
