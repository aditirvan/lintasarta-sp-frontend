<template>
  <v-row fluid class="py-0">

    <v-col cols="12" v-if="elementDate">
      <v-card flat class="rounded-lg">
        <v-card-text >
          
          <v-row>

            <v-col>

              <v-autocomplete
                id="FilterInstance"
                v-model="filterins"
                :items="instanceByProject.instance"
                outlined
                item-text="name"
                item-value="id"
                placeholder="Filter Instance"
                attach="#FilterInsAttach"
                clearable
                hide-details
              >
                <template v-slot:append-outer>
                  <div id="FilterInsAttach"></div>
                </template>
              </v-autocomplete>

            </v-col>

            <v-col>
              <v-menu
                v-model="vcalendar"
                offset-y
                :close-on-click="true"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    height="100%"
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
                  :max-date="new Date()"
                />
              </v-menu>
            </v-col>
          </v-row>

        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" v-if="elementInfoSubscribing">
      <v-card flat class="" v-bind:class="[instanceSubscribed ? 'rounded-lg infoSubscribe white--text':  'rounded-lg']">

        <v-card-title class="font-weight-bold">Deka Agent {{ instanceSubscribed ? 'Premium' : '' }}</v-card-title>

        <v-card-text 
          class="py-0 pr-10 pb-4">
          
          <div >
            <span v-if="instanceSubscribed" class="white--text">
              This instance has subscribed to Deka Agent Premium services
            </span>
            <span v-if="!instanceSubscribed" class="black--text">
              Select an instance to see the full graph.
            </span>
            <span v-if="getStatusInstanceDekaAgent !== null" class="black--text">
              {{ getStatusInstanceDekaAgent.is_still_active && getStatusInstanceDekaAgent.is_unsubscribe && getStatusInstanceDekaAgent.instance_id == instanceId ? "This subscription will end tomorrow." : ""}}
            </span>
          </div>

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
          <p>
            To ensure comprehensive monitoring and performance metrics for your services, we require the installation of a monitoring agent on your Instance. This agent will gather essential data points that help us maintain optimal operation of your services.
          </p>
          <p><b> How to install</b></p>

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


    <v-expansion-panel-content style="background-color: #f9f6f6;">
      <v-row>

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

  <dialogForDownloadPdf
    v-if="dialogDownloadPDF"
    :instance="instanceDetail"
    v-model="dialogDownloadPDF"
  />
    

  </v-row>
</template>
<script lang="ts">
import dialogForDownloadPdf from "../instance/instance_detail/dialogForDownloadPdf.vue"
import moment from "moment/moment.js";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { INSTANCEDETAIL } from "@/modules/instance/instance_detail/namespace";
import {
  computed,
  defineComponent,
  ref,
  watch,
  onMounted,
} from "@vue/composition-api";
import INSTANCE from "@/modules/instance/namespace";
import libProject from "@/lib/project";

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
  components: { dialogForDownloadPdf, },
  data() {
    return {
      iframeHeight: '0px',
      // iframeHeight: '481px',

    }
  },
  computed: {
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

          window.addEventListener('messageAgent', this.handleIframeResize);
        })
      }

    }
  },
  beforeDestroy() {
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

    const { getInstanceDetail, getStatusInstanceDekaAgent } = useNamespacedGetters(INSTANCE, [
      "getInstanceDetail",
      "getStatusInstanceDekaAgent",
    ]);

    const { getStatusSubscribeDekaAgent, fetchInstanceByProject, fetchInstanceDetail } = useNamespacedActions(INSTANCE, [
      "getStatusSubscribeDekaAgent",
      "fetchInstanceByProject",
      "fetchInstanceDetail",
    ]);

    const { getmetricDekaAgentall, getmetricDekaAgentPerProjectall } = useNamespacedActions(INSTANCEDETAIL, [
      "getmetricDekaAgentall",
      "getmetricDekaAgentPerProjectall",
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

    const elementExportPdf = ref(false);
    const elementHowtoinstall = ref(false);
    const elementDate = ref(false);
    const elementInfoSubscribing = ref(false);
    const instanceSubscribed = ref(false)
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

    const instanceId = ref(null);
    const dialogDownloadPDF = ref(false)

    const date = new Date();
    const dateFrom = ref(moment(new Date()).format('x'))
    const dateTo = ref(moment(date.setDate(date.getDate() - 1)).format('x'))
    const instanceSelect = ref("")

    const filterins = ref("");
    const range = ref({
      start: new Date((new Date()).setDate((new Date()).getDate() - 1)),
      end: new Date((new Date()).setDate((new Date()).getDate() )),
    });

    const {
      isThereMetricsAllPerproject,
      isThereMetricsAllPerinstance,
    } = useNamespacedState(INSTANCEDETAIL, [
      "isThereMetricsAllPerproject",
      "isThereMetricsAllPerinstance",
    ]);

    const { 
      instanceByProject, 
      instanceDetail,
    } = useNamespacedState(INSTANCE, [
      "instanceByProject",
      'instanceDetail',
    ])

    onMounted( async() => {

      const currOrg = await libProject.getCurrentOrg();
      const nameOrg = encodeURIComponent(currOrg.name)

      const currentProjectDB = await libProject.getActiveProject()
      const projNameUrl = currentProjectDB.name.replace(/ /g, '+')

      srcMain.value = `${process.env.VUE_APP_API_BASE_URL_GRAFANA}/d-solo/rYdddlPWk21/node-exporter-deka-agent?orgId=2&var-DS_PROMETHEUS=Prometheus&var-job=deka-monitoring`
      srcMain.value += `&var-org=${nameOrg}`
      srcMain.value += `&var-proj=${projNameUrl}`

      const timeRangeDefault = `&from=${dateFrom.value}&to=${dateTo.value}`

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


      await fetchInstanceByProject(currentProjectDB.id)

      await getmetricDekaAgentPerProjectall({ id: currentProjectDB.id, range })

      if (isThereMetricsAllPerproject.value > 0) {
        loading.value = false
        elementHowtoinstall.value = false
        elementDate.value = true
        elementInfoSubscribing.value = true
        elementBtnClpsQuick.value = true
        elemetContentquick.value = true
        elementBtnBasicCpu.value = true
        elementContentBasicCpu.value = true
        if ((getInstanceDetail.value.package_deka_agent.id == "" || getInstanceDetail.value.package_deka_agent.status == "inactive") && !getStatusInstanceDekaAgent.value.is_still_active) {
          elementExportPdf.value = false
        } else {
          elementExportPdf.value = true
        }

      } else {
        loading.value = false
        elementExportPdf.value = false
        elementHowtoinstall.value = true
        elementDate.value = false
        elementInfoSubscribing.value = false
        elementBtnClpsQuick.value = false
        elemetContentquick.value = false
        elementBtnBasicCpu.value = false
        elementContentBasicCpu.value = false
      }

      
    })

    watch(filterins, async(val) => {
      if (val !== null) {

        instanceId.value = val;

        instanceSubscribed.value = false
        elementInfoSubscribing.value = false

        loading.value = true
        elementHowtoinstall.value = false
        elementDate.value = true
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
        elementExportPdf.value = false

        // let coll = document.getElementsByClassName("collapsible") as HTMLCollection | null
        // let i;
        // for (i = 0; i < coll.length; i++) {
        //   var content = coll[i].nextElementSibling
        //   content["style"].maxHeight = null;
        // }

        await getmetricDekaAgentall({ id: val, range  });
        if ( isThereMetricsAllPerinstance.value == 0 ) {
          loading.value = false
          elementHowtoinstall.value = true
          // elementDate.value = false
          elementBtnClpsQuick.value = false
          elemetContentquick.value = false
          elementBtnBasicCpu.value = false
          elementContentBasicCpu.value = false
          elementInfoSubscribing.value = false
        } else {
          // loading.value = false
          elementHowtoinstall.value = false
          // elementDate.value = true

        }

        await fetchInstanceDetail(val)
        await getStatusSubscribeDekaAgent(val)

        loading.value = false
        elementBtnClpsQuick.value = true
        elemetContentquick.value = true
        elementBtnBasicCpu.value = true
        elementContentBasicCpu.value = true
        elementInfoSubscribing.value = true

        if ( (getInstanceDetail.value.package_deka_agent.id == "" || getInstanceDetail.value.package_deka_agent.status == "inactive") && !getStatusInstanceDekaAgent.value.is_still_active ) {
          instanceSubscribed.value = false
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
          if (getStatusInstanceDekaAgent.value.is_unsubscribe) {
            instanceSubscribed.value = false
            elementExportPdf.value = false
          } else {
            instanceSubscribed.value = true
            elementExportPdf.value = true
          }

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

        let instanceSrc = `&var-service=instance&var-instance=${getInstanceDetail.value.name}`

        if (instanceSelect.value != "" && srcCPUBusy.value.includes(instanceSelect.value)) {
          srcCPUBusy.value = srcCPUBusy.value.replace(instanceSelect.value, instanceSrc)
          srcSysLoad5.value = srcSysLoad5.value.replace(instanceSelect.value, instanceSrc)
          srcSysLoad15.value = srcSysLoad15.value.replace(instanceSelect.value, instanceSrc)
          srcRamUsed.value = srcRamUsed.value.replace(instanceSelect.value, instanceSrc)
          srcSwapUsed.value = srcSwapUsed.value.replace(instanceSelect.value, instanceSrc)
          srcRootFsUsed.value = srcRootFsUsed.value.replace(instanceSelect.value, instanceSrc)
          srcCpuCores.value = srcCpuCores.value.replace(instanceSelect.value, instanceSrc)
          srcUptime.value = srcUptime.value.replace(instanceSelect.value, instanceSrc)
          srcRootFsTotal.value = srcRootFsTotal.value.replace(instanceSelect.value, instanceSrc)
          srcRamTotal.value = srcRamTotal.value.replace(instanceSelect.value, instanceSrc)
          srcSwapTotal.value = srcSwapTotal.value.replace(instanceSelect.value, instanceSrc)
          srcCpuBasic.value = srcCpuBasic.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryBasic.value = srcMemoryBasic.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTraficBasic.value = srcNetworkTraficBasic.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryBasicPercentage.value = srcMemoryBasicPercentage.value.replace(instanceSelect.value, instanceSrc)
          srcDiskSpaceUsedBasic.value = srcDiskSpaceUsedBasic.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryActiceInactive.value = srcMemoryActiceInactive.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryCommitted.value = srcMemoryCommitted.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryActiveInactiveDetail.value = srcMemoryActiveInactiveDetail.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryWritebackandDirty.value = srcMemoryWritebackandDirty.value.replace(instanceSelect.value, instanceSrc)
          srcMemorySharedandMapped.value = srcMemorySharedandMapped.value.replace(instanceSelect.value, instanceSrc)
          srcMemorySlab.value = srcMemorySlab.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryVmalloc.value = srcMemoryVmalloc.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryBounce.value = srcMemoryBounce.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryAnonymous.value = srcMemoryAnonymous.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryKernelCPU.value = srcMemoryKernelCPU.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryHugePagesCounter.value = srcMemoryHugePagesCounter.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryHugePagesSize.value = srcMemoryHugePagesSize.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryDirectMap.value = srcMemoryDirectMap.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryUnevictableandMLocked.value = srcMemoryUnevictableandMLocked.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryNFS.value = srcMemoryNFS.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryPagesInOut.value = srcMemoryPagesInOut.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryPagesSwapInOut.value = srcMemoryPagesSwapInOut.value.replace(instanceSelect.value, instanceSrc)
          srcMemoryPageFaults.value = srcMemoryPageFaults.value.replace(instanceSelect.value, instanceSrc)
          srcOOMKiller.value = srcOOMKiller.value.replace(instanceSelect.value, instanceSrc)
          srcTimeSynchronizedDrift.value = srcTimeSynchronizedDrift.value.replace(instanceSelect.value, instanceSrc)
          srcTimePLLAdjust.value = srcTimePLLAdjust.value.replace(instanceSelect.value, instanceSrc)
          srcTimeSynchronizedStatus.value = srcTimeSynchronizedStatus.value.replace(instanceSelect.value, instanceSrc)
          srcTimeMisc.value = srcTimeMisc.value.replace(instanceSelect.value, instanceSrc)
          srcProcessesStatus.value = srcProcessesStatus.value.replace(instanceSelect.value, instanceSrc)
          srcProcessesState.value = srcProcessesState.value.replace(instanceSelect.value, instanceSrc)
          srcProcessesForks.value = srcProcessesForks.value.replace(instanceSelect.value, instanceSrc)
          srcProcessesMemory.value = srcProcessesMemory.value.replace(instanceSelect.value, instanceSrc)
          srcPIDsNumberandLimit.value = srcPIDsNumberandLimit.value.replace(instanceSelect.value, instanceSrc)
          srcProcessschedulestatsRunningWaiting.value = srcProcessschedulestatsRunningWaiting.value.replace(instanceSelect.value, instanceSrc)
          srcThreadsNumberandLimit.value = srcThreadsNumberandLimit.value.replace(instanceSelect.value, instanceSrc)
          srcContextSwitchesInterrupts.value = srcContextSwitchesInterrupts.value.replace(instanceSelect.value, instanceSrc)
          srcSystemLoad.value = srcSystemLoad.value.replace(instanceSelect.value, instanceSrc)
          srcInterruptsDetail.value = srcInterruptsDetail.value.replace(instanceSelect.value, instanceSrc)
          srcScheduletimeslicesexecutedbyeachcpu.value = srcScheduletimeslicesexecutedbyeachcpu.value.replace(instanceSelect.value, instanceSrc)
          srcEntropy.value = srcEntropy.value.replace(instanceSelect.value, instanceSrc)
          srcCPUtimespentinuserandsystemcontexts.value = srcCPUtimespentinuserandsystemcontexts.value.replace(instanceSelect.value, instanceSrc)
          srcFileDescriptors.value = srcFileDescriptors.value.replace(instanceSelect.value, instanceSrc)
          srcHardwaretemperaturemonitor.value = srcHardwaretemperaturemonitor.value.replace(instanceSelect.value, instanceSrc)
          srcThrottlecoolingdevice.value = srcThrottlecoolingdevice.value.replace(instanceSelect.value, instanceSrc)
          srcPowersupply.value = srcPowersupply.value.replace(instanceSelect.value, instanceSrc)
          srcSystemdSockets.value = srcSystemdSockets.value.replace(instanceSelect.value, instanceSrc)
          srcSystemdUnitsState.value = srcSystemdUnitsState.value.replace(instanceSelect.value, instanceSrc)
          srcDiskIOpsCompleted.value = srcDiskIOpsCompleted.value.replace(instanceSelect.value, instanceSrc)
          srcDiskRWData.value = srcDiskRWData.value.replace(instanceSelect.value, instanceSrc)
          srcDiskAverageWaitTime.value = srcDiskAverageWaitTime.value.replace(instanceSelect.value, instanceSrc)
          srcAverageQueueSize.value = srcAverageQueueSize.value.replace(instanceSelect.value, instanceSrc)
          srcDiskRWMerged.value = srcDiskRWMerged.value.replace(instanceSelect.value, instanceSrc)
          srcTimeSpentDoingIOs.value = srcTimeSpentDoingIOs.value.replace(instanceSelect.value, instanceSrc)
          srcInstantaneousQueueSize.value = srcInstantaneousQueueSize.value.replace(instanceSelect.value, instanceSrc)
          srcDiskIOpsDiscardscompletedmerged.value = srcDiskIOpsDiscardscompletedmerged.value.replace(instanceSelect.value, instanceSrc)
          srcFilesystemspaceavailable.value = srcFilesystemspaceavailable.value.replace(instanceSelect.value, instanceSrc)
          srcFileNodesFree.value = srcFileNodesFree.value.replace(instanceSelect.value, instanceSrc)
          srcFileDescriptor.value = srcFileDescriptor.value.replace(instanceSelect.value, instanceSrc)
          srcFileNodesSize.value = srcFileNodesSize.value.replace(instanceSelect.value, instanceSrc)
          srcFilesysteminReadOnlyError.value = srcFilesysteminReadOnlyError.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTrafficbyPackets.value = srcNetworkTrafficbyPackets.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTrafficErrors.value = srcNetworkTrafficErrors.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTrafficDrop.value = srcNetworkTrafficDrop.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTrafficCompressed.value = srcNetworkTrafficCompressed.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTrafficMulticast.value = srcNetworkTrafficMulticast.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTrafficFifo.value = srcNetworkTrafficFifo.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTrafficFrame.value = srcNetworkTrafficFrame.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTrafficCarrier.value = srcNetworkTrafficCarrier.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkTrafficColls.value = srcNetworkTrafficColls.value.replace(instanceSelect.value, instanceSrc)
          srcNFContrack.value = srcNFContrack.value.replace(instanceSelect.value, instanceSrc)
          srcARPEntries.value = srcARPEntries.value.replace(instanceSelect.value, instanceSrc)
          srcMTU.value = srcMTU.value.replace(instanceSelect.value, instanceSrc)
          srcSpeed.value = srcSpeed.value.replace(instanceSelect.value, instanceSrc)
          srcQueueLength.value = srcQueueLength.value.replace(instanceSelect.value, instanceSrc)
          srcSoftnetPackets.value = srcSoftnetPackets.value.replace(instanceSelect.value, instanceSrc)
          srcSoftnetOutofQuota.value = srcSoftnetOutofQuota.value.replace(instanceSelect.value, instanceSrc)
          srcNetworkOperationalStatus.value = srcNetworkOperationalStatus.value.replace(instanceSelect.value, instanceSrc)
          srcSockstatTCP.value = srcSockstatTCP.value.replace(instanceSelect.value, instanceSrc)
          srcSockstatUDP.value = srcSockstatUDP.value.replace(instanceSelect.value, instanceSrc)
          srcSockstatFRAGRAW.value = srcSockstatFRAGRAW.value.replace(instanceSelect.value, instanceSrc)
          srcSockstatMemorySize.value = srcSockstatMemorySize.value.replace(instanceSelect.value, instanceSrc)
          srcSockstatUsed.value = srcSockstatUsed.value.replace(instanceSelect.value, instanceSrc)
          srcNetstatIPInOutOctets.value = srcNetstatIPInOutOctets.value.replace(instanceSelect.value, instanceSrc)
          srcNetstatIPForwarding.value = srcNetstatIPForwarding.value.replace(instanceSelect.value, instanceSrc)
          srcICMPInOut.value = srcICMPInOut.value.replace(instanceSelect.value, instanceSrc)
          srcICMPErrors.value = srcICMPErrors.value.replace(instanceSelect.value, instanceSrc)
          srcUDPInOut.value = srcUDPInOut.value.replace(instanceSelect.value, instanceSrc)
          srcUDPErrors.value = srcUDPErrors.value.replace(instanceSelect.value, instanceSrc)
          srcTCPInOut.value = srcTCPInOut.value.replace(instanceSelect.value, instanceSrc)
          srcTCPErrors.value = srcTCPErrors.value.replace(instanceSelect.value, instanceSrc)
          srcTCPConnections.value = srcTCPConnections.value.replace(instanceSelect.value, instanceSrc)
          srcTCPSynCookie.value = srcTCPSynCookie.value.replace(instanceSelect.value, instanceSrc)
          srcTCPDirectTransition.value = srcTCPDirectTransition.value.replace(instanceSelect.value, instanceSrc)
          srcTCPStat.value = srcTCPStat.value.replace(instanceSelect.value, instanceSrc)
          srcNodeExporterScrapeTime.value = srcNodeExporterScrapeTime.value.replace(instanceSelect.value, instanceSrc)
          srcNodeExporterScrape.value = srcNodeExporterScrape.value.replace(instanceSelect.value, instanceSrc)



        } else {
          srcCPUBusy.value += instanceSrc
          srcSysLoad5.value += instanceSrc
          srcSysLoad15.value += instanceSrc
          srcRamUsed.value += instanceSrc
          srcSwapUsed.value += instanceSrc
          srcRootFsUsed.value += instanceSrc
          srcCpuCores.value += instanceSrc
          srcUptime.value += instanceSrc
          srcRootFsTotal.value += instanceSrc
          srcRamTotal.value += instanceSrc
          srcSwapTotal.value += instanceSrc
          srcCpuBasic.value += instanceSrc
          srcMemoryBasic.value += instanceSrc
          srcNetworkTraficBasic.value += instanceSrc
          srcMemoryBasicPercentage.value += instanceSrc
          srcDiskSpaceUsedBasic.value += instanceSrc
          srcMemoryActiceInactive.value += instanceSrc
          srcMemoryCommitted.value += instanceSrc
          srcMemoryActiveInactiveDetail.value += instanceSrc
          srcMemoryWritebackandDirty.value += instanceSrc
          srcMemorySharedandMapped.value += instanceSrc
          srcMemorySlab.value += instanceSrc
          srcMemoryVmalloc.value += instanceSrc
          srcMemoryBounce.value += instanceSrc
          srcMemoryAnonymous.value += instanceSrc
          srcMemoryKernelCPU.value += instanceSrc
          srcMemoryHugePagesCounter.value += instanceSrc
          srcMemoryHugePagesSize.value += instanceSrc
          srcMemoryDirectMap.value += instanceSrc
          srcMemoryUnevictableandMLocked.value += instanceSrc
          srcMemoryNFS.value += instanceSrc
          srcMemoryPagesInOut.value += instanceSrc
          srcMemoryPagesSwapInOut.value += instanceSrc
          srcMemoryPageFaults.value += instanceSrc
          srcOOMKiller.value += instanceSrc
          srcTimeSynchronizedDrift.value += instanceSrc
          srcTimePLLAdjust.value += instanceSrc
          srcTimeSynchronizedStatus.value += instanceSrc
          srcTimeMisc.value += instanceSrc
          srcProcessesStatus.value += instanceSrc
          srcProcessesState.value += instanceSrc
          srcProcessesForks.value += instanceSrc
          srcProcessesMemory.value += instanceSrc
          srcPIDsNumberandLimit.value += instanceSrc
          srcProcessschedulestatsRunningWaiting.value += instanceSrc
          srcThreadsNumberandLimit.value += instanceSrc
          srcContextSwitchesInterrupts.value += instanceSrc
          srcSystemLoad.value += instanceSrc
          srcInterruptsDetail.value += instanceSrc
          srcScheduletimeslicesexecutedbyeachcpu.value += instanceSrc
          srcEntropy.value += instanceSrc
          srcCPUtimespentinuserandsystemcontexts.value += instanceSrc
          srcFileDescriptors.value += instanceSrc
          srcHardwaretemperaturemonitor.value += instanceSrc
          srcThrottlecoolingdevice.value += instanceSrc
          srcPowersupply.value += instanceSrc
          srcSystemdSockets.value += instanceSrc
          srcSystemdUnitsState.value += instanceSrc
          srcDiskIOpsCompleted.value += instanceSrc
          srcDiskRWData.value += instanceSrc
          srcDiskAverageWaitTime.value += instanceSrc
          srcAverageQueueSize.value += instanceSrc
          srcDiskRWMerged.value += instanceSrc
          srcTimeSpentDoingIOs.value += instanceSrc
          srcInstantaneousQueueSize.value += instanceSrc
          srcDiskIOpsDiscardscompletedmerged.value += instanceSrc
          srcFilesystemspaceavailable.value += instanceSrc
          srcFileNodesFree.value += instanceSrc
          srcFileDescriptor.value += instanceSrc
          srcFileNodesSize.value += instanceSrc
          srcFilesysteminReadOnlyError.value += instanceSrc
          srcNetworkTrafficbyPackets.value += instanceSrc
          srcNetworkTrafficErrors.value += instanceSrc
          srcNetworkTrafficDrop.value += instanceSrc
          srcNetworkTrafficCompressed.value += instanceSrc
          srcNetworkTrafficMulticast.value += instanceSrc
          srcNetworkTrafficFifo.value += instanceSrc
          srcNetworkTrafficFrame.value += instanceSrc
          srcNetworkTrafficCarrier.value += instanceSrc
          srcNetworkTrafficColls.value += instanceSrc
          srcNFContrack.value += instanceSrc
          srcARPEntries.value += instanceSrc
          srcMTU.value += instanceSrc
          srcSpeed.value += instanceSrc
          srcQueueLength.value += instanceSrc
          srcSoftnetPackets.value += instanceSrc
          srcSoftnetOutofQuota.value += instanceSrc
          srcNetworkOperationalStatus.value += instanceSrc
          srcSockstatTCP.value += instanceSrc
          srcSockstatUDP.value += instanceSrc
          srcSockstatFRAGRAW.value += instanceSrc
          srcSockstatMemorySize.value += instanceSrc
          srcSockstatUsed.value += instanceSrc
          srcNetstatIPInOutOctets.value += instanceSrc
          srcNetstatIPForwarding.value += instanceSrc
          srcICMPInOut.value += instanceSrc
          srcICMPErrors.value += instanceSrc
          srcUDPInOut.value += instanceSrc
          srcUDPErrors.value += instanceSrc
          srcTCPInOut.value += instanceSrc
          srcTCPErrors.value += instanceSrc
          srcTCPConnections.value += instanceSrc
          srcTCPSynCookie.value += instanceSrc
          srcTCPDirectTransition.value += instanceSrc
          srcTCPStat.value += instanceSrc
          srcNodeExporterScrapeTime.value += instanceSrc
          srcNodeExporterScrape.value += instanceSrc


        }
        instanceSelect.value = instanceSrc

      } else {

        instanceId.value = null;

        loading.value = false
        elementExportPdf.value = false
        
        instanceSubscribed.value = false
        elementInfoSubscribing.value = true

        elementHowtoinstall.value = false
        elementBtnClpsQuick.value = true
        elemetContentquick.value = true
        elementBtnBasicCpu.value = true
        elementContentBasicCpu.value = true
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

        srcCPUBusy.value = srcCPUBusy.value.replace(instanceSelect.value, "")
        srcSysLoad5.value = srcSysLoad5.value.replace(instanceSelect.value, "")
        srcSysLoad15.value = srcSysLoad15.value.replace(instanceSelect.value, "")
        srcRamUsed.value = srcRamUsed.value.replace(instanceSelect.value, "")
        srcSwapUsed.value = srcSwapUsed.value.replace(instanceSelect.value, "")
        srcRootFsUsed.value = srcRootFsUsed.value.replace(instanceSelect.value, "")
        srcCpuCores.value = srcCpuCores.value.replace(instanceSelect.value, "")
        srcUptime.value = srcUptime.value.replace(instanceSelect.value, "")
        srcRootFsTotal.value = srcRootFsTotal.value.replace(instanceSelect.value, "")
        srcRamTotal.value = srcRamTotal.value.replace(instanceSelect.value, "")
        srcSwapTotal.value = srcSwapTotal.value.replace(instanceSelect.value, "")
        srcCpuBasic.value = srcCpuBasic.value.replace(instanceSelect.value, "")
        srcMemoryBasic.value = srcMemoryBasic.value.replace(instanceSelect.value, "")
        srcNetworkTraficBasic.value = srcNetworkTraficBasic.value.replace(instanceSelect.value, "")
        srcMemoryBasicPercentage.value = srcMemoryBasicPercentage.value.replace(instanceSelect.value, "")
        srcDiskSpaceUsedBasic.value = srcDiskSpaceUsedBasic.value.replace(instanceSelect.value, "")
        srcMemoryActiceInactive.value = srcMemoryActiceInactive.value.replace(instanceSelect.value, "")
        srcMemoryCommitted.value = srcMemoryCommitted.value.replace(instanceSelect.value, "")
        srcMemoryActiveInactiveDetail.value = srcMemoryActiveInactiveDetail.value.replace(instanceSelect.value, "")
        srcMemoryWritebackandDirty.value = srcMemoryWritebackandDirty.value.replace(instanceSelect.value, "")
        srcMemorySharedandMapped.value = srcMemorySharedandMapped.value.replace(instanceSelect.value, "")
        srcMemorySlab.value = srcMemorySlab.value.replace(instanceSelect.value, "")
        srcMemoryVmalloc.value = srcMemoryVmalloc.value.replace(instanceSelect.value, "")
        srcMemoryBounce.value = srcMemoryBounce.value.replace(instanceSelect.value, "")
        srcMemoryAnonymous.value = srcMemoryAnonymous.value.replace(instanceSelect.value, "")
        srcMemoryKernelCPU.value = srcMemoryKernelCPU.value.replace(instanceSelect.value, "")
        srcMemoryHugePagesCounter.value = srcMemoryHugePagesCounter.value.replace(instanceSelect.value, "")
        srcMemoryHugePagesSize.value = srcMemoryHugePagesSize.value.replace(instanceSelect.value, "")
        srcMemoryDirectMap.value = srcMemoryDirectMap.value.replace(instanceSelect.value, "")
        srcMemoryUnevictableandMLocked.value = srcMemoryUnevictableandMLocked.value.replace(instanceSelect.value, "")
        srcMemoryNFS.value = srcMemoryNFS.value.replace(instanceSelect.value, "")
        srcMemoryPagesInOut.value = srcMemoryPagesInOut.value.replace(instanceSelect.value, "")
        srcMemoryPagesSwapInOut.value = srcMemoryPagesSwapInOut.value.replace(instanceSelect.value, "")
        srcMemoryPageFaults.value = srcMemoryPageFaults.value.replace(instanceSelect.value, "")
        srcOOMKiller.value = srcOOMKiller.value.replace(instanceSelect.value, "")
        srcTimeSynchronizedDrift.value = srcTimeSynchronizedDrift.value.replace(instanceSelect.value, "")
        srcTimePLLAdjust.value = srcTimePLLAdjust.value.replace(instanceSelect.value, "")
        srcTimeSynchronizedStatus.value = srcTimeSynchronizedStatus.value.replace(instanceSelect.value, "")
        srcTimeMisc.value = srcTimeMisc.value.replace(instanceSelect.value, "")
        srcProcessesStatus.value = srcProcessesStatus.value.replace(instanceSelect.value, "")
        srcProcessesState.value = srcProcessesState.value.replace(instanceSelect.value, "")
        srcProcessesForks.value = srcProcessesForks.value.replace(instanceSelect.value, "")
        srcProcessesMemory.value = srcProcessesMemory.value.replace(instanceSelect.value, "")
        srcPIDsNumberandLimit.value = srcPIDsNumberandLimit.value.replace(instanceSelect.value, "")
        srcProcessschedulestatsRunningWaiting.value = srcProcessschedulestatsRunningWaiting.value.replace(instanceSelect.value, "")
        srcThreadsNumberandLimit.value = srcThreadsNumberandLimit.value.replace(instanceSelect.value, "")
        srcContextSwitchesInterrupts.value = srcContextSwitchesInterrupts.value.replace(instanceSelect.value, "")
        srcSystemLoad.value = srcSystemLoad.value.replace(instanceSelect.value, "")
        srcInterruptsDetail.value = srcInterruptsDetail.value.replace(instanceSelect.value, "")
        srcScheduletimeslicesexecutedbyeachcpu.value = srcScheduletimeslicesexecutedbyeachcpu.value.replace(instanceSelect.value, "")
        srcEntropy.value = srcEntropy.value.replace(instanceSelect.value, "")
        srcCPUtimespentinuserandsystemcontexts.value = srcCPUtimespentinuserandsystemcontexts.value.replace(instanceSelect.value, "")
        srcFileDescriptors.value = srcFileDescriptors.value.replace(instanceSelect.value, "")
        srcHardwaretemperaturemonitor.value = srcHardwaretemperaturemonitor.value.replace(instanceSelect.value, "")
        srcThrottlecoolingdevice.value = srcThrottlecoolingdevice.value.replace(instanceSelect.value, "")
        srcPowersupply.value = srcPowersupply.value.replace(instanceSelect.value, "")
        srcSystemdSockets.value = srcSystemdSockets.value.replace(instanceSelect.value, "")
        srcSystemdUnitsState.value = srcSystemdUnitsState.value.replace(instanceSelect.value, "")
        srcDiskIOpsCompleted.value = srcDiskIOpsCompleted.value.replace(instanceSelect.value, "")
        srcDiskRWData.value = srcDiskRWData.value.replace(instanceSelect.value, "")
        srcDiskAverageWaitTime.value = srcDiskAverageWaitTime.value.replace(instanceSelect.value, "")
        srcAverageQueueSize.value = srcAverageQueueSize.value.replace(instanceSelect.value, "")
        srcDiskRWMerged.value = srcDiskRWMerged.value.replace(instanceSelect.value, "")
        srcTimeSpentDoingIOs.value = srcTimeSpentDoingIOs.value.replace(instanceSelect.value, "")
        srcInstantaneousQueueSize.value = srcInstantaneousQueueSize.value.replace(instanceSelect.value, "")
        srcDiskIOpsDiscardscompletedmerged.value = srcDiskIOpsDiscardscompletedmerged.value.replace(instanceSelect.value, "")
        srcFilesystemspaceavailable.value = srcFilesystemspaceavailable.value.replace(instanceSelect.value, "")
        srcFileNodesFree.value = srcFileNodesFree.value.replace(instanceSelect.value, "")
        srcFileDescriptor.value = srcFileDescriptor.value.replace(instanceSelect.value, "")
        srcFileNodesSize.value = srcFileNodesSize.value.replace(instanceSelect.value, "")
        srcFilesysteminReadOnlyError.value = srcFilesysteminReadOnlyError.value.replace(instanceSelect.value, "")
        srcNetworkTrafficbyPackets.value = srcNetworkTrafficbyPackets.value.replace(instanceSelect.value, "")
        srcNetworkTrafficErrors.value = srcNetworkTrafficErrors.value.replace(instanceSelect.value, "")
        srcNetworkTrafficDrop.value = srcNetworkTrafficDrop.value.replace(instanceSelect.value, "")
        srcNetworkTrafficCompressed.value = srcNetworkTrafficCompressed.value.replace(instanceSelect.value, "")
        srcNetworkTrafficMulticast.value = srcNetworkTrafficMulticast.value.replace(instanceSelect.value, "")
        srcNetworkTrafficFifo.value = srcNetworkTrafficFifo.value.replace(instanceSelect.value, "")
        srcNetworkTrafficFrame.value = srcNetworkTrafficFrame.value.replace(instanceSelect.value, "")
        srcNetworkTrafficCarrier.value = srcNetworkTrafficCarrier.value.replace(instanceSelect.value, "")
        srcNetworkTrafficColls.value = srcNetworkTrafficColls.value.replace(instanceSelect.value, "")
        srcNFContrack.value = srcNFContrack.value.replace(instanceSelect.value, "")
        srcARPEntries.value = srcARPEntries.value.replace(instanceSelect.value, "")
        srcMTU.value = srcMTU.value.replace(instanceSelect.value, "")
        srcSpeed.value = srcSpeed.value.replace(instanceSelect.value, "")
        srcQueueLength.value = srcQueueLength.value.replace(instanceSelect.value, "")
        srcSoftnetPackets.value = srcSoftnetPackets.value.replace(instanceSelect.value, "")
        srcSoftnetOutofQuota.value = srcSoftnetOutofQuota.value.replace(instanceSelect.value, "")
        srcNetworkOperationalStatus.value = srcNetworkOperationalStatus.value.replace(instanceSelect.value, "")
        srcSockstatTCP.value = srcSockstatTCP.value.replace(instanceSelect.value, "")
        srcSockstatUDP.value = srcSockstatUDP.value.replace(instanceSelect.value, "")
        srcSockstatFRAGRAW.value = srcSockstatFRAGRAW.value.replace(instanceSelect.value, "")
        srcSockstatMemorySize.value = srcSockstatMemorySize.value.replace(instanceSelect.value, "")
        srcSockstatUsed.value = srcSockstatUsed.value.replace(instanceSelect.value, "")
        srcNetstatIPInOutOctets.value = srcNetstatIPInOutOctets.value.replace(instanceSelect.value, "")
        srcNetstatIPForwarding.value = srcNetstatIPForwarding.value.replace(instanceSelect.value, "")
        srcICMPInOut.value = srcICMPInOut.value.replace(instanceSelect.value, "")
        srcICMPErrors.value = srcICMPErrors.value.replace(instanceSelect.value, "")
        srcUDPInOut.value = srcUDPInOut.value.replace(instanceSelect.value, "")
        srcUDPErrors.value = srcUDPErrors.value.replace(instanceSelect.value, "")
        srcTCPInOut.value = srcTCPInOut.value.replace(instanceSelect.value, "")
        srcTCPErrors.value = srcTCPErrors.value.replace(instanceSelect.value, "")
        srcTCPConnections.value = srcTCPConnections.value.replace(instanceSelect.value, "")
        srcTCPSynCookie.value = srcTCPSynCookie.value.replace(instanceSelect.value, "")
        srcTCPDirectTransition.value = srcTCPDirectTransition.value.replace(instanceSelect.value, "")
        srcTCPStat.value = srcTCPStat.value.replace(instanceSelect.value, "")
        srcNodeExporterScrapeTime.value = srcNodeExporterScrapeTime.value.replace(instanceSelect.value, "")
        srcNodeExporterScrape.value = srcNodeExporterScrape.value.replace(instanceSelect.value, "")



        instanceSelect.value = ""
      }
      
    })

    watch(range, (val) => {
      const start = moment(new Date(val.start)).format('x')
      const end = moment(new Date(val.end)).format('x')
      const currentDays = dateTo.value

      if(currentDays !== (start || end)){
        const timeRange = `&from=${start}&to=${end}`
        const timeOld = `&from=${dateFrom.value}&to=${dateTo.value}`

        srcCPUBusy.value = srcCPUBusy.value.replace(timeOld, timeRange)
        srcSysLoad5.value = srcSysLoad5.value.replace(timeOld, timeRange)
        srcSysLoad15.value = srcSysLoad15.value.replace(timeOld, timeRange)
        srcRamUsed.value = srcRamUsed.value.replace(timeOld, timeRange)
        srcSwapUsed.value = srcSwapUsed.value.replace(timeOld, timeRange)
        srcRootFsUsed.value = srcRootFsUsed.value.replace(timeOld, timeRange)
        srcCpuCores.value = srcCpuCores.value.replace(timeOld, timeRange)
        srcUptime.value = srcUptime.value.replace(timeOld, timeRange)
        srcRootFsTotal.value = srcRootFsTotal.value.replace(timeOld, timeRange)
        srcRamTotal.value = srcRamTotal.value.replace(timeOld, timeRange)
        srcSwapTotal.value = srcSwapTotal.value.replace(timeOld, timeRange)
        srcCpuBasic.value = srcCpuBasic.value.replace(timeOld, timeRange)
        srcMemoryBasic.value = srcMemoryBasic.value.replace(timeOld, timeRange)
        srcNetworkTraficBasic.value = srcNetworkTraficBasic.value.replace(timeOld, timeRange)
        srcMemoryBasicPercentage.value = srcMemoryBasicPercentage.value.replace(timeOld, timeRange)
        srcDiskSpaceUsedBasic.value = srcDiskSpaceUsedBasic.value.replace(timeOld, timeRange)
        srcMemoryActiceInactive.value = srcMemoryActiceInactive.value.replace(timeOld, timeRange)
        srcMemoryCommitted.value = srcMemoryCommitted.value.replace(timeOld, timeRange)
        srcMemoryActiveInactiveDetail.value = srcMemoryActiveInactiveDetail.value.replace(timeOld, timeRange)
        srcMemoryWritebackandDirty.value = srcMemoryWritebackandDirty.value.replace(timeOld, timeRange)
        srcMemorySharedandMapped.value = srcMemorySharedandMapped.value.replace(timeOld, timeRange)
        srcMemorySlab.value = srcMemorySlab.value.replace(timeOld, timeRange)
        srcMemoryVmalloc.value = srcMemoryVmalloc.value.replace(timeOld, timeRange)
        srcMemoryBounce.value = srcMemoryBounce.value.replace(timeOld, timeRange)
        srcMemoryAnonymous.value = srcMemoryAnonymous.value.replace(timeOld, timeRange)
        srcMemoryKernelCPU.value = srcMemoryKernelCPU.value.replace(timeOld, timeRange)
        srcMemoryHugePagesCounter.value = srcMemoryHugePagesCounter.value.replace(timeOld, timeRange)
        srcMemoryHugePagesSize.value = srcMemoryHugePagesSize.value.replace(timeOld, timeRange)
        srcMemoryDirectMap.value = srcMemoryDirectMap.value.replace(timeOld, timeRange)
        srcMemoryUnevictableandMLocked.value = srcMemoryUnevictableandMLocked.value.replace(timeOld, timeRange)
        srcMemoryNFS.value = srcMemoryNFS.value.replace(timeOld, timeRange)
        srcMemoryPagesInOut.value = srcMemoryPagesInOut.value.replace(timeOld, timeRange)
        srcMemoryPagesSwapInOut.value = srcMemoryPagesSwapInOut.value.replace(timeOld, timeRange)
        srcMemoryPageFaults.value = srcMemoryPageFaults.value.replace(timeOld, timeRange)
        srcOOMKiller.value = srcOOMKiller.value.replace(timeOld, timeRange)
        srcTimeSynchronizedDrift.value = srcTimeSynchronizedDrift.value.replace(timeOld, timeRange)
        srcTimePLLAdjust.value = srcTimePLLAdjust.value.replace(timeOld, timeRange)
        srcTimeSynchronizedStatus.value = srcTimeSynchronizedStatus.value.replace(timeOld, timeRange)
        srcTimeMisc.value = srcTimeMisc.value.replace(timeOld, timeRange)
        srcProcessesStatus.value = srcProcessesStatus.value.replace(timeOld, timeRange)
        srcProcessesState.value = srcProcessesState.value.replace(timeOld, timeRange)
        srcProcessesForks.value = srcProcessesForks.value.replace(timeOld, timeRange)
        srcProcessesMemory.value = srcProcessesMemory.value.replace(timeOld, timeRange)
        srcPIDsNumberandLimit.value = srcPIDsNumberandLimit.value.replace(timeOld, timeRange)
        srcProcessschedulestatsRunningWaiting.value = srcProcessschedulestatsRunningWaiting.value.replace(timeOld, timeRange)
        srcThreadsNumberandLimit.value = srcThreadsNumberandLimit.value.replace(timeOld, timeRange)
        srcContextSwitchesInterrupts.value = srcContextSwitchesInterrupts.value.replace(timeOld, timeRange)
        srcSystemLoad.value = srcSystemLoad.value.replace(timeOld, timeRange)
        srcInterruptsDetail.value = srcInterruptsDetail.value.replace(timeOld, timeRange)
        srcScheduletimeslicesexecutedbyeachcpu.value = srcScheduletimeslicesexecutedbyeachcpu.value.replace(timeOld, timeRange)
        srcEntropy.value = srcEntropy.value.replace(timeOld, timeRange)
        srcCPUtimespentinuserandsystemcontexts.value = srcCPUtimespentinuserandsystemcontexts.value.replace(timeOld, timeRange)
        srcFileDescriptors.value = srcFileDescriptors.value.replace(timeOld, timeRange)
        srcHardwaretemperaturemonitor.value = srcHardwaretemperaturemonitor.value.replace(timeOld, timeRange)
        srcThrottlecoolingdevice.value = srcThrottlecoolingdevice.value.replace(timeOld, timeRange)
        srcPowersupply.value = srcPowersupply.value.replace(timeOld, timeRange)
        srcSystemdSockets.value = srcSystemdSockets.value.replace(timeOld, timeRange)
        srcSystemdUnitsState.value = srcSystemdUnitsState.value.replace(timeOld, timeRange)
        srcDiskIOpsCompleted.value = srcDiskIOpsCompleted.value.replace(timeOld, timeRange)
        srcDiskRWData.value = srcDiskRWData.value.replace(timeOld, timeRange)
        srcDiskAverageWaitTime.value = srcDiskAverageWaitTime.value.replace(timeOld, timeRange)
        srcAverageQueueSize.value = srcAverageQueueSize.value.replace(timeOld, timeRange)
        srcDiskRWMerged.value = srcDiskRWMerged.value.replace(timeOld, timeRange)
        srcTimeSpentDoingIOs.value = srcTimeSpentDoingIOs.value.replace(timeOld, timeRange)
        srcInstantaneousQueueSize.value = srcInstantaneousQueueSize.value.replace(timeOld, timeRange)
        srcDiskIOpsDiscardscompletedmerged.value = srcDiskIOpsDiscardscompletedmerged.value.replace(timeOld, timeRange)
        srcFilesystemspaceavailable.value = srcFilesystemspaceavailable.value.replace(timeOld, timeRange)
        srcFileNodesFree.value = srcFileNodesFree.value.replace(timeOld, timeRange)
        srcFileDescriptor.value = srcFileDescriptor.value.replace(timeOld, timeRange)
        srcFileNodesSize.value = srcFileNodesSize.value.replace(timeOld, timeRange)
        srcFilesysteminReadOnlyError.value = srcFilesysteminReadOnlyError.value.replace(timeOld, timeRange)
        srcNetworkTrafficbyPackets.value = srcNetworkTrafficbyPackets.value.replace(timeOld, timeRange)
        srcNetworkTrafficErrors.value = srcNetworkTrafficErrors.value.replace(timeOld, timeRange)
        srcNetworkTrafficDrop.value = srcNetworkTrafficDrop.value.replace(timeOld, timeRange)
        srcNetworkTrafficCompressed.value = srcNetworkTrafficCompressed.value.replace(timeOld, timeRange)
        srcNetworkTrafficMulticast.value = srcNetworkTrafficMulticast.value.replace(timeOld, timeRange)
        srcNetworkTrafficFifo.value = srcNetworkTrafficFifo.value.replace(timeOld, timeRange)
        srcNetworkTrafficFrame.value = srcNetworkTrafficFrame.value.replace(timeOld, timeRange)
        srcNetworkTrafficCarrier.value = srcNetworkTrafficCarrier.value.replace(timeOld, timeRange)
        srcNetworkTrafficColls.value = srcNetworkTrafficColls.value.replace(timeOld, timeRange)
        srcNFContrack.value = srcNFContrack.value.replace(timeOld, timeRange)
        srcARPEntries.value = srcARPEntries.value.replace(timeOld, timeRange)
        srcMTU.value = srcMTU.value.replace(timeOld, timeRange)
        srcSpeed.value = srcSpeed.value.replace(timeOld, timeRange)
        srcQueueLength.value = srcQueueLength.value.replace(timeOld, timeRange)
        srcSoftnetPackets.value = srcSoftnetPackets.value.replace(timeOld, timeRange)
        srcSoftnetOutofQuota.value = srcSoftnetOutofQuota.value.replace(timeOld, timeRange)
        srcNetworkOperationalStatus.value = srcNetworkOperationalStatus.value.replace(timeOld, timeRange)
        srcSockstatTCP.value = srcSockstatTCP.value.replace(timeOld, timeRange)
        srcSockstatUDP.value = srcSockstatUDP.value.replace(timeOld, timeRange)
        srcSockstatFRAGRAW.value = srcSockstatFRAGRAW.value.replace(timeOld, timeRange)
        srcSockstatMemorySize.value = srcSockstatMemorySize.value.replace(timeOld, timeRange)
        srcSockstatUsed.value = srcSockstatUsed.value.replace(timeOld, timeRange)
        srcNetstatIPInOutOctets.value = srcNetstatIPInOutOctets.value.replace(timeOld, timeRange)
        srcNetstatIPForwarding.value = srcNetstatIPForwarding.value.replace(timeOld, timeRange)
        srcICMPInOut.value = srcICMPInOut.value.replace(timeOld, timeRange)
        srcICMPErrors.value = srcICMPErrors.value.replace(timeOld, timeRange)
        srcUDPInOut.value = srcUDPInOut.value.replace(timeOld, timeRange)
        srcUDPErrors.value = srcUDPErrors.value.replace(timeOld, timeRange)
        srcTCPInOut.value = srcTCPInOut.value.replace(timeOld, timeRange)
        srcTCPErrors.value = srcTCPErrors.value.replace(timeOld, timeRange)
        srcTCPConnections.value = srcTCPConnections.value.replace(timeOld, timeRange)
        srcTCPSynCookie.value = srcTCPSynCookie.value.replace(timeOld, timeRange)
        srcTCPDirectTransition.value = srcTCPDirectTransition.value.replace(timeOld, timeRange)
        srcTCPStat.value = srcTCPStat.value.replace(timeOld, timeRange)
        srcNodeExporterScrapeTime.value = srcNodeExporterScrapeTime.value.replace(timeOld, timeRange)
        srcNodeExporterScrape.value = srcNodeExporterScrape.value.replace(timeOld, timeRange)


        dateTo.value = end
        dateFrom.value = start

        range.value.start = new Date(val.start)
        range.value.end = new Date(val.end)

      }
    });

    const waitForElm = (selector) => {
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

    watch(elementBtnClpsQuick, (val) => {
      if (val) {

        waitForElm('.collapsible').then((elm) => {
          let coll = document.getElementsByClassName("collapsible") as HTMLCollection | null
          let i;
          for (i = 0; i < coll.length; i++) {
            // console.log('inside for')
            coll[i].addEventListener("click", function() {
              // console.log('terclick')
              this.classList.toggle("active");
              var content = this.nextElementSibling;
              if (content.style.maxHeight){
                content.style.maxHeight = null;
              } else {
                content.style.maxHeight = content.scrollHeight + "px";
              } 
            });
          }

        });
        
      }
    });

    return {
      getInstanceDetail,
      getStatusInstanceDekaAgent,
      vcalendar: false,
      instanceId,

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

      elementHowtoinstall,
      elementDate,
      elementInfoSubscribing,
      instanceSubscribed,
      elementBtnClpsQuick,
      elemetContentquick,
      elementBtnBasicCpu,
      elementContentBasicCpu,
      loading,
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

      getmetricDekaAgentPerProjectall,
      instanceByProject,

      dateFrom,
      dateTo,
      filterins,
      instanceSelect,

      dialogDownloadPDF,
      elementExportPdf,
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

.box-shadow-custom {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

.infoSubscribe {
    border: none;
    border-radius: 1px;
    padding: 5px 20px;
    background: #2388C9;
    position: relative;
    overflow: hidden;
}

.infoSubscribe:before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100%;
    background-image: linear-gradient(
        120deg,
        rgba(255,255,255, 0) 30%,
        rgba(255,255,255, .8),
        rgba(255,255,255, 0) 70%
    );
    top: 0;
    left: -100px;
  animation: shine 3s infinite linear; /* Animation */
}
@keyframes shine {
    0% {left: -100px}
    20% {left: 100%}
    100% {left: 100%}
}

</style>
