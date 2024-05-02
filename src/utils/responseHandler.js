export default function responseHandler(res, data) {
  try {
    console.log("data",data);
    switch (data?.status) {
      case 200:
        res.status(200).send({ ...data, status_code: "OK" });
        break;

      case 201:
        res.status(200).send({ ...data, status_code: "CREATED" });
        break;

      case 400:
        res.status(400).send({ ...data, error_code: "BAD_REQUEST" });
        break;

      case 401:
        res.status(401).send({ ...data, error_code: "UNAUTHORIZED" });
        break;

      case 403:
        res.status(403).send({ ...data, error_code: "FORBBIDDEN" });
        break;

      case 404:
        res.status(404).send({ ...data, error_code: "NOT_FOUND" });
        break;

      case 409:
        res.status(409).send({ ...data, error_code: "CONFLICT" });
        break;

      case 410:
        res.status(410).send({ ...data, error_code: "TOKEN_EXPIRED" });
        break;

      case 500:
        res.status(500).send({ ...data, error_code: "SERVER_ERROR" });
        break;

      default:
        res.status(500).send({ ...data, error_code: "SERVER_ERROR" });
        break;
    }
  } catch (error) {
    res.status(500).send({ ...data, error_code: "SERVER_ERROR" });
  }
}
