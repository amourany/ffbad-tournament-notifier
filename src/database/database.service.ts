import {JSONFile, Low} from "lowdb";
import {Users} from "./users";

require('dotenv').config();
const file = process.env.DB_FILE ?? "";
const adapter = new JSONFile<Users>(file);
const db = new Low<Users>(adapter);

const databaseService = (db: Low<Users>) => ({
    read: async (): Promise<Users> => {
        await db.read();
        return db.data || {userInfos: []};
    },

    write: async (users: Users): Promise<void> => {
        db.data = users;
        await db.write();
    }
});

export const DatabaseService = databaseService(db);
