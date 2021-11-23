import TelegramBot, {ChatId, Message} from "node-telegram-bot-api";
import {TournamentScrapper} from "../scrapper/scrapper.service";
import {CronJob} from "cron";
import {DatabaseService} from "../database/database.service";
import {TournamentQueryBuilder} from "../tournament-query.builder";
import {Tournament} from "../tournament";

require('dotenv').config();
const token = process.env.BOT_TOKEN ?? "";
const telegramBot = new TelegramBot(token, {polling: true});

const tournamentFinderBot = (telegramBot: TelegramBot) => ({
    startBot: async (): Promise<void> => {
        await bot.addUserRegistrationListener();
        bot.periodicallyPollTournaments();
    },

    addUserRegistrationListener: async (): Promise<void> => {
        telegramBot.onText(/\/start/, bot.registerUser);
    },
    registerUser: async ({chat}: Message): Promise<void> => {
        const {userInfos} = await DatabaseService.read();
        if (!userInfos.some(({chatId}) => chatId === chat.id)) {
            userInfos.push({chatId: chat.id, query: TournamentQueryBuilder.build(30, '92170', 0), sentResultsId: []});
            await DatabaseService.write({userInfos});
            telegramBot.sendMessage(chat.id, "Utilisateur enregistré ! Les infos des tournois seront envoyées")
        }
    },

    periodicallyPollTournaments: (): void => {
        const cronJob = new CronJob({
            cronTime: '0 */1 * * * *',
            onTick: bot.refreshTournaments
        });
        cronJob.start();
    },

    refreshTournaments: async () => {
        const {userInfos} = await DatabaseService.read();
        for (const user of userInfos) {
            const tournaments = await TournamentScrapper.fetchTournaments(user.query);
            tournaments.filter(({competitionId}) => !user.sentResultsId.includes(competitionId))
                .forEach(tournament => {
                    bot.notify(user.chatId, tournament);
                    user.sentResultsId?.push(tournament.competitionId);
                })

        }
        await DatabaseService.write({userInfos});
    },

    notify: async (chatId: ChatId, tournament: Tournament): Promise<void> => {
        const {
            name,
            location,
            distance,
            startDate,
            endDate,
            discipline,
            sublevel,
            number
        } = tournament;
        await telegramBot.sendMessage(chatId,
            `${name}
A ${location} (${Math.round(distance)} km)
Du ${startDate} au ${endDate}
Disciplines : ${discipline}
Niveaux : ${sublevel}
Details : https://www.myffbad.fr/tournoi/details/${number}`);
    }
});

export const bot = tournamentFinderBot(telegramBot);
