<template>
  <v-card flat class="pt-4">
    <v-card-text class="py-0">
      <v-row>
        <v-col class="pb-0 pt-0">
          <div class="headline font-weight-bold font--text">
            Snapshot
          </div>
        </v-col>
      </v-row>
      <v-row
      >
        <v-col>
          <v-tabs v-model="tab1" align-with-title>
            <v-tab>Instance</v-tab>
            <v-tab>Storage</v-tab>
          </v-tabs>
        </v-col>
      </v-row>

      <v-divider/>
    </v-card-text>
    <v-card-text>
      <v-tabs-items v-model="tab1">
        <v-tab-item>
          <v-data-table
              :hide-default-footer="true"
              :headers="headers"
              :items="instances"
              :items-per-page="10"
              class="elevation-0"
          >
            <template v-slot:item.name="{ item }">
              <div class="d-flex">
                <div class="dotblue mt-2"></div>
                <div>
                  <router-link :to="'' + item.id" append>
                                      <span class="primary--text">{{
                                          item.name.text
                                        }}</span>
                  </router-link>
                  <p>{{ item.name.spec }}</p>
                </div>
              </div>
            </template>

            <template v-slot:item.size="{ item }">
              <p>{{ item.size.vol }}</p>
              <p>{{ item.size.item }}</p>
            </template>

            <template v-slot:item.action="{ item }">
              <label
                  class="text-primary"
                  style="position: relative"
                  @click="show($event, item)"
              >More
                <v-icon>mdi-chevron-down</v-icon>
              </label>
            </template>
            <template v-if="instances.length > 5" v-slot:footer="{ props }">
              <custom-footer-datatable :props="props"/>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <div class="d-flex">
            <v-col
                md="6"
                style="padding-top: 77px; padding-bottom: 76px"
                class="d-flex flex-column text-center ma-auto"
            >
              <p
                  style="font-size:16px"
                  class="font-weight-bold">
                Looks like you don’t have any volume
                snapshots.
              </p>
              <p style="color:#A5B3BF">
                Snapshots allow you to manually copy and store
                an image of your volume. Take one using the
                form up top or from the “More” dropdown menu
                on any volume.
              </p>
            </v-col>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col>
          <div
              class="headline font-weight-bold font--text pb-4"
          >
            Take a Snapshot
          </div>

          <p>
            Power-down Instances before taking a snapshot to
            ensure data consistency.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <v-text-field
              outlined
              hide-details=""
          ></v-text-field>
        </v-col>
        <v-col md="4">
          <v-row>
            <v-col class="py-0">
              <div class="d-flex flex-row align-center">
                <v-text-field
                    outlined
                    hide-details
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col md="2 align-self-end">
          <v-btn
              depressed
              width="150"
              height="50"
              color="secondary"
          >Take Snapshot
          </v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data() {
    const customimage = [
      {
        id: 1,
        image: {
          text: "Image Lintasarta",
          spec: "Version 1.0.1",
        },
        size: {
          vol: "10 GB",
        },
        region: "SGP1",
        createddate: "2 years ago",
        tags: "",
      },
      {
        id: 1,
        image: {
          text: "Image Lintasarta",
          spec: "Version 1.0.1",
        },
        size: {
          vol: "10 GB",
        },
        region: "SGP1",
        createddate: "2 years ago",
        tags: "",
      },
      {
        id: 1,
        image: {
          text: "Image Lintasarta",
          spec: "Version 1.0.1",
        },
        size: {
          vol: "10 GB",
        },
        region: "SGP1",
        createddate: "2 years ago",
        tags: "",
      },
      {
        id: 1,
        image: {
          text: "Image Lintasarta",
          spec: "Version 1.0.1",
        },
        size: {
          vol: "10 GB",
        },
        region: "SGP1",
        createddate: "2 years ago",
        tags: "",
      },
      {
        id: 1,
        image: {
          text: "Image Lintasarta",
          spec: "Version 1.0.1",
        },
        size: {
          vol: "10 GB",
        },
        region: "SGP1",
        createddate: "2 years ago",
        tags: "",
      },
    ];
    return {
      dialoguploadimage: false,
      editfilelisting: false,
      editcdn: false,
      tab: null,
      tab1: null,
      customimage,
      headers: [
        {text: "Name", value: "name"},
        {text: "Status", value: "status"},
        {text: "Created Date", value: "createddate"},
        {text: "tags", value: "tags"},
        {text: "Action", sortable: false, align: 'center', value: "action"},
      ],
      headers1: [{text: "Name", value: "name"}],
      headercustomimage: [
        {text: "Image", value: "image"},
        {text: "size", value: "size"},
        {text: "Created date", value: "createddate"},
        {text: "Action", sortable: false, align: 'center', value: "action"},
      ],
      instances: [
        {
          id: 1,
          name: {
            text: "Test-Object-Storage-Lintasarta",
            spec: "https://test-object-storage-lintasarta.cloud.lintasarta.com",
          },
          size: {
            vol: "10 GB",
            item: "5 Items",
          },
          region: "SGP1",
          createddate: "2 years ago",
          tags: "",
        },
        {
          id: 2,
          name: {
            text: "Test-Object-Storage-Lintasarta",
            spec: "https://test-object-storage-lintasarta.cloud.lintasarta.com",
          },
          size: {
            vol: "10 GB",
            item: "5 Items",
          },
          region: "SGP1",
          createddate: "2 years ago",
          tags: "",
        },
        {
          id: 3,
          name: {
            text: "Test-Object-Storage-Lintasarta",
            spec: "https://test-object-storage-lintasarta.cloud.lintasarta.com",
          },
          size: {
            vol: "10 GB",
            item: "5 Items",
          },
          region: "SGP1",
          createddate: "2 years ago",
          tags: "",
        },
        {
          id: 4,
          name: {
            text: "Test-Object-Storage-Lintasarta",
            spec: "https://test-object-storage-lintasarta.cloud.lintasarta.com",
          },
          size: {
            vol: "10 GB",
            item: "5 Items",
          },
          region: "SGP1",
          createddate: "2 years ago",
          tags: "",
        },
        {
          id: 5,
          name: {
            text: "Test-Object-Storage-Lintasarta",
            spec: "https://test-object-storage-lintasarta.cloud.lintasarta.com",
          },
          size: {
            vol: "10 GB",
            item: "5 Items",
          },
          region: "SGP1",
          createddate: "2 years ago",
          tags: "",
        },
      ],
    };
  },
}
</script>