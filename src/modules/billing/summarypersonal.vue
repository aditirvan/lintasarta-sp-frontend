<template>
  <v-card flat class="rounded-lg pa-2 mt-3">
    <v-card-text class="d-flex justify-space-between">
      <v-row class="align-center">
        <v-col>
          <p class="fz-21 font-weight-bold">
            <!-- List Billing All Project - April 2021 {{ userprofile }} (dummy text) -->
            List Billing All Project - {{ $moment().format("MMMM YYYY") }}
            <!-- {{ userprofile }} -->
          </p>
        </v-col>

        <v-col class="d-flex justify-end">
          <div>
            <v-btn
              outlined
              depressed
              color="secondary"
              class="mr-4"
              style="margin-bottom: 20px"
              height="45"
              max-width="197"
              to="/billing/payment"
            >
              Top Up Balance
            </v-btn>

            <v-btn
              v-if="isDevMode"
              depressed
              class="secondary"
              style="margin-bottom: 20px"
              height="45"
              max-width="197"
              @click="downloadInvoice"
            >
              Download Invoice
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">List Project</th>
              <th class="text-left">Monthly Cost</th>
            </tr>
          </thead>

          <tbody>
            <!-- tr from api data -->
            <!-- <tr v-for="project in projects" :key="project.name">
              <td>
                <router-link
                  :to="`/billing/personal/${project.id}`"
                >
                  {{ project.name }}
                </router-link>

                <span class="ml-4" />
                
                <v-icon :color="project.commitment ? '#FF8C5A' : '#A5B3BF'">
                  $vuetify.icons.antdesigntagsIcon
                </v-icon>
                
                <span
                  :style="{ color: project.commitment ? '#FF8C5A' : '#A5B3BF' }"
                >
                  {{
                    project.commitment
                      ? "Commitment Project"
                      : "Non-Commitment Project"
                  }}
                </span>
              </td>

              <td>asd2</td>
            </tr> -->

            <!-- dummy tr -->
            <tr
              v-for="(project, index) in projects"
              :key="'project-' + project.project_id + index"
            >
              <td>
                <router-link :to="'/billing/personal/' + project.project_name">
                  {{ project.project_name }}
                </router-link>
              </td>

              <td>IDR {{ project.billed.toLocaleString("id-ID") }}</td>
            </tr>

            <tr v-if="loading">
              <td>
                <beat-loader
                  v-if="loading"
                  :loading="loading"
                  color="#2C94D2"
                  size="10px"
                  class="ml-2"
                />
              </td>
              <td>
                <beat-loader
                  v-if="loading"
                  :loading="loading"
                  color="#2C94D2"
                  size="10px"
                  class="ml-2"
                />
              </td>
            </tr>

            <tr v-if="!projects.length && !loading">
              <td>
                <p class="text-center">Data is empty</p>
              </td>
              <td>
                <p class="text-center">Data is empty</p>
              </td>
            </tr>

            <!-- total -->
            <tr>
              <td style="padding-left: 0px; padding-right: 0px">
                <div
                  class="d-flex align-center px-4 rounded-l-lg"
                  style="
                    height: 80px;
                    background-color: #f1f2f2;
                    margin-top: 20px;
                    font-family: Fira Sans;
                    font-size: 21px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 29px;
                    letter-spacing: 0em;
                    text-align: left;
                  "
                >
                  Total
                </div>
              </td>
              <td style="padding-right: 0px; padding-left: 0px">
                <div
                  class="d-flex align-center px-4 rounded-r-lg"
                  style="
                    height: 80px;
                    background-color: #f1f2f2;
                    margin-top: 20px;
                    font-size: 36px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 50px;
                    letter-spacing: 0em;
                    text-align: left;
                  "
                >
                  <!-- {{
                    IDRformat.format(billings.reduce((t, v) => t + v.price, 0))
                  }} -->
                  IDR {{ total.toLocaleString("id-ID") }}
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
import api from "@/lib/api";

const isDevMode = process.env.VUE_APP_DEV_MODE === "fase-1.3";

export default {
  data() {
    return {
      isDevMode,
      projects: [],
      total: 0,
      loading: false,
    };
  },
  methods: {
    async fetchProjects() {
      this.loading = true;

      try {
        const res = await api.POST("/billing/list", {
          year: parseInt(this.$moment().format("YYYY")),
          month: parseInt(this.$moment().format("M")),
        });

        this.projects = res.data.list;
        this.total = res.data.total;
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying project list"
        );
      }

      this.loading = false;
    },
    downloadInvoice() {},
  },
  mounted() {
    this.fetchProjects();
  },
};
</script>
