// rollup.config.js
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { createFilter } from '@rollup/pluginutils';
import { glob } from 'glob';

export default [
	// Block editor components
	{
		input: glob.sync('src/editor/**/*.jsx'),
		output: {
			dir: 'src/editor',
			format: 'es',
			entryFileNames: (chunkInfo) => {
				const name = chunkInfo.name.replace(/^src\/editor\//, '');

				return `${name}.dist.js`;
			},
			sourcemap: true,
			preserveModules: true,
		},
		external: [
			/^@wordpress\/.+$/,
			'react',
			'react-dom'
		],
		plugins: [
			wordpressGlobals(),
			resolve({
				extensions: ['.js', '.jsx'],
				browser: true
			}),
			babel({
				babelHelpers: 'bundled',
				presets: [
					'@babel/preset-react'
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import'
				],
				extensions: ['.js', '.jsx']
			})
		]
	}
];

// Custom plugin to transform WordPress imports to globals
// Note: This does not work with @wordpress/icons
function wordpressGlobals(options = {}) {
	const filter = createFilter(options.include || ['**/*.js', '**/*.jsx'], options.exclude || 'node_modules/**');
	const wpPackages = {
		'@wordpress/blocks': 'wp.blocks',
		'@wordpress/block-editor': 'wp.blockEditor',
		'@wordpress/element': 'wp.element',
		'@wordpress/data': 'wp.data',
		'@wordpress/components': 'wp.components',
		'@wordpress/i18n': 'wp.i18n',
		'@wordpress/compose': 'wp.compose',
		'@wordpress/hooks': 'wp.hooks',
		'@wordpress/server-side-render': 'wp.serverSideRender',
		'react': 'React',
		'react-dom': 'ReactDOM'
	};

	return {
		name: 'wordpress-globals',

		// This runs before the code is parsed into an AST
		transform(code, id) {
			if (!filter(id)) return null;

			let hasTransformed = false;
			let transformedCode = code;

			// Handle each WordPress package
			Object.entries(wpPackages).forEach(([packageName, globalName]) => {
				// Match import statements for this package
				const importRegex = new RegExp(`import\\s+{\\s*([^}]+)\\s*}\\s+from\\s+['"]${packageName}['"]`, 'g');
				let match;

				while ((match = importRegex.exec(code)) !== null) {
					hasTransformed = true;
					const importedItems = match[1].split(',').map(item => item.trim());

					// Create destructuring assignment from global
					const destructuring = `const { ${importedItems.join(', ')} } = ${globalName};`;

					// Replace the import with destructuring
					transformedCode = transformedCode.replace(match[0], destructuring);
				}

				// Handle default imports
				const defaultImportRegex = new RegExp(`import\\s+(\\w+)\\s+from\\s+['"]${packageName}['"]`, 'g');
				while ((match = defaultImportRegex.exec(code)) !== null) {
					hasTransformed = true;
					const importedName = match[1];

					// Create variable assignment from global
					const assignment = `const ${importedName} = ${globalName};`;

					// Replace the import with assignment
					transformedCode = transformedCode.replace(match[0], assignment);
				}
			});

			if (hasTransformed) {
				return {
					code: transformedCode,
					map: null // We could generate a source map, but it's not critical
				};
			}

			return null;
		}
	};
}
