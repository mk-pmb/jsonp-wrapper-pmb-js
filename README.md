
<!--#echo json="package.json" key="name" underline="=" -->
jsonp-wrapper-pmb
=================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
A suggestion and utility for easily wrapping your API JSON reply in JSONP
packaging.
<!--/#echo -->


Cheat sheet
-----------

```text
/some/api -> {"foo":"bar"}
/some/api?jsonp=myApp.render -> myApp.render({"foo":"bar"});
/some/api?jsonp=myApp.recv:motd:123 -> myApp.recv('motd','123',{"foo":"bar"});
/some/api?jsonp=console.debug:reply -> console.debug('reply',{"foo":"bar"});
```



API
---

This module exports one function:

### jsonpWrap(cbName)

`cbName` is the untrusted config string that describes the JSONP packaging
to be used. It's usually a client-provided query argument, potentially
controlled by an attacker, and thus it is `jsonpWrap`'s responsibility
(with the caveats described below) to handle it safely and securely.

Returns an array of two (potentially empty) strings:
What to print before your regular API result, and what to print after.
This way you have full choice: If your server API needs to concatenate
the reply, you can easily use the `.join()` method,
and if instead you use streams, you can print each component individually.

* If anything about `cbName` is invalid according to the rules defined here,
  two empty strings are returned.
* A false-y (e.g., empty) `cbName` is invalid. This avoids wasting CPU cycles
  if the request doesn't even want JSONP.
* Valid characters in `cbName` are a subset of the Unicode block
  "Basic Latin", specifically: Letters (`A-Za-z`), digits (`0-9`),
  low line (aka underscore; `_`), full stop (`.`), and colon (`:`).
* The colon character divides the string into callback name and arguments.
* An empty callback name is invalid.
* Arguments, if any, will be single-quoted and inserted as early arguments
  to the callback.
  * Example use case: Adding timestamps so the receiver can easily discard
    late replies to already-obsolete requests.
  * Example use case: Use the same receiver function for multiple data topics.
  * Security: Due to the harsh restriction on valid characters, we can blindly
    put single quotes and don't have to worry about complex quoting rules.
* Validation does _not_ check whether the resulting effective callback name
  is valid JavaScript.



Security
--------

The callback name validation is meant to protect your webserver from
shenanigans like control characters, zero bytes, HTTP protocol injections,
or Unicode obfuscation tricks.

However, JSONP always has a residual risk of client-side code injection,
because by design it's meant to call functions.
I had considered implementing a blocklist for callback names like `eval`,
but that would be an infeasible arms race: There are just too many ways to
call an `eval`-like function, and the variety of functions an attacker can
choose from only ever grows with new browser API inventions and with each
module imported in the website.

However, some of the limitations on the acceptable characters for `cbName`
are meant to help avoid code injection even if the effective callback name
really is `eval`, because it blocks some usual command-triggering techniques:

* Function call via parentheses `()`.
* Stowing away a side effect in a ternary
  (`?` is invalid and `:` acts as argument splitter).
* Stowing away a side effect in a multi-value comma expression.
* Using brackets `[]` to dynamically construct method invocations.
* Most math (`+-*/()`) for calculating obfuscated strings from character codes.
* Increment/decrement operator (`++`, `--`).
* Assignment (`=`).
* Boolean chains (`||`, `&&`).

But even with those, there may still be plenty of attack surface, especially
if your app (or any module you import) uses getters with side effects.



Usage
-----

see [test/usage.mjs](test/usage.mjs).


<!--#toc stop="scan" -->





&nbsp;


License
-------
<!--#echo json="package.json" key="license" -->
ISC
<!--/#echo -->
