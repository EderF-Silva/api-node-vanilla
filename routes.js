function buildRoutePath(route) {
  return new RegExp(`^${route}$`);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const users = [];

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/usuarios"),
    handler: (req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/usuarios"),
    handler: (req, res) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const userData = JSON.parse(body);

          // Validar envio dos campos
          if (!userData?.name || !userData?.email) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ message: "Campos obrigatórios faltando." })
            );
          }

          // Validar Email.
          if (!isValidEmail(userData.email)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ message: "Formato de e-mail inválido." })
            );
          }

          // Validar se email já existe.
          const emailExists = users.some(
            (user) => user.email === userData.email
          );
          if (emailExists) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ message: "E-mail já cadastrado." })
            );
          }

          const newUser = {
            id: users.length + 1,
            name: userData.name,
            email: userData.email,
          };
          users.push(newUser);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newUser));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Erro no servidor ao processar dados." })
          );
        }
      });
    },
  },
];
