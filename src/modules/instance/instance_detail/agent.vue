<template>
  <v-row fluid class="py-0">

    <v-col cols="12" v-if="elementForSubscribing">
      <v-card flat class="rounded-lg">

        <v-card-title class="font-weight-bold">Subscribe Deka Agent Premium</v-card-title>

        <v-card-text 
          class="py-0 pr-10">
          
          <div>
            Subscribe to the deka agent premium service to see a more complete graphs.
            <span v-if="statusInstanceDekaAgent.is_still_active && statusInstanceDekaAgent.is_unsubscribe">
              This subscription will end tomorrow.
            </span>
          </div>

        </v-card-text>

        <v-card-actions
          class="pl-4 pr-10">
          <v-row>
            <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0 pb-0">
              <div class="d-flex align-center">
                <v-checkbox v-model="agree" label="By Subscribe Deka Agent You Agree To The"> </v-checkbox>
                <span class="text-decoration-underline primary--text ml-2 mb-1 fz-16 font-weight-bold cursor-pointer" @click="getEula()"
                  >Terms of Service</span
                >
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
        <v-card-text>
          <v-btn v-if="role.toLowerCase() == 'superadmin'"
            depressed
            large
            class="secondary"
            @click="
              () => {
                dialogSubscribing = true;
              }
            "
          >
            Subscribe
          </v-btn>
          <v-btn v-else-if="statusCheckEula"
            depressed
            large
            class="secondary"
            @click="
              () => {
                dialogSubscribing = true;
              }
            "
          >
            Subscribe
          </v-btn>
          <v-btn v-else
            :disabled="isBtnSubscribeDisable || !agree"
            depressed
            large
            class="secondary"
            @click="
              () => {
                dialogSubscribing = true;
              }
            "
          >
            Subscribe
          </v-btn>
        </v-card-text>


      </v-card>

    </v-col>

    <v-col cols="12" v-if="elementQuotaLimitReached">
      <v-card flat class="rounded-lg">

        <v-card-title class="font-weight-bold">Agent's subscribe quota has been reached</v-card-title>

        <v-card-text 
          class="py-0 pr-10 pb-4">
          
          <div>
            contact the administrator to increase the quota
          </div>

        </v-card-text>

      </v-card>
    </v-col>

    <v-col cols="12" v-if="elementForUnSubscribing">
      <v-card flat class="rounded-lg">

        <v-card-title class="font-weight-bold">Deka Agent Premium</v-card-title>

         <v-card-text 
          class="py-0 pr-10 pb-4">
          
          <div>
            This instance has subscribed to the Deka Agent Premium service
          </div>

        </v-card-text>

        <v-card-actions
          class="pl-4 pr-10 pb-4">
          <v-btn
            depressed
            large
            class="error"
            @click="
              () => {
                dialogSubscribing = true;
              }
            "
          >
            Unsubscribe
          </v-btn>
        </v-card-actions>


      </v-card>

    </v-col>

    <v-col cols="12" class="" v-if="loading">
      <v-card flat class="rounded-lg text-center pa-15">

        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>

      </v-card>
    </v-col>
    

    <v-col cols="12" class="" v-if="elementHowtoinstall">
      <v-card flat class="rounded-lg">
        <v-card-title>
          <div class="headline font-weight-bold font--text">Deka Agent</div>
        </v-card-title>
        <v-card-text class="">
          <p><b> Description</b></p>
          <!-- <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id cursus justo. Fusce congue, odio eu dignissim fringilla, arcu justo suscipit tellus, in vehicula purus turpis eget elit. In laoreet, arcu ac facilisis convallis, urna augue elementum metus, sit amet feugiat erat libero vel libero. Curabitur nec libero lectus. Donec gravida metus nec risus efficitur, et blandit orci venenatis. Nulla a libero sed dolor tincidunt facilisis a id odio. Vivamus eget dui id ex bibendum suscipit nec vel elit. Vivamus malesuada bibendum neque, vel cursus metus dapibus a.
          </p> -->
          <p>
            To ensure comprehensive monitoring and performance metrics for your services, we require the installation of a monitoring agent on your Instance. This agent will gather essential data points that help us maintain optimal operation of your services.
          </p>
          <p><b> How to install</b></p>

          <!-- <pre class="horizontal-scroll-container mb-5"
          >
            <code class="bash">
<br>
$ wget https://bucket.cloud.lintasarta.co.id:8082/deka/agent/deka-agent
<br>
<br>
 $ chmod +x deka-agent
<br>
<br>
 $ ./deka-agent install
<br>
<br>
 $ systemctl status deka-agent
<br>
<br>
 $ systemctl status deka-monitoring-agent.service
<br>
            </code>
          </pre> -->

          <div class="code-window">
            <div class="menubar">Terminal</div>
            <div class="codearea">
              <pre class="codeblock horizontal-scroll-container"><code class="bash">
<br>
$ wget https://parahu.box.cloudeka.id/cloudeka-agent/deka-agent/deka-agent
<br>
$ chmod +x deka-agent
<br>
$ ./deka-agent install
<br>
$ systemctl status deka-agent
<br>
$ systemctl status deka-monitoring-agent.service
<br>
</code></pre>
            </div>
          </div>

        </v-card-text>
      </v-card>
    </v-col>


    <v-col cols="12" v-if="elementDate">
      <v-card flat class="rounded-lg">
        <v-card-text class="d-flex justify-end" style="padding-left: 30px; padding-right: 30px">
          <v-menu
            v-model="vcalendar"
            offset-y
            :close-on-click="true"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                depressed
                :ripple="false"
                outlined
                v-bind="attrs"
                v-on="on"
                style="border: 1px solid #ece9f1"
              >
                <p class="black--text mb-0" style="font-weight: 400">
                  {{ range.start.toLocaleDateString("id-ID") }} -
                  {{ range.end.toLocaleDateString("id-ID") }}
                </p>
                <v-icon class="ml-2" style="width: 13px; height: 13px">
                  $vuetify.icons.calendarIcon
                </v-icon>
              </v-btn>
            </template>
            <vc-date-picker
              v-model="range"
              is-range
              :min-date="new Date(getInstanceDetail.created_at)"
              :max-date="new Date()"
            />
          </v-menu>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" v-if="elementExportPdf">
      <v-card flat class="rouded-lg">
        <v-card-text class="d-flex justify-end">
          <v-btn
            color="primary"
            elevation="11"
            large
            @click="
              () => {
                dialogDownloadPDF = true;
              }
            "
          >Export to PDF</v-btn>
        </v-card-text>
      </v-card>
    </v-col>

  <v-col cols="12" v-if="elementBtnClpsQuick">
   <v-expansion-panels>

     <v-expansion-panel>
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Quick CPU / Mem / Disk
        </v-expansion-panel-header>
   

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

    <v-col cols="">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaCPUBusy"
                :src="srcCPUBusy"
                class="iframe-box"
                frameborder="0"
              >
              </iframe>

              <iframe 
                ref="chartiframe"
                id="NoDataCPUBusy"
                :src="urlCpuBusy.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"

              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

     <v-col cols="">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanasrcSysLoad5"
                :src="srcSysLoad5"
                class="iframe-box"
                frameborder="0"
              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDatasrcSysLoad5"
                :src="urlSysLoad5.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"

              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

     <v-col cols="">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaSysLoad15"
                :src="srcSysLoad15"
                class="iframe-box"
                frameborder="0"
              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataSysLoad15"
                :src="urlsysLoad15.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"

              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaRamUsed"
                :src="srcRamUsed"
                class="iframe-box"
                frameborder="0"
              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataRamUsed"
                :src="urlRamUsed.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"

              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaSwapUsed"
                :src="srcSwapUsed"
                class="iframe-box"
                frameborder="0"
              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataSwapUsed"
                :src="urlSwapUsed.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"

              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

     <v-col cols="">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaRootFsUsed"
                :src="srcRootFsUsed"
                class="iframe-box"
                frameborder="0"
              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataRootFsUsed"
                :src="urlRootFsUsed.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"

              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="6">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaCpuCores"
                :src="srcCpuCores"
                class="iframe-box"
                frameborder="0"
                width="100%" 

              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataCpuCores"
                :src="urlCpuCores.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="6">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaUptime"
                :src="srcUptime"
                class="iframe-box"
                frameborder="0"
                width="100%" 

              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataUptime"
                :src="urlUptime.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaRootFsTotal"
                :src="srcRootFsTotal"
                class="iframe-box"
                frameborder="0"
                width="100%" 

              >
              </iframe>
             <iframe 
                ref="chartiframe"
                id="NoDataRootFsTotal"
                :src="urlRootFsTotal.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"
                width="100%" 
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="6">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaRamTotal"
                :src="srcRamTotal"
                class="iframe-box"
                frameborder="0"
                width="100%" 

              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataRamTotal"
                :src="urlRamTotal.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="6">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaSwapTotal"
                :src="srcSwapTotal"
                class="iframe-box"
                frameborder="0"
                width="100%" 

              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataSwapTotal"
                :src="urlSwapTotal.href"
                class="iframe-box"
                frameborder="0"
                style="display: none;"
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- </v-row> -->
    </v-row>
    </v-expansion-panel-content>

      </v-expansion-panel>

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnBasicCpu">
   <v-expansion-panels>

    <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Basic CPU / Mem / Net / Disk
        </v-expansion-panel-header>
    <!-- <button v-if="elementBtnBasicCpu" class="btn btn-link rounded-lg mx-3 mt-2 mb-2 collapsible" cols="12" >
      &nbsp;&nbsp; Basic CPU / Mem / Net / Disk
    </button> -->

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>
    <!-- <v-row class="content" v-if="elementContentBasicCpu"  > -->

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaCpuBasic"
                :src="srcCpuBasic"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                :height="iframeHeight"

              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataCpuBasic"
                :src="urlCpuBasic.href"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                style="display: none;"
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaMemoryBasic"
                :src="srcMemoryBasic"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                :height="iframeHeight"

              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataMemoryBasic"
                :src="urlMemoryBasic.href"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                style="display: none;"
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaNetworkTraficBasic"
                :src="srcNetworkTraficBasic"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                :height="iframeHeight"

              >
              </iframe>
               <iframe 
                ref="chartiframe"
                id="NoDataNetworkTraficBasic"
                :src="urlNetworkTraficBasic.href"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                style="display: none;"
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaMemoryBasicPercentage"
                :src="srcMemoryBasicPercentage"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                :height="iframeHeight"

              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataMemoryBasicPercentage"
                :src="urlMemoryBasicPercentage.href"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                style="display: none;"
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card flat class="rounded-lg">
        <v-card-text class="py-0 pr-10 pb-4">
          
          <v-row class="ml-n5">
            <v-col class="text-center">
              <iframe 
                ref="chartiframe"
                id="iframeGrafanaDiskSpaceUsedBasic"
                :src="srcDiskSpaceUsedBasic"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                :height="iframeHeight"

              >
              </iframe>
              <iframe 
                ref="chartiframe"
                id="NoDataDiskSpaceUsedBasic"
                :src="urlDiskSpaceUsedBasic.href"
                class="iframe-box"
                frameborder="0"
                width="100%" 
                style="display: none;"
              >
              </iframe>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- </v-row> -->
     </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>


    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnMemoryMeminfo">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Memory Meminfo
        </v-expansion-panel-header>

     <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryActiveInactive"
                  :src="srcMemoryActiceInactive"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryCommitted"
                  :src="srcMemoryCommitted"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryActiveInactiveDetail"
                  :src="srcMemoryActiveInactiveDetail"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryWritebackandDirty"
                  :src="srcMemoryWritebackandDirty"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemorySharedandMapped"
                  :src="srcMemorySharedandMapped"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemorySlab"
                  :src="srcMemorySlab"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryVmalloc"
                  :src="srcMemoryVmalloc"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryBounce"
                  :src="srcMemoryBounce"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryAnonymous"
                  :src="srcMemoryAnonymous"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryKernelCPU"
                  :src="srcMemoryKernelCPU"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryHugePagesCounter"
                  :src="srcMemoryHugePagesCounter"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryHugePagesSize"
                  :src="srcMemoryHugePagesSize"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryDirectMap"
                  :src="srcMemoryDirectMap"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryUnevictableandMLocked"
                  :src="srcMemoryUnevictableandMLocked"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryNFS"
                  :src="srcMemoryNFS"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnMemoryVmstat">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Memory Vmstat
        </v-expansion-panel-header>

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryPagesInOut"
                  :src="srcMemoryPagesInOut"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryPagesSwapInOut"
                  :src="srcMemoryPagesSwapInOut"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMemoryPageFaults"
                  :src="srcMemoryPageFaults"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaOOMKiller"
                  :src="srcOOMKiller"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

   <v-col cols="12" v-if="elementBtnSystemTimesync">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          System Timesync
        </v-expansion-panel-header>

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTimeSynchronizedDrift"
                  :src="srcTimeSynchronizedDrift"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTimePLLAdjust"
                  :src="srcTimePLLAdjust"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTimeSynchronizedStatus"
                  :src="srcTimeSynchronizedStatus"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTimeMisc"
                  :src="srcTimeMisc"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnSystemProcesses">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          System Processes
        </v-expansion-panel-header>

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaProcessesStatus"
                  :src="srcProcessesStatus"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaProcessesState"
                  :src="srcProcessesState"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaProcessesForks"
                  :src="srcProcessesForks"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaProcessesMemory"
                  :src="srcProcessesMemory"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaPIDsNumberandLimit"
                  :src="srcPIDsNumberandLimit"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaProcessschedulestatsRunningWaiting"
                  :src="srcProcessschedulestatsRunningWaiting"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaThreadsNumberandLimit"
                  :src="srcThreadsNumberandLimit"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnSystemMisc">
   <v-expansion-panels>

     <v-expansion-panel>
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          System Misc
        </v-expansion-panel-header>

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaContextSwitchesInterrupts"
                  :src="srcContextSwitchesInterrupts"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSystemLoad"
                  :src="srcSystemLoad"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaInterruptsDetail"
                  :src="srcInterruptsDetail"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaScheduletimeslicesexecutedbyeachcpu"
                  :src="srcScheduletimeslicesexecutedbyeachcpu"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaEntropy"
                  :src="srcEntropy"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaCPUtimespentinuserandsystemcontexts"
                  :src="srcCPUtimespentinuserandsystemcontexts"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaFileDescriptors"
                  :src="srcFileDescriptors"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnHardwareMisc">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Hardware Misc
        </v-expansion-panel-header>


    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaHardwaretemperaturemonitor"
                  :src="srcHardwaretemperaturemonitor"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaThrottlecoolingdevice"
                  :src="srcThrottlecoolingdevice"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaPowersupply"
                  :src="srcPowersupply"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnSystemd">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Systemd
        </v-expansion-panel-header>


    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSystemdSockets"
                  :src="srcSystemdSockets"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSystemdUnitsState"
                  :src="srcSystemdUnitsState"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnStorageDisk">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Storage Disk
        </v-expansion-panel-header>


    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaDiskIOpsCompleted"
                  :src="srcDiskIOpsCompleted"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaDiskRWData"
                  :src="srcDiskRWData"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaDiskAverageWaitTime"
                  :src="srcDiskAverageWaitTime"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaAverageQueueSize"
                  :src="srcAverageQueueSize"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaDiskRWMerged"
                  :src="srcDiskRWMerged"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTimeSpentDoingIOs"
                  :src="srcTimeSpentDoingIOs"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaInstantaneousQueueSize"
                  :src="srcInstantaneousQueueSize"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaDiskIOpsDiscardscompletedmerged"
                  :src="srcDiskIOpsDiscardscompletedmerged"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnStorageFilesystem">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Storage Filesystem
        </v-expansion-panel-header>

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaFilesystemspaceavailable"
                  :src="srcFilesystemspaceavailable"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaFileNodesFree"
                  :src="srcFileNodesFree"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaFileDescriptor"
                  :src="srcFileDescriptor"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaFileNodesSize"
                  :src="srcFileNodesSize"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaFilesysteminReadOnlyError"
                  :src="srcFilesysteminReadOnlyError"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnNetworkTraffic">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Network Traffic
        </v-expansion-panel-header>

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkTrafficbyPackets"
                  :src="srcNetworkTrafficbyPackets"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkTrafficErrors"
                  :src="srcNetworkTrafficErrors"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkTrafficDrop"
                  :src="srcNetworkTrafficDrop"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkTrafficCompressed"
                  :src="srcNetworkTrafficCompressed"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkTrafficMulticast"
                  :src="srcNetworkTrafficMulticast"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkTrafficFifo"
                  :src="srcNetworkTrafficFifo"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkTrafficFrame"
                  :src="srcNetworkTrafficFrame"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkTrafficCarrier"
                  :src="srcNetworkTrafficCarrier"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkTrafficColls"
                  :src="srcNetworkTrafficColls"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNFContrack"
                  :src="srcNFContrack"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaARPEntries"
                  :src="srcARPEntries"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaMTU"
                  :src="srcMTU"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSpeed"
                  :src="srcSpeed"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaQueueLength"
                  :src="srcQueueLength"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSoftnetPackets"
                  :src="srcSoftnetPackets"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSoftnetOutofQuota"
                  :src="srcSoftnetOutofQuota"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetworkOperationalStatus"
                  :src="srcNetworkOperationalStatus"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnNetworkSockstat">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Network Sockstat
        </v-expansion-panel-header>

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSockstatTCP"
                  :src="srcSockstatTCP"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSockstatUDP"
                  :src="srcSockstatUDP"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSockstatFRAGRAW"
                  :src="srcSockstatFRAGRAW"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSockstatMemorySize"
                  :src="srcSockstatMemorySize"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaSockstatUsed"
                  :src="srcSockstatUsed"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>


      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnNetworkNetstat">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Network Netstat
        </v-expansion-panel-header>

    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetstatIPInOutOctets"
                  :src="srcNetstatIPInOutOctets"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNetstatIPForwarding"
                  :src="srcNetstatIPForwarding"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaICMPInOut"
                  :src="srcICMPInOut"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaICMPErrors"
                  :src="srcICMPErrors"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaUDPInOut"
                  :src="srcUDPInOut"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaUDPErrors"
                  :src="srcUDPErrors"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTCPInOut"
                  :src="srcTCPInOut"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTCPErrors"
                  :src="srcTCPErrors"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTCPConnections"
                  :src="srcTCPConnections"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTCPSynCookie"
                  :src="srcTCPSynCookie"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTCPDirectTransition"
                  :src="srcTCPDirectTransition"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaTCPStat"
                  :src="srcTCPStat"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>

  <v-col cols="12" v-if="elementBtnNodeExporter">
   <v-expansion-panels>

     <v-expansion-panel >
       <v-expansion-panel-header class="header-panel-text-color border-bot-panel">
          Node Exporter
        </v-expansion-panel-header>


    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNodeExporterScrapeTime"
                  :src="srcNodeExporterScrapeTime"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card flat class="rounded-lg">
          <v-card-text class="py-0 pr-10 pb-4">
            
            <v-row class="ml-n5">
              <v-col class="text-center">
                <iframe 
                  ref="chartiframe"
                  id="iframeGrafanaNodeExporterScrape"
                  :src="srcNodeExporterScrape"
                  class="iframe-box"
                  frameborder="0"
                  width="100%" 
                  :height="iframeHeight"

                >
                </iframe>
               
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      </v-row>
    </v-expansion-panel-content>

    </v-expansion-panel>
    

    </v-expansion-panels>
  </v-col>


  <dialogForSubscribing
    v-if="dialogSubscribing"
    :instance="instanceDetail"
    :service="dekaAgentPrice"
    v-model="dialogSubscribing"
  />

  <dialogForDownloadPdf
    v-if="dialogDownloadPDF"
    :instance="instanceDetail"
    v-model="dialogDownloadPDF"
  />


  </v-row>
</template>
<script lang="ts">
import moment from "moment/moment.js";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { INSTANCEDETAIL } from "./namespace";
import dialogForSubscribing from "./dialogForSubscribingDekaAgent.vue";
import dialogForDownloadPdf from "./dialogForDownloadPdf.vue"
import {
  computed,
  defineComponent,
  ref,
  watch,
  onMounted,
} from "@vue/composition-api";
import INSTANCE from "../namespace";
import { SUPERADMINMANAGEPRICING } from "../../superadmin-manage-pricing/namespace";
import libProject from "@/lib/project";
import axios from '@/lib/axios'

const DELTAS = {
  "100":481,
  "200":427,
  "300":400,
  "400":400,
  "500":400,
  "700":400,
  "800":400,
  "900":400,
  "1000":400,
};

export default defineComponent({
  components: { dialogForSubscribing, dialogForDownloadPdf, },
  data() {
    return {
      iframeHeight: '0px',
    }
  },
  computed: {
    // Necessary for initial iframe height
    iframeOffsetWidth() {      
      return this.$refs['chartiframe'].offsetWidth;
    },
  },
  watch:{
    elementBtnClpsQuick(val){
      if (val) {
        // this.waitForElm('.collapsible').then((elm) => {
        this.waitForElm('.iframe-box').then((elm) => {
          this.iframeHeight = `${DELTAS[Math.min(1e3,Math.max(100*Math.floor(this.iframeOffsetWidth/100),100))]}px`;

          // setup event listener
          window.addEventListener('messageAgent', this.handleIframeResize);
        })
      }

    }
  },
  // mounted() {
  //   this.iframeHeight = `${DELTAS[Math.min(1e3,Math.max(100*Math.floor(this.iframeOffsetWidth/100),100))]}px`;

  //   // setup event listener
  //   window.addEventListener('messageAgent', this.handleIframeResize);
  // },
  beforeDestroy() {
    // destroy event listener
    window.removeEventListener('messageAgent', this.handleIframeResize);
  },
  methods: {
    handleIframeResize(e) {
      for(var b in e.data['datawrapper-height']) {
        if ('8dfPN' === b) {
          this.iframeHeight = `${e.data['datawrapper-height'][b]}px`;

        }
      }
    },
    waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
  },
  setup(props: any, context: any) {

    const { getInstanceDetail } = useNamespacedGetters(INSTANCE, [
      "getInstanceDetail",
    ]);

    const { getStatusSubscribeDekaAgent, fetchInstanceDetail, checkEula } = useNamespacedActions(INSTANCE, [
      "getStatusSubscribeDekaAgent",
      "fetchInstanceDetail",
      "checkEula"
    ]);

    const { getmetricDekaAgentall } = useNamespacedActions(INSTANCEDETAIL, [
      "getmetricDekaAgentall",
    ]);
    const { 
      getDekaAgentLimit,
    } = useNamespacedActions(
      "AGENT",
      [
        "getDekaAgentLimit",
      ]
    );
    const { limitservices } = useNamespacedState("AGENT", ["limitservices"]);

    const {
      getDefaultDekaAgent,
    } = useNamespacedActions(INSTANCEDETAIL, [
      "getDefaultDekaAgent",
    ]);
    const {
      dekaAgentPrice,
    } = useNamespacedState(INSTANCEDETAIL, [
      "dekaAgentPrice",
    ]);

    const srcMain = ref('');
    const srcCPUBusy = ref('');
    const srcSysLoad5 = ref('');
    const srcSysLoad15 = ref('');
    const srcRamUsed = ref('');
    const srcSwapUsed = ref('');
    const srcRootFsUsed = ref('');
    const srcCpuCores = ref('');
    const srcUptime = ref('');
    const srcRootFsTotal = ref('');
    const srcRamTotal = ref('');
    const srcSwapTotal = ref('');
    const srcCpuBasic = ref('');
    const srcMemoryBasic = ref('');
    const srcNetworkTraficBasic = ref('');
    const srcMemoryBasicPercentage = ref('');
    const srcDiskSpaceUsedBasic = ref('');
    const urlCpuBusy = ref({});
    const urlSysLoad5 = ref({});
    const urlsysLoad15 = ref({});
    const urlRamUsed = ref({});
    const urlSwapUsed = ref({});
    const urlRootFsUsed = ref({});
    const urlCpuCores = ref({});
    const urlUptime = ref({});
    const urlRootFsTotal = ref({});
    const urlRamTotal = ref({});
    const urlSwapTotal = ref({});
    const urlCpuBasic = ref({});
    const urlMemoryBasic = ref({});
    const urlNetworkTraficBasic = ref({});
    const urlMemoryBasicPercentage = ref({});
    const urlDiskSpaceUsedBasic = ref({});
    const srcMemoryActiceInactive = ref('');
    const srcMemoryCommitted = ref('');
    const srcMemoryActiveInactiveDetail = ref('');
    const srcMemoryWritebackandDirty = ref('');
    const srcMemorySharedandMapped = ref('');
    const srcMemorySlab = ref('');
    const srcMemoryVmalloc = ref('');
    const srcMemoryBounce = ref('');
    const srcMemoryAnonymous = ref('');
    const srcMemoryKernelCPU = ref('');
    const srcMemoryHugePagesCounter = ref('');
    const srcMemoryHugePagesSize = ref('');
    const srcMemoryDirectMap = ref('');
    const srcMemoryUnevictableandMLocked = ref('');
    const srcMemoryNFS = ref('');
    const srcMemoryPagesInOut = ref('');
    const srcMemoryPagesSwapInOut = ref('');
    const srcMemoryPageFaults = ref('');
    const srcOOMKiller = ref('');
    const srcTimeSynchronizedDrift = ref('');
    const srcTimePLLAdjust = ref('');
    const srcTimeSynchronizedStatus = ref('');
    const srcTimeMisc = ref('');
    const srcProcessesStatus = ref('');
    const srcProcessesState = ref('');
    const srcProcessesForks = ref('');
    const srcProcessesMemory = ref('');
    const srcPIDsNumberandLimit = ref('');
    const srcProcessschedulestatsRunningWaiting = ref('');
    const srcThreadsNumberandLimit = ref('');
    const srcContextSwitchesInterrupts = ref('')
    const srcSystemLoad = ref('')
    const srcInterruptsDetail = ref('')
    const srcScheduletimeslicesexecutedbyeachcpu = ref('')
    const srcEntropy = ref('')
    const srcCPUtimespentinuserandsystemcontexts = ref('')
    const srcFileDescriptors = ref('')
    const srcHardwaretemperaturemonitor = ref('')
    const srcThrottlecoolingdevice = ref('')
    const srcPowersupply = ref('')
    const srcSystemdSockets = ref('')
    const srcSystemdUnitsState = ref('')
    const srcDiskIOpsCompleted = ref('')
    const srcDiskRWData = ref('')
    const srcDiskAverageWaitTime = ref('')
    const srcAverageQueueSize = ref('')
    const srcDiskRWMerged = ref('')
    const srcTimeSpentDoingIOs = ref('')
    const srcInstantaneousQueueSize = ref('')
    const srcDiskIOpsDiscardscompletedmerged = ref('')
    const srcFilesystemspaceavailable = ref('')
    const srcFileNodesFree = ref('')
    const srcFileDescriptor = ref('')
    const srcFileNodesSize = ref('')
    const srcFilesysteminReadOnlyError = ref('')
    const srcNetworkTrafficbyPackets = ref('')
    const srcNetworkTrafficErrors = ref('')
    const srcNetworkTrafficDrop = ref('')
    const srcNetworkTrafficCompressed = ref('')
    const srcNetworkTrafficMulticast = ref('')
    const srcNetworkTrafficFifo = ref('')
    const srcNetworkTrafficFrame = ref('')
    const srcNetworkTrafficCarrier = ref('')
    const srcNetworkTrafficColls = ref('')
    const srcNFContrack = ref('')
    const srcARPEntries = ref('')
    const srcMTU = ref('')
    const srcSpeed = ref('')
    const srcQueueLength = ref('')
    const srcSoftnetPackets = ref('')
    const srcSoftnetOutofQuota = ref('')
    const srcNetworkOperationalStatus = ref('')
    const srcSockstatTCP = ref('')
    const srcSockstatUDP = ref('')
    const srcSockstatFRAGRAW = ref('')
    const srcSockstatMemorySize = ref('')
    const srcSockstatUsed = ref('')
    const srcNetstatIPInOutOctets = ref('')
    const srcNetstatIPForwarding = ref('')
    const srcICMPInOut = ref('')
    const srcICMPErrors = ref('')
    const srcUDPInOut = ref('')
    const srcUDPErrors = ref('')
    const srcTCPInOut = ref('')
    const srcTCPErrors = ref('')
    const srcTCPConnections = ref('')
    const srcTCPSynCookie = ref('')
    const srcTCPDirectTransition = ref('')
    const srcTCPStat = ref('')
    const srcNodeExporterScrapeTime = ref('')
    const srcNodeExporterScrape = ref('')

    const elementExportPdf = ref(false);
    const elementForSubscribing = ref(false);
    const elementForUnSubscribing = ref(false);
    const elementHowtoinstall = ref(false);
    const elementDate = ref(false);
    const elementBtnClpsQuick = ref(false);
    const elemetContentquick = ref(false);
    const elementBtnBasicCpu = ref(false);
    const elementContentBasicCpu = ref(false);
    const loading = ref(true)
    const elementBtnMemoryMeminfo = ref(false)
    const elementContentMemoryMeminfo = ref(false)
    const elementBtnMemoryVmstat = ref(false)
    const elementContentMemoryVmstat = ref(false)
    const elementBtnSystemTimesync = ref(false)
    const elementContentSystemTimesync = ref(false)
    const elementBtnSystemProcesses = ref(false)
    const elementContentSystemProcesses = ref(false)
    const elementBtnSystemMisc = ref(false)
    const elementContentSystemMisc = ref(false)
    const elementBtnHardwareMisc = ref(false)
    const elementContentHardwareMisc = ref(false)
    const elementBtnSystemd = ref(false)
    const elementContentSystemd = ref(false)
    const elementBtnStorageDisk = ref(false)
    const elementContentStorageDisk = ref(false)
    const elementBtnStorageFilesystem = ref(false)
    const elementContentStorageFilesystem = ref(false)
    const elementBtnNetworkTraffic = ref(false)
    const elementContentNetworkTraffic = ref(false)
    const elementBtnNetworkSockstat = ref(false)
    const elementContentNetworkSockstat = ref(false)
    const elementBtnNetworkNetstat = ref(false)
    const elementContentNetworkNetstat = ref(false)
    const elementBtnNodeExporter = ref(false)
    const elementContentNodeExporter = ref(false)
    const isBtnSubscribeDisable = ref(false)
    const elementQuotaLimitReached = ref(false)
    const agree = ref(false);
    const role = ref(localStorage.getItem("role"));

    const {
      isThereMetricsAllPerinstance,
    } = useNamespacedState(INSTANCEDETAIL, [
      "isThereMetricsAllPerinstance",
    ]);
    const {
      instanceDetail,
      statusInstanceDekaAgent,
      statusCheckEula
    } = useNamespacedState(INSTANCE, [
      'instanceDetail',
      'statusInstanceDekaAgent',
      'statusCheckEula'
    ])


    const range = ref({
      start: new Date((new Date()).setDate((new Date()).getDate() - 1)),
      end: new Date((new Date()).setDate((new Date()).getDate() )),
    });
    
    const dialogSubscribing = ref(false)
    const dialogDownloadPDF = ref(false)
    const { instanceid } = context.root._route.params
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const projectId = ref(currentProj.id);
    const getEula = () => {
      const routeData = context.root.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Subscribe Deka Agent" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    };

    onMounted( async() => {
      const params = new URLSearchParams();
      params.append("project_id", localStorage.getItem("projectid"));
      params.append("form_name", "Form Subscribe Deka Agent");
      await checkEula(params);

      // const params = new URLSearchParams();
      // params.append("limit", "1");
      // params.append("page", "1");
      // params.append("status", "1");
      // params.append("search", "Deka Monitoring");

      // await getListProduct(params);
      await getDefaultDekaAgent();
      await getDekaAgentLimit(projectId.value)
      const totalRemainingDekaAgent = limitservices.value.deka_agent.deka_agent_total.remaining

      // console.log('listProduct.value:', listProduct.value)
      // console.log('listProduct.value[0].id:', listProduct.value[0].id)

      // if (listProduct.value.length > 0) {
      //   await getDetailProduct(listProduct.value[0].id);
      // }
      // console.log('detailProduct.value:', detailProduct.value)
      // console.log('detailProduct.value.services[0].service_tag[0].price_per_hour:', detailProduct.value.services[0].service_tag[0].price_per_hour)
      // console.log('detailProduct.value.services[0].service_tag[0].price_per_month:', detailProduct.value.services[0].service_tag[0].price_per_month)

      const currOrg = await libProject.getCurrentOrg();
      const nameOrg = encodeURIComponent(currOrg.name)

      const currentProjectDB = await libProject.getActiveProject()
      const projNameUrl = currentProjectDB.name.replace(" ", "+")

      await fetchInstanceDetail(instanceid)
      await getStatusSubscribeDekaAgent(instanceid)

      srcMain.value = `${process.env.VUE_APP_API_BASE_URL_GRAFANA}/d-solo/rYdddlPWk21/node-exporter-deka-agent?orgId=2&var-DS_PROMETHEUS=Prometheus&var-job=deka-monitoring`
      srcMain.value += `&var-org=${nameOrg}`
      srcMain.value += `&var-proj=${projNameUrl}`
      srcMain.value += `&var-service=instance&var-instance=${getInstanceDetail.value.name}`
    

      const date = new Date();
      const currentDays = moment(new Date()).format('x')
      const yesterday = moment(date.setDate(date.getDate() - 1)).format('x')

      const timeRangeDefault = `&from=${yesterday}&to=${currentDays}`

      srcMain.value += '&theme=light'
      srcMain.value += '&refresh=1m'
      srcCPUBusy.value = srcMain.value + "&panelId=20" + timeRangeDefault
      srcSysLoad5.value = srcMain.value + "&panelId=155" + timeRangeDefault
      srcSysLoad15.value = srcMain.value + "&panelId=19" + timeRangeDefault
      srcRamUsed.value = srcMain.value + "&panelId=16" + timeRangeDefault
      srcSwapUsed.value = srcMain.value + "&panelId=21" + timeRangeDefault
      srcRootFsUsed.value = srcMain.value + "&panelId=154" + timeRangeDefault
      srcCpuCores.value = srcMain.value + "&panelId=14" + timeRangeDefault
      srcUptime.value = srcMain.value + "&panelId=15" + timeRangeDefault
      srcRootFsTotal.value = srcMain.value + "&panelId=23" + timeRangeDefault
      srcRamTotal.value = srcMain.value + "&panelId=75" + timeRangeDefault
      srcSwapTotal.value = srcMain.value + "&panelId=18" + timeRangeDefault
      srcCpuBasic.value = srcMain.value + "&panelId=77" + timeRangeDefault
      srcMemoryBasic.value = srcMain.value + "&panelId=78" + timeRangeDefault
      srcNetworkTraficBasic.value = srcMain.value + "&panelId=74" + timeRangeDefault
      srcMemoryBasicPercentage.value = srcMain.value + "&panelId=321" + timeRangeDefault
      srcDiskSpaceUsedBasic.value = srcMain.value + "&panelId=152" + timeRangeDefault
      srcMemoryActiceInactive.value = srcMain.value + "&panelId=136" + timeRangeDefault
      srcMemoryCommitted.value = srcMain.value + "&panelId=135" + timeRangeDefault
      srcMemoryActiveInactiveDetail.value = srcMain.value + "&panelId=191" + timeRangeDefault 
      srcMemoryWritebackandDirty.value = srcMain.value + "&panelId=130" + timeRangeDefault
      srcMemorySharedandMapped.value = srcMain.value + "&panelId=138" + timeRangeDefault
      srcMemorySlab.value = srcMain.value + "&panelId=131" + timeRangeDefault
      srcMemoryVmalloc.value = srcMain.value + "&panelId=70" + timeRangeDefault
      srcMemoryBounce.value = srcMain.value + "&panelId=159" + timeRangeDefault
      srcMemoryAnonymous.value = srcMain.value + "&panelId=129" + timeRangeDefault
      srcMemoryKernelCPU.value = srcMain.value + "&panelId=160" + timeRangeDefault
      srcMemoryHugePagesCounter.value = srcMain.value + "&panelId=140" + timeRangeDefault
      srcMemoryHugePagesSize.value = srcMain.value + "&panelId=71" + timeRangeDefault
      srcMemoryDirectMap.value = srcMain.value + "&panelId=128" + timeRangeDefault
      srcMemoryUnevictableandMLocked.value = srcMain.value + "&panelId=137" + timeRangeDefault
      srcMemoryNFS.value = srcMain.value + "&panelId=132" + timeRangeDefault
      srcMemoryPagesInOut.value = srcMain.value + "&panelId=176" + timeRangeDefault
      srcMemoryPagesSwapInOut.value = srcMain.value + "&panelId=22" + timeRangeDefault
      srcMemoryPageFaults.value = srcMain.value + "&panelId=175" + timeRangeDefault
      srcOOMKiller.value = srcMain.value + "&panelId=307" + timeRangeDefault
      srcTimeSynchronizedDrift.value = srcMain.value + "&panelId=260" + timeRangeDefault
      srcTimePLLAdjust.value = srcMain.value + "&panelId=291" + timeRangeDefault
      srcTimeSynchronizedStatus.value = srcMain.value + "&panelId=168" + timeRangeDefault
      srcTimeMisc.value = srcMain.value + "&panelId=294" + timeRangeDefault
      srcProcessesStatus.value = srcMain.value + "&panelId=62" + timeRangeDefault
      srcProcessesState.value = srcMain.value + "&panelId=315" + timeRangeDefault
      srcProcessesForks.value = srcMain.value + "&panelId=148" + timeRangeDefault
      srcProcessesMemory.value = srcMain.value + "&panelId=149" + timeRangeDefault
      srcPIDsNumberandLimit.value = srcMain.value + "&panelId=313" + timeRangeDefault
      srcProcessschedulestatsRunningWaiting.value = srcMain.value + "&panelId=305" + timeRangeDefault
      srcThreadsNumberandLimit.value = srcMain.value + "&panelId=314" + timeRangeDefault
      srcContextSwitchesInterrupts.value = srcMain.value + "&panelId=8" + timeRangeDefault
      srcSystemLoad.value = srcMain.value + "&panelId=7" + timeRangeDefault
      srcInterruptsDetail.value = srcMain.value + "&panelId=259" + timeRangeDefault
      srcScheduletimeslicesexecutedbyeachcpu.value = srcMain.value + "&panelId=306" + timeRangeDefault
      srcEntropy.value = srcMain.value + "&panelId=151" + timeRangeDefault
      srcCPUtimespentinuserandsystemcontexts.value = srcMain.value + "&panelId=308" + timeRangeDefault
      srcFileDescriptors.value = srcMain.value + "&panelId=64" + timeRangeDefault
      srcHardwaretemperaturemonitor.value = srcMain.value + "&panelId=158" + timeRangeDefault
      srcThrottlecoolingdevice.value = srcMain.value + "&panelId=300" + timeRangeDefault
      srcPowersupply.value = srcMain.value + "&panelId=302" + timeRangeDefault
      srcSystemdSockets.value = srcMain.value + "&panelId=297" + timeRangeDefault
      srcSystemdUnitsState.value = srcMain.value + "&panelId=298" + timeRangeDefault
      srcDiskIOpsCompleted.value = srcMain.value + "&panelId=9" + timeRangeDefault
      srcDiskRWData.value = srcMain.value + "&panelId=33" + timeRangeDefault
      srcDiskAverageWaitTime.value = srcMain.value + "&panelId=37" + timeRangeDefault
      srcAverageQueueSize.value = srcMain.value + "&panelId=35" + timeRangeDefault
      srcDiskRWMerged.value = srcMain.value + "&panelId=133" + timeRangeDefault
      srcTimeSpentDoingIOs.value = srcMain.value + "&panelId=36" + timeRangeDefault
      srcInstantaneousQueueSize.value = srcMain.value + "&panelId=34" + timeRangeDefault
      srcDiskIOpsDiscardscompletedmerged.value = srcMain.value + "&panelId=301" + timeRangeDefault
      srcFilesystemspaceavailable.value = srcMain.value + "&panelId=43" + timeRangeDefault
      srcFileNodesFree.value = srcMain.value + "&panelId=41" + timeRangeDefault
      srcFileDescriptor.value = srcMain.value + "&panelId=28" + timeRangeDefault
      srcFileNodesSize.value = srcMain.value + "&panelId=219" + timeRangeDefault
      srcFilesysteminReadOnlyError.value = srcMain.value + "&panelId=44" + timeRangeDefault
      srcNetworkTrafficbyPackets.value = srcMain.value + "&panelId=60" + timeRangeDefault
      srcNetworkTrafficErrors.value = srcMain.value + "&panelId=142" + timeRangeDefault
      srcNetworkTrafficDrop.value = srcMain.value + "&panelId=143" + timeRangeDefault
      srcNetworkTrafficCompressed.value = srcMain.value + "&panelId=141" + timeRangeDefault
      srcNetworkTrafficMulticast.value = srcMain.value + "&panelId=146" + timeRangeDefault
      srcNetworkTrafficFifo.value = srcMain.value + "&panelId=144" + timeRangeDefault
      srcNetworkTrafficFrame.value = srcMain.value + "&panelId=145" + timeRangeDefault
      srcNetworkTrafficCarrier.value = srcMain.value + "&panelId=231" + timeRangeDefault
      srcNetworkTrafficColls.value = srcMain.value + "&panelId=232" + timeRangeDefault
      srcNFContrack.value = srcMain.value + "&panelId=61" + timeRangeDefault
      srcARPEntries.value = srcMain.value + "&panelId=230" + timeRangeDefault
      srcMTU.value = srcMain.value + "&panelId=288" + timeRangeDefault
      srcSpeed.value = srcMain.value + "&panelId=280" + timeRangeDefault
      srcQueueLength.value = srcMain.value + "&panelId=289" + timeRangeDefault
      srcSoftnetPackets.value = srcMain.value + "&panelId=290" + timeRangeDefault
      srcSoftnetOutofQuota.value = srcMain.value + "&panelId=310" + timeRangeDefault
      srcNetworkOperationalStatus.value = srcMain.value + "&panelId=309" + timeRangeDefault
      srcSockstatTCP.value = srcMain.value + "&panelId=63" + timeRangeDefault
      srcSockstatUDP.value = srcMain.value + "&panelId=124" + timeRangeDefault
      srcSockstatFRAGRAW.value = srcMain.value + "&panelId=125" + timeRangeDefault
      srcSockstatMemorySize.value = srcMain.value + "&panelId=220" + timeRangeDefault
      srcSockstatUsed.value = srcMain.value + "&panelId=126" + timeRangeDefault
      srcNetstatIPInOutOctets.value = srcMain.value + "&panelId=221" + timeRangeDefault
      srcNetstatIPForwarding.value = srcMain.value + "&panelId=81" + timeRangeDefault
      srcICMPInOut.value = srcMain.value + "&panelId=115" + timeRangeDefault
      srcICMPErrors.value = srcMain.value + "&panelId=50" + timeRangeDefault
      srcUDPInOut.value = srcMain.value + "&panelId=55" + timeRangeDefault
      srcUDPErrors.value = srcMain.value + "&panelId=109" + timeRangeDefault
      srcTCPInOut.value = srcMain.value + "&panelId=299" + timeRangeDefault
      srcTCPErrors.value = srcMain.value + "&panelId=104" + timeRangeDefault
      srcTCPConnections.value = srcMain.value + "&panelId=85" + timeRangeDefault
      srcTCPSynCookie.value = srcMain.value + "&panelId=91" + timeRangeDefault
      srcTCPDirectTransition.value = srcMain.value + "&panelId=82" + timeRangeDefault
      srcTCPStat.value = srcMain.value + "&panelId=320" + timeRangeDefault
      srcNodeExporterScrapeTime.value = srcMain.value + "&panelId=40" + timeRangeDefault
      srcNodeExporterScrape.value = srcMain.value + "&panelId=157" + timeRangeDefault

      await getmetricDekaAgentall({ id: instanceid, range  });

      if ( isThereMetricsAllPerinstance.value == 0 ) {

        loading.value = false
        elementExportPdf.value = false
        elementForSubscribing.value = false
        elementForUnSubscribing.value = false
        elementHowtoinstall.value = true
        elementDate.value = false
        elementBtnClpsQuick.value = false
        elemetContentquick.value = false
        elementBtnBasicCpu.value = false
        elementContentBasicCpu.value = false
        elementBtnMemoryMeminfo.value = false
        elementContentMemoryMeminfo.value = false
        elementBtnMemoryVmstat.value = false
        elementContentMemoryVmstat.value = false
        elementBtnSystemTimesync.value = false
        elementContentSystemTimesync.value = false
        elementBtnSystemProcesses.value = false
        elementContentSystemProcesses.value = false
        elementBtnSystemMisc.value = false
        elementContentSystemMisc.value = false
        elementBtnHardwareMisc.value = false
        elementContentHardwareMisc.value = false
        elementBtnSystemd.value = false
        elementContentSystemd.value = false
        elementBtnStorageDisk.value = false
        elementContentStorageDisk.value = false
        elementBtnStorageFilesystem.value = false
        elementContentStorageFilesystem.value = false
        elementBtnNetworkTraffic.value = false
        elementContentNetworkTraffic.value = false
        elementBtnNetworkSockstat.value = false
        elementContentNetworkSockstat.value = false
        elementBtnNetworkNetstat.value = false
        elementContentNetworkNetstat.value = false
        elementBtnNodeExporter.value = false
        elementContentNodeExporter.value = false
        
      } else {
        loading.value = false

        
        if ((getInstanceDetail.value.package_deka_agent.id == "" || getInstanceDetail.value.package_deka_agent.status == "inactive") && !statusInstanceDekaAgent.value.is_still_active) {

          // // ⁠Untuk sementara waktu limit dibuat otomatis (Jumlah limit dan penggunaan akan otomatis bertambah jika ada subscribe baru dan akan berkurang jika ada unsubscribe)
          // if (totalRemainingDekaAgent > 0) {
          //   elementForSubscribing.value = true
          // } else {
          //   elementForSubscribing.value = false
          //   elementQuotaLimitReached.value = true
          // }
          elementForSubscribing.value = true

          elementForUnSubscribing.value = false

          elementHowtoinstall.value = false
          elementDate.value = true
          elementBtnClpsQuick.value = true
          elemetContentquick.value = true
          elementBtnBasicCpu.value = true
          elementContentBasicCpu.value = true

          elementExportPdf.value = false
          elementBtnMemoryMeminfo.value = false
          elementContentMemoryMeminfo.value = false
          elementBtnMemoryVmstat.value = false
          elementContentMemoryVmstat.value = false
          elementBtnSystemTimesync.value = false
          elementContentSystemTimesync.value = false
          elementBtnSystemProcesses.value = false
          elementContentSystemProcesses.value = false
          elementBtnSystemMisc.value = false
          elementContentSystemMisc.value = false
          elementBtnHardwareMisc.value = false
          elementContentHardwareMisc.value = false
          elementBtnSystemd.value = false
          elementContentSystemd.value = false
          elementBtnStorageDisk.value = false
          elementContentStorageDisk.value = false
          elementBtnStorageFilesystem.value = false
          elementContentStorageFilesystem.value = false
          elementBtnNetworkTraffic.value = false
          elementContentNetworkTraffic.value = false
          elementBtnNetworkSockstat.value = false
          elementContentNetworkSockstat.value = false
          elementBtnNetworkNetstat.value = false
          elementContentNetworkNetstat.value = false
          elementBtnNodeExporter.value = false
          elementContentNodeExporter.value = false
        } else {
          if(statusInstanceDekaAgent.value.is_unsubscribe) {
          // // ⁠Untuk sementara waktu limit dibuat otomatis (Jumlah limit dan penggunaan akan otomatis bertambah jika ada subscribe baru dan akan berkurang jika ada unsubscribe)

            // if (totalRemainingDekaAgent > 0) {
            //   elementForSubscribing.value = true
            // } else {
            //   elementForSubscribing.value = false
            //   elementQuotaLimitReached.value = true
            // }
            elementForSubscribing.value = true

            if (statusInstanceDekaAgent.value.is_still_active) {
              isBtnSubscribeDisable.value = true
            }
            elementForUnSubscribing.value = false
          } else {
            elementForSubscribing.value = false
            elementForUnSubscribing.value = true
          }

          elementHowtoinstall.value = false
          elementDate.value = true
          elementBtnClpsQuick.value = true
          elemetContentquick.value = true
          elementBtnBasicCpu.value = true
          elementContentBasicCpu.value = true

          elementExportPdf.value = true
          elementBtnMemoryMeminfo.value = true
          elementContentMemoryMeminfo.value = true
          elementBtnMemoryVmstat.value = true
          elementContentMemoryVmstat.value = true
          elementBtnSystemTimesync.value = true
          elementContentSystemTimesync.value = true
          elementBtnSystemProcesses.value = true
          elementContentSystemProcesses.value = true
          elementBtnSystemMisc.value = true
          elementContentSystemMisc.value = true
          elementBtnHardwareMisc.value = true
          elementContentHardwareMisc.value = true
          elementBtnSystemd.value = true
          elementContentSystemd.value = true
          elementBtnStorageDisk.value = true
          elementContentStorageDisk.value = true
          elementBtnStorageFilesystem.value = true
          elementContentStorageFilesystem.value = true
          elementBtnNetworkTraffic.value = true
          elementContentNetworkTraffic.value = true
          elementBtnNetworkSockstat.value = true
          elementContentNetworkSockstat.value = true
          elementBtnNetworkNetstat.value = true
          elementContentNetworkNetstat.value = true
          elementBtnNodeExporter.value = true
          elementContentNodeExporter.value = true

        }
      }
      
    })

    watch(range, (val) => {
      const date = new Date();
      const start = moment(new Date(val.start)).format('x')
      const end = moment(new Date(val.end)).format('x')
      const currentDays = moment(new Date()).format('x')
      const yesterday = moment(date.setDate(date.getDate() - 1)).format('x')

      const checkIsthereCPUBusyParamTimeFrom = srcCPUBusy.value.split("&from=")
      const checkIsthereSysLoad5ParamTimeFrom = srcSysLoad5.value.split("&from=")
      const checkIsthereSysLoad15ParamTimeFrom = srcSysLoad15.value.split("&from=")
      const checkIsthereRamUsedParamTimeFrom = srcRamUsed.value.split("&from=")
      const checkIsthereSwapUsedParamTimeFrom = srcSwapUsed.value.split("&from=")
      const checkIsthereRootFsUsedParamTimeFrom = srcRootFsUsed.value.split("&from=")
      const checkIsthereCpuCoresParamTimeFrom = srcCpuCores.value.split("&from=")
      const checkIsthereUptimeParamTimeFrom = srcUptime.value.split("&from=")
      const checkIsthereRootFsTotalParamTimeFrom = srcRootFsTotal.value.split("&from=")
      const checkIsthereRamTotalParamTimeFrom = srcRamTotal.value.split("&from=")
      const checkIsthereSwapTotalParamTimeFrom = srcSwapTotal.value.split("&from=")
      const checkIsthereCpuBasicParamTimeFrom = srcCpuBasic.value.split("&from=")
      const checkIsthereMemoryBasicParamTimeFrom = srcMemoryBasic.value.split("&from=")
      const checkIsthereNetworkTraficBasicParamTimeFrom = srcNetworkTraficBasic.value.split("&from=")
      const checkIsthereMemoryBasicPercentageParamTimeFrom = srcMemoryBasicPercentage.value.split("&from=")
      const checkIsthereDiskSpaceUsedBasicParamTimeFrom = srcDiskSpaceUsedBasic.value.split("&from=")
      const checkIsTheresrcMemoryActiceInactiveParamTimeFrom = srcMemoryActiceInactive.value.split("&from=")
      const checkIsTheresrcMemoryCommittedParamTimeFrom = srcMemoryCommitted.value.split("&from=")
      const checkIsTheresrcMemoryActiveInactiveDetailParamTimeFrom = srcMemoryActiveInactiveDetail.value.split("&from=")
      const checkIsTheresrcMemoryWritebackandDirtyParamTimeFrom = srcMemoryWritebackandDirty.value.split("&from=")
      const checkIsTheresrcMemorySharedandMappedParamTimeFrom = srcMemorySharedandMapped.value.split("&from=")
      const checkIsTheresrcMemorySlabParamTimeFrom = srcMemorySlab.value.split("&from=")
      const checkIsTheresrcMemoryVmallocParamTimeFrom = srcMemoryVmalloc.value.split("&from=")
      const checkIsTheresrcMemoryBounceParamTimeFrom = srcMemoryBounce.value.split("&from=")
      const checkIsTheresrcMemoryAnonymousParamTimeFrom = srcMemoryAnonymous.value.split("&from=")
      const checkIsTheresrcMemoryKernelCPUParamTimeFrom = srcMemoryKernelCPU.value.split("&from=")
      const checkIsTheresrcMemoryHugePagesCounterParamTimeFrom = srcMemoryHugePagesCounter.value.split("&from=")
      const checkIsTheresrcMemoryHugePagesSizeParamTimeFrom = srcMemoryHugePagesSize.value.split("&from=")
      const checkIsTheresrcMemoryDirectMapParamTimeFrom = srcMemoryDirectMap.value.split("&from=")
      const checkIsTheresrcMemoryUnevictableandMLockedParamTimeFrom = srcMemoryUnevictableandMLocked.value.split("&from=")
      const checkIsTheresrcMemoryNFSParamTimeFrom = srcMemoryNFS.value.split("&from=")
      const checkIsTheresrcMemoryPagesInOutParamTimeFrom = srcMemoryPagesInOut.value.split("&from=")
      const checkIsTheresrcMemoryPagesSwapInOutParamTimeFrom = srcMemoryPagesSwapInOut.value.split("&from=")
      const checkIsTheresrcMemoryPageFaultsParamTimeFrom = srcMemoryPageFaults.value.split("&from=")
      const checkIsTheresrcOOMKillerParamTimeFrom = srcOOMKiller.value.split("&from=")
      const checkIsTheresrcTimeSynchronizedDriftParamTimeFrom = srcTimeSynchronizedDrift.value.split("&from=")
      const checkIsTheresrcTimePLLAdjustParamTimeFrom = srcTimePLLAdjust.value.split("&from=")
      const checkIsTheresrcTimeSynchronizedStatusParamTimeFrom = srcTimeSynchronizedStatus.value.split("&from=")
      const checkIsTheresrcTimeMiscParamTimeFrom = srcTimeMisc.value.split("&from=")
      const checkIsTheresrcProcessesStatusParamTimeFrom = srcProcessesStatus.value.split("&from=")
      const checkIsTheresrcProcessesStateParamTimeFrom = srcProcessesState.value.split("&from=")
      const checkIsTheresrcProcessesForksParamTimeFrom = srcProcessesForks.value.split("&from=")
      const checkIsTheresrcProcessesMemoryParamTimeFrom = srcProcessesMemory.value.split("&from=")
      const checkIsTheresrcPIDsNumberandLimitParamTimeFrom = srcPIDsNumberandLimit.value.split("&from=")
      const checkIsTheresrcProcessschedulestatsRunningWaitingParamTimeFrom = srcProcessschedulestatsRunningWaiting.value.split("&from=")
      const checkIsTheresrcThreadsNumberandLimitParamTimeFrom = srcThreadsNumberandLimit.value.split("&from=")
      const checkIsTheresrcContextSwitchesInterruptsParamTimeFrom = srcContextSwitchesInterrupts.value.split("&from=")
      const checkIsTheresrcSystemLoadParamTimeFrom = srcSystemLoad.value.split("&from=")
      const checkIsTheresrcInterruptsDetailParamTimeFrom = srcInterruptsDetail.value.split("&from=")
      const checkIsTheresrcScheduletimeslicesexecutedbyeachcpuParamTimeFrom = srcScheduletimeslicesexecutedbyeachcpu.value.split("&from=")
      const checkIsTheresrcEntropyParamTimeFrom = srcEntropy.value.split("&from=")
      const checkIsTheresrcCPUtimespentinuserandsystemcontextsParamTimeFrom = srcCPUtimespentinuserandsystemcontexts.value.split("&from=")
      const checkIsTheresrcFileDescriptorsParamTimeFrom = srcFileDescriptors.value.split("&from=")
      const checkIsTheresrcHardwaretemperaturemonitorParamTimeFrom = srcHardwaretemperaturemonitor.value.split("&from=")
      const checkIsTheresrcThrottlecoolingdeviceParamTimeFrom = srcThrottlecoolingdevice.value.split("&from=")
      const checkIsTheresrcPowersupplyParamTimeFrom = srcPowersupply.value.split("&from=")
      const checkIsTheresrcSystemdSocketsParamTimeFrom = srcSystemdSockets.value.split("&from=")
      const checkIsTheresrcSystemdUnitsStateParamTimeFrom = srcSystemdUnitsState.value.split("&from=")
      const checkIsTheresrcDiskIOpsCompletedParamTimeFrom = srcDiskIOpsCompleted.value.split("&from=")
      const checkIsTheresrcDiskRWDataParamTimeFrom = srcDiskRWData.value.split("&from=")
      const checkIsTheresrcDiskAverageWaitTimeParamTimeFrom = srcDiskAverageWaitTime.value.split("&from=")
      const checkIsTheresrcAverageQueueSizeParamTimeFrom = srcAverageQueueSize.value.split("&from=")
      const checkIsTheresrcDiskRWMergedParamTimeFrom = srcDiskRWMerged.value.split("&from=")
      const checkIsTheresrcTimeSpentDoingIOsParamTimeFrom = srcTimeSpentDoingIOs.value.split("&from=")
      const checkIsTheresrcInstantaneousQueueSizeParamTimeFrom = srcInstantaneousQueueSize.value.split("&from=")
      const checkIsTheresrcDiskIOpsDiscardscompletedmergedParamTimeFrom = srcDiskIOpsDiscardscompletedmerged.value.split("&from=")
      const checkIsTheresrcFilesystemspaceavailableParamTimeFrom = srcFilesystemspaceavailable.value.split("&from=")
      const checkIsTheresrcFileNodesFreeParamTimeFrom = srcFileNodesFree.value.split("&from=")
      const checkIsTheresrcFileDescriptorParamTimeFrom = srcFileDescriptor.value.split("&from=")
      const checkIsTheresrcFileNodesSizeParamTimeFrom = srcFileNodesSize.value.split("&from=")
      const checkIsTheresrcFilesysteminReadOnlyErrorParamTimeFrom = srcFilesysteminReadOnlyError.value.split("&from=")
      const checkIsTheresrcNetworkTrafficbyPacketsParamTimeFrom = srcNetworkTrafficbyPackets.value.split("&from=")
      const checkIsTheresrcNetworkTrafficErrorsParamTimeFrom = srcNetworkTrafficErrors.value.split("&from=")
      const checkIsTheresrcNetworkTrafficDropParamTimeFrom = srcNetworkTrafficDrop.value.split("&from=")
      const checkIsTheresrcNetworkTrafficCompressedParamTimeFrom = srcNetworkTrafficCompressed.value.split("&from=")
      const checkIsTheresrcNetworkTrafficMulticastParamTimeFrom = srcNetworkTrafficMulticast.value.split("&from=")
      const checkIsTheresrcNetworkTrafficFifoParamTimeFrom = srcNetworkTrafficFifo.value.split("&from=")
      const checkIsTheresrcNetworkTrafficFrameParamTimeFrom = srcNetworkTrafficFrame.value.split("&from=")
      const checkIsTheresrcNetworkTrafficCarrierParamTimeFrom = srcNetworkTrafficCarrier.value.split("&from=")
      const checkIsTheresrcNetworkTrafficCollsParamTimeFrom = srcNetworkTrafficColls.value.split("&from=")
      const checkIsTheresrcNFContrackParamTimeFrom = srcNFContrack.value.split("&from=")
      const checkIsTheresrcARPEntriesParamTimeFrom = srcARPEntries.value.split("&from=")
      const checkIsTheresrcMTUParamTimeFrom = srcMTU.value.split("&from=")
      const checkIsTheresrcSpeedParamTimeFrom = srcSpeed.value.split("&from=")
      const checkIsTheresrcQueueLengthParamTimeFrom = srcQueueLength.value.split("&from=")
      const checkIsTheresrcSoftnetPacketsParamTimeFrom = srcSoftnetPackets.value.split("&from=")
      const checkIsTheresrcSoftnetOutofQuotaParamTimeFrom = srcSoftnetOutofQuota.value.split("&from=")
      const checkIsTheresrcNetworkOperationalStatusParamTimeFrom = srcNetworkOperationalStatus.value.split("&from=")
      const checkIsTheresrcSockstatTCPParamTimeFrom = srcSockstatTCP.value.split("&from=")
      const checkIsTheresrcSockstatUDPParamTimeFrom = srcSockstatUDP.value.split("&from=")
      const checkIsTheresrcSockstatFRAGRAWParamTimeFrom = srcSockstatFRAGRAW.value.split("&from=")
      const checkIsTheresrcSockstatMemorySizeParamTimeFrom = srcSockstatMemorySize.value.split("&from=")
      const checkIsTheresrcSockstatUsedParamTimeFrom = srcSockstatUsed.value.split("&from=")
      const checkIsTheresrcNetstatIPInOutOctetsParamTimeFrom = srcNetstatIPInOutOctets.value.split("&from=")
      const checkIsTheresrcNetstatIPForwardingParamTimeFrom = srcNetstatIPForwarding.value.split("&from=")
      const checkIsTheresrcICMPInOutParamTimeFrom = srcICMPInOut.value.split("&from=")
      const checkIsTheresrcICMPErrorsParamTimeFrom = srcICMPErrors.value.split("&from=")
      const checkIsTheresrcUDPInOutParamTimeFrom = srcUDPInOut.value.split("&from=")
      const checkIsTheresrcUDPErrorsParamTimeFrom = srcUDPErrors.value.split("&from=")
      const checkIsTheresrcTCPInOutParamTimeFrom = srcTCPInOut.value.split("&from=")
      const checkIsTheresrcTCPErrorsParamTimeFrom = srcTCPErrors.value.split("&from=")
      const checkIsTheresrcTCPConnectionsParamTimeFrom = srcTCPConnections.value.split("&from=")
      const checkIsTheresrcTCPSynCookieParamTimeFrom = srcTCPSynCookie.value.split("&from=")
      const checkIsTheresrcTCPDirectTransitionParamTimeFrom = srcTCPDirectTransition.value.split("&from=")
      const checkIsTheresrcTCPStatParamTimeFrom = srcTCPStat.value.split("&from=")
      const checkIsTheresrcNodeExporterScrapeTimeParamTimeFrom = srcNodeExporterScrapeTime.value.split("&from=")
      const checkIsTheresrcNodeExporterScrapeParamTimeFrom = srcNodeExporterScrape.value.split("&from=")


      if(currentDays !== (start || end)){
        const timeRange = `&from=${start}&to=${end}`

        srcCPUBusy.value = checkIsthereCPUBusyParamTimeFrom[0] + timeRange
        srcSysLoad5.value = checkIsthereSysLoad5ParamTimeFrom[0] + timeRange
        srcSysLoad15.value = checkIsthereSysLoad15ParamTimeFrom[0] + timeRange
        srcRamUsed.value = checkIsthereRamUsedParamTimeFrom[0] + timeRange
        srcSwapUsed.value = checkIsthereSwapUsedParamTimeFrom[0] + timeRange
        srcRootFsUsed.value = checkIsthereRootFsUsedParamTimeFrom[0] + timeRange
        srcCpuCores.value = checkIsthereCpuCoresParamTimeFrom[0] + timeRange
        srcUptime.value = checkIsthereUptimeParamTimeFrom[0] + timeRange
        srcRootFsTotal.value = checkIsthereRootFsTotalParamTimeFrom[0] + timeRange
        srcRamTotal.value = checkIsthereRamTotalParamTimeFrom[0] + timeRange
        srcSwapTotal.value = checkIsthereSwapTotalParamTimeFrom[0] + timeRange
        srcCpuBasic.value = checkIsthereCpuBasicParamTimeFrom[0] + timeRange
        srcMemoryBasic.value = checkIsthereMemoryBasicParamTimeFrom[0] + timeRange
        srcNetworkTraficBasic.value = checkIsthereNetworkTraficBasicParamTimeFrom[0] + timeRange
        srcMemoryBasicPercentage.value = checkIsthereMemoryBasicPercentageParamTimeFrom[0] + timeRange
        srcDiskSpaceUsedBasic.value = checkIsthereDiskSpaceUsedBasicParamTimeFrom[0] + timeRange
        srcMemoryActiceInactive.value = checkIsTheresrcMemoryActiceInactiveParamTimeFrom[0] + timeRange
        srcMemoryCommitted.value = checkIsTheresrcMemoryCommittedParamTimeFrom[0] + timeRange
        srcMemoryActiveInactiveDetail.value = checkIsTheresrcMemoryActiveInactiveDetailParamTimeFrom[0] + timeRange
        srcMemoryWritebackandDirty.value = checkIsTheresrcMemoryWritebackandDirtyParamTimeFrom[0] + timeRange
        srcMemorySharedandMapped.value = checkIsTheresrcMemorySharedandMappedParamTimeFrom[0] + timeRange
        srcMemorySlab.value = checkIsTheresrcMemorySlabParamTimeFrom[0] + timeRange
        srcMemoryVmalloc.value = checkIsTheresrcMemoryVmallocParamTimeFrom[0] + timeRange
        srcMemoryBounce.value = checkIsTheresrcMemoryBounceParamTimeFrom[0] + timeRange
        srcMemoryAnonymous.value = checkIsTheresrcMemoryAnonymousParamTimeFrom[0] + timeRange
        srcMemoryKernelCPU.value = checkIsTheresrcMemoryKernelCPUParamTimeFrom[0] + timeRange
        srcMemoryHugePagesCounter.value = checkIsTheresrcMemoryHugePagesCounterParamTimeFrom[0] + timeRange
        srcMemoryHugePagesSize.value = checkIsTheresrcMemoryHugePagesSizeParamTimeFrom[0] + timeRange
        srcMemoryDirectMap.value = checkIsTheresrcMemoryDirectMapParamTimeFrom[0] + timeRange
        srcMemoryUnevictableandMLocked.value = checkIsTheresrcMemoryUnevictableandMLockedParamTimeFrom[0] + timeRange
        srcMemoryNFS.value = checkIsTheresrcMemoryNFSParamTimeFrom[0] + timeRange
        srcMemoryPagesInOut.value = checkIsTheresrcMemoryPagesInOutParamTimeFrom[0] + timeRange
        srcMemoryPagesSwapInOut.value = checkIsTheresrcMemoryPagesSwapInOutParamTimeFrom[0] + timeRange
        srcMemoryPageFaults.value = checkIsTheresrcMemoryPageFaultsParamTimeFrom[0] + timeRange
        srcOOMKiller.value = checkIsTheresrcOOMKillerParamTimeFrom[0] + timeRange
        srcTimeSynchronizedDrift.value = checkIsTheresrcTimeSynchronizedDriftParamTimeFrom[0] + timeRange
        srcTimePLLAdjust.value = checkIsTheresrcTimePLLAdjustParamTimeFrom[0] + timeRange
        srcTimeSynchronizedStatus.value = checkIsTheresrcTimeSynchronizedStatusParamTimeFrom[0] + timeRange
        srcTimeMisc.value = checkIsTheresrcTimeMiscParamTimeFrom[0] + timeRange
        srcProcessesStatus.value = checkIsTheresrcProcessesStatusParamTimeFrom[0] + timeRange
        srcProcessesState.value = checkIsTheresrcProcessesStateParamTimeFrom[0] + timeRange
        srcProcessesForks.value = checkIsTheresrcProcessesForksParamTimeFrom[0] + timeRange
        srcProcessesMemory.value = checkIsTheresrcProcessesMemoryParamTimeFrom[0] + timeRange
        srcPIDsNumberandLimit.value = checkIsTheresrcPIDsNumberandLimitParamTimeFrom[0] + timeRange
        srcProcessschedulestatsRunningWaiting.value = checkIsTheresrcProcessschedulestatsRunningWaitingParamTimeFrom[0] + timeRange
        srcThreadsNumberandLimit.value = checkIsTheresrcThreadsNumberandLimitParamTimeFrom[0] + timeRange
        srcContextSwitchesInterrupts.value = checkIsTheresrcContextSwitchesInterruptsParamTimeFrom[0] + timeRange
        srcSystemLoad.value = checkIsTheresrcSystemLoadParamTimeFrom[0] + timeRange
        srcInterruptsDetail.value = checkIsTheresrcInterruptsDetailParamTimeFrom[0] + timeRange
        srcScheduletimeslicesexecutedbyeachcpu.value = checkIsTheresrcScheduletimeslicesexecutedbyeachcpuParamTimeFrom[0] + timeRange
        srcEntropy.value = checkIsTheresrcEntropyParamTimeFrom[0] + timeRange
        srcCPUtimespentinuserandsystemcontexts.value = checkIsTheresrcCPUtimespentinuserandsystemcontextsParamTimeFrom[0] + timeRange
        srcFileDescriptors.value = checkIsTheresrcFileDescriptorsParamTimeFrom[0] + timeRange
        srcHardwaretemperaturemonitor.value = checkIsTheresrcHardwaretemperaturemonitorParamTimeFrom[0] + timeRange
        srcThrottlecoolingdevice.value = checkIsTheresrcThrottlecoolingdeviceParamTimeFrom[0] + timeRange
        srcPowersupply.value = checkIsTheresrcPowersupplyParamTimeFrom[0] + timeRange
        srcSystemdSockets.value = checkIsTheresrcSystemdSocketsParamTimeFrom[0] + timeRange
        srcSystemdUnitsState.value = checkIsTheresrcSystemdUnitsStateParamTimeFrom[0] + timeRange
        srcDiskIOpsCompleted.value = checkIsTheresrcDiskIOpsCompletedParamTimeFrom[0] + timeRange
        srcDiskRWData.value = checkIsTheresrcDiskRWDataParamTimeFrom[0] + timeRange
        srcDiskAverageWaitTime.value = checkIsTheresrcDiskAverageWaitTimeParamTimeFrom[0] + timeRange
        srcAverageQueueSize.value = checkIsTheresrcAverageQueueSizeParamTimeFrom[0] + timeRange
        srcDiskRWMerged.value = checkIsTheresrcDiskRWMergedParamTimeFrom[0] + timeRange
        srcTimeSpentDoingIOs.value = checkIsTheresrcTimeSpentDoingIOsParamTimeFrom[0] + timeRange
        srcInstantaneousQueueSize.value = checkIsTheresrcInstantaneousQueueSizeParamTimeFrom[0] + timeRange
        srcDiskIOpsDiscardscompletedmerged.value = checkIsTheresrcDiskIOpsDiscardscompletedmergedParamTimeFrom[0] + timeRange
        srcFilesystemspaceavailable.value = checkIsTheresrcFilesystemspaceavailableParamTimeFrom[0] + timeRange
        srcFileNodesFree.value = checkIsTheresrcFileNodesFreeParamTimeFrom[0] + timeRange
        srcFileDescriptor.value = checkIsTheresrcFileDescriptorParamTimeFrom[0] + timeRange
        srcFileNodesSize.value = checkIsTheresrcFileNodesSizeParamTimeFrom[0] + timeRange
        srcFilesysteminReadOnlyError.value = checkIsTheresrcFilesysteminReadOnlyErrorParamTimeFrom[0] + timeRange
        srcNetworkTrafficbyPackets.value = checkIsTheresrcNetworkTrafficbyPacketsParamTimeFrom[0] + timeRange
        srcNetworkTrafficErrors.value = checkIsTheresrcNetworkTrafficErrorsParamTimeFrom[0] + timeRange
        srcNetworkTrafficDrop.value = checkIsTheresrcNetworkTrafficDropParamTimeFrom[0] + timeRange
        srcNetworkTrafficCompressed.value = checkIsTheresrcNetworkTrafficCompressedParamTimeFrom[0] + timeRange
        srcNetworkTrafficMulticast.value = checkIsTheresrcNetworkTrafficMulticastParamTimeFrom[0] + timeRange
        srcNetworkTrafficFifo.value = checkIsTheresrcNetworkTrafficFifoParamTimeFrom[0] + timeRange
        srcNetworkTrafficFrame.value = checkIsTheresrcNetworkTrafficFrameParamTimeFrom[0] + timeRange
        srcNetworkTrafficCarrier.value = checkIsTheresrcNetworkTrafficCarrierParamTimeFrom[0] + timeRange
        srcNetworkTrafficColls.value = checkIsTheresrcNetworkTrafficCollsParamTimeFrom[0] + timeRange
        srcNFContrack.value = checkIsTheresrcNFContrackParamTimeFrom[0] + timeRange
        srcARPEntries.value = checkIsTheresrcARPEntriesParamTimeFrom[0] + timeRange
        srcMTU.value = checkIsTheresrcMTUParamTimeFrom[0] + timeRange
        srcSpeed.value = checkIsTheresrcSpeedParamTimeFrom[0] + timeRange
        srcQueueLength.value = checkIsTheresrcQueueLengthParamTimeFrom[0] + timeRange
        srcSoftnetPackets.value = checkIsTheresrcSoftnetPacketsParamTimeFrom[0] + timeRange
        srcSoftnetOutofQuota.value = checkIsTheresrcSoftnetOutofQuotaParamTimeFrom[0] + timeRange
        srcNetworkOperationalStatus.value = checkIsTheresrcNetworkOperationalStatusParamTimeFrom[0] + timeRange
        srcSockstatTCP.value = checkIsTheresrcSockstatTCPParamTimeFrom[0] + timeRange
        srcSockstatUDP.value = checkIsTheresrcSockstatUDPParamTimeFrom[0] + timeRange
        srcSockstatFRAGRAW.value = checkIsTheresrcSockstatFRAGRAWParamTimeFrom[0] + timeRange
        srcSockstatMemorySize.value = checkIsTheresrcSockstatMemorySizeParamTimeFrom[0] + timeRange
        srcSockstatUsed.value = checkIsTheresrcSockstatUsedParamTimeFrom[0] + timeRange
        srcNetstatIPInOutOctets.value = checkIsTheresrcNetstatIPInOutOctetsParamTimeFrom[0] + timeRange
        srcNetstatIPForwarding.value = checkIsTheresrcNetstatIPForwardingParamTimeFrom[0] + timeRange
        srcICMPInOut.value = checkIsTheresrcICMPInOutParamTimeFrom[0] + timeRange
        srcICMPErrors.value = checkIsTheresrcICMPErrorsParamTimeFrom[0] + timeRange
        srcUDPInOut.value = checkIsTheresrcUDPInOutParamTimeFrom[0] + timeRange
        srcUDPErrors.value = checkIsTheresrcUDPErrorsParamTimeFrom[0] + timeRange
        srcTCPInOut.value = checkIsTheresrcTCPInOutParamTimeFrom[0] + timeRange
        srcTCPErrors.value = checkIsTheresrcTCPErrorsParamTimeFrom[0] + timeRange
        srcTCPConnections.value = checkIsTheresrcTCPConnectionsParamTimeFrom[0] + timeRange
        srcTCPSynCookie.value = checkIsTheresrcTCPSynCookieParamTimeFrom[0] + timeRange
        srcTCPDirectTransition.value = checkIsTheresrcTCPDirectTransitionParamTimeFrom[0] + timeRange
        srcTCPStat.value = checkIsTheresrcTCPStatParamTimeFrom[0] + timeRange
        srcNodeExporterScrapeTime.value = checkIsTheresrcNodeExporterScrapeTimeParamTimeFrom[0] + timeRange
        srcNodeExporterScrape.value = checkIsTheresrcNodeExporterScrapeParamTimeFrom[0] + timeRange
        
        

      } else {
        const timeRangeDefault = `&from=${yesterday}&to=${currentDays}`

        srcCPUBusy.value = checkIsthereCPUBusyParamTimeFrom[0] + timeRangeDefault
        srcSysLoad5.value = checkIsthereSysLoad5ParamTimeFrom[0] + timeRangeDefault
        srcSysLoad15.value = checkIsthereSysLoad15ParamTimeFrom[0] + timeRangeDefault
        srcRamUsed.value = checkIsthereRamUsedParamTimeFrom[0] + timeRangeDefault
        srcSwapUsed.value = checkIsthereSwapUsedParamTimeFrom[0] + timeRangeDefault
        srcRootFsUsed.value = checkIsthereRootFsUsedParamTimeFrom[0] + timeRangeDefault
        srcCpuCores.value = checkIsthereCpuCoresParamTimeFrom[0] + timeRangeDefault
        srcUptime.value = checkIsthereUptimeParamTimeFrom[0] + timeRangeDefault
        srcRootFsTotal.value = checkIsthereRootFsTotalParamTimeFrom[0] + timeRangeDefault
        srcRamTotal.value = checkIsthereRamTotalParamTimeFrom[0] + timeRangeDefault
        srcSwapTotal.value = checkIsthereSwapTotalParamTimeFrom[0] + timeRangeDefault
        srcCpuBasic.value = checkIsthereCpuBasicParamTimeFrom[0] + timeRangeDefault
        srcMemoryBasic.value = checkIsthereMemoryBasicParamTimeFrom[0] + timeRangeDefault
        srcNetworkTraficBasic.value = checkIsthereNetworkTraficBasicParamTimeFrom[0] + timeRangeDefault
        srcMemoryBasicPercentage.value = checkIsthereMemoryBasicPercentageParamTimeFrom[0] + timeRangeDefault
        srcDiskSpaceUsedBasic.value = checkIsthereDiskSpaceUsedBasicParamTimeFrom[0] + timeRangeDefault
        srcMemoryActiceInactive.value = checkIsTheresrcMemoryActiceInactiveParamTimeFrom[0] + timeRangeDefault
        srcMemoryCommitted.value = checkIsTheresrcMemoryCommittedParamTimeFrom[0] + timeRangeDefault
        srcMemoryActiveInactiveDetail.value = checkIsTheresrcMemoryActiveInactiveDetailParamTimeFrom[0] + timeRangeDefault
        srcMemoryWritebackandDirty.value = checkIsTheresrcMemoryWritebackandDirtyParamTimeFrom[0] + timeRangeDefault
        srcMemorySharedandMapped.value = checkIsTheresrcMemorySharedandMappedParamTimeFrom[0] + timeRangeDefault
        srcMemorySlab.value = checkIsTheresrcMemorySlabParamTimeFrom[0] + timeRangeDefault
        srcMemoryVmalloc.value = checkIsTheresrcMemoryVmallocParamTimeFrom[0] + timeRangeDefault
        srcMemoryBounce.value = checkIsTheresrcMemoryBounceParamTimeFrom[0] + timeRangeDefault
        srcMemoryAnonymous.value = checkIsTheresrcMemoryAnonymousParamTimeFrom[0] + timeRangeDefault
        srcMemoryKernelCPU.value = checkIsTheresrcMemoryKernelCPUParamTimeFrom[0] + timeRangeDefault
        srcMemoryHugePagesCounter.value = checkIsTheresrcMemoryHugePagesCounterParamTimeFrom[0] + timeRangeDefault
        srcMemoryHugePagesSize.value = checkIsTheresrcMemoryHugePagesSizeParamTimeFrom[0] + timeRangeDefault
        srcMemoryDirectMap.value = checkIsTheresrcMemoryDirectMapParamTimeFrom[0] + timeRangeDefault
        srcMemoryUnevictableandMLocked.value = checkIsTheresrcMemoryUnevictableandMLockedParamTimeFrom[0] + timeRangeDefault
        srcMemoryNFS.value = checkIsTheresrcMemoryNFSParamTimeFrom[0] + timeRangeDefault
        srcMemoryPagesInOut.value = checkIsTheresrcMemoryPagesInOutParamTimeFrom[0] + timeRangeDefault
        srcMemoryPagesSwapInOut.value = checkIsTheresrcMemoryPagesSwapInOutParamTimeFrom[0] + timeRangeDefault
        srcMemoryPageFaults.value = checkIsTheresrcMemoryPageFaultsParamTimeFrom[0] + timeRangeDefault
        srcOOMKiller.value = checkIsTheresrcOOMKillerParamTimeFrom[0] + timeRangeDefault
        srcTimeSynchronizedDrift.value = checkIsTheresrcTimeSynchronizedDriftParamTimeFrom[0] + timeRangeDefault
        srcTimePLLAdjust.value = checkIsTheresrcTimePLLAdjustParamTimeFrom[0] + timeRangeDefault
        srcTimeSynchronizedStatus.value = checkIsTheresrcTimeSynchronizedStatusParamTimeFrom[0] + timeRangeDefault
        srcTimeMisc.value = checkIsTheresrcTimeMiscParamTimeFrom[0] + timeRangeDefault
        srcProcessesStatus.value = checkIsTheresrcProcessesStatusParamTimeFrom[0] + timeRangeDefault
        srcProcessesState.value = checkIsTheresrcProcessesStateParamTimeFrom[0] + timeRangeDefault
        srcProcessesForks.value = checkIsTheresrcProcessesForksParamTimeFrom[0] + timeRangeDefault
        srcProcessesMemory.value = checkIsTheresrcProcessesMemoryParamTimeFrom[0] + timeRangeDefault
        srcPIDsNumberandLimit.value = checkIsTheresrcPIDsNumberandLimitParamTimeFrom[0] + timeRangeDefault
        srcProcessschedulestatsRunningWaiting.value = checkIsTheresrcProcessschedulestatsRunningWaitingParamTimeFrom[0] + timeRangeDefault
        srcThreadsNumberandLimit.value = checkIsTheresrcThreadsNumberandLimitParamTimeFrom[0] + timeRangeDefault
        srcContextSwitchesInterrupts.value = checkIsTheresrcContextSwitchesInterruptsParamTimeFrom[0] + timeRangeDefault
        srcSystemLoad.value = checkIsTheresrcSystemLoadParamTimeFrom[0] + timeRangeDefault
        srcInterruptsDetail.value = checkIsTheresrcInterruptsDetailParamTimeFrom[0] + timeRangeDefault
        srcScheduletimeslicesexecutedbyeachcpu.value = checkIsTheresrcScheduletimeslicesexecutedbyeachcpuParamTimeFrom[0] + timeRangeDefault
        srcEntropy.value = checkIsTheresrcEntropyParamTimeFrom[0] + timeRangeDefault
        srcCPUtimespentinuserandsystemcontexts.value = checkIsTheresrcCPUtimespentinuserandsystemcontextsParamTimeFrom[0] + timeRangeDefault
        srcFileDescriptors.value = checkIsTheresrcFileDescriptorsParamTimeFrom[0] + timeRangeDefault
        srcHardwaretemperaturemonitor.value = checkIsTheresrcHardwaretemperaturemonitorParamTimeFrom[0] + timeRangeDefault
        srcThrottlecoolingdevice.value = checkIsTheresrcThrottlecoolingdeviceParamTimeFrom[0] + timeRangeDefault
        srcPowersupply.value = checkIsTheresrcPowersupplyParamTimeFrom[0] + timeRangeDefault
        srcSystemdSockets.value = checkIsTheresrcSystemdSocketsParamTimeFrom[0] + timeRangeDefault
        srcSystemdUnitsState.value = checkIsTheresrcSystemdUnitsStateParamTimeFrom[0] + timeRangeDefault
        srcDiskIOpsCompleted.value = checkIsTheresrcDiskIOpsCompletedParamTimeFrom[0] + timeRangeDefault
        srcDiskRWData.value = checkIsTheresrcDiskRWDataParamTimeFrom[0] + timeRangeDefault
        srcDiskAverageWaitTime.value = checkIsTheresrcDiskAverageWaitTimeParamTimeFrom[0] + timeRangeDefault
        srcAverageQueueSize.value = checkIsTheresrcAverageQueueSizeParamTimeFrom[0] + timeRangeDefault
        srcDiskRWMerged.value = checkIsTheresrcDiskRWMergedParamTimeFrom[0] + timeRangeDefault
        srcTimeSpentDoingIOs.value = checkIsTheresrcTimeSpentDoingIOsParamTimeFrom[0] + timeRangeDefault
        srcInstantaneousQueueSize.value = checkIsTheresrcInstantaneousQueueSizeParamTimeFrom[0] + timeRangeDefault
        srcDiskIOpsDiscardscompletedmerged.value = checkIsTheresrcDiskIOpsDiscardscompletedmergedParamTimeFrom[0] + timeRangeDefault
        srcFilesystemspaceavailable.value = checkIsTheresrcFilesystemspaceavailableParamTimeFrom[0] + timeRangeDefault
        srcFileNodesFree.value = checkIsTheresrcFileNodesFreeParamTimeFrom[0] + timeRangeDefault
        srcFileDescriptor.value = checkIsTheresrcFileDescriptorParamTimeFrom[0] + timeRangeDefault
        srcFileNodesSize.value = checkIsTheresrcFileNodesSizeParamTimeFrom[0] + timeRangeDefault
        srcFilesysteminReadOnlyError.value = checkIsTheresrcFilesysteminReadOnlyErrorParamTimeFrom[0] + timeRangeDefault
        srcNetworkTrafficbyPackets.value = checkIsTheresrcNetworkTrafficbyPacketsParamTimeFrom[0] + timeRangeDefault
        srcNetworkTrafficErrors.value = checkIsTheresrcNetworkTrafficErrorsParamTimeFrom[0] + timeRangeDefault
        srcNetworkTrafficDrop.value = checkIsTheresrcNetworkTrafficDropParamTimeFrom[0] + timeRangeDefault
        srcNetworkTrafficCompressed.value = checkIsTheresrcNetworkTrafficCompressedParamTimeFrom[0] + timeRangeDefault
        srcNetworkTrafficMulticast.value = checkIsTheresrcNetworkTrafficMulticastParamTimeFrom[0] + timeRangeDefault
        srcNetworkTrafficFifo.value = checkIsTheresrcNetworkTrafficFifoParamTimeFrom[0] + timeRangeDefault
        srcNetworkTrafficFrame.value = checkIsTheresrcNetworkTrafficFrameParamTimeFrom[0] + timeRangeDefault
        srcNetworkTrafficCarrier.value = checkIsTheresrcNetworkTrafficCarrierParamTimeFrom[0] + timeRangeDefault
        srcNetworkTrafficColls.value = checkIsTheresrcNetworkTrafficCollsParamTimeFrom[0] + timeRangeDefault
        srcNFContrack.value = checkIsTheresrcNFContrackParamTimeFrom[0] + timeRangeDefault
        srcARPEntries.value = checkIsTheresrcARPEntriesParamTimeFrom[0] + timeRangeDefault
        srcMTU.value = checkIsTheresrcMTUParamTimeFrom[0] + timeRangeDefault
        srcSpeed.value = checkIsTheresrcSpeedParamTimeFrom[0] + timeRangeDefault
        srcQueueLength.value = checkIsTheresrcQueueLengthParamTimeFrom[0] + timeRangeDefault
        srcSoftnetPackets.value = checkIsTheresrcSoftnetPacketsParamTimeFrom[0] + timeRangeDefault
        srcSoftnetOutofQuota.value = checkIsTheresrcSoftnetOutofQuotaParamTimeFrom[0] + timeRangeDefault
        srcNetworkOperationalStatus.value = checkIsTheresrcNetworkOperationalStatusParamTimeFrom[0] + timeRangeDefault
        srcSockstatTCP.value = checkIsTheresrcSockstatTCPParamTimeFrom[0] + timeRangeDefault
        srcSockstatUDP.value = checkIsTheresrcSockstatUDPParamTimeFrom[0] + timeRangeDefault
        srcSockstatFRAGRAW.value = checkIsTheresrcSockstatFRAGRAWParamTimeFrom[0] + timeRangeDefault
        srcSockstatMemorySize.value = checkIsTheresrcSockstatMemorySizeParamTimeFrom[0] + timeRangeDefault
        srcSockstatUsed.value = checkIsTheresrcSockstatUsedParamTimeFrom[0] + timeRangeDefault
        srcNetstatIPInOutOctets.value = checkIsTheresrcNetstatIPInOutOctetsParamTimeFrom[0] + timeRangeDefault
        srcNetstatIPForwarding.value = checkIsTheresrcNetstatIPForwardingParamTimeFrom[0] + timeRangeDefault
        srcICMPInOut.value = checkIsTheresrcICMPInOutParamTimeFrom[0] + timeRangeDefault
        srcICMPErrors.value = checkIsTheresrcICMPErrorsParamTimeFrom[0] + timeRangeDefault
        srcUDPInOut.value = checkIsTheresrcUDPInOutParamTimeFrom[0] + timeRangeDefault
        srcUDPErrors.value = checkIsTheresrcUDPErrorsParamTimeFrom[0] + timeRangeDefault
        srcTCPInOut.value = checkIsTheresrcTCPInOutParamTimeFrom[0] + timeRangeDefault
        srcTCPErrors.value = checkIsTheresrcTCPErrorsParamTimeFrom[0] + timeRangeDefault
        srcTCPConnections.value = checkIsTheresrcTCPConnectionsParamTimeFrom[0] + timeRangeDefault
        srcTCPSynCookie.value = checkIsTheresrcTCPSynCookieParamTimeFrom[0] + timeRangeDefault
        srcTCPDirectTransition.value = checkIsTheresrcTCPDirectTransitionParamTimeFrom[0] + timeRangeDefault
        srcTCPStat.value = checkIsTheresrcTCPStatParamTimeFrom[0] + timeRangeDefault
        srcNodeExporterScrapeTime.value = checkIsTheresrcNodeExporterScrapeTimeParamTimeFrom[0] + timeRangeDefault
        srcNodeExporterScrape.value = checkIsTheresrcNodeExporterScrapeParamTimeFrom[0] + timeRangeDefault



      }
    });


    watch(getInstanceDetail, async (val) => {
      await getmetricDekaAgentall({ id: instanceid, range  });
      await getDekaAgentLimit(projectId.value)
      const totalRemainingDekaAgent = limitservices.value.deka_agent.deka_agent_total.remaining
        
        if (isThereMetricsAllPerinstance.value == 0) {
          elementForSubscribing.value = false
          elementForUnSubscribing.value = false

          elementExportPdf.value = false
          elementBtnMemoryMeminfo.value = false
          elementContentMemoryMeminfo.value = false
          elementBtnMemoryVmstat.value = false
          elementContentMemoryVmstat.value = false
          elementBtnSystemTimesync.value = false
          elementContentSystemTimesync.value = false
          elementBtnSystemProcesses.value = false
          elementContentSystemProcesses.value = false
          elementBtnSystemMisc.value = false
          elementContentSystemMisc.value = false
          elementBtnHardwareMisc.value = false
          elementContentHardwareMisc.value = false
          elementBtnSystemd.value = false
          elementContentSystemd.value = false
          elementBtnStorageDisk.value = false
          elementContentStorageDisk.value = false
          elementBtnStorageFilesystem.value = false
          elementContentStorageFilesystem.value = false
          elementBtnNetworkTraffic.value = false
          elementContentNetworkTraffic.value = false
          elementBtnNetworkSockstat.value = false
          elementContentNetworkSockstat.value = false
          elementBtnNetworkNetstat.value = false
          elementContentNetworkNetstat.value = false
          elementBtnNodeExporter.value = false
          elementContentNodeExporter.value = false
        } else if ( isThereMetricsAllPerinstance.value > 0 && (getInstanceDetail.value.package_deka_agent.id == "" || getInstanceDetail.value.package_deka_agent.status == "inactive") && !statusInstanceDekaAgent.value.is_still_active) {

          // // ⁠Untuk sementara waktu limit dibuat otomatis (Jumlah limit dan penggunaan akan otomatis bertambah jika ada subscribe baru dan akan berkurang jika ada unsubscribe)

          // if (totalRemainingDekaAgent > 0) {
          //   elementForSubscribing.value = true
          // } else {
          //   elementForSubscribing.value = false
          //   elementQuotaLimitReached.value = true
          // }
          elementForSubscribing.value = true

          elementForUnSubscribing.value = false

          elementExportPdf.value = false
          elementBtnMemoryMeminfo.value = false
          elementContentMemoryMeminfo.value = false
          elementBtnMemoryVmstat.value = false
          elementContentMemoryVmstat.value = false
          elementBtnSystemTimesync.value = false
          elementContentSystemTimesync.value = false
          elementBtnSystemProcesses.value = false
          elementContentSystemProcesses.value = false
          elementBtnSystemMisc.value = false
          elementContentSystemMisc.value = false
          elementBtnHardwareMisc.value = false
          elementContentHardwareMisc.value = false
          elementBtnSystemd.value = false
          elementContentSystemd.value = false
          elementBtnStorageDisk.value = false
          elementContentStorageDisk.value = false
          elementBtnStorageFilesystem.value = false
          elementContentStorageFilesystem.value = false
          elementBtnNetworkTraffic.value = false
          elementContentNetworkTraffic.value = false
          elementBtnNetworkSockstat.value = false
          elementContentNetworkSockstat.value = false
          elementBtnNetworkNetstat.value = false
          elementContentNetworkNetstat.value = false
          elementBtnNodeExporter.value = false
          elementContentNodeExporter.value = false
        } else {

          if(statusInstanceDekaAgent.value.is_unsubscribe) {
          // // ⁠Untuk sementara waktu limit dibuat otomatis (Jumlah limit dan penggunaan akan otomatis bertambah jika ada subscribe baru dan akan berkurang jika ada unsubscribe)

            // if (totalRemainingDekaAgent > 0) {
            //   elementForSubscribing.value = true
            // } else {
            //   elementForSubscribing.value = false
            //   elementQuotaLimitReached.value = true
            // }
            elementForSubscribing.value = true

            if (statusInstanceDekaAgent.value.is_still_active) {
              isBtnSubscribeDisable.value = true
            }
            elementForUnSubscribing.value = false
          } else {
            elementForSubscribing.value = false
            elementForUnSubscribing.value = true
          }

          elementHowtoinstall.value = false
          elementDate.value = true
          elementBtnClpsQuick.value = true
          elemetContentquick.value = true
          elementBtnBasicCpu.value = true
          elementContentBasicCpu.value = true

          elementExportPdf.value = true
          elementBtnMemoryMeminfo.value = true
          elementContentMemoryMeminfo.value = true
          elementBtnMemoryVmstat.value = true
          elementContentMemoryVmstat.value = true
          elementBtnSystemTimesync.value = true
          elementContentSystemTimesync.value = true
          elementBtnSystemProcesses.value = true
          elementContentSystemProcesses.value = true
          elementBtnSystemMisc.value = true
          elementContentSystemMisc.value = true
          elementBtnHardwareMisc.value = true
          elementContentHardwareMisc.value = true
          elementBtnSystemd.value = true
          elementContentSystemd.value = true
          elementBtnStorageDisk.value = true
          elementContentStorageDisk.value = true
          elementBtnStorageFilesystem.value = true
          elementContentStorageFilesystem.value = true
          elementBtnNetworkTraffic.value = true
          elementContentNetworkTraffic.value = true
          elementBtnNetworkSockstat.value = true
          elementContentNetworkSockstat.value = true
          elementBtnNetworkNetstat.value = true
          elementContentNetworkNetstat.value = true
          elementBtnNodeExporter.value = true
          elementContentNodeExporter.value = true
        }
    })

    return {
      getInstanceDetail,
      vcalendar: false,
      getStatusSubscribeDekaAgent,
      projectId,

      srcMain,
      srcCPUBusy,
      srcSysLoad5,
      srcSysLoad15,
      srcRamUsed,
      srcSwapUsed,
      srcRootFsUsed,
      srcCpuCores,
      srcUptime,
      srcRootFsTotal,
      srcRamTotal,
      srcSwapTotal,
      srcCpuBasic,
      srcMemoryBasic,
      srcNetworkTraficBasic,
      srcMemoryBasicPercentage,
      srcDiskSpaceUsedBasic,
      srcMemoryActiceInactive,
      srcMemoryCommitted,
      srcMemoryActiveInactiveDetail,
      srcMemoryWritebackandDirty,
      srcMemorySharedandMapped,
      srcMemorySlab,
      srcMemoryVmalloc,
      srcMemoryBounce,
      srcMemoryAnonymous,
      srcMemoryKernelCPU,
      srcMemoryHugePagesCounter,
      srcMemoryHugePagesSize,
      srcMemoryDirectMap,
      srcMemoryUnevictableandMLocked,
      srcMemoryNFS,
      srcMemoryPagesInOut,
      srcMemoryPagesSwapInOut,
      srcMemoryPageFaults,
      srcOOMKiller,
      srcTimeSynchronizedDrift,
      srcTimePLLAdjust,
      srcTimeSynchronizedStatus,
      srcTimeMisc,
      srcProcessesStatus,
      srcProcessesState,
      srcProcessesForks,
      srcProcessesMemory,
      srcPIDsNumberandLimit,
      srcProcessschedulestatsRunningWaiting,
      srcThreadsNumberandLimit,
      srcContextSwitchesInterrupts,
      srcSystemLoad,
      srcInterruptsDetail,
      srcScheduletimeslicesexecutedbyeachcpu,
      srcEntropy,
      srcCPUtimespentinuserandsystemcontexts,
      srcFileDescriptors,
      srcHardwaretemperaturemonitor,
      srcThrottlecoolingdevice,
      srcPowersupply,
      srcSystemdSockets,
      srcSystemdUnitsState,
      srcDiskIOpsCompleted,
      srcDiskRWData,
      srcDiskAverageWaitTime,
      srcAverageQueueSize,
      srcDiskRWMerged,
      srcTimeSpentDoingIOs,
      srcInstantaneousQueueSize,
      srcDiskIOpsDiscardscompletedmerged,
      srcFilesystemspaceavailable,
      srcFileNodesFree,
      srcFileDescriptor,
      srcFileNodesSize,
      srcFilesysteminReadOnlyError,
      srcNetworkTrafficbyPackets,
      srcNetworkTrafficErrors,
      srcNetworkTrafficDrop,
      srcNetworkTrafficCompressed,
      srcNetworkTrafficMulticast,
      srcNetworkTrafficFifo,
      srcNetworkTrafficFrame,
      srcNetworkTrafficCarrier,
      srcNetworkTrafficColls,
      srcNFContrack,
      srcARPEntries,
      srcMTU,
      srcSpeed,
      srcQueueLength,
      srcSoftnetPackets,
      srcSoftnetOutofQuota,
      srcNetworkOperationalStatus,
      srcSockstatTCP,
      srcSockstatUDP,
      srcSockstatFRAGRAW,
      srcSockstatMemorySize,
      srcSockstatUsed,
      srcNetstatIPInOutOctets,
      srcNetstatIPForwarding,
      srcICMPInOut,
      srcICMPErrors,
      srcUDPInOut,
      srcUDPErrors,
      srcTCPInOut,
      srcTCPErrors,
      srcTCPConnections,
      srcTCPSynCookie,
      srcTCPDirectTransition,
      srcTCPStat,
      srcNodeExporterScrapeTime,
      srcNodeExporterScrape,

      range,
      getmetricDekaAgentall,
      isThereMetricsAllPerinstance,
      instanceDetail,
      statusInstanceDekaAgent,
      isBtnSubscribeDisable,

      urlCpuBusy,
      urlSysLoad5,
      urlsysLoad15,
      urlRamUsed,
      urlSwapUsed,
      urlRootFsUsed,
      urlCpuCores,
      urlUptime,
      urlRootFsTotal,
      urlRamTotal,
      urlSwapTotal,
      urlCpuBasic,
      urlMemoryBasic,
      urlNetworkTraficBasic,
      urlMemoryBasicPercentage,
      urlDiskSpaceUsedBasic,

      elementForUnSubscribing,
      elementForSubscribing,
      elementHowtoinstall,
      elementDate,
      elementBtnClpsQuick,
      elemetContentquick,
      elementBtnBasicCpu,
      elementContentBasicCpu,
      loading,
      elementExportPdf,
      elementBtnMemoryMeminfo,
      elementContentMemoryMeminfo,
      elementBtnMemoryVmstat,
      elementContentMemoryVmstat,
      elementBtnSystemTimesync,
      elementContentSystemTimesync,
      elementBtnSystemProcesses,
      elementContentSystemProcesses,
      elementBtnSystemMisc,
      elementContentSystemMisc,
      elementBtnHardwareMisc,
      elementContentHardwareMisc,
      elementBtnSystemd,
      elementContentSystemd,
      elementBtnStorageDisk,
      elementContentStorageDisk,
      elementBtnStorageFilesystem,
      elementContentStorageFilesystem,
      elementBtnNetworkTraffic,
      elementContentNetworkTraffic,
      elementBtnNetworkSockstat,
      elementContentNetworkSockstat,
      elementBtnNetworkNetstat,
      elementContentNetworkNetstat,
      elementBtnNodeExporter,
      elementContentNodeExporter,
      elementQuotaLimitReached,

      dialogSubscribing,
      dialogDownloadPDF,

      // detailProduct,
      dekaAgentPrice,
      agree,
      role,
      getEula,
      statusCheckEula,
    };
  },

  created() {
  },

});
</script>
<style lang="scss" scoped>

.collapsible {
  background-color: #FFFFFF;
  color: #5A6472;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
}

.active, .collapsible:hover {
  background-color: #f9f6f6;
}

.collapsible:after {
  content: '\002B';
  color: #2388C9;
  font-weight: bold;
  float: right;
  margin-left: 5px;
}

.active:after {
  content: "\2212";
}

.content {
  padding: 0 18px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  // background-color: #f1f1f1;
}

.horizontal-scroll-container {
  overflow-x: auto;
  white-space: nowrap; 
  // background-color: #0C1021;
  color: #E9E9EB;
}

.code-window {
  // width: 640px;
  box-shadow: 0px 10px 16px 0px rgba(0,0,0,0.5);
  max-width: 100%;
  margin: 0 auto;
}
.code-window > .menubar {
  padding: 0.5em;
  font-family: 'Monaco', monospace;
  text-align: center;
  border-radius: 8px 8px 0 0;
  // color: #000;
  background: linear-gradient(to bottom, #d0d0d0 0%, #878787);
}
.code-window > .codearea {
  background-color: #272822;
  padding: 1em;
}

.header-panel-text-color {
  color: #1A5695
}
.border-bot-panel {
  border-bottom-style: solid;
  border-bottom-color: #1A5695;
}
.v-expansion-panel-header--active {
  border-width : 0
}

</style>
