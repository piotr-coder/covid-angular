import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
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
  data: any;
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

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {
    merge(
      this.service.getGlobalData().pipe(
        map(result => {
          this.data = result;
          this.data.forEach(cs => {
            if (!Number.isNaN(cs.cases)){
              this.totalCases += cs.cases;
              this.totalDeaths += cs.deaths;
            }  
        })})
      ),
      this.service.populateNewCases().pipe(
        map(result => {
          this.newCases = result;
        })
      )
    ).subscribe(
      {
        complete: ()=> {
          this.initChart('c');
          this.loading = false;
        }
      }
    )
  }

  initChart(caseType: string) {
    this.datatable = [];
    if(caseType == 'd'){
      this.chart.columns=["Country", "Deaths"];      
    } else {
      this.chart.columns=["Country", "Cases"];
    }
    
    this.data.forEach(cs => {
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