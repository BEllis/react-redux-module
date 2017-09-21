# React Redux Module

## IMPORTANT NOTICE

*Experimental* I didn't realise publishing this package to NPM would cause so many downloads. This package is still experimental so I would not currently recommend it for production use yet though I intend for it to production ready in the coming days.

Some middleware may not work with this library as all actions are pushed through each middleware in each module, so some middleware may not handle this scenario gracefully, though thunks and redux-observable have been tested.

## Motivation

Having to compile a list of possible reducers, state and/or middleware ahead-of-time is
error prone (you forget to add a reducer/middleware) and time consuming (hunting
down which reducers and middleware you need).

This has been resolved by using the redux-modules-enhancer that adds support for
adding/removing modules after the store has been created.

In order to avoid polluting JSX code with boilerplate code for adding modules such as,

```javascript
class MyComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.context.store.add(myModule);
  }

  ...
}

MyClass.contextTypes {
  [store]: storeShape.required
}
```

this module provides a ReduxModule component that lets you add a module as part of
the render step, for example,

```javascript
import { connect } from "react-redux";
import { connectModules } from "react-redux-module";
import { createMyModule } from "./my-redux-module.js";

class MyComponent extends Component {
  render() {
    return
      <div>
        ...
      </div>
  }
}

... mapStateToProps & mapDispatchToProps ...

export default connect(mapStateToProps, mapDispatchToProps, connectModules(createMyModule, MyComponent));
```

## How to use it?

The only 2 dependencies required for use are,
  - *redux-modules-enhancer* - use the modulesEnhancer from redux-modules-enhancer when creating your store to add support for adding/removing modules.
  - *react-redux* - use the Provider component to ensure the store is part of the context.

```javascript
  import React from "react";
  import { render } from "react-dom";
  import { createStore } from "redux";
  import modulesEnhancer from "redux-modules-enhancer";

  const store = Redux.createStore(myreducer, myinitialState, modulesEnhancer());

  render(
    <Provider store={store}>
      <MyApp />
    </Provider>,
    document.getElementById('root')
  )
```

or, if you want to use other enhancers as well,

```javascript
  import { createStore, combine, applyMiddleware } from "redux";

  const store = Redux.createStore(myreducer, myinitialState, combine(modulesEnhancer(), applyMiddleware(...)));
```

After that, you just wrap your component using *connectModule* and a factory method for creating your module,

#### MyComponent.jsx
```javascript
import { ReduxModule } from "react-redux-module";
import { connectModules } from "react-redux-module";

class MyComponent extends Component {
  render() {
    return
      <div>
        ...
      </div>
  }
}

/* ... mapStateToProps & mapDispatchToProps ... */

export default connect(mapStateToProps, mapDispatchToProps, connectModules(createMyModule, MyComponent));
```

#### MyModule.js
```javascript
export default function createMyModule(options) {
  const moduleId = options.id || "my-module";
  const initialState = { /* ... initial state ... */ }
  const reducer = (state, action) => {
    // .. reducer logic ..
  }

  const middleware = [ /* ... any middleware required for this module ... */  ];
  const onload = dispatch => {
    /* Any behaviour to take when the module is first loaded. */
  }

  const onunload = dispatch => {
    /* Any behaviour to take when the module is removed from the store. */
  }

  return {
    moduleId,
    initialState,
    reducer,
    middleware,
    onload,
    onunload,
  }
}
```

## API

### connectModules

connectModules(modulesFactory, component)

  - *modulesFactory* is a method that takes a single ownProps argument and returns either a single module object or an array of module objects.
  - *component* is the component to be wrapped that relies on the given modules being loaded.

  The method returns a Component that wraps the given component and will load the given modules when the component is constructed.
