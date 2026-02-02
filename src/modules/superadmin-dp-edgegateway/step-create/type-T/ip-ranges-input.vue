<template>
  <div>
    <div v-for="(availSub, key) in listAvailableIp" :key="key">
      <div v-if="item.gateway == availSub.gateway">
        <v-row>
          <v-col md="9">
            <p class="mb-1">IP Allocation</p>
            <v-text-field
            v-model="value.input"
            placeholder="Enter IP Range"
            single-line
            outlined
            dense
            ></v-text-field>
          </v-col>
          <v-col md="3" class="mt-6 pr-6 d-flex justify-end">
            <v-btn class="" color="secondary" depressed height="40"
            :disabled="!value.input"
            @click="() => { 
              value.value.push(value.input);
              value.input = ''
            }"> Add </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <v-card class="bs mr-2 mb-2 scroll" elevation="1">
                <v-list dense  class="pb-0">
                  <v-list-item-group>
                    <v-list-item v-for="(ip, i) in value.value" :key="i" >
                      <v-list-item-content>
                        <v-list-item-title v-text="ip" class="fz-14-i"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-icon small color="red" @click="() => { value.value.splice(i, 1) }">mdi-close</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
            </v-card>
          </v-col>
        </v-row>

      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from '@vue/composition-api'
export default {
  props: ["value", "listAvailableIp" , "item"],
  setup(props, context) {
    onMounted(() => {
      console.log(props.value)
    })
    return{

    }
  },
}
</script>

<style lang="scss" scoped>
.bs {
  box-shadow: none !important;
  border: 1px solid rgb(2 0 0 / 12%);
}
.scroll {
  height: 150px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}
</style>