# Louk
_Vue without the HTML_

## Intro

Vue is a beautiful technology, but it’s always felt a bit awkward crammed into old-school HTML. Louk is a tailor-made shorthand and preprocessor that hides the wonky stuff and lets Vue shine.

The key is that most things are interpreted as dynamic Vue entities (bound content and properties) by default, while anything else is escaped with a single character. This means markup like `{{ }}` and `v-` become unnecessary, as it’s just assumed.

Louk runs on Node, and can compile standalone markup into HTML files (via task runners like gulp) or embedded markup in single file components (via module loaders such as webpack).

## Installation
```sh
$ npm install louk -D
```
If using with webpack, you will also want to install the [Louk Loader](https://github.com/agorischek/louk-loader).

## Notation

### Elements and attributes

Elements are followed by a space, and nested elements are indented. Elements are closed when a new element is encountered at the same indentation level, or when the end of the file is reached.
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

Attributes are followed by a colon and a space, and must follow their corresponding element on separate lines.
```html
//louk
for: item in items

//html
v-for="item in items"
```
### Dynamic content

By default, Louk converts most things into Vue reactive placeholders and directives. Document content placeholders get surrounded by curly brackets.
```html
//louk
div string

//html
<div>{{string}}</div>
```

### Keys
Keys are shorthands that become common directives:

`for` becomes `v-for`

`if` becomes `v-if`

`model` becomes `v-model`

`click` becomes `v-on:click`

`submit` becomes `v-on:submit`

Keys starting with `v-``, including custom directives, will be left unchanged:

`v-show` becomes `v-show`

`v-custom` becomes `v-custom`

All other keys become bound attributes:

`class` becomes `v-bind:class`

`href` becomes `v-bind:href`

etc...

### Static content

Escape characters are used to indicate static content, which Vue will render literally. Text can be escaped with a tilde:

`~p Hello world!` becomes `<p>Hello world!</p>`

`~type: text/css` becomes `type="text/css"`

Some attributes have optional special escape characters:

`.center` becomes `class="center"`

`#install` becomes `id="install"`

`@logo.png` becomes `src="logo.png"` or `href="logo.png"`

Self closing elements are indicated with a pipe.
```html
//louk
br|
.class: full

//html
<br class="full" />
```
