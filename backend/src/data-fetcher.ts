import axios, {AxiosError, AxiosResponse, AxiosRequestConfig} from "axios";
import {Prisma, PrismaClient} from './../generated/prisma/client'
import {readFileSync} from "fs";


interface Session_interface {

    meeting_key: number,
    session_key: number,
    location: string,
    date_start: string,
    date_end: string,
    session_type: string,
    session_name: string,
    country_key: number,
    country_code: string,
    country_name: string,
    circuit_key: number,
    circuit_short_name: string,
    gmt_offset: string,
    year: number
}
interface Driver_interface   {
    meeting_key: number,
    session_key: number,
    driver_number: number,
    broadcast_name: string,
    full_name: string,
    name_acronym: string,
    team_name: string,
    team_colour: string,
    first_name: string,
    last_name: string,
    headshot_url: string,
    country_code: string
}
interface Result_interface   	{
    position: number,
    driver_number: number,
    number_of_laps: number,
    point: number,
    dnf: boolean,
    dns: boolean,
    dsq: boolean,
    gap_to_leader: number,
    duration: number,
    meeting_key: number,
    session_key: number

}

function sleep(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
}


function extra_piont(word:number|string|number[]) :number {
    if (typeof word == "string") {
        return Number(word[1])
    }else return 0
}


export class   DataFetcher{
    private baseURL: string = 'https://api.openf1.org/v1';

    async fetchSessions(year_start:number, year_end:number):Promise<Session_interface[]>{
        try {
        const response:AxiosResponse<Session_interface[],AxiosRequestConfig> = await axios.get<Session_interface[]>(`${this.baseURL}/sessions?year%3E=${year_start}&year%3C=${year_end}&session_type=Race`);
        // console.log(response.data);
            console.log("sessions recived!");
        return response.data;
        }catch(error){
            const axiosError = error as AxiosError;
            throw new Error(`failed to fetch sessions: ${axiosError.message}`);
        }
    }

    async fetchDrivers(sessionKey:number): Promise<Driver_interface[]>{
        try {
        const response :AxiosResponse<Driver_interface[],AxiosRequestConfig> = await axios.get<Driver_interface[]>(`${this.baseURL}/drivers?session_key=${sessionKey.toString()}`);
        // console.log(response.data);
            console.log("drivers recived!");
            return response.data;
        }catch(error) {
            const axiosError = error as AxiosError;
            throw new Error(`failed to fetch drivers: ${axiosError.message}`);
        }
    }

    async fetchResults(session_key_start:number, session_key_end:number): Promise<Result_interface[]>{
        try {
            const response:AxiosResponse<Result_interface[],AxiosRequestConfig> = await axios.get<Result_interface[]>(`${this.baseURL}/session_result?session_key>=${session_key_start}&session_key<=${session_key_end}`);
            // console.log(response.data);
            console.log("results recived!");
            await sleep(300);
            return response.data;
        }catch(error){
            const axiosError = error as AxiosError;
            throw new Error(`failed to fetch session result of session ${session_key_start}: ${axiosError.message}`);
        }
    }

    
};


export class DataInserter {
    private prisma: PrismaClient;
    public  grandPrixPoints:number[] =[25,18,15,12,10,8,6,4,2,1];
    public sprintPoints:number[] =[8,7,6,5,4,3,2,1];

    constructor() {
        this.prisma = new PrismaClient();
    }

    async insertDrivers(drivers_list: Driver_interface[]): Promise<void> {
        try {
            if (!drivers_list.length) {
                throw new Error("No drivers found.");
            }
            else{
                await this.prisma.driver.createMany({
                    data :drivers_list.map((driver_member:Driver_interface) => ({

                        name : driver_member.full_name,
                        driver_number : driver_member.driver_number,
                        team_id: driver_member.team_name,
                        nationality: driver_member.country_code

                    })), skipDuplicates: true,
                });
                console.log(`driver was inserted: ${drivers_list.length}`);
            }

        }catch (error) {
            console.error(`failed to insert drivers: ${error}`);
        }
    }

    async insertRaces(session_list:Session_interface[]):Promise<void>{
        try {
            if (!session_list.length) {
                throw new Error("No session found.");
            }else{
                await this.prisma.race.createMany({
                    data : session_list.map((session:Session_interface)=>({
                        id: session.session_key.toString(),
                        season: session.year,
                        date: new Date(session.date_start),
                        circuit_name: session.circuit_short_name,
                        race_type: session.session_name,
                        country: session.country_name,
                        city: session.location
                    }))
                })
                console.log(`session was inserted: ${session_list.length}`);

            }
        }catch(error) {
            console.error(`failed to insert race: ${error}`);
        }
    }

    async addPoints(resultList:Result_interface[]):Promise<void>{
        for (const result of resultList) {
            let point:number
            const session = await this.prisma.race.findUnique({where:{ id : result.session_key.toString(),}});
            if (!session) {
                point = 0;
                result.point = point;
            }
            else if(session.race_type === "Race" && result.position <= 10){
                point= this.grandPrixPoints[result.position-1];
                result.point = point;
            }else if(session.race_type === "Sprint" && result.position <= 8){
                point = this.sprintPoints[result.position-1];
                result.point = point;
            }else {
                point= 0;
                result.point = point;
            }
        }
    }

    async insertResult(result_list:Result_interface[]): Promise<void>{
        try {
            if (!result_list.length) {
                throw new Error("No session found.");
            }else{
                await this.addPoints(result_list);
                await this.prisma.result.createMany({
                    data :  result_list.map((result:Result_interface) =>({
                        race_id :    result.session_key.toString(),
                        driver_number :  result.driver_number,
                        position :    Number(result.position),
                        extra_points: extra_piont(result.gap_to_leader),
                        points: result.point

                    }))
                })
                console.log(`result was inserted: ${result_list.length}`);
            }
        }catch(error) {
            console.error(`failed to insert result: ${error}`);
        }
    }

    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();

    };
}






