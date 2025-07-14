import axios, {AxiosError, AxiosResponse, AxiosRequestConfig} from "axios";
import {PrismaClient} from './../generated/prisma/client'

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
    points: number,
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

export class   DataFetcher{
    private baseURL: string = 'https://api.openf1.org/v1';

    async fetchSessions(year:number):Promise<Session_interface[]>{
        try {
        const response:AxiosResponse<Session_interface[],AxiosRequestConfig> = await axios.get<Session_interface[]>(`${this.baseURL}/sessions?year=${year}&session_type=Race`);
        // console.log(response.data);
        return response.data;
        }catch(error){
            const axiosError = error as AxiosError;
            throw new Error(`failed to fetch sessions: ${axiosError.message}`);
        }
    }

    async fetchDrivers(meetingKey:number): Promise<Driver_interface[]>{
        try {
        const response :AxiosResponse<Driver_interface[],AxiosRequestConfig> = await axios.get<Driver_interface[]>(`${this.baseURL}/drivers?meeting_key=${meetingKey.toString()}`);
        // console.log(response.data);
        return response.data;
        }catch(error) {
            const axiosError = error as AxiosError;
            throw new Error(`failed to fetch drivers: ${axiosError.message}`);
        }
    }

    async fetchResults(session_key:number): Promise<Result_interface[]>{
        try {
            const response:AxiosResponse<Result_interface[],AxiosRequestConfig> = await axios.get<Result_interface[]>(`${this.baseURL}/session_result?session_key=${session_key}&position<=10`);
            console.log(response.data);
            await sleep(300);
            return response.data;
        }catch(error){
            const axiosError = error as AxiosError;
            throw new Error(`failed to fetch session result of session ${session_key}: ${axiosError.message}`);
        }
    }

    
};


export class DataInserter {
    private prisma: PrismaClient;

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
                        id : driver_member.broadcast_name,
                        name : driver_member.full_name,
                        driver_number : driver_member.driver_number,
                        team_id: driver_member.team_name,
                        nationality: driver_member.country_code
                    })),
                    skipDuplicates:true,
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





    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();

    };
}


// async function main(){
//     const myDataFetcher = new DataFetcher();
//     const myDataInserter= new DataInserter();
//     for (const year of [2023,2024]){
//         const sessions : Session_interface[] = await myDataFetcher.fetchSessions(year)
//         await myDataInserter.insertRaces(sessions);
//
//     }
//     myDataInserter.disconnect();
// }
//
// main().catch(error => console.error(`main() failed: ${error}`));





