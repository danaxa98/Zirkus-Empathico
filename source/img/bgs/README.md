# The Backgrounds-Folder

Put your background-images (JPG, PNG, SVG) you're referencing in your SCSS-files in here.  

The JPG nad PNG files will be processed by the imagemin-task and then copied to `build` or `dist`.

All SVG-files will be processed with the svgmin-task and put into the `bgs/svgmin` folder.  
Afterwards the grunticon-task uses these icons to produce

- PNG-fallback-files, which will be put into the `bgs/png-fallback` folder
- SCSS-files (all icons are included as data-URIs in the form of SASS-placeholders), which will be put into `sass/grunticon`
