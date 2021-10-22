import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateWiseData } from '../model/date-wise-data';
import { GlobalDataSummary } from '../model/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/10-21-2021.csv`;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  constructor(private http: HttpClient) { }

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
        // console.log(mainData);
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
        // console.log(rows);
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
    )
  }
}
