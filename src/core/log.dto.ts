export interface LogDTO {
    id?: number;
    timestamp: string;
    level: string;
    mensagem: string;
    stackTrace?: string;
    servico: string;
    contexto?: string;
    tags?: string;
    ambiente: string;
    duracaoMs?: number;
    metodoHttp?: string;
    yamcolIdUsuario?: number;
};