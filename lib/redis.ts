import { Redis } from "@upstash/redis"

// Redis config details
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// SetUrl for setting the shorturl in redis db
export async function setUrl(url: string) {
  let short = getShort();
  let check = await redis.exists(`short/${short}`);
  // To check for conflict
  while (check !== 0) {
    short = getShort();
    check = await redis.exists(`short/${short}`);
  }
  await redis.set(`short/${short}`, url);
  return short;
}

// getUrl for retrieving the actual URL
export async function getUrl(short: string): Promise<string> {
  let data = await redis.get(`short/${short}`);
  return String(data);
}

// getShort for generation of shortcode
function getShort(): string {
  const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
  return [...new Array(8)]
    .map((_) => alpha[Math.floor(Math.random() * alpha.length)])
    .join("");
}
