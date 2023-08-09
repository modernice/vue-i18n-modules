import { Plugin } from '@vue/runtime-core'
import { type Extension, ExtensionKey } from './extension.js'
import type { useExtension } from './composables.js'

/**
 * Creates the extension as a Vue plugin. After installing the plugin, you can use
 * {@link useExtension} to access the translation loader.
 */
export function createPlugin(extension: Extension): Plugin {
  return (app) => app.provide(ExtensionKey, extension)
}
