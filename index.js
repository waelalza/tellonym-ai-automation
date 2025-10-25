/**
 * Main script to run Tellonym AI automation.
 * Schedules 3 posts per hour with randomized delays.
 */

const { schedulePosts } = require('./src/utils');
const { generatePoem } = require('./src/ai');
const { postToTellonym } = require('./src/tellonym');

async function main() {
  console.log('Starting Tellonym AI automation...');

  // Schedule 3 posts per hour
  schedulePosts(async () => {
    try {
      // Generate a poem
      const poem = await generatePoem();
      console.log('Generated poem:', poem);

      // Post to Tellonym
      await postToTellonym(poem);

      // Log success
      console.log('Post successful at', new Date().toISOString());
    } catch (error) {
      console.error('Error during automation:', error);
    }
  }, 3, 18 * 60 * 1000, 22 * 60 * 1000); // 18-22 minutes in ms
}

main().catch(console.error);