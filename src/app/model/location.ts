export class Location {
    country: string;
    newCases: number;
    totalCases: number;
    deaths: number;
    totalDeaths: number;
    population: number;

    stringencyIndex: string;
    cardiovascDeathRate: string;
    totalVaccinationsPerHundred: string;
    peopleFullyVaccinatedPerHundred: string;
    lifeExpectancy: string;

    constructor(country, newCases, totalCases, deaths, totalDeaths, population, stringencyIndex, cardiovascDeathRate, totalVaccinationsPerHundred, peopleFullyVaccinatedPerHundred, lifeExpectancy){
        this.lifeExpectancy = lifeExpectancy;

    }
}
