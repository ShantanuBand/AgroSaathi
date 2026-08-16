import { Router, type IRouter } from "express";
import { newsService } from "../services/newsService.js";

const router: IRouter = Router();

router.get("/news", async (req, res) => {
  try {
    const { category, search, district } = req.query;
    const news = await newsService.getNews({
      category: category as string,
      search: search as string,
      district: district as string
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

export default router;
