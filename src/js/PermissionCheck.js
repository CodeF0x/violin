class PermissionCheck {
  constructor() {
    if (process.platform !== 'darwin') {
      return;
    }

    const { app, systemPreferences } = require('electron').remote;

    if (systemPreferences.isTrustedAccessibilityClient(true)) {
      return;
    }

    const not = new Notification('Enable keyboard shortcuts', {
      body:
        'Please add Violin as a trusted client, then click on this message or restart Violin.'
    });
    not.onclick = () => {
      app.relaunch();
      app.quit();
    };
  }
}

new PermissionCheck();
