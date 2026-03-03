import { config } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'prisma/generated/client';
import { randomUUID } from 'crypto';
import { execSync } from 'child_process';

config({ path: '.env', override: true});
config({ path: '.env.test', override: true});

const connectionString = process.env.DATABASE_URL;


function generateUniqueDatabaseUrl(schemaId: string) {
    if(!process.env.DATABASE_URL) throw new Error("Please provide Database url variable");
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('schema', schemaId);
    
    return url.toString();
}

const schemaId = randomUUID();

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

beforeAll(async () => {
    const databaseUrl = generateUniqueDatabaseUrl(schemaId);
    process.env.DATABASE_URL = databaseUrl;

    execSync("npx prisma migrate deploy");
});

afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
    await prisma.$disconnect();
})