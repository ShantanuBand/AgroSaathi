import { Router, type IRouter } from "express";
import { getLiveNotifications } from "../data/mockTime.js";

const router: IRouter = Router();

let readStatusMap: Record<string, boolean> = {};

/** GET /notifications */
router.get("/notifications", async (req, res): Promise<void> => {
  const { unreadOnly } = req.query as Record<string, string>;
  const liveList = getLiveNotifications().map(n => ({
    ...n,
    isRead: readStatusMap[n.id] !== undefined ? readStatusMap[n.id] : n.isRead,
  }));
  const result = unreadOnly === "true"
    ? liveList.filter(n => !n.isRead)
    : liveList;
  res.json(result);
});

/** POST /notifications/mark-all-read */
router.post("/notifications/mark-all-read", async (_req, res): Promise<void> => {
  const liveList = getLiveNotifications();
  liveList.forEach(n => { readStatusMap[n.id] = true; });
  res.json({ success: true, message: "All notifications marked as read" });
});

/** PATCH /notifications/:notificationId/read */
router.patch("/notifications/:notificationId/read", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.notificationId)
    ? req.params.notificationId[0]
    : req.params.notificationId;

  const liveList = getLiveNotifications();
  const notification = liveList.find(n => n.id === id);
  if (!notification) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }

  readStatusMap[id] = true;
  res.json({ ...notification, isRead: true });
});

export default router;
