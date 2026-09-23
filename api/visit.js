import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const redisUrl =
      process.env.UPSTASH_REDIS_REST_URL;

    const redisToken =
      process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      return res.status(500).json({
        success: false,
        message:
          "Missing Redis environment variables",
      });
    }

    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    const visitors =
      await redis.incr(
        "smora_visitor_count"
      );

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );

    return res.status(200).json({
      success: true,
      visitors:
        Number(visitors) || 0,
    });
  } catch (error) {
    console.error(
      "Smora visitor counter error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update visitor counter",
    });
  }
}