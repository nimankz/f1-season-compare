import axios, {AxiosError, AxiosResponse, AxiosRequestConfig} from "axios";
import {PrismaClient} from './../generated/prisma/client'

interface Session {

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



class  DataFetcher{
    private baseURL: string = 'https://api.openf1.org/v1';

    async fetchSessions(year:number): Promise<Session[]>{
        try {
        const response:AxiosResponse<Session[],AxiosRequestConfig> = await axios.get<Session[]>(`${this.baseURL}/sessions?year=${year}`);
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
};


class DataInserter {
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


    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();

    };
}


async function main(){
    const mydataFetcher = new DataFetcher();
    const myInserter = new DataInserter();
    for (const year of [2023,2024]){
        const sessions : Session[] = await mydataFetcher.fetchSessions(year)
        const meetingKeys : number[] = [...new Set(sessions.map(x=>x.meeting_key))];
        for (const meetingKey of meetingKeys){
            const drivers:Driver_interface[] = await mydataFetcher.fetchDrivers(meetingKey);
            await myInserter.insertDrivers(drivers);
        }
    }
    myInserter.disconnect();
}

main().catch(error => console.error(`main() failed: ${error}`));