module.exports = function () {
  const { isDev } = require('electron-is-dev');
  const { Menu } = require('electron');

  const template = [
    {
      label: 'Configuration',
      submenu: [
        {
          label: 'Toggle fancymode',
          click: () => console.log('Click')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
