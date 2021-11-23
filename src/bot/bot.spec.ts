import {bot} from "./bot";
import {Chat, Message} from "node-telegram-bot-api";
import {DatabaseService} from "../database/database.service";

jest.mock("../database/database.service", () => ({
    DatabaseService: {

        read: jest.fn(),
        write: jest.fn()
    }
}));

jest.mock("node-telegram-bot-api");

describe("Bot", () => {
    it("should register a new user", async () => {
        // Given
        (DatabaseService.read as jest.Mock).mockResolvedValueOnce({userInfos: []})

        // When
        await bot.registerUser({chat: {id: 1} as Chat} as Message);

        // Then
        expect(DatabaseService.write).toHaveBeenCalledWith({userInfos: [{chatId: 1}]})
    });

    it("should not register an already registered user", async () => {
        // Given
        (DatabaseService.read as jest.Mock).mockResolvedValueOnce({userInfos: [{chatId: 1}]})

        // When
        await bot.registerUser({chat: {id: 1} as Chat} as Message);

        // Then
        expect(DatabaseService.write).not.toHaveBeenCalled();
    });
})
