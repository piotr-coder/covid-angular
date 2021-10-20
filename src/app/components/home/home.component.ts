import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { GlobalDataSummary } from 'src/app/model/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalCases = 0;
  totalDeaths = 0;
  globalData: GlobalDataSummary[];
  datatable = [];
  chart = {
    PieChart : ChartType.PieChart,
    ColumnChart : ChartType.ColumnChart,
    height: 500,
    options: {
      animation:{
        duration: 1000,
        easing: 'out'
      },
      is3D: true
    }
  }

  constructor(private dataService: DataServiceService) { }

  initChart(caseType: string) {
    this.datatable = [];
    // this.datatable.push(["Country", "Cases"]);
    this.globalData.forEach(cs => {
      let value: number;
      if (caseType == 'c') {
        if (cs.cases > 2000) {
          value = cs.cases;
        }
      }
      if (caseType == 'd') {
        if (cs.deaths > 100) {
          value = cs.deaths
        }
      }
      this.datatable.push([
        cs.country, value
      ])
    })
    console.log(this.datatable[2]);
  }
  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next: (result) => {
          console.log(result);
          this.globalData = result;
          result.forEach(cs => {
            if (!Number.isNaN(cs.cases)) {
              this.totalCases += cs.cases;
              this.totalDeaths += cs.deaths;
            }
          })
          this.initChart('c');
        }
      }
    )
  }
  updateChart(input: HTMLInputElement): void {
    this.initChart(input.value);
  }
}
