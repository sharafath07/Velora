import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
    .setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject("68dbf06b003c3626d20b");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };