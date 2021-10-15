import { Component, OnInit } from '@angular/core';
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


  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next : (result)=>{
          console.log(result);
          this.globalData = result;
          result.forEach(cs => {
            if(!Number.isNaN(cs.cases)){
              this.totalCases += cs.cases;
              this.totalDeaths += cs.deaths;
            }
          })
          
        }
      }
    )
  }

}
