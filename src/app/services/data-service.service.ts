import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DateWiseData } from '../model/date-wise-data';
import { GlobalDataSummary } from '../model/global-data';
import { Location } from '../model/location';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private baseUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/`;
  private globalDataUrl: string;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  private apiUrl: string = "http://wirus.herokuapp.com/api";
  private year;
  private month: number;
  private day;

  getDate(date: number){
    if(date < 10){
      return `0${date}`;
    }
    return date;
  }

  constructor(private http: HttpClient) {
    let now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth() +1;
    this.day = now.getDate();
    this.globalDataUrl = `${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.day)}-${this.year}.csv`;
    // this.popolateNewCases();
  }

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let mainData = {};
        let rows = result.split('\n');
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row=>{
          let cols = row.split(/,(?=\S)/);
          let country = cols[1];
          cols.splice(0, 4);
          mainData[country] = [];
          cols.forEach((value, index)=>{
            let dw: DateWiseData = {
              cases: +value,
              country: country,
              date: new Date(Date.parse(dates[index]))
            }
          mainData[country].push(dw);
          })
        })
        return mainData;
      })
    );
  }

  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)

          let cs = {
            country: cols[3],
            cases: +cols[7],
            deaths: +cols[8]
          };
          let temp: GlobalDataSummary = raw[cs.country];
          if (temp) {
            temp.cases += cs.cases;
            temp.deaths += cs.deaths;

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }
        })
        return <GlobalDataSummary[]>Object.values(raw);
      })
      ,
      catchError((error: HttpErrorResponse)=>{
        if(error.status == 404){
          if(this.day == 1){
            let now = new Date();
            now.setDate(0);
            this.year = now.getFullYear();
            this.month = now.getMonth();
            this.day = now.getDate();
          }else{
            this.day--;
          }
          this.globalDataUrl = `${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.day)}-${this.year}.csv`;
          console.log(this.globalDataUrl);
          return this.getGlobalData();
        }
      })
    )
  }
  getLocationStats(): Observable<Location[]>{
    return this.http.get<Location[]>(this.apiUrl);
  }

  populateNewCases(){
    return this.http.get(this.apiUrl, { responseType: 'text' }).pipe(
      map(result => {
        let rows = result.split('}');
        let world: string = rows[rows.length-5];
        console.log(world);
        let newCases = +world.match(/[0-9]+/);
        return newCases;
      })
    );
  }
}
