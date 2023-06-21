# SVG Sheet

Takes in a list of source SVG assets, minifies them and then merges them into a single sprite sheet. Useful for simple animations.

Note: this is not a general purpose solution, but tailored to a specific set of SVGs (that are not included in this repo).

## Usage

Install everything:

```shell
yarn
```

Put your source assets in the `srcAssets` folder.

Minify everything:

```shell
yarn min
```

Build everything into a single sprite sheet:

```shell
yarn build
```

Get your asset from `dist`.