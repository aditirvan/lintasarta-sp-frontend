<template>
     <v-card flat class="">
                      <v-card-text class="py-0">
                        <v-row>
                          <v-col>
                            <div
                              class="headline font-weight-bold font--text pb-4"
                            >
                              Custom Image
                            </div>
                          </v-col>
                          <v-col class="flex-row text-right">
                            <v-btn
                              style="border: 3px solid; background-color: white"
                              depressed
                              width="150"
                              height="50"
                              class="secondary--text"
                              @click="() => {
                                dialogImportImageURL = true;
                              }"
                              >Import via URL</v-btn
                            >
                            <div
                              style="
                                height: auto;
                                display: inline-block;
                                width: 30px;
                              "
                            />
                            <v-btn
                              depressed
                              @click="
                                () => {
                                  dialoguploadimage = true;
                                }
                              "
                              width="150"
                              height="50"
                              color="secondary"
                              >Upload Image</v-btn
                            >
                          </v-col>
                        </v-row>

                        <v-row
                          ><v-col>
                            <v-data-table
                              hide-default-footer
                              :headers="headercustomimage"
                              :items="customimage"
                              :items-per-page="10"
                              class="elevation-0"
                            >
                              <template v-slot:item.image="{ item }">
                                <div class="d-flex">
                                  <div class="dotblue mt-2"></div>
                                  <div>
                                    <router-link :to="'' + item.id" append>
                                      <span class="primary--text">{{
                                        item.image.text
                                      }}</span>
                                    </router-link>
                                    <p>{{ item.image.spec }}</p>
                                  </div>
                                </div>
                              </template>

                              <template v-slot:item.size="{ item }">
                                <p class="mb-0">{{ item.size.vol }}</p>
                              </template>

                              <template v-slot:item.action="{}">
                                <label style="cursor: pointer"
                                  ><span class="primary--text">Edit</span>
                                </label>
                                <span
                                  style="
                                    height: auto;
                                    width: 20px;
                                    display: inline-block;
                                  "
                                />
                                <label style="cursor: pointer"
                                  ><span class="error--text"
                                    >Delete</span
                                  ></label
                                >
                              </template>
                              <template v-if="customimage.length > 5" v-slot:footer="{ props }">
                                <custom-footer-datatable :props="props" />
                              </template>
                            </v-data-table>
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
      dialogImportURL: true,
      editfilelisting: false,
      editcdn: false,
      tab: null,
      tab1: null,
      customimage,
      headers: [
        { text: "Name", value: "name" },
        { text: "Region", value: "region" },
        { text: "Created Date", value: "createddate" },
        { text: "Tags", value: "tags" },
        { text: "Action",  sortable: false,  align:'center', value: "action" },
      ],
      headers1: [{ text: "Name", value: "name" }],
      headercustomimage: [
        { text: "Image", value: "image" },
        { text: "Size", value: "size" },
        { text: "Created Date", value: "createddate" },
        { text: "Action",  sortable: false,  align:'center', value: "action" },
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
  components: {
  },
};
</script>
