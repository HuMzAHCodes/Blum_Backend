import "dotenv/config";
import app from "./app.js";
import prisma from "./lib/prisma.js";
const PORT = process.env.PORT || 5000;
async function bootstrap() {
    try {
        // Verify DB connection
        await prisma.$connect();
        console.log("💾 Database connection established successfully.");
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
        // Graceful Shutdown
        const shutdown = async (signal) => {
            console.log(`\nReceived ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                await prisma.$disconnect();
                console.log("Prisma disconnected. Server closed.");
                process.exit(0);
            });
        };
        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));
    }
    catch (error) {
        console.error("❌ Failed to connect to the database:", error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=server.js.map