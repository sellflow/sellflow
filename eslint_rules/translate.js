module.exports = {
  create: function(context) {
    return {
      CallExpression(node) {
        let { callee } = node;
        if (callee.type === 'Identifier' && callee.name === 't') {
          let scope = context.getScope();
          while (scope && scope.type !== 'global') {
            if (scope.set.has('t')) {
              // t is not global
              return;
            }
            scope = scope.upper;
          }
          let args = node.arguments;
          if (!args || args.length === 0) {
            context.report({
              node,
              message: 't() must take at least one argument.',
            });
            return;
          }
          let arg = args[0];
          if (
            // Not a literal
            (arg.type !== 'Literal' && arg.type !== 'TemplateLiteral') ||
            // Non-string literal.
            (arg.type === 'Literal' && typeof arg.value !== 'string') ||
            // Template literal with expressions.
            (arg.type === 'TemplateLiteral' && arg.expressions.length)
          ) {
            context.report({
              node: arg,
              message: 'First argument to t() must be a string literal.',
            });
          }
        }
      },
    };
  },
};
