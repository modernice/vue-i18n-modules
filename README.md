# vue-i18n-modules

An extension for [vue-i18n](https://github.com/intlify/vue-i18n-next) that
provides namespaced lazy-loading of messages, as opposed to the default behavior
of vue-i18n, which always loads all messages for a specific locale.

## Introduction

Large applications that use vue-i18n for internationaliztion often have a large
amount of message files for different parts of the application. For better
performance, it is desirable to only load a set of messages when they're
actually needed, instead of loading all messages for a specific locale all at
once.

### Prerequisites

- Vue >= v3.0.0
- vue-i18n >= v9.0.0

### Limitations

- Only supports vue-i18n's [Composition API](https://vue-i18n.intlify.dev/guide/advanced/composition.html); does not support legacy mode
- Currently only supports Vite's `import.meta.glob` for loading message files
- Message directory must be organized in a specific way

## Installation

```sh
npm i vue-i18n@^9 @modernice/vue-i18n-modules

pnpm i vue-i18n@^9 @modernice/vue-i18n-modules

yarn add vue-i18n@^9 @modernice/vue-i18n-modules
```

## Setup

```ts
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createExtension, createPlugin } from 'vue-i18n-modules'
import { createGlobLoader } from 'vue-i18n-modules/vite'

// First create the vue-i18n instance.
const i18n = createI18n({
  // Legacy mode is not supported!
  legacy: false,
})

// Setup a loader for message files in the `./messages` directory.
const loader = createGlobLoader(import.meta.glob('./messages/**/*.json'), {
  // The prefix allows you to reference/load message modules without
  // having to specify the full path to the directory.
  prefix: './messages/'
})

// Create the extension from the vue-i18n instance and module loader.
const extension = createExtension({ i18n, loader })

// Create the Vue plugin from the extension.
const plugin = createPlugin(extension)

createApp()
  .use(i18n)
  .use(plugin)
  .mount('#app')
```

## Basic usage

Given that your message modules are in the `./messages` directory, you must
create a directory structure like this:

- `./messages`
  - `./foo`
    - `./en.json`
    - `./de.json`
    - `./fr.json`
    - `./foobar`
      - `./en.json`
      - `./de.json`
      - `./fr.json`
  - `./bar`
    - `./en.json`
    - `./de.json`
    - `./fr.json`
    - `./barbaz`
      - `./en.json`
      - `./de.json`
      - `./fr.json`

The above directory structure defines 4 modules: "foo", "bar", "foo.foobar", and
"bar.barbaz". Each module provides its messages for the locales that are configured
in the vue-i18n instance.

Given that `./messages/foo/foobar/en.json` has the following contents:

```json
{
  "page": {
    "title": "Hello, Foo!"
  }
}
```

You can lazy-load and translate the title like this:

```ts
// Within a Vue setup function
import { useExtension } from 'vue-i18n-modules'

const { loadModule, translate } = useExtension()

// Loads the messages of the "foo.foobar" module.
await loadModule('foo.foobar')

// Translate the title in the currently active locale.
const title = translate('foo.foobar', 'page.title')
```

The `translate` function utilities vue-i18n's translate function internally,
so you can pass vue-i18n's translate options to this function.

## Typed modules

You can define types for your message modules by augmenting the `DefineModules`
interface. When defining at least one module, this extension enforces strictness
in module names passed to the `translate` function.

For example, you could create `./messages/foo/foobar/index.ts` to define the
type of the `foo.foobar` module:

```ts
// ./messages/foo/foobar/index.ts
import type foobar from './en.json'

/**
 * Foobar messages.
 */
export type Foobar = typeof foobar
```

Then augment the `DefineModules` interface to enable strict typing:

```ts
// in a project-wide *.d.ts file
import { Foobar } from './messages/foo/foobar/index.js'

declare module '@modernice/vue-i18n-modules' {
  interface DefineModules {
    'foo.foobar': Foobar
  }
}
```

If at least one module is defined, the `translate` function only accepts defined
module names instead of arbitrary strings. The following will raise a TypeScript
error:

```ts
// Within a Vue setup function
import { useExtension } from 'vue-i18n-modules'

const { loadModule, translate } = useExtension()

// This will not work
await loadModule('unknown-module-name')

// This won't work either
const title = translate('unknown-module-name', 'some.key')

// This also won't work because the key does not exist in the file
const title = translate('foo.foobar', 'some.key')
```

## useMessages()

Instead of `useExtension()`, you may call `useMessages()` to get a translate
function for a specific module:

```ts
// Within a Vue setup function
import { useMessages } from 'vue-i18n-modules'

const { translate } = useMessages('foo.foobar', {
  // Immediately load the module within `onServerPrefetch`
  // and/or `onMounted`.
  load: true,
})

// Now you can omit the module name
const title = translate('page.title')
```

## Nuxt

This package provides a ready-to-use Nuxt plugin with support for "initial"
modules that are eagerly loaded for every page.

```ts
// ./plugins/i18n.ts
import {
  createExtension,
  createGlobLoader,
} from '@modernice/vue-i18n-modules/nuxt'
import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin((app) => {
  const { vueApp } = app

  // Create the vue-i18n plugin.
  const i18n = createI18n({
    locale: "en",
    fallbackLocale: "en",
    availableLocales: ["en", "de", "fr"],
    legacy: false,
  })

  // Install the vue-i18n plugin.
  vueApp.use(i18n)

  // Create the message loader for the './i18n/messages' directory.
  const loader = createGlobLoader(
    import.meta.glob('./i18n/messages/**/*.json')
  )

  // Create and install the vue-i18n-modules plugin.
  createExtension({
    loader,
    i18n: i18n.global,

    // Modules that are eagerly loaded for every page.
    initial: ['foo', 'bar', 'foo.foobar'],
  })(app)
})
```

### Middleware

A middleware for loading message modules is provided for Nuxt applications:

```ts
// Within a Vue setup function

definePageMeta({
  middleware: 'messages',

  // Load the "foo" and "foo.bar" message modules in a
  // middleware before rendering the page.
  translate: ['foo', 'foo.bar'],
})
```

## License

[MIT](./LICENSE)
