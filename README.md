<img width="90" src="img/logo.png" alt="Louk logo" />

# Louk
_Vue without the HTML_

[![Build Status](https://img.shields.io/travis/louk-lang/louk.svg?branch=master&style=flat-square)](https://travis-ci.org/louk-lang/louk)
[![Codecov](https://img.shields.io/codecov/c/github/louk-lang/louk.svg?style=flat-square)](https://codecov.io/gh/louk-lang/louk)
[![Depfu](https://img.shields.io/depfu/louk-lang/louk.svg?style=flat-square)](https://depfu.com/repos/louk-lang/louk)
[![Known Vulnerabilities](https://snyk.io/test/github/louk-lang/louk/badge.svg?targetFile=package.json&style=flat-square)](https://snyk.io/test/github/louk-lang/louk?targetFile=package.json)
[![Version](https://img.shields.io/npm/v/louk.svg?style=flat-square)](https://www.npmjs.com/package/louk)
[![License](https://img.shields.io/github/license/louk-lang/louk.svg?style=flat-square)](https://github.com/louk-lang/louk/blob/master/LICENSE)

## Intro

Vue is a beautiful technology, but it’s always felt a bit awkward crammed into old-school HTML. Louk is a tailor-made notation and preprocessor that hides the wonky stuff and lets Vue shine.

The key is that most things are interpreted as dynamic Vue entities (bound content and attributes) by default, while anything else is escaped with a single character. This means markup like `{{ }}` and `v-` becomes unnecessary, as it’s just assumed.

Louk runs on Node, and compiles into Vue HTML. Standalone Louk files can be compiled into full Vue components, or Louk notation can be embedded in Vue component sections.

## Getting Started
The quickest way to get started with Louk is the [`louk-intro` template](https://github.com/louk-lang/louk-intro), which sets up a basic end-to-end development environment. If you’re integrating Louk into an existing project, download the libraries directly instead, and then [configure `louk-loader`](https://www.npmjs.com/package/louk-loader):

```sh
npm install -D louk louk-loader
```

To get syntax highlighting, install the editor extension for [Atom](http://atom.io/packages/language-louk), [Sublime](https://packagecontrol.io/packages/Louk), or [VS Code](https://marketplace.visualstudio.com/items?itemName=louk-lang.louk).


## Notation

### Elements & Content

Elements are denoted by their tags as the first visible characters on a line. Nested elements are indented, and closing tags are implied. Self closing elements are followed with a forward slash.

```html
//louk
h1
div
    br/

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

Directives and other attributes are denoted by prefixes and follow their corresponding elements on separate lines.

```html
//louk
ul
:class focus
    li
    -for item in items

//html
<ul v-bind:class="focus">
    <li v-for="item in items"></li>
</ul>
```

Simple directives are denoted by a leading hyphen.

`-if` becomes `v-if`

`-for` becomes `v-for`

`-model` becomes `v-model`


Binding directives are denoted by a leading colon.

`:id` becomes `v-bind:id`

`:class` becomes `v-bind:class`

`:href` becomes `v-bind:href`


Action directives are denoted by a leading at sign.

`@click` becomes `v-on:click`

`@submit` becomes `v-on:submit`

`@keyup.enter` becomes `v-on:keyup.enter`


### Escaping & Statics

Content can be made static by escaping the tag with a trailing double quote mark.

`p" Hello world!` becomes `<p>Hello world!</p>`

Attributes can be made static by escaping the attribute name with a leading single quote mark.

`"type text/css` becomes `type="text/css"`

Additionally, the `class`, `id`, and `href` attributes can be made static by escaping the attribute value with a leading period, pound sign, or closing angle bracket, respectively.

`.center` becomes `class="center"`

`#install` becomes `id="install"`

`>https://example.org` becomes `href="https://example.org"`

### Multiline

Element content can extend to additional lines by beginning the line with a vertical pipe and space, at the same indentation level as the element tag, before any directives or attributes.

```html
//louk
div a
.outer
    span b
    .inner
| c

//html
<div class="outer">
    {{a}}
    <span class="inner">{{b}}</span>
    {{c}}
</div>
```

Multiline content can be made static by following the vertical pipe with a double quote mark (`|"`).

### Component Sections

Single file component sections are denoted with a trailing comma, and must be unindented. Only the `template` section will have its contents parsed as Louk.

```html
//louk
template,
    <!-- Template goes here -->
script,
    // Script goes here
style,
    /* Style goes here */

//html
<template>
    <!-- Template goes here -->
</template>
<script>
    // Script goes here
</script>
<style>
    /* Style goes here */
</style>
```

### Comments & HTML

Comments are indicated with two leading forward slashes and will not be included in the HTML output.

```html
//louk
div save
//Triggers dialog
@click confirm

//html
<div v-on:click="confirm">{{save}}</div>
```
Raw HTML will be passed through unmodified. Louk notation can be included on new lines between HTML tags.

```html
//louk
<div>
    <!-- A comment -->
    h1 title
    #title
</div>

//html
<div>
    <!-- A comment -->
    <h1 id="title">{{title}}</h1>
</div>
```

## Options

Indentation and newlines are kept by default, but can be removed with the `whitespace` option.
```js
louk(content, {whitespace: false})
```

Sections can be assigned default `lang` attributes. Setting these explicitly in the component will override defaults.
```js
louk(content, {langs: {style: "stylus"}})
```

## Example

```html
//louk
template,

    div
    #main
        button string
        @click greet

script,
"lang ts

    export default {
      methods:{
          greet: function(){alert('Hello!')}
      },
      data: function(){
        return {string: 'Greet'}
      }
    }

style,
"scoped

    button{
        background-color: blue;
    }

//html
<template>
    <div id="main">
        <button v-on:click="greet">{{string}}</button>
    </div>
</template>
<script lang="ts">
    export default {
      methods:{
          greet: function(){alert('Hello!')}
      },
      data: function(){
        return {string: 'Greet'}
      }
    }
</script>
<style scoped>
    button{
        background-color: blue;
    }
</style>
```
