// -*- coding: utf-8, tab-width: 2 -*-

import eq from 'equal-pmb';

import jsonWrap from '../jsonpwrap.js';

eq(jsonWrap(), ['', '']);
eq(jsonWrap(false), ['', '']);
eq(jsonWrap(undefined), ['', '']);
eq(jsonWrap(''), ['', '']);
eq(jsonWrap('hello world'), ['', '']);
eq(jsonWrap('hello#?'), ['', '']);

eq(jsonWrap('myApp.render'), ['myApp.render(', ');']);
eq(jsonWrap('myApp.recv:motd:1234'), ["myApp.recv('motd','1234',", ');']);
eq(jsonWrap('console.debug:reply'), ["console.debug('reply',", ');']);






console.info('+OK usage test passed.');
