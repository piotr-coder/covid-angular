import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateWiseData } from 'src/app/model/date-wise-data';
import { GlobalDataSummary } from 'src/app/model/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  loading = true;
  data;
  countries: string[] = [];
  totalCases: number = 0;
  totalDeaths: number = 0;
  dateWiseData;
  selectedCountryData: DateWiseData[];
  dataTable = [];
  chart = {
    type : ChartType.ComboChart,
    columns: ['Month', 'Cases'],
    options: {
      height: 500,
      width: 1000,
      hAxis: {
        title: 'Month'
     },
     vAxis:{
        title: 'Cases'
     },
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
      this.service.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map(result =>{
          this.data = result;
          this.data.forEach(cs => {
            this.countries.push(cs.country)    
        })
        }))
    ).subscribe(
      {
        complete : ()=>{
          this.updateValues('Poland');
          this.loading = false;
        }
      }
    )}

  updateChart(){
    this.dataTable = [];
    // this.dataTable.push(['Cases', 'Data']);
    this.selectedCountryData.forEach(cs => {
      this.dataTable.push([cs.date, cs.cases]);
    })
  }

  updateValues(country: string){
    this.data.forEach(cs => {
      if(cs.country == country){
        this.totalCases = cs.cases;
        this.totalDeaths = cs.deaths;
      }
    })
    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
  }
}
