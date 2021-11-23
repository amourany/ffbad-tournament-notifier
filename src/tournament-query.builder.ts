import {TournamentQuery} from "./tournament-query";

const baseQuery: TournamentQuery = {
    type: "TOURNAMENT",
    sort: "dateFrom-ASC",
    categories: [], dateFrom: new Date(), dateTo: new Date(), distance: 0, offset: 0, postalCode: "", sublevels: []
}

export const TournamentQueryBuilder = {
    build: (distance: number, postalCode: string, offset: number): TournamentQuery => {
        const today: Date = new Date();
        const inTwoYear: Date = new Date(today.getFullYear() + 2, today.getMonth(), today.getDay());

        return {
            ...baseQuery,
            postalCode,
            distance,
            offset,
            dateTo: inTwoYear,
            dateFrom: today
        }
    }
}
