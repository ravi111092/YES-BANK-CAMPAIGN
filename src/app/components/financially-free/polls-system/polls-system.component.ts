import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
@Component({
  selector: 'app-polls-system',
  templateUrl: './polls-system.component.html',
  styleUrls: ['./polls-system.component.css']
})
export class PollsSystemComponent implements OnInit {
  chartReady = true;
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['A', 'B', 'C', 'D'];
  public barChartColors:Array<any> = [{
    backgroundColor: ['#337ab7','#337ab7','#337ab7','#337ab7']
 }];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 85], label: 'Polls' },
    // { data: [28, 48, 40, 19], label: 'Series B' }
  ];



  constructor() { }

  ngOnInit() {
  }

}
