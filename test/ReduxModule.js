import { expect } from "chai";
import * as Redux from "redux";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import modulesEnhancer from "redux-modules-enhancer";
import ReduxModule from "../lib/ReduxModule";

describe("ReduxModule", function() {

    it("should support adding a module", function() {

      const baseReducerActions = [];
      let reducer = (state = {}, action) => { baseReducerActions.push(action); return state };
      let initialState = {};
      let enhancer = modulesEnhancer();
      let store = Redux.createStore(reducer, initialState, enhancer);

      let moduleReducerActions = [];
      let moduleId = "my-module"
      let moduleReducer = function(state, action) {
        moduleReducerActions.push(action);
        return state;
      }

      let moduleInitialState = { bob: "the builder" };

      let middlewareActions = [];
      let moduleMiddleware = store => next => action => { middlewareActions.push(action); return next(action); }

      const MY_AMAZING_ACTION = "MY_AMAZING_ACTION"
      store.dispatch({ type: MY_AMAZING_ACTION });
      let provider = <Provider store={store}>
        <ReduxModule moduleId={moduleId} reducer={moduleReducer} initialState={moduleInitialState} middlewares={ [ moduleMiddleware ] } />
      </Provider>
      let renderedElement = ReactDOMServer.renderToString(provider);
      store.dispatch({ type: MY_AMAZING_ACTION });

      expect(baseReducerActions.length).to.equal(4); // INIT, MY_AMAZING_ACTION, MODULE_ADDED, MY_AMAZING_ACTION
      expect(moduleReducerActions.length).to.equal(2); // MODULE_ADDED, MY_AMAZING_ACTION
      expect(middlewareActions.length).to.equal(2); // MODULE_ADDED, MY_AMAZING_ACTION

    });
});
