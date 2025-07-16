import {DataFetcher,DataInserter} from './data-fetcher'

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

console.log("the project started perfectly.")


const myDataFetcher = new DataFetcher();
const myDataInserter= new DataInserter();

async function main():Promise<void> {
    const myDataFetcher = new DataFetcher();
    const myDataInserter= new DataInserter();
    const sessions : Session_interface[] = await myDataFetcher.fetchSessions(2023,2024)
    const first_session:number = sessions[0].session_key
    const last_session:number = sessions[sessions.length-1].session_key

    const drivers_2023 : Driver_interface[]= await myDataFetcher.fetchDrivers(first_session)
    const drivers_2024 : Driver_interface[]= await myDataFetcher.fetchDrivers(last_session)
    const results: Result_interface[] = await myDataFetcher.fetchResults(first_session,last_session)

    await myDataInserter.insertDrivers(drivers_2023);
    await myDataInserter.insertDrivers(drivers_2024);
    await myDataInserter.insertRaces(sessions);
    await myDataInserter.insertResult(results);



    myDataInserter.disconnect();

}
main().catch(error => console.error(`main function has an error: ${error}`));


