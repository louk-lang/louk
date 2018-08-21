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

### Elements & Content

Elements are denoted by their tags as the first visible characters on a line. Nested elements are indented, and closing tags are implied. Self closing elements are followed with a pipe.

```html
//louk
h1
div
    br|

//html
<h1></h1>
<div>
    <br />
</div>
```

Element content follows the tag on the same line, separated by a space. Content is interpreted as dynamic by default.

```html
//louk
div string

//html
<div>{{string}}</div>
```

### Directives & Attributes

Directives and other attributes are denoted by a leading colon, and follow their corresponding element on separate lines.

```html
//louk
ul
:if items
    li
    :for item in items

//html
<ul v-if="items">
    <li v-for="item in items"></li>
</ul>
```

Key directives have shorthands:

`:if` becomes `v-if`

`:for` becomes `v-for`

`:model` becomes `v-model`

`:click` becomes `v-on:click`

`:submit` becomes `v-on:submit`

All other attributes are simply bound:

`:id` becomes `v-bind:id`

`:class` becomes `v-bind:class`

`:href` becomes `v-bind:href`


### Statics

Content and attributes can be made static by escaping with a trailing tilde.

`p~ Hello world!` becomes `<p>Hello world!</p>`

`:type~ text/css` becomes `type="text/css"`

Additionally, some attributes have escape shorthands.

`.center` becomes `class="center"`

`#install` becomes `id="install"`
