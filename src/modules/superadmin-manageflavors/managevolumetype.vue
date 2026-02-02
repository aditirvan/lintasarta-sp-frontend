<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text class="d-flex flex-row align-center">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Manage Volume Type</p>

          <v-spacer />

          <div style="height: auto; width: 30px" />

          <v-btn
            id="CreateNewType"
            depressed
            height="50"
            width="150"
            class="secondary"
            @click="
              () => {
                openDialogAddType = true;
              }
            "
          >
            <span class="fz-14">Create New Type</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-data-table
        hide-default-footer
        :items-per-page="5"
        :headers="headers"
        :items="types"
      >
        <!-- btns -->
        <template v-slot:item.action="{ item }">
          <label
            style="cursor: pointer"
            @click="
              () => {
                selectedType = item;
                openDialogTypeEdit = true;
              }
            "
          >
            <span class="primary--text mr-6">Edit</span>
          </label>

          <label
            style="cursor: pointer"
            @click="
              () => {
                selectedType = item;
                openDialogTypeDelete = true;
              }
            "
          >
            <span class="error--text">Delete</span>
          </label>
        </template>

        <!-- pagination -->
        <template v-slot:footer="{ props }">
          <custom-footer-datatable :props="props" />
        </template>
      </v-data-table>
    </v-card-text>

    <dialogAddType
      v-if="openDialogAddType"
      v-model="openDialogAddType"
      @succeed="refreshTypes"
    />

    <dialogEditType
      v-if="selectedType && openDialogTypeEdit"
      v-model="openDialogTypeEdit"
      :item="selectedType"
      @succeed="refreshTypes"
    />

    <dialogDeleteType
      v-if="selectedType && openDialogTypeDelete"
      v-model="openDialogTypeDelete"
      :item="selectedType"
      @close="openDialogTypeDelete = false"
      @confirm="deleteType"
      :loading="loading"
      title="Delete Volume"
    />
  </v-card>
</template>

<script>
import dialogAddType from "./managevolumetype/dialogAddType.vue";
import dialogEditType from "./managevolumetype/dialogEditType.vue";
import dialogDeleteType from "./managevolumetype/dialogDeleteType.vue";

export default {
  components: {
    dialogAddType,
    dialogEditType,
    dialogDeleteType,
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Action", value: "action" },
      ],
      types: [{ name: "asd", description: "asd" }],
      openDialogAddType: false,
      openDialogTypeEdit: false,
      openDialogTypeDelete: false,
      selectedType: null,
    };
  },
  methods: {
    refreshTypes() {},
    deleteType() {},
  },
};
</script>
