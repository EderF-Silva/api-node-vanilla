import http from "http";
import { routes } from "./routes.js";
import { parse } from "url";

const server = http.createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;
  const method = req.method;

  const matchedRoute = routes.find((route) => {
    return route.method === method && route.path.test(pathname);
  });

  if (matchedRoute) {
    req.query = parsedUrl.query;
    req.params = matchedRoute.path.exec(pathname)?.groups || {};
    return matchedRoute.handler(req, res);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Rota não encontrada." }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
