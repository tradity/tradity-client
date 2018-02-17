import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  moduleId: module.id,
  selector: 'tradity-chart',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  @Input()
  set values(values: { time: number, totalvalue: number }[]) {
    this.data = [];
    for (const value of values) {
      this.data.push({
        x: new Date(value.time * 1000),
        y: value.totalvalue / 10000
      });
    }
    if (this.chart != null) {
      this.chart.data.datasets[0].data = this.data;
      this.chart.update();
    }
  }
  @ViewChild('canvas') canvas: ElementRef;
  private chart: Chart;
  private data: Chart.ChartPoint[];
  ngAfterViewInit() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            data: this.data,
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