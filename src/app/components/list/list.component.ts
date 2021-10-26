import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { Location } from 'src/app/model/location';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  loading = true;
  locations: Location[] = [];
  country: any;
  totalReportedCases: number;
  totalReportedDeaths: number;
  totalNewCases: number;

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {
    this.service.getLocationStats().subscribe(
      {
        next: (response) => {
          this.locations = response;
          let tempLocation = this.locations.filter(res =>{
            return res.country.toLocaleLowerCase().match('world');
          });
          this.totalReportedCases = tempLocation[0].totalCases;
          this.totalReportedDeaths = tempLocation[0].totalDeaths;
          this.totalNewCases = tempLocation[0].newCases;
      },
        complete: ()=> {
          this.loading = false;
      }
    }
    )
  }
  search(){
    if(this.country == ""){
      this.ngOnInit();
    }else{
      this.locations = this.locations.filter(res =>{
        return res.country.toLocaleLowerCase().match(this.country.toLocaleLowerCase());
      });
    }
  }
  key: string = 'location'; 
  reverse: boolean = true;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }
}
