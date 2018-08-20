# Louk
_Vue without the HTML_

## Intro

Vue is a beautiful technology, but it’s always felt a bit awkward crammed into old-school HTML. Louk is a tailor-made notation and preprocessor that hides the wonky stuff and lets Vue shine.

The key is that most things are interpreted as dynamic Vue entities (bound content and properties) by default, while anything else is escaped with a single character. This means markup like `{{ }}` and `v-` become unnecessary, as it’s just assumed.

Louk runs on Node, and can compile standalone markup into HTML files (via task runners like gulp) or embedded markup in single file components (via module loaders such as webpack).

## Installation
```sh
$ npm install louk -D
```
If using with webpack, you'll also want to install the [Louk Loader](https://github.com/agorischek/louk-loader).

## Notation

### Elements and attributes

Elements are followed by a space or new line, and nested elements are indented. Elements are closed when a new element is encountered at the same indentation level, or when the end of the file is reached.
```html
//louk
h1
div
    a

//html
<h1></h1>
<div>
    <a></a>
</div>
```

Attributes are preceded by a colon, and must follow their corresponding element on separate lines:
```html
//louk
li
:for item in items

//html
<li v-for="item in items"></li>
```
### Dynamic content

Document content placeholders get surrounded by curly brackets:
```html
//louk
div string

//html
<div>{{string}}</div>
```

### Directives

Common directives have shorthands:

`:for` becomes `v-for`

`:if` becomes `v-if`

`:model` becomes `v-model`

`:click` becomes `v-on:click`

`:submit` becomes `v-on:submit`

Directives starting with `v-`, including custom directives, will be left unchanged:

`:v-show` becomes `v-show`

`:v-custom` becomes `v-custom`

All other directives become bound attributes:

`:class` becomes `v-bind:class`

`:href` becomes `v-bind:href`

etc...

### Static content

A tilde following an element or directive escapes it, telling Vue to treat it as static content:

`p~ Hello world!` becomes `<p>Hello world!</p>`

`:type~ text/css` becomes `type="text/css"`

Some attributes have optional special escape characters:

`.center` becomes `class="center"`

`#install` becomes `id="install"`

Self closing elements are followed with a pipe:
```html
//louk
br|
.full

//html
<br class="full" />
```
