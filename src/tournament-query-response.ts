import {Tournament} from "./tournament";

export type TournamentQueryResponse = {
    totalPage: number;
    currentPage: number;
    tournaments: Tournament[];
}
