'use strict';

function jsonpWrap(cbName) {
  let c = cbName;
  c = c && jsonpWrap.cbNameRx.exec(c);
  if (!c) { return ['', '']; }
  const a = c[0].split(':');
  c = a[0] + '(';
  const n = a.length;
  let i = 1;
  for (i = 1; i < n; i += 1) { c += "'" + a[i] + "',"; }
  return [c, ');'];
}

jsonpWrap.cbNameRx = /^(?!:)[A-Za-z0-9_\.:]+$/;
module.exports = jsonpWrap;
