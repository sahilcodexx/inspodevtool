import { Client, Account, Databases } from "appwrite";

export const APPWRITE_ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID = "6a806fa6002023f196d2";
export const APPWRITE_DATABASE_ID = "6a8073ac00388157613c";
export const APPWRITE_COLLECTION_ID = "websiteurl";

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
