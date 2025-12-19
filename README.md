# Comet Components WordPress block editor plugin

This plugin is a WordPress implementation of the majority of Double-E Design's Comet Components library and standard customisations of the block editor itself. It includes a selection of the components as blocks, as well as some designed for use directly in templates (such as `SiteHeader`, `SiteFooter`, and
`Menu`). The blocks use a combination of attribute controls that leverage the block editor's native control components and Advanced Custom Fields Pro for their content.

If you're reading this from GitHub, you're seeing the mirror of the [Comet Components WordPress Block Editor Plugin package](https://github.com/doubleedesign/comet-components/tree/master/packages/comet-plugin) that is here for the purposes of publishing to Packagist and installing via Composer.

Development of this project belongs in the main Comet Components monorepo.

## Feature support

This plugin is intended for use as the primary block library in a site. In order to ensure a straightforward editing experience for clients, a number of block editor and adjacent core features are either actively disabled (if necessary) or not supported (if they are opt-in). These include:
- Most core blocks are disabled
- Block patterns are disabled in favour of a "Shared content" custom post type which works similarly but has better UX for clients (given how I usually set everything else up)
- Full-site editing (FSE) is not supported.

The plugin is intended to be used with the Comet Canvas (Block Editor Edition) theme as a parent theme. It would be considered a "hybrid" theme in that it uses traditional PHP templates for rendering, but leverages the block editor for content editing (for the post types it is suitable for).

## Extending

This block collection can be extended in client sites using site-specific plugins or themes that define their own blocks. The code that disables core blocks does not prevent registration of new blocks (as long as they aren't namespaced with `core/`), and the block editor customisations can be extended or overridden by enqueuing additional JavaScript in the block editor context.

---

## Developer notes

### Local development

When working on this plugin within the monorepo, use `composer.local.json` so that symlinked local packages are used:

```powershell
$env:COMPOSER = "composer.local.json"; composer update --prefer-source
```

If editing the custom attribute controls (React components), ensure you install the JS dependencies:

```powershell
npm install
```

You can compile the `CustomControlsWrapper` using:

```powershell
npm run build
```

### Custom controls for the block editor

For UX consistency across blocks, custom controls have been created for use in block inspector panels for things like colour and layout options for the custom blocks that support the corresponding attributes. They are "custom" in that they are React components created specifically for attributes defined by the Comet Components block definitions, but they leverage native block editor components where possible to ensure familiar, consistent, well-supported editor UX.

The custom controls are all rendered in one wrapping component, `CustomControlsWrapper`, which needs to be compiled (Rollup is configured for this) and enqueued in the block editor for the controls to be available.

When making changes to the components, recompile the `CustomControlsWrapper` using `npm run build` or use an automatic watcher in PhpStorm to rebuild when any of the files change.

### Why ACF Pro for content + Gutenberg-esque attribute controls?

I have found that this combination provides the best editor experience for clients - ACF fields for almost all content ensures a consistent and easy-to-understand content editing experience, while the customised but native attribute controls provide straightforward access to styling and layout options that specific blocks support.

### File structure

Due to the way that some things for the block editor can be done in PHP and others must be done in JavaScript, some of
the code organisation feels a bit unintuitive because there can be code in either language that deals with the same
domain. The following table outlines the purpose these pairs of files in this plugin.

| PHP file                       | JS or other file         | Purpose                                                                                                                                                                                                                                                                                                                       |
|--------------------------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `JavaScriptImplementation.php` | -                        | Provides an explicit structure for pairing PHP and JS files that do related things, and handles enqueueing of the JS file in the WordPress admin.                                                                                                                                                                             |
| `BlockRegistry.php`            | `block-registry.js`      | Manages availability, supported features, styles, and variations for non-Comet blocks. This includes expressly disabling most Core blocks, while ensuring some supported plugin blocks (such as Ninja Forms' form block) remain available.                                                                                    |
|
| `BlockEditorConfig.php`        | `block-editor-config.js` | Customisations to the organisation of blocks in the editor such as categorisation, labels and descriptions, and restrictions on parent/child block relationships; customisations to the editor itself such as disabling unwanted/unsupported editor features and customising editor behaviour e.g., sidebar/panel appearance. |

