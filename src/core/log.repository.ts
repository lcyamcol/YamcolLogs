import { LogDTO } from "./log.dto";

export interface ILogRepository {
    save(dto: LogDTO): Promise<any>
    getAll(page?: number, pageSize?: number): Promise<any>
    readById(id: number): Promise<any>
    deleteById(id: number): Promise<any>

}