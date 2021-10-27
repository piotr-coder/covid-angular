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
  newCases: number = 0;
  dateWiseData;
  selectedCountryData: DateWiseData[];
  dataTableTotal = [];
  dataTableNewCases = [];
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
    this.dataTableTotal = [];
    this.selectedCountryData.forEach(cs => {
      this.dataTableTotal.push([cs.date, cs.cases]);
    })

    this.dataTableNewCases = [];
    for(let i: number = 150; i<this.selectedCountryData.length; i++){
      let currentDay: DateWiseData = this.selectedCountryData[i];
      let previousDay: DateWiseData = this.selectedCountryData[i-1];
      let cases: number = currentDay.cases - previousDay.cases;
      if (currentDay.cases <= 0 && cases <= 0){
        cases = 0; 
      }
      this.dataTableNewCases.push([currentDay.date, cases]);
    }

  }

  updateValues(country: string){
    this.data.forEach(cs => {
      if(cs.country == country){
        this.totalCases = cs.cases;
        this.totalDeaths = cs.deaths;
      }
    })
    this.selectedCountryData = this.dateWiseData[country];
    this.newCases=this.selectedCountryData[this.selectedCountryData.length-1].cases
                 -this.selectedCountryData[this.selectedCountryData.length-2].cases;
    this.updateChart();
  }
}
