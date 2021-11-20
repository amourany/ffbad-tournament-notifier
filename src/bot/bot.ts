import TelegramBot, {ChatId} from "node-telegram-bot-api";
import {TournamentScrapper} from "../scrapper/scrapper.service";
import {CronJob} from "cron";

require('dotenv').config();
const token = process.env.BOT_TOKEN ?? "";

export class TournamentFinderBot {
    chatId: ChatId;
    telegramBot: TelegramBot;
    sentTournamentsId: number[];

    constructor() {
        this.telegramBot = new TelegramBot(token, {polling: true})
        this.chatId = "";
        this.sentTournamentsId = [];
    }

    startBot = (): void => {
        this.addUserRegistrationListener();
        this.periodicallyPollTournaments();
    }

    addUserRegistrationListener = (): void => {
        this.telegramBot.onText(/\/start/, ({chat}) => {
            this.chatId = chat.id;
            this.telegramBot.sendMessage(chat.id, "Utilisateur enregistré ! Les infos des tournois seront envoyées")
        });
    }

    periodicallyPollTournaments = (): void => {
        const cronJob = new CronJob({
            cronTime: '0 */1 * * * *',
            onTick: this.pollNewTournaments
        });
        cronJob.start();
    }

    pollNewTournaments = async (): Promise<void> => {
        const tournaments = await TournamentScrapper.fetchTournaments();
        for (const tournament of tournaments) {
            const {
                name,
                location,
                distance,
                startDate,
                endDate,
                discipline,
                sublevel,
                number,
                competitionId
            } = tournament;
            if (!this.sentTournamentsId.includes(competitionId)) {
                await this.telegramBot.sendMessage(this.chatId,
                    `${name}
A ${location} (${Math.round(distance)} km)
Du ${startDate} au ${endDate}
Disciplines : ${discipline}
Niveaux : ${sublevel}
Details : https://www.myffbad.fr/tournoi/details/${number}`);
                this.sentTournamentsId.push(competitionId);
            }
        }
    }

}
