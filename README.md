# Louk
Vue without the HTML

## Intro

Vue is a beautiful technology, but it’s always felt a bit awkward crammed into old-school HTML. Louk is a tailor-made shorthand and preprocessor that hides the wonky stuff and lets Vue shine.

The key is that most things are interpreted as dynamic Vue entities (bound content and properties) by default, while anything else is escaped with a single character. This means markup like {{ }} and v- become unnecessary, as it’s just assumed. It also supports inline HTML, for when that’s needed.

Louk runs on Node, and can compile standalone markup into HTML files (via command line or task runners like gulp) or embedded markup in single file templates (via module loaders such as webpack).

## Installation

## Notation

### Elements and attributes

Elements are followed by a space, and nested elements are indented. Elements are closed when a new element is encountered at the same indentation level, or when the end of the file is reached.
```
div
div
    span
```
...becomes...
```
<div></div><div><span></span></div>
```
Attributes are followed by a colon and a space, and must follow their corresponding element on separate lines
```
for:
```
...becomes...
```
v-for=
```
### Dynamic stuff


By default, Louk converts most things into Vue reactive placeholders and directives.

#### Content
Document content placeholders get surrounded by curly brackets:
```
element string
```
...becomes...
```
<element>{{string}}</element>
```

#### Keys
Keys are shorthands that become common directives:
`for` becomes `v-for`
`if` becomes `v-if`
`model` becomes `v-model`
`click` becomes `v-on:click`
`submit` becomes `v-on:submit`

Keys starting with v-, including custom directives, will be left unchanged:
`v-show` becomes `v-show`
`v-custom` becomes `v-custom`

All other keys become bound attributes:
`class` becomes `v-bind:class`
`href` becomes `v-bind:href`
etc...

### Static stuff

Escape characters are used to indicate static, non-Vue content. Some attributes have optional special escape characters:

`.center` becomes `class=“Center”`

`#install` becomes `id=“install”`

`@logo.png` becomes `src=“logo.png”` or `href=“logo.png”`

Everything else can be escaped with a tilde:

`~p Hello world!` Becomes `<p>Hello world!</p>`

`~type: text/css` becomes `type=“text/css”`

Self closing elements are indicated with a pipe
```
br|
.class: full
```
...becomes...
```
<br class=“full” />
```
### Comments
Comments can be escaped with a single / for one line or /// for multi line.

HTML can be included inline as long as it starts its own line. Inline HTML continues across lines until a matching closing tag is reached.
