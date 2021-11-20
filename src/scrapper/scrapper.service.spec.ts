import {TournamentScrapper} from "./scrapper.service";

describe("Scrapper", () => {
    it("should query MyFFBad", async () => {
        // Given

        // When
        const result = await TournamentScrapper.fetchTournaments();

        // Then
        console.log({result});
        expect(result).toBeDefined();
    })
})
