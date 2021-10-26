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
  loading = true;
  totalCases = 0;
  totalDeaths = 0;
  newCases = 0;
  globalData: GlobalDataSummary[];
  datatable = [];
  chart = {
    PieChart : ChartType.PieChart,
    ColumnChart : ChartType.ColumnChart,
    height: 500,
    columns: [],
    options: {
      animation:{
        duration: 1000,
        easing: 'out'
      },
      is3D: true
    }
  }

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next: (result) => {
          this.globalData = result;
          result.forEach(cs => {
            if (!Number.isNaN(cs.cases)) {
              this.totalCases += cs.cases;
              this.totalDeaths += cs.deaths;
            }
          })
          this.initChart('c');
        },
        complete: ()=> {
          this.loading = false;
        }
      }
    )
  }

  initChart(caseType: string) {
    this.datatable = [];
    // this.datatable.push(["Country", "Cases"]);
    if(caseType == 'd'){
      this.chart.columns=["Country", "Deaths"];      
    } else {
      this.chart.columns=["Country", "Cases"];
    }
    
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
  }

  updateChart(input: HTMLInputElement): void {
    this.initChart(input.value);
  }
}