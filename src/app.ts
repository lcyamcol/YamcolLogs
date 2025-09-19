import { Elysia, t } from "elysia";
import { YamcolLogService } from "./core/yamcol-log.service";
import { LogRepositoryPg } from "./infra/log.repository";
import { checkBanco, poolInfo } from "./infra/database";
import { formatarBytes } from "./libs";
const PORT: number = +(process.env.PORT || 8081);
const NODE_ENV = process.env.NODE_ENV ?? "development";

const yamcolLogService = new YamcolLogService(new LogRepositoryPg());

new Elysia()
  .get("/saude", async () => {
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
  })
  .post("/logs", ({ body }) => {
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
  })
  .get("/logs", ({ query }) => {
    const page = query.page ? Number(query.page) : 1;
    const pageSize = query.pageSize ? Number(query.pageSize) : 10;

    return yamcolLogService.getAll(page, pageSize);
  }, {
    query: t.Object({
      page: t.Optional(t.Number()),
      pageSize: t.Optional(t.Number())
    })
  })
  .get("/logs/:id", ({ params }) => {
    const id = Number(params.id);
    return yamcolLogService.readById(id);
  }, {
    params: t.Object({
      id: t.Number()
    })
  })
  .delete("/logs/:id", ({ params }) => {
    const id = Number(params.id);
    return yamcolLogService.deleteById(id);
  }, {
    params: t.Object({
      id: t.Number()
    })
  })
  .listen(PORT, () => {
    console.log(`[${NODE_ENV}] Server rodando na porta ${PORT}`);
  });
