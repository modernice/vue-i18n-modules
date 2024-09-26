import path from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'

// @ts-expect-error no typings
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

export default antfu(
  {
    rules: {
      'no-console': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
    },
  },
  compat.extends('eslint-config-prettier'),
)
