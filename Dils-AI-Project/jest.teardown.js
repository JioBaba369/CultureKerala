const { getApp, deleteApp } = require('firebase/app');

module.exports = async () => {
  try {
    const app = getApp();
    await deleteApp(app);
  } catch (error) {
    // Ignore error if app doesn't exist
  }
};
