
import Vue from 'vue'
import moment from 'moment'
import faker from 'faker'
import lodash from 'lodash'
import {reactive} from '@vue/composition-api'
interface ChartInterface extends Vue {
    renderChart: any;
}
type gradient = CanvasGradient | string
export const useGraph = (props: any, context: any) => {
    const generateOptions = (min: number, max: number, stepsize: number, aspectRatio: number, callback: (value: number) => string, tooltipcolor: string): any => {
        return {
            legend: {
                display: false,
            },
            maintainAspectRatio: true,
            aspectRatio: aspectRatio,
            responsive: true,
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
                    },
                ],
                yAxes: [
                    {
                        gridLines: {
                            display: true,
                            zeroLineWidth: 1,
                        },
                        ticks: {
                            min: min,
                            max: max,
                            stepSize: stepsize,
                            callback: callback,
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                        },
                    },
                ],
            },
            //untuk menampilkan tooltip di tengah
            tooltips: {
                yAlign: "bottom",
                xAlign: "center",
                titleAlign: "left",
                caretSize: 0,
                custom: function (tooltipModel: any) {
                    tooltipModel.titleMarginBottom = 0;
                    tooltipModel.height = 21;
                    tooltipModel.backgroundColor = tooltipcolor;
                },
                callbacks: {
                    title: function (data: any) {
                        return "" + data[0].yLabel;
                    },
                    label: () => "",
                },
            },
        };
    };
    const generateGradient = (
        idcanvas: string,
        rgba0: string,
        rgba1: string,
        data: string,
        options: string
    ) => {
        const canvas: HTMLCanvasElement | null = document.querySelector(
            `#${idcanvas} canvas`
        );
        const contex2d = canvas?.getContext("2d");
        const gradientFill = contex2d?.createLinearGradient(0, 0, 0, 400);
        gradientFill?.addColorStop(0, rgba0);
        gradientFill?.addColorStop(1, rgba1);

        return gradientFill || ''


    };

    const division = Math.floor(100 / 8)
    const generatelabel = () => {
        const labels = Array(100).fill(true).map((v, i) => moment().add(1 + i, 'days').format('HH:mm')).filter((v, i) => i % division == 0)
        return labels
    }

    const generateDatalength = (maxvalue:number=100) => {
        let datalength = Array(100).fill('').map(x => faker.random.number(maxvalue))
        const newarray = []
        while (datalength.length) newarray.push(datalength.splice(0, 8))
        datalength = newarray.map(x => lodash.sum(x) / x.length)
        return datalength
    }

    const generatedata = (labels: Array<string>,backgroundColor:string, borderColor: string, maxvalue: number = 100)=>{
        return reactive({
            labels: labels,
            datasets: [
              {
                backgroundColor,
                borderColor,
                data: generateDatalength(maxvalue),
                fill: true,
              },
            ],
          });
    }
    return {
        generateOptions,
        generateGradient,
        generatelabel,
        generateDatalength,
        generatedata
    }
}