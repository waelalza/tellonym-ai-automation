/**
 * Utility functions for logging and scheduling.
 */

const fs = require('fs');
const path = require('path');

/**
 * Logs an action to the log file.
 * @param {string} message - The message to log.
 * @param {string} timestamp - The timestamp.
 */
function logAction(message, timestamp) {
  const logPath = path.join(__dirname, '..', 'logs', 'tellonym-ai-log.txt');
  const logEntry = `${timestamp}: ${message}\n`;

  fs.appendFileSync(logPath, logEntry);
}

/**
 * Schedules posts with randomized delays.
 * @param {Function} task - The task to run.
 * @param {number} count - Number of tasks per hour.
 * @param {number} minDelay - Minimum delay in ms.
 * @param {number} maxDelay - Maximum delay in ms.
 */
function schedulePosts(task, count, minDelay, maxDelay) {
  for (let i = 0; i < count; i++) {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    setTimeout(task, delay + (i * (maxDelay - minDelay) / count)); // Distribute over hour
  }

  // Repeat every hour
  setInterval(() => {
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(task, delay + (i * (maxDelay - minDelay) / count));
    }
  }, 60 * 60 * 1000); // 1 hour
}

module.exports = { logAction, schedulePosts };
