module.exports = function() {
  const { isDev } = require('electron-is-dev');
  const { Menu } = require('electron');

  const template = [
    {
      label: 'Configuration',
      submenu: [
        {
          label: 'Color ',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
