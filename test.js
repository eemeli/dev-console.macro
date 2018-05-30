import pluginTester from 'babel-plugin-tester'
import plugin from 'babel-plugin-macros'
import macro from './macro'

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: {
    basic: `
      import console from "./macro";
      function foo() {
        console.log("foo");
        blah();
      }
    `,
    guards: `
      import console from "./macro";
      function foo() {
        true && console.log("foo");
        blah();
      }
    `,
    'local-binding': `
      import console from "./macro";
      function foo(console) {
        console.foo("hi");
        const bar = console.foo.bind(console);
      }
      function bar(a) {
        const { console } = a;
        a.b = console => console.bar("bar");
        if (console.foo.call(console, "bar")) {
          return;
        }
      }
    `,
    'member-expr-assignment-no-op': `
      import console from "./macro";
      function foo() {
        console.foo = function foo() {
          console.log("foo");
        };
        console.error = myConsoleError;
        console.foo();
        console.error("asdf");
      }
    `,
    'member-expr-no-op': `
      import console from "./macro";
      const a = console.log;
      a();
      const b = console.log.bind(console);
      b("asdf");
      var x = console.log ? console.log('log') : foo();
      function foo() {
        if (console.error) {
          console.error("Errored");
        }
      }
      console.log.call(console, "foo");
      console.log.apply(null, {});
    `,
    'replace-with-empty-block': `
      import console from "./macro";
      if (blah) console.log(blah);
      for (;;) console.log(blah);
      for (var blah in []) console.log(blah);
      for (var blah of []) console.log(blah);
      while (blah) console.log(blah);
      do console.log(blah); while (blah);
    `,
    'top-level': `
      import console from "./macro";
      true && console.log("foo");
      blah();
    `,
    'top-level-stmts': `
      import console from "./macro";
      console.log("foo");
      blah();
    `
  }
})

describe('config', () => {
  let origOptions
  beforeAll(() => {
    origOptions = macro.options
    macro.options = { configName: 'test-remove-console' }
  })
  afterAll(() => {
    macro.options = origOptions
  })

  pluginTester({
    plugin,
    snapshot: true,
    babelOptions: { filename: __filename },
    tests: {
      'bound-excludes': `
        import console from "./macro";
        function foo() {
          const a = console.log;
          a();
          const b = console.error.bind(console);
          b("asdf");
          blah();
        }
      `,
      excludes: `
        import console from "./macro";
        function foo() {
          console.log("foo");
          console.error("bar");
          blah();
          console.info("blah");
        }
      `
    }
  })
})

describe('errors', () => {
  pluginTester({
    plugin,
    snapshot: false,
    babelOptions: { filename: __filename },
    tests: [
      {
        title: 'no default import',
        code: `
        import { foo } from "./macro";
          foo();
          blah();
        `,
        error: /requires a default import/
      },
      {
        title: 'bad default import name',
        code: `
        import foo from "./macro";
          foo();
          blah();
        `,
        error: /needs to have "console" as its local name/
      }
    ]
  })
})
