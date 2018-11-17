2.0.2
------------------
- Unanchored attributes (attributes whose indentation don't match a preceding tag) are now properly discarded.

2.0.1
------------------
- Documentation examples are improved.

2.0.0
------------------
- Multiline content is supported by beginning lines with `|`.
- Static attributes are now denoted with a leading single quote, such as `'msg Hello!` rather than a double quote.
- Self-closing elements now have proper trailing newline when `keepWhitespace` is enabled.
- Non-Louk template section languages are now properly respected.

1.0.2
------------------
- The first attribute value declared for an element is now always used.

1.0.1
------------------
- Lines that consist only of whitespace characters are properly handled.
