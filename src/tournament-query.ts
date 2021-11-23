export type TournamentQuery = {
    type: string;
    offset: number;
    postalCode: string;
    distance: number;
    sublevels: string[];
    categories: string[];
    dateFrom: Date;
    dateTo: Date;
    sort: string;
}
