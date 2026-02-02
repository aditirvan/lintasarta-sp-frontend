<template>
  <div>
    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"
          ><p class="font-weight-bold fz-16">Static IP Pools</p>
          <!-- <v-textarea solo label="Description" v-model="generalDesc"></v-textarea> -->
        </v-col>
      </v-row>
    </v-card-text>

    <!-- <p class="font-weight-bold mb-0">Static IP Pools</p> -->
    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"
          ><p class="font-weight-bold">Gateway CIDR</p>
          <v-text-field :value="gateway" solo disabled></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0 mt-4">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"
          ><p class="font-weight-bold">Static IP Pools</p>
          <!-- <v-text-field :value="gateway" solo disabled></v-text-field> -->
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0 mt-4">
      <v-row>
        <v-col sm="12" md="6" class="pt-0 pb-0"
          ><p class="font-weight-bold">Enter an IP range { format 192.168.1.2 - 192.168.1.100 }</p>
          <!-- <v-text-field :value="gateway" solo disabled></v-text-field> -->
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="pb-0 pt-0 mt-4">
      <v-row>
        <v-col sm="9" md="9" class="pt-0 pb-0">
          <v-text-field label="192.168.1.2" solo v-model="inputIp"></v-text-field>
        </v-col>
        <v-col class="grid pt-0"><v-btn color="secondary" @click="add()" :disabled="!inputIp" height="45">Add</v-btn></v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0 mt-4">
      <v-row>
        <v-col sm="9" md="9" class="pt-0 pb-0">
          <v-card-text class="border">
            <div v-for="(row, index) in listIp" :key="index">
              {{ row }}
              <span class="align-content-end"><v-icon color="red" class="float-right cursor-pointer" @click="del(index)" small>mdi-close-circle</v-icon></span>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>

    <div class="mb-6">
      <!-- <v-row class="mt-6">
        <v-col class="d-flex mt-3">
          <span>Enter an IP range { format 192.168.1.2 - 192.168.1.100 }</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="9"><v-text-field label="192.168.1.2" solo dense v-model="inputIp"></v-text-field></v-col>
        <v-col class="grid"><v-btn color="primary" @click="add()" :disabled="!inputIp">Add</v-btn></v-col>
      </v-row> -->
      <!-- <v-row>
        <v-col md="9">
          <v-card-text class="border">
            <div v-for="(row, index) in listIp" :key="index">
              {{ row }}
              <span class="align-content-end"><v-icon color="red" class="float-right cursor-pointer" @click="del(index)" small>mdi-close-circle</v-icon></span>
            </div>
          </v-card-text>
        </v-col>
      </v-row> -->

      <!-- <div>Total IP Address: 0</div> -->
    </div>
    <v-card-text>
      <v-row class="d-flex justify-end">
        <v-col cols="3">
          <router-link to="/networking"> <v-btn color="#a5b3bf" class="white--text fz-16" block height="40"> Cancel </v-btn></router-link>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3" v-if="step > 1">
          <v-btn class="fz-16" color="secondary" block outlined height="40" @click="prev()"> Previous </v-btn>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3" v-if="step <= 6">
          <v-btn class="white--text fz-16" color="secondary" block height="40" @click="next()"> Next </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    gateway: {
      type: String,
      default: "",
    },
    static: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const listIp = ref(
      props.static.map((elem) => {
        return elem["startAddress"] + "-" + elem["endAddress"];
      })
    );
    const inputIp = ref("");
    const next = () => {
      const data =
        listIp.value.length == 0
          ? []
          : listIp.value
              .join()
              .split(",")
              .map((e) => e.split("-"))
              .map(([startAddress, endAddress]) => ({ startAddress, endAddress }));
      context.emit("get-data", data);
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    const add = () => {
      const data = inputIp.value.replaceAll(" ", "");
      listIp.value.push(data);
      inputIp.value = "";
    };
    const del = (index) => {
      listIp.value.splice(index, 1);
    };
    return {
      next,
      prev,
      listIp,
      add,
      inputIp,
      del,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
  box-shadow: none;
  border: 1px solid black;
}
.grid {
  display: grid;
}
.border {
  border: 1px solid black;
  border-radius: 5px;
  height: 100px;
}
</style>
