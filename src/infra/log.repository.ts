import { LogDTO } from "../core/log.dto";
import { ILogRepository } from "../core/log.repository";
import { PoolClient } from "pg";
import { pool } from "./database";

export class LogRepositoryPg implements ILogRepository {
    async save(dto: LogDTO) {
        const query = `
            INSERT INTO logs
                (timestamp, level, mensagem, stack_trace, servico, contexto, tags, ambiente, duracao_ms, metodo_http, yamcol_id_usuario)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;

        const values = [
            dto.timestamp ?? new Date(),
            dto.level,
            dto.mensagem,
            dto.stackTrace ?? null,
            dto.servico,
            dto.contexto ?? null,
            dto.tags ?? null,
            dto.ambiente,
            dto.duracaoMs ?? null,
            dto.metodoHttp ?? null,
            dto.yamcolIdUsuario ?? null
        ];

        let client: PoolClient | undefined;

        try {
            client = await pool.connect();
            const result = await client.query(query, values);

            return {
                id: result.rows[0].id,
                timestamp: result.rows[0].timestamp,
                level: result.rows[0].level,
                mensagem: result.rows[0].mensagem,
                stackTrace: result.rows[0].stack_trace,
                servico: result.rows[0].servico,
                contexto: result.rows[0].contexto,
                tags: result.rows[0].tags,
                ambiente: result.rows[0].ambiente,
                duracaoMs: result.rows[0].duracao_ms,
                metodoHttp: result.rows[0].metodo_http,
                yamcolIdUsuario: result.rows[0].yamcol_id_usuario
            }
        } catch (error) {
            console.error("Erro ao salvar log:", error);
            throw error;
        } finally {
            client?.release();
        }
    }

    async getAll(page = 1, pageSize = 10) {
        const offset = (page - 1) * pageSize;
        const query = `
            SELECT *
            FROM logs
            ORDER BY timestamp DESC
            LIMIT $1 OFFSET $2
        `;
        let client: PoolClient | undefined;

        try {
            client = await pool.connect();
            const result = await client.query(query, [pageSize, offset]);
            return result.rows.map(row => ({
                id: row.id,
                timestamp: row.timestamp,
                level: row.level,
                mensagem: row.mensagem,
                stackTrace: row.stack_trace,
                servico: row.servico,
                contexto: row.contexto,
                tags: row.tags,
                ambiente: row.ambiente,
                duracaoMs: row.duracao_ms,
                metodoHttp: row.metodo_http,
                yamcolIdUsuario: row.yamcol_id_usuario
            }));
        } catch (error) {
            console.error("Erro ao buscar logs:", error);
            throw error;
        } finally {
            client?.release();
        }
    }

    async deleteById(id: number) {
        const query = `DELETE FROM logs WHERE id = $1`;
        let client: PoolClient | undefined;

        try {
            client = await pool.connect();
            await client.query(query, [id]);
            return { deletedId: id };
        } catch (error) {
            console.error("Erro ao deletar log:", error);
            throw error;
        } finally {
            client?.release();
        }
    }

    async readById(id: number) {
        const query = `SELECT * FROM logs WHERE id = $1`;
        let client: PoolClient | undefined;

        try {
            client = await pool.connect();
            const result = await client.query(query, [id]);

            if (result.rowCount === 0) {
                return null; // ou lançar erro se preferir
            }

            const row = result.rows[0];
            return {
                id: row.id,
                timestamp: row.timestamp,
                level: row.level,
                mensagem: row.mensagem,
                stackTrace: row.stack_trace,
                servico: row.servico,
                contexto: row.contexto,
                tags: row.tags,
                ambiente: row.ambiente,
                duracaoMs: row.duracao_ms,
                metodoHttp: row.metodo_http,
                yamcolIdUsuario: row.yamcol_id_usuario
            };
        } catch (error) {
            console.error("Erro ao buscar log:", error);
            throw error;
        } finally {
            client?.release();
        }
    }
}
