const { createMacro, MacroError } = require('babel-plugin-macros')
const plugin = require('babel-plugin-transform-remove-console')

const defaultConfig = {
  production: true,
  staging: { exclude: ['error'] }
}

function macro({ babel, config = defaultConfig, references, state }) {
  if (!references.default) {
    throw new MacroError('dev-console.macro requires a default import')
  }
  const opts = config[process.env.NODE_ENV]
  if (!opts) return

  // console needs to be in global scope for the plugin
  const { node, scope } = references.default[0]
  scope.removeBinding(node.name)
  scope.addGlobal(node)

  const { CallExpression, MemberExpression } = plugin(babel).visitor
  state.file.path.traverse({
    CallExpression(path) {
      CallExpression(path, { opts })
    },
    MemberExpression: {
      exit(path) {
        MemberExpression.exit(path, { opts })
      }
    }
  })
}

module.exports = createMacro(macro, { configName: 'remove-console' })
