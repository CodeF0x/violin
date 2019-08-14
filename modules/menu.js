module.exports = function() {
  const { Menu } = require('electron');

  const template = [
    {
      role: 'Help',
      submenu: [
        {
          label: 'Developer website',
          click() {
            require('electron').shell.openExternal('https://codef0x.dev');
          }
        },
        {
          label: 'Source code',
          click() {
            require('electron').shell.openExternal(
              'https://github.com/CodeF0x/violin'
            );
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
