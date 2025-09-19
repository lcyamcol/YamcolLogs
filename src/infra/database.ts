import { Pool } from "pg";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export const poolInfo = {
    total: pool.totalCount,
    ocioso: pool.idleCount,
    fila: pool.waitingCount,
};

export const checkBanco = async () => {
    try {
        const client = await pool.connect();
        await client.query("SELECT 1");
        client.release();
        return true;
    }
    catch (error) {
        return false;
    }
}