// var shell = require('shelljs')
// var fs = require('fs')
//
//
//
//
// function findIcon(icon, size, scale) {
//   let theme = shell.exec('gsettings get org.gnome.desktop.interface icon-theme')
//   let filename = findIconHelper(icon, size, scale, theme);
//
//   if filename != none
//     return filename
//
//   filename = findIconHelper(icon, size, scale, "hicolor");
//   if (filename) return filename
//
//   return LookupFallbackIcon (icon)
// }
//
//
//
//
// function findIconHelper(icon, size, scale, theme) {
//   let filename = lookupIcon (icon, size, scale, theme)
//   if (filename) return filename
//
//   // if theme has parents
//   // let parents = theme.parents
//   let parents = ['hicolor']
//
//   for (parent in parents) {
//     filename = findIconHelper(icon, size, scale, parent)
//     if (filename) return filename
//   }
//   return false
// }
//
// function lookupIcon (iconname, size, scale, theme) {
//   for each subdir in $(theme subdir list) {
//     for each directory in $(basename list) {
//       for extension in ("png", "svg", "xpm") {
//         if DirectoryMatchesSize(subdir, size, scale) {
//           filename = directory/$(themename)/subdir/iconname.extension
//           if exist filename
// 	    return filename
//         }
//       }
//     }
//   }
//   minimal_size = MAXINT
//   for each subdir in $(theme subdir list) {
//     for each directory in $(basename list) {
//       for extension in ("png", "svg", "xpm") {
//         filename = directory/$(themename)/subdir/iconname.extension
//         if exist filename and DirectorySizeDistance(subdir, size, scale) < minimal_size {
// 	   closest_filename = filename
// 	   minimal_size = DirectorySizeDistance(subdir, size, scale)
//         }
//       }
//     }
//   }
//   if closest_filename set
//      return closest_filename
//   return none
// }
//
// LookupFallbackIcon (iconname) {
//   for each directory in $(basename list) {
//     for extension in ("png", "svg", "xpm") {
//       if exists directory/iconname.extension
//         return directory/iconname.extension
//     }
//   }
//   return none
// }
//
// DirectoryMatchesSize(subdir, iconsize, iconscale) {
//   read Type and size data from subdir
//   if Scale != iconscale
//      return False;
//   if Type is Fixed
//     return Size == iconsize
//   if Type is Scaled
//     return MinSize <= iconsize <= MaxSize
//   if Type is Threshold
//     return Size - Threshold <= iconsize <= Size + Threshold
// }
//
// DirectorySizeDistance(subdir, iconsize, iconscale) {
//   read Type and size data from subdir
//   if Type is Fixed
//     return abs(Size*Scale - iconsize*iconscale)
//   if Type is Scaled
//     if iconsize*iconscale < MinSize*Scale
//         return MinSize*Scale - iconsize*iconscale
//     if iconsize*iconscale > MaxSize*Scale
//         return iconsize*iconscale - MaxSize*Scale
//     return 0
//   if Type is Threshold
//     if iconsize*iconscale < (Size - Threshold)*Scale
//         return MinSize*Scale - iconsize*iconscale
//     if iconsize*iconsize > (Size + Threshold)*Scale
//         return iconsize*iconsize - MaxSize*Scale
//     return 0
// }
