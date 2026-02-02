<script>
import { Line } from "vue-chartjs";
import { useNamespacedState, useNamespacedGetters } from "vuex-composition-helpers";
import { computed, watch } from "@vue/composition-api";
import moment from "moment";
import INSTANCE from "../namespace";

export default {
  extends: Line,
  props: [
    'startDate',
    'endDate',
    'type',
  ],
  data() {
    return {
      gradient: null,
    }
  },
  setup: (props, context) => {
    const {
      instancemetrics,
      cpumetrics,
      rammetrics,
      inputoutput,
      inputin,
      diskread,
      diskwrite,
    } = useNamespacedState("INSTANCEDETAIL", [
      props.type,
    ]);
    const { getInstanceDetail } = useNamespacedGetters(INSTANCE, [
      "getInstanceDetail",
    ]);
    const { root_disk_package } = getInstanceDetail.value;
    const { name } = root_disk_package.type;

    const chartdata = {
      labels: [],
      datasets: [
        {
          label: "",
          borderColor: '#F2994A',
          pointBackgroundColor: "#fffff",
          pointStrokeColor : "#fff",
          pointBorderWidth: 10,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 10,
          pointDotStrokeWidth : 10,
          pointRadius: 0,
          borderWidth: 4,
          data: [],
          backgroundColor: [],
          fill: true,
        },
      ],
    };
    

    return {
      cpumetrics,
      instancemetrics,
      rammetrics,
      inputoutput,
      inputin,
      diskread,
      diskwrite,
      chartdata: chartdata,
      options: {
        showLines: true,
        legend: {
          display: false,
        },
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        responsive: true,
        layout: {
          padding: {
            top: 50
          }
        },
      
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                zeroLineWidth: 0,
              },
              display: true,
              scaleLabel: {
                display: true,
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 8,
                callback: (val) => {
                  return moment(new Date(val)).format("DD HH:mm");
                },
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                zeroLineWidth: 1,
              },
              ticks: {
                min: 0,
                max: 100,
                stepSize: 20,
                callback:(val) => {
                 return props.type == 'inputin' || props.type == 'inputoutput' ? (
                   parseFloat(val).toFixed(0) + ' MB/s'
                 ) : props.type == 'diskread' || props.type == 'diskwrite' ? (
                   parseFloat(val).toFixed(0) + ' IOPS'
                 ) : (
                   parseFloat(val).toFixed(0) + ' %'
                 )
                },
              },
              display: true,
              scaleLabel: {
                display: true,
              },
            },
          ],
        },
        hover: {
          mode: "index",
          intersect: false,
        },
        tooltips: {
          displayColors: false,
          mode: "index",
          intersect: false,
          yAlign: "bottom",
          xAlign: "center",
          titleAlign: "left",
          caretSize: 0,
          custom: function (tooltipModel) {
            tooltipModel.titleMarginBottom = 0;
            tooltipModel.height = 32;
          },
          callbacks: {
            title: function (val) {
              return props.type == 'inputin' || props.type == 'inputoutput'
                ? (
                  parseFloat(val[0].yLabel).toFixed(2) + ' MB/s'
                )
                : props.type == 'diskread' || props.type == 'diskwrite'
                  ? (
                    parseFloat(val[0].yLabel).toFixed(2) + ' IOPS'
                  )
                  : (
                    parseFloat(val[0].yLabel).toFixed(2) + ' %'
                  )
            },
            label: (val) => {
              return moment(new Date(val.xLabel)).format("DD/MM/YY HH:mm");
            },
          },
        },

      },
    };
  },
  mounted() {
    this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 500)

    this.gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.gradient.addColorStop(0, this.type == 'cpumetrics'
      ? 'rgba(242,153,74,0.5)'
      : this.type == 'rammetrics'
        ? 'rgba(44, 148, 210, 0.5)'
        : this.type == 'inputoutput' || this.type == 'inputin'
          ? 'rgba(116, 89, 217, 0.5)'
          : this.type == 'diskread' || this.type == 'diskwrite'
            ? '#27AE6080'
            : 'rgba(116, 89, 217, 0.5)'
    );
    // MAX RANGE
    this.options.scales.yAxes[0].ticks.max = this.type == 'diskread' || this.type == 'diskwrite'
        ? 4500
        : 100
    // STEP SIZE
    this.options.scales.yAxes[0].ticks.stepSize = this.type == 'diskread' || this.type == 'diskwrite'
        ? 4500 / 4
        : 100 / 4
    // BORDER COLOR
    this.chartdata.datasets[0].borderColor = this.type == 'inputin' || this.type == 'inputoutput'
      ? '#7459D9'
      : this.type == 'cpumetrics'
        ? '#F2994A'
        : this.type == 'diskwrite' || this.type == 'diskread'
          ? '#27AE60'
          : '#2C94D2'
    // GRADIENT
    this.chartdata.datasets[0].backgroundColor = this.gradient

    this.renderChart(this.chartdata, this.options);
  },
  watch: {
    cpumetrics: function (metrics) {
      const dates = metrics[0].values.map(data => data.date_time)
      const datas = metrics[0].values.map(data => data.value)
      const start = dates.indexOf(moment(this.startDate).format())
      const end = dates.indexOf(moment(this.endDate).format())
      const label = dates.slice(start, dates.length - 1)
      const value = datas.slice(start, datas.length - 1)
      if (moment(metrics[metrics.length - 1].date_time).format('DD-MM HH') == moment(this.startDate).format('DD-MM HH')) {
        this.chartdata.labels = dates
        this.chartdata.datasets[0].data = datas
        this.$data._chart.update()
      } else if(label.length !== 0){
        this.chartdata.labels = label
        this.chartdata.datasets[0].data = value
        this.$data._chart.update()
      }
    },
    rammetrics: function (metrics) {
      const dates = metrics[0].values.map(data => data.date_time)
      const datas = metrics[0].values.map(data => data.value)
      const start = dates.indexOf(moment(this.startDate).format())
      const end = dates.indexOf(moment(this.endDate).format())
      const label = dates.slice(start, dates.length - 1)
      const value = datas.slice(start, datas.length - 1)
      if (moment(metrics[metrics.length - 1].date_time).format('DD-MM HH') == moment(this.startDate).format('DD-MM HH')) {
        this.chartdata.labels = dates
        this.chartdata.datasets[0].data = datas
        this.$data._chart.update()
      } else if(label.length !== 0){
        this.chartdata.labels = label
        this.chartdata.datasets[0].data = value
        this.$data._chart.update()
      }
    },
    inputin: function (metrics) {
      const dates = metrics[0].values.map(data => data.date_time)
      const datas = metrics[0].values.map(data => data.value / 1000000)
      const start = dates.indexOf(moment(this.startDate).format())
      const end = dates.indexOf(moment(this.endDate).format())
      const label = dates.slice(start, dates.length - 1)
      const value = datas.slice(start, datas.length - 1)
      if (moment(metrics[metrics.length - 1].date_time).format('DD-MM HH') == moment(this.startDate).format('DD-MM HH')) {
        this.chartdata.labels = dates
        this.chartdata.datasets[0].data = datas
        this.$data._chart.update()
      } else if(label.length !== 0){
        this.chartdata.labels = label
        this.chartdata.datasets[0].data = value
        this.$data._chart.update()
      }
    },
    inputoutput: function (metrics) {
      const dates = metrics[0].values.map(data => data.date_time)
      const datas = metrics[0].values.map(data => data.value / 1000000)
      const start = dates.indexOf(moment(this.startDate).format())
      const end = dates.indexOf(moment(this.endDate).format())
      const label = dates.slice(start, dates.length - 1)
      const value = datas.slice(start, datas.length - 1)
      if (moment(metrics[metrics.length - 1].date_time).format('DD-MM HH') == moment(this.startDate).format('DD-MM HH')) {
        this.chartdata.labels = dates
        this.chartdata.datasets[0].data = datas
        this.$data._chart.update()
      } else if(label.length !== 0){
        this.chartdata.labels = label
        this.chartdata.datasets[0].data = value
        this.$data._chart.update()
      }
    },
    diskread: function (metrics) {
      const metricValues = metrics.map(data => data.values)
      const dates = metrics[0].values.map(data => data.date_time)
      const datas = metricValues[0].map(data => data.value)
      const start = dates.indexOf(moment(this.startDate).format())
      const end = dates.indexOf(moment(this.endDate).format())
      const label = dates.slice(start, dates.length - 1)
      const value = datas.slice(start, datas.length - 1)
      if (moment(metrics[metrics.length - 1].date_time).format('DD-MM HH') == moment(this.startDate).format('DD-MM HH')) {
        this.chartdata.labels = dates
        this.chartdata.datasets[0].data = datas
        this.$data._chart.update()
      } else if(label.length !== 0){
        this.chartdata.labels = label
        this.chartdata.datasets[0].data = value
        this.$data._chart.update()
      }
    },
    diskwrite: function (metrics) {
      const metricValues = metrics.map(data => data.values)
      const dates = metrics[0].values.map(data => data.date_time)
      const datas = metricValues[0].map(data => data.value)
      const start = dates.indexOf(moment(this.startDate).format())
      const end = dates.indexOf(moment(this.endDate).format())
      const label = dates.slice(start, dates.length - 1)
      const value = datas.slice(start, datas.length - 1)
      if (moment(metrics[metrics.length - 1].date_time).format('DD-MM HH') == moment(this.startDate).format('DD-MM HH')) {
        this.chartdata.labels = dates
        this.chartdata.datasets[0].data = datas
        this.$data._chart.update()
      } else if(label.length !== 0){
        this.chartdata.labels = label
        this.chartdata.datasets[0].data = value
        this.$data._chart.update()
      }
    },
  },
};
</script>
