# Changelog


## v0.3.1

[compare changes](https://github.com/modernice/vue-i18n-modules/compare/v0.0.21...v0.3.1)

### 🚀 Enhancements

- Extract nuxt-i18n-modules package ([816eef3](https://github.com/modernice/vue-i18n-modules/commit/816eef3))
- **package.json:** Add publishConfig to package.json to allow public access when publishing the package ([854055e](https://github.com/modernice/vue-i18n-modules/commit/854055e))
- **nuxt:** Allow custom extension options ([6f00b3f](https://github.com/modernice/vue-i18n-modules/commit/6f00b3f))
- Remove _playground directory and its related files to clean up the project structure ([dc06ca5](https://github.com/modernice/vue-i18n-modules/commit/dc06ca5))
- **nuxt.config.ts): remove '@nuxtjs/i18n' from modules array to avoid manual addition feat(module.ts:** Add check and installation for '@nuxtjs/i18n' module to ensure it's always present ([8611771](https://github.com/modernice/vue-i18n-modules/commit/8611771))
- **nuxt): create new const.ts file to store middleware constants refactor(plugin.ts:** Import middleware constants from const.ts for cleaner code structure and better maintainability ([7ae48f8](https://github.com/modernice/vue-i18n-modules/commit/7ae48f8))
- **nuxt/module.ts:** Export all from './const' to make constants available for import in other modules ([4c1d0f5](https://github.com/modernice/vue-i18n-modules/commit/4c1d0f5))
- **extension.ts:** Add localize function to load message modules for given locale(s) ([21aacab](https://github.com/modernice/vue-i18n-modules/commit/21aacab))
- **package.json:** Add prepack script to ensure build before packaging ([42d53df](https://github.com/modernice/vue-i18n-modules/commit/42d53df))
- Add Makefile with docs command to generate documentation ([98ddd2d](https://github.com/modernice/vue-i18n-modules/commit/98ddd2d))
- **extension.ts:** Return moduleNamespace function ([cf037db](https://github.com/modernice/vue-i18n-modules/commit/cf037db))
- **composables.ts:** Add messageNamespace function ([bc9763d](https://github.com/modernice/vue-i18n-modules/commit/bc9763d))
- Add debug log ([bbf9d66](https://github.com/modernice/vue-i18n-modules/commit/bbf9d66))
- **composables.ts:** Add getCurrentInstance check before running init functions to ensure they are run in the correct context ([a15ff3f](https://github.com/modernice/vue-i18n-modules/commit/a15ff3f))
- Add debug log ([e1e1a5f](https://github.com/modernice/vue-i18n-modules/commit/e1e1a5f))
- **vue-i18n-modules:** Add TypeScript definition files for index and vite to support TypeScript import/export ([92def1d](https://github.com/modernice/vue-i18n-modules/commit/92def1d))
- **nuxt/playground:** Add 'object-array' i18n module with components and types ([3b4968c](https://github.com/modernice/vue-i18n-modules/commit/3b4968c))
- **vue-i18n-modules:** Bump version to 0.2.0 for new features release ([69bf59c](https://github.com/modernice/vue-i18n-modules/commit/69bf59c))
- **eslint): add ESLint configuration file to enforce coding standards and improve code quality chore(package:** Add @eslint/eslintrc as a dev dependency for ESLint compatibility with custom configurations ([70a9ad7](https://github.com/modernice/vue-i18n-modules/commit/70a9ad7))
- **package.json:** Add "type": "module" to enable ES module support in the project ([c233aa1](https://github.com/modernice/vue-i18n-modules/commit/c233aa1))

### 🩹 Fixes

- **runtime/plugin.ts:** Change the order of plugin execution to run after @nuxtjs/i18n ([421db11](https://github.com/modernice/vue-i18n-modules/commit/421db11))
- **plugin.ts:** Change import path for InitialModulesMiddleware and MessagesMiddleware to '../module' ([21b4296](https://github.com/modernice/vue-i18n-modules/commit/21b4296))
- **extension.ts:** Correct the file extension for locale files from 'on' to '.json' to ensure correct file loading ([a5c6961](https://github.com/modernice/vue-i18n-modules/commit/a5c6961))
- **nuxt:** Change module declaration from '#app' to 'nuxt/dist/pages/runtime/composables' ([d4bdd89](https://github.com/modernice/vue-i18n-modules/commit/d4bdd89))
- **augment.d.ts:** Add 'export {}' ([8b8f902](https://github.com/modernice/vue-i18n-modules/commit/8b8f902))
- **composables.ts:** Pass instance to onServerPrefetch and onBeforeMount to ensure correct context is used during initialization ([277cb7d](https://github.com/modernice/vue-i18n-modules/commit/277cb7d))
- **package.json:** Replace npm with pnpm in release script for consistency with package manager usage ([48d158c](https://github.com/modernice/vue-i18n-modules/commit/48d158c))
- **package.json:** Remove test script from release command to skip tests during release process ([a48d18e](https://github.com/modernice/vue-i18n-modules/commit/a48d18e))

### 💅 Refactors

- **plugin.ts, augment.d.ts:** Move PageMeta interface declaration from plugin.ts to augment.d.ts for better code organization ([9add640](https://github.com/modernice/vue-i18n-modules/commit/9add640))
- **nuxt:** Move constants to a separate file in runtime directory for better organization ([97a04a8](https://github.com/modernice/vue-i18n-modules/commit/97a04a8))
- **vue-i18n-modules:** Move ExtensionKey from extension.ts to internal.ts for better organization ([2694d81](https://github.com/modernice/vue-i18n-modules/commit/2694d81))
- **augment.d.ts:** Change module declaration from 'nuxt/dist/pages/runtime/composables' to '#app' ([6c606de](https://github.com/modernice/vue-i18n-modules/commit/6c606de))
- **nuxt:** Move constants to middleware.ts ([668ddad](https://github.com/modernice/vue-i18n-modules/commit/668ddad))

### 📖 Documentation

- **README.md:** Remove Nuxt section as it's no longer relevant, keeping the documentation up-to-date and clean ([719011a](https://github.com/modernice/vue-i18n-modules/commit/719011a))

### 🏡 Chore

- **package.json:** Bump version from 0.0.21 to 0.1.0 to reflect significant changes in the package ([f4435b9](https://github.com/modernice/vue-i18n-modules/commit/f4435b9))
- **package.json:** Bump version from 0.0.1 to 0.1.0 to reflect new features and improvements in the package ([2aac3b6](https://github.com/modernice/vue-i18n-modules/commit/2aac3b6))
- **nuxt/package.json:** Bump version from 0.1.0 to 0.1.1 for new release ([1e138bc](https://github.com/modernice/vue-i18n-modules/commit/1e138bc))
- **nuxt/package.json:** Bump package version from 0.1.1 to 0.1.2 for new release ([51b0414](https://github.com/modernice/vue-i18n-modules/commit/51b0414))
- **nuxt/package.json:** Bump package version from 0.1.2 to 0.1.3 for new release ([65f5354](https://github.com/modernice/vue-i18n-modules/commit/65f5354))
- **nuxt/package.json:** Bump package version from 0.1.3 to 0.1.4 for new release ([9180898](https://github.com/modernice/vue-i18n-modules/commit/9180898))
- **nuxt/package.json:** Bump package version from 0.1.4 to 0.1.5 for new release ([36754b2](https://github.com/modernice/vue-i18n-modules/commit/36754b2))
- **nuxt/package.json:** Bump package version from 0.1.5 to 0.1.6 for new release ([f2232a6](https://github.com/modernice/vue-i18n-modules/commit/f2232a6))
- **package.json:** Bump version from 0.1.0 to 0.1.1 for new release of vue-i18n-modules package ([0b3b0bf](https://github.com/modernice/vue-i18n-modules/commit/0b3b0bf))
- **package.json:** Bump version from 0.1.1 to 0.1.2 for a new release of @modernice/vue-i18n-modules package ([f896a02](https://github.com/modernice/vue-i18n-modules/commit/f896a02))
- **package.json:** Bump version from 0.1.2 to 0.1.3 for new release of vue-i18n-modules package ([0bde064](https://github.com/modernice/vue-i18n-modules/commit/0bde064))
- Bump version of @modernice/nuxt-i18n-modules from 0.1.6 to 0.1.7 and @modernice/vue-i18n-modules from 0.1.3 to 0.1.4 for new release ([506c008](https://github.com/modernice/vue-i18n-modules/commit/506c008))
- **package.json:** Bump package version from 0.1.4 to 0.1.5 for a new release ([42835b0](https://github.com/modernice/vue-i18n-modules/commit/42835b0))
- **nuxt/package.json:** Bump package version from 0.1.7 to 0.1.8 for a new release ([daf9aa4](https://github.com/modernice/vue-i18n-modules/commit/daf9aa4))
- **vue-i18n-modules/package.json): bump package version from 0.1.5 to 0.1.6 for new release refactor(vue-i18n-modules/src/composables.ts): modify ModuleTranslateFn type definition to improve type safety refactor(vue-i18n-modules/src/composables.ts:** Adjust translate constant type to match updated ModuleTranslateFn type definition ([f33a6b8](https://github.com/modernice/vue-i18n-modules/commit/f33a6b8))
- **package.json:** Bump package version from 0.1.6 to 0.1.7 for a new release ([687458c](https://github.com/modernice/vue-i18n-modules/commit/687458c))
- **package.json:** Bump package version from 0.1.7 to 0.1.8 for a new release ([de8eb30](https://github.com/modernice/vue-i18n-modules/commit/de8eb30))
- **nuxt:** Bump package version from 0.1.8 to 0.1.9 ([f5b847a](https://github.com/modernice/vue-i18n-modules/commit/f5b847a))
- **nuxt/package.json:** Bump package version from 0.1.9 to 0.1.10 for new release ([22a62e1](https://github.com/modernice/vue-i18n-modules/commit/22a62e1))
- Bump versions ([d5fd6d6](https://github.com/modernice/vue-i18n-modules/commit/d5fd6d6))
- **package.json:** Bump package version from 0.1.9 to 0.1.10 for a new release ([fdf32ae](https://github.com/modernice/vue-i18n-modules/commit/fdf32ae))
- **package.json:** Update @nuxtjs/i18n and vue-i18n versions in peerDependencies This change is done to keep the project up-to-date with the latest versions of dependencies. ([3bb55e8](https://github.com/modernice/vue-i18n-modules/commit/3bb55e8))
- **package.json:** Bump version from 0.1.10 to 0.1.11 for new release ([9d4f94f](https://github.com/modernice/vue-i18n-modules/commit/9d4f94f))
- **package.json:** Bump version from 0.1.11 to 0.1.12 for new release ([2b76a94](https://github.com/modernice/vue-i18n-modules/commit/2b76a94))
- **package.json:** Bump version from 0.1.12 to 0.1.13 for new release ([9e4e047](https://github.com/modernice/vue-i18n-modules/commit/9e4e047))
- **nuxt/package.json:** Bump version from 0.1.11 to 0.1.12 for new release ([edaf14a](https://github.com/modernice/vue-i18n-modules/commit/edaf14a))
- **package.json:** Bump version from 0.1.13 to 0.1.14 for new release ([9318763](https://github.com/modernice/vue-i18n-modules/commit/9318763))
- **package.json:** Bump version from 0.1.14 to 0.1.15 for new release ([05b8966](https://github.com/modernice/vue-i18n-modules/commit/05b8966))
- **package.json): update devDependencies for improved compatibility and features across the project chore(nuxt.config.ts): add compatibilityDate to specify the compatibility date for the Nuxt configuration fix(extension.ts:** Import computed from 'vue' instead of '@vue/reactivity' for consistency with Vue 3 best practices ([7be0e77](https://github.com/modernice/vue-i18n-modules/commit/7be0e77))
- **package.json:** Bump version from 0.2.0 to 0.3.0 to reflect new changes and updates in the vue-i18n-modules package ([773216a](https://github.com/modernice/vue-i18n-modules/commit/773216a))
- **nuxt:** Bump version from 0.1.12 to 0.2.0 to reflect new changes and improvements in the package ([9cd8051](https://github.com/modernice/vue-i18n-modules/commit/9cd8051))
- **package.json): update devDependencies to latest versions for improved stability and features chore(nuxt): upgrade Nuxt and related dependencies to v4 with updated peerDependencies and devDependencies feat(nuxt): add i18n locales configuration and enable debug mode in playground nuxt.config.ts feat(nuxt): add new playground app with i18n modules integration and example components for testing translations feat(nuxt): add type augmentation for vue-i18n-modules to define message modules interfaces refactor(nuxt): improve dictionary path resolution in module.ts to handle Nuxt 4 app directory structure chore(nuxt): add module dependency on @nuxtjs/i18n and update compatibility to Nuxt 4 style(nuxt): fix trailing slash removal in dictionary path normalization chore(nuxt): update tsconfig.json to set module to ESNext and moduleResolution to Bundler chore(vue-i18n-modules): update dependencies to latest versions for Vue 3.5 and Vue I18n 11 compatibility chore(nuxt/playground): add initial Nuxt playground app with i18n modules and example usage components and dictionaries chore(nuxt/playground): update package.json to use latest jiti and Nuxt 4 versions chore(nuxt/playground:** Add empty i18n plugin stub for future implementation ([0941a9a](https://github.com/modernice/vue-i18n-modules/commit/0941a9a))
- **package.json:** Bump version to 0.4.0 for vue-i18n-modules package ([b89efa5](https://github.com/modernice/vue-i18n-modules/commit/b89efa5))
- **nuxt:** Bump version from 0.2.0 to 0.3.0 to reflect new changes ([52a925b](https://github.com/modernice/vue-i18n-modules/commit/52a925b))

### 🎨 Styles

- **plugin.ts, tsconfig.json:** Reorder imports and compilerOptions for consistency and clarity ([4f1de6d](https://github.com/modernice/vue-i18n-modules/commit/4f1de6d))

### ❤️ Contributors

- Bounoable <bounoable@gmail.com>
- Saman Hosseini <bounoable@gmail.com>

