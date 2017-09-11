import PropTypes from "prop-types";

const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})

// <ReduxModule moduleId="my-module" reducer={ myModuleReducer } initialState={ myModuleInitialState } middleware={ [ myModuleMiddlware1, myModuleMiddlware2 ] } />
// or
// <ReduxModule module={myModule} />
const ReduxModule = function(props, context) {
  const store = context.store;
  const module = props.module;
  let moduleId;
  if (module !== undefined) {
    moduleId = module.moduleId;
  } else {
    moduleId = props.moduleId;
  }

  if (!store.hasModule(moduleId)) {
    let middleware = props.middlewares;
    if (middleware instanceof Function) {
      middleware = [ middleware ];
    }

    if (module !== undefined) {
      store.addModule(module);
    } else {
      store.addModule(props.moduleId, props.reducer, props.initialState, ...middleware);
    }
  }

  return null;
};

ReduxModule.contextTypes = {
  store: storeShape.isRequired,
}

export default ReduxModule;
