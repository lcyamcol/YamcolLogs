import { Elysia } from "elysia";
const PORT: number = +(process.env.PORT || 8081);
const NODE_ENV = process.env.NODE_ENV ?? "development";

const app = new Elysia();

app.get("/", () => "Rodando API com Elysia e Bun!");

app.listen(PORT, () => {
  console.log(`[${NODE_ENV}] Server rodando na porta ${PORT}`);
});
