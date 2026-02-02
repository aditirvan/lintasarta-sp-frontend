<template>
  <div>
    <v-col cols="12">
      <v-card class="rounded-lg" flat>
        <!-- <v-container class="mt-4" v-if="isLoading">
          <div class="d-flex justify-center">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
        </v-container> -->
        <v-container fluid class="px-7 py-4">
          <v-row>
            <v-col cols="9">
              <div class="firewall-title ">{{ $route.params.project }}</div>
            </v-col>
          </v-row>
          <v-card class="rounded-lg mt-4 mb-4" flat>

            <v-data-table
              :headers="headers"
              :items="detailRepositories"
              class="elevation-0"
              item-key="id"
              v-model="selected"
              hide-default-footer
              :items-per-page="10"
              :options.sync="options"
              :loading="isLoading"
              :server-items-length="totalRepositories.count"
            >
              <template #[`item.digest`]="{ item }">
                <router-link
                    ref="digest"
                    :value="`${item.digest}`"
                  :to="`/registry/${$route.params.project_name}/repositories/${$route.params.project}/${item.digest}`"
                  >{{ formatString(item.digest) }}</router-link
                >
              </template>
              <template #[`item.tags`]="{ item }">
                <div v-if="item.tags!=null">  
                  <span v-if="item.tags.length==1">{{ item.tags[0].name }}</span>
                  <v-tooltip bottom color="white" v-else-if="item.tags.length>1">
                    <template #activator="{ on }">
                      <v-chip v-on="on"  variant="text">{{ item.tags[0].name }}, {{ item.tags[1].name }} ... ({{ item.tags.length }}) </v-chip> 
                    </template>
                      <span>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">Tags</th>
                                <th class="text-left">Signed by notary</th>
                                <th class="text-left">Pull Time</th>
                                <th class="text-left">Push Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(items,index) in item.tags.slice(0, 3)">
                                <td v-if="items.immutable">{{ items.name }} <v-chip x-small color="primary" style="float: right;">Immutable</v-chip></td>
                                <td v-else>{{ items.name }}</td>
                                <td>
                                  <div v-if="items.signed == false" style="text-align: center;">
                                    <v-icon color="red">mdi-close-circle-outline</v-icon>
                                  </div>
                                  <div v-else style="text-align: center;">
                                    <v-icon color="green">mdi-check-circle-outline</v-icon>
                                  </div>
                                </td>
                                <td>
                                  <div v-if="item.pull_time!='0001-01-01T00:00:00.000Z'">
                                    {{ formatDate(item.pull_time) }}
                                  </div>
                                  <div  v-else>
                                    -
                                  </div>
                                </td>
                                <td>
                                  <div>{{ formatDate(items.push_time) }}</div>
                                </td>
                              </tr>
                              <tr v-if="item.tags.length>=6">
                                <td :colspan="4"><b>...</b></td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </span>
                  </v-tooltip>
                </div>
                <div v-else>-</div>
              </template>

              <template #[`item.size`]="{ item }">
                <div>{{ $formatSize(item.size) }}</div>
              </template>
              <template #[`item.labels`]="{item}">
                <li v-for="(items, index) in item.labels" style="list-style-type: none;" >
                    <v-btn :color="items.color" class="white--text bs-trs"
                      ><v-icon>mdi-lan</v-icon>&nbsp;{{ items.name }}</v-btn
                    >
                </li>
              </template>
              <template #[`item.pull`]="{item}">
                <div>
                  <v-btn
                    class="bs-tr"
                    :title="`docker pull ${infoSystem.external_url}/${$route.params.project_name}/${$route.params.project}:${item.digest}`"
                    @click="copy(`docker pull ${infoSystem.external_url}/${$route.params.project_name}/${$route.params.project}:${item.digest}`)"
                    ><v-icon class="text-center"
                      >mdi-content-copy</v-icon
                    ></v-btn
                  >
                </div>
              </template>
              <template #[`item.labels`]="{ item }">
                <div v-if=" item.labels && item.labels.length==1">                    
                    <v-btn :color="item.labels[0].color" class="white--text bs-trx"
                      ><v-icon>mdi-lan</v-icon>&nbsp;{{ item.labels[0].name }}</v-btn
                    >
                  </div>
                <div v-else-if=" item.labels && item.labels.length>1">
                    <div class="text-center d-flex ma-4 justify-center">
                      <v-tooltip bottom  color="white">
                        <template v-slot:activator="{ on }">
                          <v-btn :color="item.labels[0].color" class="white--text" v-on="on"><v-icon>mdi-lan</v-icon> {{ item.labels[0].name }} ... </v-btn>
                        </template>
                        <span  v-for="(items, index) in item.labels">
                          <v-btn :color="items.color" class="white--text" ><v-icon>mdi-lan</v-icon> {{ items.name }} </v-btn><br>
                        </span>
                      </v-tooltip>
                    </div>
                </div>
                
                <div v-else>-</div>
              </template>
              <template #[`item.vulnerabilities`]="{item}">
                {{ handler_vulnerabilities(item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'],$route.params.project_name,$route.params.project) }}
                <div v-if="item.scan_overview && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'] && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity==='Critical' && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Success'">
                  <v-tooltip left> 
                    <template  v-slot:activator="{ on }">
                      <v-icon color="red"  v-on="on">mdi-alpha-c-circle-outline</v-icon>
                    </template>
                    <span>
                      Vulnerabilities severity : {{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity }}
                    </span>
                  </v-tooltip>
                  <v-tooltip left  color="white"> 
                    <template  v-slot:activator="{ on }">
                      <h3 v-on="on">{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.total }} Total - <small>{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.fixable }} Fixable</small></h3>
                    </template>
                    <div style="width: 300px;">
                      <bar
                        :data="{                         
                         labels: [
                            'Critical : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            'High : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            'Medium : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            'Low : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            'None : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                          datasets:[{
                            data: [
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                            backgroundColor: [
                              'rgba(189, 39, 28, 0.2)',
                              'rgba(250, 68, 55, 0.2)',
                              'rgba(252, 181, 13, 0.2)',
                              'rgba(17, 118, 250, 0.2)',
                              'rgba(170, 171, 173, 0.2)'
                            ],
                            borderColor: [
                              'rgb(189, 39, 28)',
                              'rgb(250, 68, 55)',
                              'rgb(252, 181, 13)',
                              'rgb(17, 118, 250)',
                              'rgb(170, 171, 173)'
                            ],
                            borderWidth: 1
                          }]
                        }"
                        
                        :options="{
                          legend: {
                            display: false,
                          },
                          title: {
                              display: true,
                              text: 'Vulnerabilities severity : Critical',
                              font:{weight: 'bold'}
                          },
                          tooltips: {
                            enabled: false,
                          },
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }"
                      />
                    </div>
                  </v-tooltip>
                </div>
                <div v-else-if="item.scan_overview && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'] && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity==='High' && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Success'">
                  <v-tooltip left> 
                    <template  v-slot:activator="{ on }">
                      <v-icon color="red"  v-on="on">mdi-alpha-h-circle-outline</v-icon>
                    </template>
                    <span>
                      Vulnerabilities severity : {{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity }}
                    </span>
                  </v-tooltip>
                  <v-tooltip left  color="white"> 
                    <template  v-slot:activator="{ on }">
                      <h3 v-on="on">{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.total }} Total - <small>{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.fixable }} Fixable</small></h3>
                  
                    </template>
                    <div style="width: 300px;">
                      <bar
                        :data="{
                           labels: [
                            'Critical : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            'High : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            'Medium : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            'Low : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            'None : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                          datasets:[{
                            data: [
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                            backgroundColor: [
                              'rgba(189, 39, 28, 0.2)',
                              'rgba(250, 68, 55, 0.2)',
                              'rgba(252, 181, 13, 0.2)',
                              'rgba(17, 118, 250, 0.2)',
                              'rgba(170, 171, 173, 0.2)'
                            ],
                            borderColor: [
                              'rgb(189, 39, 28)',
                              'rgb(250, 68, 55)',
                              'rgb(252, 181, 13)',
                              'rgb(17, 118, 250)',
                              'rgb(170, 171, 173)'
                            ],
                            borderWidth: 1
                          }]
                        }"
                        
                        :options="{
                          legend: {
                            display: false,
                          },
                          title: {
                              display: true,
                              text: 'Vulnerabilities severity : High',
                              font:{weight: 'bold'}
                          },
                          tooltips: {
                            enabled: false,
                          },
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }"
                      />
                    </div>
                  </v-tooltip>
                </div>
                <div v-else-if="item.scan_overview && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'] && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity==='Medium' && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Success'">
                   <v-tooltip bottom location="start">
                    <template  v-slot:activator="{ on }">
                      <v-icon color="amber">mdi-alpha-m-circle-outline</v-icon>
                    </template>
                    <span>
                      Vulnerabilities severity : {{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity }}
                    </span>
                  </v-tooltip>
                  <v-tooltip left  color="white"> 
                    <template  v-slot:activator="{ on }">
                  <h3>{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.total }} Total - <small>{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.fixable }} Fixable</small></h3>
                    </template>
                    <div style="width: 300px;">
                      <bar
                        :data="{
                          
                          labels: [
                            'Critical : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            'High : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            'Medium : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            'Low : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            'None : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                          datasets:[{
                            data: [
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                            backgroundColor: [
                              'rgba(189, 39, 28, 0.2)',
                              'rgba(250, 68, 55, 0.2)',
                              'rgba(252, 181, 13, 0.2)',
                              'rgba(17, 118, 250, 0.2)',
                              'rgba(170, 171, 173, 0.2)'
                            ],
                            borderColor: [
                              'rgb(189, 39, 28)',
                              'rgb(250, 68, 55)',
                              'rgb(252, 181, 13)',
                              'rgb(17, 118, 250)',
                              'rgb(170, 171, 173)'
                            ],
                            borderWidth: 1
                          }]
                        }"
                        
                        :options="{
                          legend: {
                            display: false,
                          },
                          title: {
                              display: true,
                              text: 'Vulnerabilities severity : Medium',
                              font:{weight: 'bold'}
                          },
                          tooltips: {
                            enabled: false,
                          },
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }"
                      />
                    </div>
                  </v-tooltip>
                </div>
                <div v-else-if="item.scan_overview && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'] && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity==='Low' && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Success'">
                  <v-tooltip bottom location="start">
                    <template  v-slot:activator="{ on }">
                      <v-icon color="light-blue">mdi-alpha-l-circle-outline</v-icon>
                    </template>
                    <span>
                      Vulnerabilities severity : {{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity }}
                    </span>
                  </v-tooltip>
                  <v-tooltip left  color="white"> 
                  <template  v-slot:activator="{ on }">
                    <h3>{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.total }} Total - <small>{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.fixable }} Fixable</small></h3>
                  </template>
                    <div style="width: 300px;">
                      <bar
                        :data="{
                          
                          labels: [
                            'Critical : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            'High : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            'Medium : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            'Low : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            'None : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                          datasets:[{
                            data: [
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                            backgroundColor: [
                              'rgba(189, 39, 28, 0.2)',
                              'rgba(250, 68, 55, 0.2)',
                              'rgba(252, 181, 13, 0.2)',
                              'rgba(17, 118, 250, 0.2)',
                              'rgba(170, 171, 173, 0.2)'
                            ],
                            borderColor: [
                              'rgb(189, 39, 28)',
                              'rgb(250, 68, 55)',
                              'rgb(252, 181, 13)',
                              'rgb(17, 118, 250)',
                              'rgb(170, 171, 173)'
                            ],
                            borderWidth: 1
                          }]
                        }"
                        
                        :options="{
                          legend: {
                            display: false,
                          },
                          title: {
                              display: true,
                              text: 'Vulnerabilities severity : Low',
                              font:{weight: 'bold'}
                          },
                          tooltips: {
                            enabled: false,
                          },
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }"
                      />
                    </div>
                  </v-tooltip>
                </div>
                <div v-else-if="item.scan_overview && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'] && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity==='None' && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Success'">
                   <v-tooltip bottom location="start">
                    <template  v-slot:activator="{ on }">
                      <v-icon color="light-blue">mdi-alpha-n-circle-outline</v-icon>
                    </template>
                    <span>
                      Vulnerabilities severity : {{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity }}
                    </span>
                  </v-tooltip>
                  <v-tooltip left  color="white"> 
                    <template  v-slot:activator="{ on }">
                      <h3>{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.total }} Total - <small>{{ item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.fixable }} Fixable</small></h3>
                    </template>
                    <div style="width: 300px;">
                      <bar
                        :data="{                         
                         labels: [
                            'Critical : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            'High : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            'Medium : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            'Low : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            'None : '+item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                          datasets:[{
                            data: [
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.critical,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.high,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.medium,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.low,
                            item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].summary.summary.none
                          ],
                            backgroundColor: [
                              'rgba(189, 39, 28, 0.2)',
                              'rgba(250, 68, 55, 0.2)',
                              'rgba(252, 181, 13, 0.2)',
                              'rgba(17, 118, 250, 0.2)',
                              'rgba(170, 171, 173, 0.2)'
                            ],
                            borderColor: [
                              'rgb(189, 39, 28)',
                              'rgb(250, 68, 55)',
                              'rgb(252, 181, 13)',
                              'rgb(17, 118, 250)',
                              'rgb(170, 171, 173)'
                            ],
                            borderWidth: 1
                          }]
                        }"
                        
                        :options="{
                          legend: {
                            display: false,
                          },
                          title: {
                              display: true,
                              text: 'Vulnerabilities severity : None',
                              font:{weight: 'bold'}
                          },
                          tooltips: {
                            enabled: false,
                          },
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }"
                      />
                    </div>
                  </v-tooltip>
                </div>
                <div v-else-if="item.scan_overview && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'] && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Stopped'">
                    <v-chip variant="outlined">
                      Scan Stopped
                    </v-chip>
                </div>
                <div  v-else-if="item.scan_overview && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'] && (item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Running'||item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Pending')" >
                  <v-col
                  class="text-subtitle-1 text-center"
                  cols="12"
                >
                  Scanning 
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-col>
                </div>
                <div v-else-if="item.scan_overview && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'] && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Success'&& item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].severity==='None'">
                    <v-chip variant="outlined">
                      No vulnerability
                    </v-chip>
                </div>
                <div v-else>
                    <v-chip variant="outlined">
                      Not Scanned
                    </v-chip>
                </div>
              </template>

              <template #[`item.sign`]="{ item }">
                <div v-if="item.tags && item.tags[0].signed == false">
                  <v-icon color="red">mdi-close-circle-outline</v-icon>
                </div>
                <div v-else-if="item.tags && item.tags[0].signed == true">
                  <v-icon color="green">mdi-check-circle-outline</v-icon>
                </div>
                <div v-else>
                -
                </div>
              </template>
              <template #[`item.annotations`]="{ item }">
                <div class="d-flex justify-center">
                  {{ item.annotations || "-" }}
                </div>
              </template>

              <template #[`item.push_time`]="{ item }">
                <div>
                  {{ formatDate(item.push_time) }}
                </div>
              </template>
              <template #[`item.pull_time`]="{ item }">
                <div v-if="item.pull_time!='0001-01-01T00:00:00.000Z'">
                  {{ formatDate(item.pull_time) }}
                </div>
                <div  v-else>
                </div>
              </template>
              <template #[`item.action`]="{ item }">
                <div>
                  More
                  <v-menu right down>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on">mdi-menu-down</v-icon>
                    </template>
                    <v-list>
                      <v-list-item 
                        :disabled="disable">
                        <v-list-item-title
                          class="cursor-pointer"
                          @click="scan_artifact(item.digest)"
                        ><v-icon left small>mdi-shield-check-outline</v-icon> Scan
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item 
                        :disabled="disable"
                      v-if="item.scan_overview && item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'] && (item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Running'||item.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status==='Pending')"
                      >
                        <v-list-item-title
                          class="cursor-pointer" 
                          @click="stopscan_artifact(item.digest)"
                        ><v-icon left small>mdi-alert-octagon</v-icon> Stop Scan
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item 
                        :disabled="disable">
                        <v-list-item-title
                          class="cursor-pointer"
                          @click="copy(item.digest)"
                        >
                        <v-icon left small>mdi-content-copy</v-icon> Copy Digest
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item 
                        :disabled="disable">
                        <v-list-item-title
                          class="cursor-pointer"
                          @click="setLabels(item)"
                        ><v-icon left small>mdi-plus</v-icon> Add Labels
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item 
                        :disabled="disable">
                        <v-list-item-title
                          class="cursor-pointer" style="color: red;"
                          @click="dialogDelete(item.digest)"
                        ><v-icon left small  color="red">mdi-delete</v-icon> Delete
                        </v-list-item-title>
                      </v-list-item>

                    </v-list>
                  </v-menu>
                </div>
              </template>
              <template v-slot:footer="{ props }">
                <custom-footer-datatable
                  @input="
                    (val) => {
                      options = val;
                      changePage(val);
                    }
                  "
                  :props="props"
                />
              </template>
            </v-data-table>
          </v-card>
        </v-container>
      </v-card>
    </v-col>
    <dialogSetLabels
      :close-dialog.sync="closeDialog"
      :data-selected="dataSelected"
      :selecteds="selecteds"
      :parameter="parameter"
    ></dialogSetLabels>
    <deleteDialog
      :close.sync="close"
      :data-delete="dataDelete"
    ></deleteDialog>
  </div>
</template>

<script>
import { ref, onMounted,onBeforeMount } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
import dialogSetLabels from "./dialog/dialog-set-labels.vue";
import deleteDialog from "./dialog/delete-dialog.vue";
import moment from "moment";
import bar from "./bar.vue";
import { array } from "yup";
export default {
  components: {
    dialogSetLabels,
    deleteDialog,
    bar,
  },
  methods: {
     handler_vulnerabilities(item,name,project){
      if(item.scan_status=='Running'||item.scan_status=='Pending'){
        const { getDetailRepositories} =
          useNamespacedActions(REGISTRY, [
          "getDetailRepositories",
        ]);
          const params = {
            name: name,
            project: project,
          };
          
        var timer = setTimeout(function () {
          getDetailRepositories(params);
          },
        3000);
        // console.log("timer",timer)
      }
    }
  },
  setup(props, context) {
    const { detailRepositories, isLoading, infoSystem,tableOverview,totalRepositories } = useNamespacedGetters(
      REGISTRY,
      ["detailRepositories", "isLoading", "infoSystem","tableOverview","totalRepositories"]
    );

    const { getDetailRepositories, getImage, getSystemInfo,getDeleteArtifact,fetchListRepositories,scanArtifact,stopScanArtifact} =
      useNamespacedActions(REGISTRY, [
        "getDetailRepositories",
        "getImage",
        "getSystemInfo",
        "getDeleteArtifact",
        "fetchListRepositories",
        "scanArtifact",
        "stopScanArtifact",
      ]);
      
    onMounted(async () =>  {
      const params = {
        name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
        digest:context.root.$route.params.artifacts,
      };
      // console.log(params)
      await getDetailRepositories(params);
      getSystemInfo()
      // console.log("============detailRepositories===============:",detailRepositories.value)
    });
    
    function percent(a,b){ b
      return a/b*100
    }
    const closeDialog = ref(false);
    const close = ref(false);
    const dataSelected = ref({});
    const dataBar = ref({});
    const selecteds = ref({});
    const parameter=ref({});
    const dataDelete = ref({});
    const selected = ref([]);
    const headers = ref([
      // { text: "No", value: "id", sortable: false },
      { text: "Artifacts", value: "digest", sortable: false },
      { text: "Pull Command", value: "pull", sortable: false },
      { text: "Tag", value: "tags", sortable: false },
      { text: "Signed", value: "sign", sortable: false },
      { text: "Size", value: "size", sortable: false, width: "10%" },
      { text: "Vulnerabilities", value: "vulnerabilities", width: "20%" },
      { text: "Annotations", value: "annotations", sortable: false },
      { text: "Labels", value: "labels", sortable: false },
      { text: "Push Time", value: "push_time", width: "10%" },
      { text: "Pull Time", value: "pull_time", width: "10%" },
      { text: "Action", value: "action" },
    ]);
    const disable = ref(true)
    const role=localStorage.getItem("role"); 
    // console.log("role====",role)
    if(role=="Owner"||role=='Superadmin'){
      disable.value=false
    }
    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, search: "", sortBy: [], sortDesc: [], is_created: [] });

    const formatDate = (date) => {
      return moment(date).format("l, LT");
    };

    function copy(field) {
      // const input = this.$refs[field].value;

      navigator.clipboard.writeText(field);
    }
    function deleted(digest) {
      // console.log("digest===================",digest)
      const params = {
        name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
        digest:digest
      };
      getDeleteArtifact(params)
    }
    const setLabels = (item) => {
      dataSelected.value = item;
      // console.log("=================detail-dataSelected======================",dataSelected.value)
      let select = []
      if(item.labels){
        for(var i=0;i<item.labels.length;i++){
          select.push(item.labels[i].id)
        // console.log("============================",item.labels[i].id)
        }
      }
      selecteds.value = Object.assign({},select);
    
    const params = {
        name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
      };
      parameter.value=params
      // console.log("=================detail-parameter======================",parameter.value)
      closeDialog.value = true;
    };
    const dialogDelete = (digest) => {
       const params = {
        name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
        digest:digest,
        title:"Artifact",
      };
      dataDelete.value = params;
      close.value = true;
    };
    function copy_digest() {
        let digest = []
      // console.log(this.selected[0])
      for( var i = 0; i < this.selected.length; i++ ){   
        digest.push(this.selected[i].digest)
      }
      navigator.clipboard.writeText(digest);
    }
    
    const changePage = (val) => {
      const params={
        page_size:val.itemsPerPage,
        page:val.page,
        project: context.root.$route.params.project,
      }
      const payload = {
        project:context.root.$route.params.project,
        params: params
      }
      fetchListRepositories(payload);
    };
    const formatString = (string) => {
      return string.substring(0, 15);
    };
    const scan_artifact = (item) => {
    // function scanArtifact(digest) {
       const params = {
        project: context.root.$route.params.project_name,
        repository: context.root.$route.params.project,
        digest:item,
      };
      // console.log("param===========",params)
      scanArtifact(params)
    };
    const stopscan_artifact = (item) => {
    // function scanArtifact(digest) {
       const params = {
        project: context.root.$route.params.project_name,
        repository: context.root.$route.params.project,
        digest:item,
      };
      // console.log("param===========",params)
      stopScanArtifact(params)
    };
    return {
      stopscan_artifact,
      scan_artifact,
      scanArtifact,
      setLabels,
      changePage,
      headers,
      selected,
      getDetailRepositories,
      tableOverview,
      totalRepositories,
      detailRepositories,
      getDeleteArtifact,    
      copy,
      copy_digest,
      formatDate,
      isLoading,
      formatString,
      getImage,
      infoSystem,
      getSystemInfo,
      deleted,
      closeDialog,
      close,
      dataSelected,
      selecteds,
      parameter,
      dataDelete,
      dialogDelete,
      options,
      // totalRepositories,
      fetchListRepositories,
      role,
      disable,
      percent,
    };
  },
};
</script>

<style lang="scss" scoped>
.fg {
  flex-grow: 0;
}
.bs-tr {
  box-shadow: none !important;
  background-color: transparent !important;
}
.bs-tr::before {
  background-color: transparent;
}

.bs-trx {
  box-shadow: none !important;
  cursor: auto;
  pointer-events: none;
  border-radius: 1.5rem;
  border: none;
}
.bs-trx::before {
  background-color: transparent;
}
::v-deep .v-progress-linear__background {
  opacity: 1 !important;
} 
.cap {
  text-transform: capitalize;
}
.bs-trs {
  box-shadow: none !important;
  cursor: auto;
  pointer-events: none;
  border-radius: 1.5rem;
  border: none;
}
.bs-trs::before {
  background-color: transparent;
}
</style>