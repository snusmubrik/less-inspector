
less-inspector is a script that can watch a directory and recompile your .less scripts if they change.
Also less-inspector can compile only one file. It is needed when you have main file with many css imports.

It searches in a recursive manner so sub-directories are handled as well.

<!-- To install less-inspector via npm simply do:

    $ sudo npm install less-inspector -->

To use less-inspector simply do:

    less-inspector -p [prefix] -d [directory]
    
    Options:
      -d [path]  Specify which directory to scan.                                                                         [default: "."]
      -f [path]  If defined, LESS will watch all files but will compile only the specified one.                     
      -p [name]  Which prefix should the compiled files have? Default is style.less will be compiled to style.css.  
      -h  Prints help                                                                                              

