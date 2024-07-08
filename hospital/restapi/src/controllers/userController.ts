import { UserNotFoundError } from "../exceptions/userNotFoundError";
import { User } from "../model/users";
import { UserService } from "../services/userService";

module.exports = function (app: any, api: any, service: UserService) {
  api.post("/login", async (req: any, res: any) => {
    try {
      let username = req.body.username;
      let password = app
        .get("crypto")
        .createHmac("sha256", app.get("password"))
        .update(req.body.password)
        .digest("hex");

      service
        .login(username, password)
        .then((user: string) => {
          req.session.user = user;
          res.status(200).send(user);
        })
        .catch((error: UserNotFoundError) => {
          res.status(404).send("Usuario no encontrado");
        })
        .catch((error: any) => {
          res.status(500).send(error);
        });
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.post("/logout", async (req: any, res: any) => {
    try {
      req.session.destroy();
      res.status(200).send("Sesión cerrada");
    } catch (error) {
      res.status(500).send(error);
    }
  });

  api.get("/users", async (req: any, res: any) => {
    try {
      const users = await service.getUsers();
      res.status(200).send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

  api.get("/user/:id", async (req: any, res: any) => {
    service
      .getUser(req.params.id)
      .then((user: User) => {
        res.status(200).send(user);
      })
      .catch((error: UserNotFoundError) => {
        res.status(404).send("Usuario no encontrado");
      })
      .catch((error: any) => {
        res.status(500);
      });
  });
};
