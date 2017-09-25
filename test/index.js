import { expect } from "chai";
import * as Redux from "redux";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import modulesEnhancer from "redux-modules-enhancer";
import { connectModules } from "../dist/react-redux-module";

describe("connectModules", function() {

    it("should support adding a single module", function() {

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

      const MyComponent = function(props) {
        return null;
      }

      const moduleDefinition = {
        moduleId,
        options: {},
        factory: (moduleId, options) => ({ moduleId, reducer: moduleReducer, initialState: moduleInitialState, middleware: moduleMiddleware }),
      }

      const WrappedComponent = connectModules(moduleDefinition)(MyComponent);

      const MY_AMAZING_ACTION = "MY_AMAZING_ACTION"
      store.dispatch({ type: MY_AMAZING_ACTION });
      let provider = <Provider store={store}>
        <WrappedComponent id="test-id" />
      </Provider>
      let renderedElement = ReactDOMServer.renderToString(provider);
      store.dispatch({ type: MY_AMAZING_ACTION });

      expect(baseReducerActions.length).to.equal(4); // INIT, MY_AMAZING_ACTION, MODULE_ADDED, MY_AMAZING_ACTION
      expect(moduleReducerActions.length).to.equal(2); // MODULE_ADDED, MY_AMAZING_ACTION
      expect(middlewareActions.length).to.equal(2); // MODULE_ADDED, MY_AMAZING_ACTION

    });


    it("should support adding multiple module", function() {

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

      const MyComponent = function(props) {
        return null;
      }

      const moduleDefinition = {
        moduleId,
        options: {},
        factory: (moduleId, options) => ({ moduleId, reducer: moduleReducer, initialState: moduleInitialState, middleware: moduleMiddleware }),
      }

      const moduleDefinition2 = {
        moduleId: "second-module-id",
        options: {},
        factory: (moduleId, options) => ({ moduleId, reducer: moduleReducer, initialState: moduleInitialState, middleware: moduleMiddleware }),
      }

      const WrappedComponent = connectModules([ moduleDefinition, moduleDefinition2 ])(MyComponent);

      const MY_AMAZING_ACTION = "MY_AMAZING_ACTION"
      store.dispatch({ type: MY_AMAZING_ACTION });
      let provider = <Provider store={store}>
        <WrappedComponent id="test-id" />
      </Provider>
      let renderedElement = ReactDOMServer.renderToString(provider);
      store.dispatch({ type: MY_AMAZING_ACTION });

      expect(baseReducerActions.length).to.equal(5); // INIT, MY_AMAZING_ACTION, MODULE_ADDED, MODULE_ADDED, MY_AMAZING_ACTION
      expect(moduleReducerActions.length).to.equal(5); // MODULE_ADDED, // MODULE_ADDED (x2) MY_AMAZING_ACTION (x2)
      expect(middlewareActions.length).to.equal(5);  // MODULE_ADDED, // MODULE_ADDED (x2) MY_AMAZING_ACTION (x2)

    });

    it("should throw if store not provided.", function() {

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

      const MyComponent = function(props) {
        return null;
      }

      const moduleDefinition = {
        moduleId,
        options: {},
        factory: (moduleId, options) => ({ moduleId, reducer: moduleReducer, initialState: moduleInitialState, middleware: moduleMiddleware }),
      }

      const moduleDefinition2 = {
        moduleId: "second-module-id",
        options: {},
        factory: (moduleId, options) => ({ moduleId, reducer: moduleReducer, initialState: moduleInitialState, middleware: moduleMiddleware }),
      }

      const WrappedComponent = connectModules([ moduleDefinition, moduleDefinition2 ])(MyComponent);

      const MY_AMAZING_ACTION = "MY_AMAZING_ACTION"
      store.dispatch({ type: MY_AMAZING_ACTION });
      expect(function() {
        let rootComponent = <WrappedComponent id="test-id" />;
        let renderedElement = ReactDOMServer.renderToString(rootComponent);
      }).to.throw("Missing require 'store' on context.");

    });

});
