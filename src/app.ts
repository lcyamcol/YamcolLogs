import { Elysia, t } from "elysia";
import { YamcolLogService } from "./core/yamcol-log.service";
import { LogRepositoryPg } from "./infra/log.repository";
import { checkBanco, poolInfo } from "./infra/database";
import { formatarBytes } from "./libs";
const PORT: number = +(process.env.PORT || 8081);
const NODE_ENV = process.env.NODE_ENV ?? "development";

const app = new Elysia();
const yamcolLogService = new YamcolLogService(new LogRepositoryPg());

app.get("/saude", async () => {
  const bancoVerificado = await checkBanco();
  const memoria = process.memoryUsage();

  return {
    mensagem: "Serviço de logs vivo", sucesso: true, data: new Date(), ambiente: NODE_ENV, versaoRuntime: process.version, uptime: process.uptime(), memoria: {
      rss: formatarBytes(memoria.rss),
      heapTotal: formatarBytes(memoria.heapTotal),
      heapUsed: formatarBytes(memoria.heapUsed),
      external: formatarBytes(memoria.external),
      arrayBuffers: formatarBytes(memoria.arrayBuffers),
    }, bancoVivo: bancoVerificado, pools: poolInfo
  };
});

app.post("/logs", ({ body }) => {
  return yamcolLogService.save(body);
}, {
  body: t.Object({
    id: t.Optional(t.Number()),
    timestamp: t.String(),
    level: t.String(),
    mensagem: t.String(),
    stackTrace: t.Optional(t.String()),
    servico: t.String(),
    contexto: t.Optional(t.String()),
    tags: t.Optional(t.String()),
    ambiente: t.String(),
    duracaoMs: t.Optional(t.Number()),
    metodoHttp: t.Optional(t.String()),
    yamcolIdUsuario: t.Optional(t.Number())
  })
});
app.listen(PORT, () => {
  console.log(`[${NODE_ENV}] Server rodando na porta ${PORT}`);
});
