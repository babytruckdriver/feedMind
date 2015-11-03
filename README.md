# feedMind
A Feed reader to full your mind.

Installation and execution instructions:
------------------------------------------
Installation:

    $ npm install
    $ npm install -g gulp
    $ npm install -g bunyan
    $ npm install -g node-dev
    
    To install dependencies in the 'devDependencies' section of the 'package.json' you have to execute 'npm' with flag '--save-dev'. Rest with flag '--save'

Execution:

    $ NODE_ENV=development DEBUG=koa* node-dev --harmony app | bunyan
    
Test:

    $gulp --harmony test

Lint:
    
    $gulp --harmony lint