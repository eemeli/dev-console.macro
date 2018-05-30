# dev-console.macro

This is a [Babel](https://babeljs.io/) macro to be used with [babel-plugin-macros](https://www.npmjs.com/package/babel-plugin-macros). By default, it'll remove all `console.log`, `console.warn` and `console.error` calls from `production` builds. Internally it uses [babel-plugin-transform-remove-console](https://babeljs.io/docs/plugins/transform-remove-console/).

## Installation

```
npm install --save-dev dev-console.macro babel-plugin-macros
```

## Usage

```js
import console from 'dev-console.macro'

console.log('This is a', 'log message')
// Removed in production & staging builds

console.error('Nothing to see here')
// Removed in production builds

const w = console.warn.bind(console)
w("Being tricky won't help you")
// In production & staging, `w` will be defined as `function () {}`
```

## Configuration

First of all, you'll need to have `"macros"` included as a Babel plugin. In some environments like [react-scripts 2.0](https://github.com/facebook/create-react-app/issues/3815) this will already be done for you; for more details please refer to the [babel-plugin-macros documentation](https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/user.md).

If you'd like to customise this macro's behaviour in specific environments and/or exclude specific methods of `console` from being removed, set the value of the `remove-console` key in your [babel-plugin-macros config](https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/author.md#config-experimental). The default config corresponds to this:

```json
{
  "remove-console": {
    "production": true,
    "staging": { "exclude": ["error"] }
  }
}
```
