test:
  @NODE_ENV=test ./node_modules/.bin/mocha \
    --require should \
    --reporter nyan \
    --harmony \
    --bail \
    api/test.js

  # Comando para ejecutar los test si no está instalado "make"
  # c:\js\feedMind\node_modules\.bin\mocha --require should --reporter nyan --harmony --bail ../..//api/test.js
    
.PHONY: test