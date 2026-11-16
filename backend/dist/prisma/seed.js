"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const user = await prisma.user.upsert({
        where: {
            email: "admin@example.com",
        },
        update: {},
        create: {
            googleId: "test-google-id",
            name: "Admin",
            email: "admin@example.com",
            avatar: null,
        },
    });
    const sender = await prisma.sender.upsert({
        where: {
            userId_email: {
                userId: user.id,
                email: "admin@example.com",
            },
        },
        update: {},
        create: {
            userId: user.id,
            email: "admin@example.com",
            name: "Admin",
        },
    });
    console.log("User created/found:");
    console.log(user);
    console.log("Sender created/found:");
    console.log(sender);
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
