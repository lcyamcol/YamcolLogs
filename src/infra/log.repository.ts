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
}
