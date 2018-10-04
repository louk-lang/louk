export default {

        // PREFIXES
        // Prefixes are nonalphabetic modifiers that precede the key.

        // All valid prefixes: " and : and @ and -
        // Shorthands like . and # are not prefixes, they are cruxes.
        prefix: /^([":@-])/,

        // Prefixes that can make an attribute static: "
        staticPrefix: /^(["])/,

        // SUFFIXES
        // Suffixes are nonalphabetic modifiers that follow the key.

        // All valid suffixes: " and / and ,
        suffix: /(["/,])$/,

        // Suffixes that can make an element static: " and /
        // The forward slash makes an element self-closing, and therefore not capable of containing dynamic content.
        staticSuffix: /(["/,])$/,

        // CRUXES
        // The crux is the string present in the source Louk that indicates what the line represents.
        // It is most commonly the same as the content before the first space or new line.
        // However, shorthands like "#" and "." are important exceptions.

        // Cruxes not followed by content, such as "a"
        plainCrux: /^(.+)/,

        // Cruxes that are followed by content, such as "a b"
        modifiedCrux: /^(.+?)\s/,

        // Shorthand cruxes that make their attribute static: > and # and .
        // The first capture group gets the shorthand crux, the second capture group gets the fill.
        staticCrux: /^([>#\.]).*/,

        // Crux of a Vue single-file component section.
        sectionCrux: /^(\w+),/,

        // FILLS
        // The fill is the "stuff" of the line: It's the content inside the element or the value of the attribute.

        // A normal fill, preceded by a space
        fill: /^.+?\s(.+)/,

        // A fill prepended by a static crux
        staticFill: /^[>#\.](.*)/,

        // KEYS
        // A key is semantically what a line of Louk ultimately represents: A specific tag or a specific attribute.
        // A key might be implied or it might have a shorthand. For example, "." is a crux, and "class" is its key.

        key: /^[":@-]*([\w\.-]+)/,

        // OTHER

        // Louk attribute, for use while parsing sections
        loukLangAttribute: /"lang louk/,

        // Used to recognize that something is an unindented Vue section marker, HTML tag, or HTML comment
        unindentedElement: /^[\w<]/,

        // Characters that indicate the line should be interpretted as a comment.
        // The capture group captures the comment.
        comment: /^\/\/(.*)/,

        // Characters that indicate the line should be interpretted as HTML
        html: /^([<])/,

        // Used to identify whether we've hit the first non-space character of a line yet.
        initialSpace: /^(\s)/,

        // Used to capture leading whitespace.
        whitespace: /^(\s*)/,

        // Shows that the line is not indented.
        unindented: /^\S/,

};
