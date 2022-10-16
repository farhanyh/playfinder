import axios from "axios";
import config from "../config";

const client = axios.create({
  baseURL: config.WG_BASE_URL,
  headers: {
    Authorization: `Apikey ${config.WG_API_KEY}`,
  },
});

export const getAncestry = async (ancestry: string) => {
  const { data } = await client.get("ancestry", { params: { name: ancestry } });
  console.log(data);
};
