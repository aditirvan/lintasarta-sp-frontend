<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item.name="{ item }">
        {{ item.users.fullname }}
      </template>
      <template v-slot:item.email="{ item }">
        {{ item.users.email }}
      </template>
      <template v-slot:item.organization="{ item }">
        {{ item.organization }}
      </template>
      <template v-slot:item.project="{ item }">
        <div>
          <div v-if="item.projects.length == 0">
            {{ item.projects.length }} Project
          </div>
          <div
            class="linkpointer"
            @click="
              () => {
                projects = item.projects;
                opendialogprojectlist = true;
              }
            "
            v-else-if="item.projects.length > 1"
          >
            <u> {{ item.projects.length }} Project</u>
          </div>
          <div v-else>{{ item.project.name }}</div>
        </div>
      </template>
      <template v-slot:item.role="{ item }">
        {{ item.users.role.name }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-switch v-model="item.users.status" true-value="active"></v-switch>
      </template>
      <template v-slot:item.joindate="{ item }">
        {{ $moment(new Date(item.joindate)).format("DD/MM/YYYY") }}
      </template>
    </v-data-table>
  </v-app>
</template>
<script>
import { onMounted, ref } from "@vue/composition-api";
import localstorage from "@/lib/localstorage";
export default {
  setup() {
    const headers = ref();
    const items = ref();
    onMounted(() => {
      headers.value = JSON.parse(localstorage.getItem("headers"));
        items.value = JSON.parse(localstorage.getItem("items"));
    });
    return {
      headers,
      items,
    };
  },
};
</script>
<style lang="scss" scoped>
.v-data-table {
  ::v-deep th:first-child {
    text-align: center;
  }
  ::v-deep th {
    text-align: inherit;
  }
}
</style>