import { SolidService } from "../services/solidService";

module.exports = function (api: any, solidService: SolidService) {
  api.get("/exportDataToPod", async (req: any, res: any) => {
    solidService
      .exportDataToPod(
        req.session.solidSessionId,
        req.session.user,
        decodeURIComponent(req.query.resource),
        decodeURIComponent(req.query.shape)
      )
      .then(() => {
        res.status(200).json("Data exported to Pod");
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/requestImportDataFromPod", async (req: any, res: any) => {
    solidService
      .requestImportDataFromPod(
        req.session.solidSessionId,
        req.session.user,
        decodeURIComponent(req.query.resource),
        decodeURIComponent(req.query.shape)
      )
      .then(() => {
        res.status(200).json("Data import request added");
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/importDataRequests", async (req: any, res: any) => {
    solidService
      .getImportDataRequests()
      .then((requests: any) => {
        res.status(200).json(requests);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/completeRequest/:requestId", async (req: any, res: any) => {
    solidService
      .completeRequest(req.params.requestId)
      .then(() => {
        res.status(200).json("Data import request accepted");
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/solidHistory/:requestId", async (req: any, res: any) => {
    solidService
      .getSolidHistory(req.session.solidSessionId, req.params.requestId)
      .then((history: any) => {
        res.status(200).json(history);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/solidLogIn", async (req: any, res: any) => {
    let encodedPodProvider = req.query.podProvider;
    let podProvider = decodeURIComponent(encodedPodProvider);
    solidService.solidLogIn(podProvider, req, res);
  });

  api.get("/login/success", async (req: any, res: any) => {
    try {
      res.send(await solidService.successfulLogin(req, res));
    } catch (error) {
      res.status(400).send({ error: "There was an error while logging in." });
    }
  });

  api.get("/solidProfile", async (req: any, res: any) => {
    solidService
      .getSolidUser(req.session.solidSessionId)
      .then((profile: any) => {
        res.status(200).json(profile);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });

  api.get("/getSolidHisory/:requestId", async (req: any, res: any) => {
    solidService
      .getSolidHistory(req.session.solidSessionId, req.params.requestId)
      .then((history: any) => {
        res.status(200).json(history);
      })
      .catch((error: any) => {
        res.status(500).json(error);
      });
  });
};
