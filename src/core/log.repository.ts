import { LogDTO } from "./log.dto";

export interface ILogRepository {
    save(dto: LogDTO): Promise<any>
}