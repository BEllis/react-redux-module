import PropTypes from "prop-types";

const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})

// <ReduxModule moduleId="my-module" reducer={ myModuleReducer } initialState={ myModuleInitialState } middlewares={ [ myModuleMiddlware1, myModuleMiddlware2 ] } />
const ReduxModule = function(props, context) {
  let store = context.store;
  let module = props.module;
  if (!store.hasModule(props.moduleId)) {
    let middlewares = props.middlewares;
    if (middlewares instanceof Function) {
      middlewares = [ middlewares ];
    }
    
    store.addModule(props.moduleId, props.reducer, props.initialState, ...middlewares);
  }

  return null;
};

ReduxModule.contextTypes = {
  store: storeShape.isRequired,
}

export default ReduxModule;
