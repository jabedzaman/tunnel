import { ApiKey } from "~/models/api-key.model";
import moment from "moment";

/**
 * @description create an API key
 */
export const create = async () => {
  // 1. calculate the expiration date
  const expirationDate = moment().add(1, "year").toDate(); // 1 year from now

  // 2. create the API key
  const apiKey = await ApiKey.create({
    expiresAt: expirationDate.getTime(),
  });

  // 3. generate auth url
  const authUrl = `http://localhost:3000/authorize?apiKey=${apiKey._id}`;
  const expiresAt = moment(expirationDate).format("YYYY-MM-DD HH:mm:ss");
  const status = apiKey.status;

  return { authUrl, expiresAt, status };
};
