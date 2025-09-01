 // backend/utils/activityLogger.js
const ActivityLog = require("../models/ActivityLog");

const logActivity = async (message) => {
  try {
    const log = new ActivityLog({ message });
    await log.save();
  } catch (err) {
    console.error("❌ Error logging activity:", err);
  }
};

module.exports = { logActivity };
