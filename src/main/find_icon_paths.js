var shell = require('shelljs')
var fs = require('fs')

function getIcons() {

  // Get name of the used theme
  // let shellObject = shell.exec('gsettings get org.gnome.desktop.interface icon-theme', {silent: true})
  // let gtkIconTheme = shellObject.stdout.trim().replace(/'/g, '')
  let gtkIconTheme = 'breeze';

  // Get theme.index file
  let themeIndex,
      iconPaths = ['/usr/share/icons/', '~/icons/']

  for (let iconPath of iconPaths) {
    if (fs.existsSync(iconPath + gtkIconTheme + '/index.theme')) {
      themeIndex = fs.readFileSync(iconPath + gtkIconTheme + '/index.theme', 'utf-8')
    }
  }

  // get inheritance
  let inheritedThemes,
      lines = themeIndex.split('\n')

  for (let line of lines) {
    if (line.indexOf('Inherits=') >= 0) {
       inheritedThemes = line.replace('Inherits=', '').split(',')
    }
  }

  // load icons from themes
  // TODO: needs to get place from theme.index
  let possiblePlaces = ['/48/apps', '/48x48/apps', '/apps/48', '/apps/48x48']

  inheritedThemes.reverse().push(gtkIconTheme);
  let allThemes = inheritedThemes;
  let allPaths = ['/usr/share/pixmaps']

  for (let iconPath of iconPaths) {
    for (let themeName of allThemes) {
      for (let place of possiblePlaces) {
        let fullPath = iconPath + themeName + place;
        if (fs.existsSync(fullPath)) {
          allPaths.push(fullPath)
        }
      }
    }
  }

  return allPaths
}

export default getIcons;
