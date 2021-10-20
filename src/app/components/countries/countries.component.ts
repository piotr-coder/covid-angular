import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/model/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[];
  countries: string[] = [];
  totalCases: number = 0;
  totalDeaths: number = 0;

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {
    this.service.getGlobalData().subscribe(result=>{
      this.data = result;
      this.data.forEach(cs => {
        this.countries.push(cs.country)
      })
    })
  }

  updateValues(country: string){
    this.data.forEach(cs => {
      if(cs.country == country){
        this.totalCases = cs.cases;
        this.totalDeaths = cs.deaths;
      }
    })
  }
}
