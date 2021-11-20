import {ChatId} from "node-telegram-bot-api";
import {TournamentQuery} from "./tournament-query";

export type UserInfos = {
    chatId: ChatId;
    query: TournamentQuery;
    sentResultsId: number[];
}
