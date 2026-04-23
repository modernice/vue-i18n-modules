import { describe, expect, it } from 'vitest'
import { createGlobLoader } from './loader'

describe('createGlobLoader', () => {
  it('loads an exact path match', async () => {
    const loader = createGlobLoader({
      '#i18n-dictionary/catalog/en.json': { default: { title: 'Catalog' } },
    }, {
      prefix: '#i18n-dictionary',
    })

    await expect(
      loader({ module: 'catalog', path: 'catalog/en.json' }),
    ).resolves.toEqual({ title: 'Catalog' })
  })

  it('falls back to a unique suffix match', async () => {
    const loader = createGlobLoader({
      '/@fs/workspace/dictionary/catalog/en.json': {
        default: { title: 'Catalog' },
      },
    }, {
      prefix: '#i18n-dictionary',
    })

    await expect(
      loader({ module: 'catalog', path: 'catalog/en.json' }),
    ).resolves.toEqual({ title: 'Catalog' })
  })

  it('prefers the shortest suffix match when nested modules collide', async () => {
    const loader = createGlobLoader({
      '/@fs/workspace/dictionary/catalog/en.json': {
        default: { title: 'Catalog' },
      },
      '/@fs/workspace/dictionary/backend/catalog/en.json': {
        default: { title: 'Backend Catalog' },
      },
    }, {
      prefix: '#i18n-dictionary',
    })

    await expect(
      loader({ module: 'catalog', path: 'catalog/en.json' }),
    ).resolves.toEqual({ title: 'Catalog' })
  })

  it('keeps reporting unresolved modules when matches stay ambiguous', async () => {
    const loader = createGlobLoader({
      '/a/catalog/en.json': { default: { title: 'Catalog A' } },
      '/b/catalog/en.json': { default: { title: 'Catalog B' } },
    }, {
      prefix: '#i18n-dictionary',
    })

    await expect(
      loader({ module: 'catalog', path: 'catalog/en.json' }),
    ).rejects.toThrow(
      '[vue-i18n-modules] Message module "catalog" not found at path "#i18n-dictionary/catalog/en.json".',
    )
  })
})
