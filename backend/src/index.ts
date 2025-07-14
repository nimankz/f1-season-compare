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

console.log("the project works perfectly.")
const grandPrixPoints ={"1st":25, "2nd": 18,"3rd":15,"4th":12,"5th":10,"6th":8,"7th":6,"8th":4,"9th":2,"10th":1 };
const sprintPoints ={"1st":8, "2nd": 7,"3rd":6,"4th":5,"5th":4,"6th":3,"7th":2,"8th":1 };

const myDataFetcher = new DataFetcher();
const myDataInserter= new DataInserter();

async function main():Promise<void> {
    const myDataFetcher = new DataFetcher();
    // const myDataInserter= new DataInserter();
    for (const year of [2023,2024]){
        const sessions : Session_interface[] = await myDataFetcher.fetchSessions(year)
        for (const session of sessions){
            await myDataFetcher.fetchResults(session.session_key)
        }
        // await myDataInserter.insertRaces(sessions);

    }
    myDataInserter.disconnect();

}
main().catch(error => console.error(`main function has an error: ${error}`));


