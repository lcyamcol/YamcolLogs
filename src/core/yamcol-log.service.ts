import { LogDTO } from "./log.dto";
import { ILogRepository } from "./log.repository";

export class YamcolLogService {
    constructor(private readonly _logRepository: ILogRepository) { }
    async save(dto: LogDTO) {
        return await this._logRepository.save(dto);
    }

    async getAll(pagina = 1, tamanhoPagina = 15) {
        return await this._logRepository.getAll(pagina, tamanhoPagina);
    }

    async readById(id: number) {
        return await this._logRepository.readById(id);
    }

    async deleteById(id: number) {
        return await this._logRepository.deleteById(id);
    }
}