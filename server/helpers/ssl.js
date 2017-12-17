var rootCas = require('ssl-root-cas/latest').create();

// default for all https requests
// (whether using https directly, request, or another module)
require('https').globalAgent.options.ca = rootCas;
