import axios, {AxiosError, AxiosResponse, AxiosRequestConfig} from "axios";
import {PrismaClient} from '@prisma/client';

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
interface Driver   {
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
interface CostumReject {
    header: string,
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

    async fetchDrivers(meetingKey:number): Promise<Driver[]>{
        try {
        const response :AxiosResponse<Driver[],AxiosRequestConfig> = await axios.get<Driver[]>(`${this.baseURL}/drivers?meeting_key=${meetingKey.toString()}`);
        // console.log(response.data);
        return response.data;
        }catch(error) {
            const axiosError = error as AxiosError;
            throw new Error(`failed to fetch drivers: ${axiosError.message}`);
        }
    }
}

const mydataFetcher = new DataFetcher();
mydataFetcher.fetchSessions(2023);
mydataFetcher.fetchDrivers(1224);