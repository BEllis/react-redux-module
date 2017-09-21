import React from "react";
import PropTypes from "prop-types";

const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})

export function connectModules(modulesFactory, ChildComponent) {
  class ModuleDependantComponent extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.store = context.store;

      if (this.store === undefined) {
        throw new Error("Missing require 'store' on context.");
      }
    }

    componentWillMount() {
      let modules = modulesFactory(this.props);
      if (!(modules instanceof Array)) {
        modules = [ modules ];
      }

      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        if (!this.store.hasModule(module)) {
          this.store.addModule(module);
        }
      }
    }

    render() {
      return React.createElement(ChildComponent, this.props, this.children);
    }
  }

  ModuleDependantComponent.contextTypes = {
    store: storeShape.isRequired,
  }

  return ModuleDependantComponent;
};
