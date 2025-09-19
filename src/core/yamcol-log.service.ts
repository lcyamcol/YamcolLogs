import { LogDTO } from "./log.dto";
import { ILogRepository } from "./log.repository";

export class YamcolLogService {
    constructor(private readonly _logRepository: ILogRepository) { }
    async save(dto: LogDTO) {
        return await this._logRepository.save(dto);
    }
}