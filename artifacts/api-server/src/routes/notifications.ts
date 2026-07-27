import { Router, type IRouter } from "express";
import { NOTIFICATIONS } from "../data/mockNotifications.js";

const router: IRouter = Router();

// In-memory mutable store for the session
const notifications = NOTIFICATIONS.map(n => ({ ...n }));

/** GET /notifications */
router.get("/notifications", async (req, res): Promise<void> => {
  const { unreadOnly } = req.query as Record<string, string>;
  const result = unreadOnly === "true"
    ? notifications.filter(n => !n.isRead)
    : notifications;
  res.json(result);
});

/** POST /notifications/mark-all-read */
router.post("/notifications/mark-all-read", async (_req, res): Promise<void> => {
  notifications.forEach(n => { n.isRead = true; });
  res.json({ success: true, message: "All notifications marked as read" });
});

/** PATCH /notifications/:notificationId/read */
router.patch("/notifications/:notificationId/read", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.notificationId)
    ? req.params.notificationId[0]
    : req.params.notificationId;

  const notification = notifications.find(n => n.id === id);
  if (!notification) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }

  notification.isRead = true;
  res.json(notification);
});

export default router;
