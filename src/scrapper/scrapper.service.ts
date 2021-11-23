import axios from "axios";
import {Tournament} from "../tournament";
import {TournamentQueryResponse} from "../tournament-query-response";
import {TournamentQuery} from "../tournament-query";

import * as https from "https";

export const TournamentScrapper = {
    fetchTournaments: async (query: TournamentQuery): Promise<Tournament[]> => {
        // const query = TournamentQueryBuilder.build(30, '92170', 0);
        return TournamentScrapper.recurseFetch(query, []);
    },
    recurseFetch: async (query: TournamentQuery, previousResults: Tournament[]): Promise<Tournament[]> => {
        try {
            const {data} = await axios.post<TournamentQueryResponse>("https://www.myffbad.fr/api/search/", query,
                {
                    headers: {
                        'Verify-Token': 'cae071324c1a7b7ef4af4748e178d16c59e4cdd8de28d73d2d2be2f91ab92b85.1637343196753',
                        'Caller-URL': '/api/search/'
                    },
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                })

            const fetchedTournaments = [...previousResults, ...data.tournaments]

            if (data.currentPage < data.totalPage) {
                return TournamentScrapper.recurseFetch({
                    ...query,
                    offset: fetchedTournaments.length
                }, fetchedTournaments)
            }

            return fetchedTournaments;
        } catch (err) {
            console.error(err);
        }

        return [];

    }
}
