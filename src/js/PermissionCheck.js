class PermissionCheck {
  constructor() {
    if (!process.platform === 'darwin') {
      return;
    }
    const not = new Notification('Enable keyboard shortcuts', {
      body:
        'Please add Violin as a trusted client, then click on this message or restart Violin.'
    });
    not.onclick = () => {
      const app = require('electron').remote.app;
      app.relaunch();
      app.quit();
    };
  }
}

new PermissionCheck();
