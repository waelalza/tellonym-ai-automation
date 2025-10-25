function schedulePosts(task, count, minDelay, maxDelay) {
  // Run the first post immediately for testing
  task();

  // Schedule the remaining posts with randomized delays
  for (let i = 1; i < count; i++) {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    setTimeout(task, delay);
  }

  // Repeat every hour
  setInterval(() => {
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(task, delay);
    }
  }, 60 * 60 * 1000); // 1 hour
}
