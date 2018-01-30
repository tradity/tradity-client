import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  moduleId: module.id,
  selector: 'tradity-chart',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  @Input() values: [number, number][];
  @ViewChild('canvas') canvas: ElementRef;
  private chart: Chart;
  public lineChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  chartLabels = ['January', 'February', 'Mars', 'April'];
  data: Chart.ChartData = { datasets: this.lineChartData, labels: this.chartLabels };
  ngAfterViewInit() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            data: [
              {
                x: new Date(Date.now() - 3600000 * 2),
                y: 20
              },
              {
                x: new Date(Date.now() - 3600000),
                y: 10
              },
              {
                x: new Date(),
                y: 15
              }
            ],
            fill: false,
            borderColor: "#F1592A",
            borderWidth: 1,
            pointRadius: 0,
            pointHitRadius: 6,
            pointHoverBackgroundColor: "white",
            pointHoverBorderColor: "white"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: "time",
            gridLines: {
              lineWidth: 0.3,
              color: "#9B9B9B",
              drawBorder: false
            },
            ticks: {
              fontColor: "white",
              fontFamily: "Lato"
            }
          }],
          yAxes: [{
            type: "linear",
            gridLines: {
              lineWidth: 0.3,
              color: "#9B9B9B",
              drawBorder: false
            },
            ticks: {
              fontColor: "#F1592A",
              fontFamily: "Lato"
            }
          }]
        }
      }
    });
  }
}