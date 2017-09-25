import React from "react";
import PropTypes from "prop-types";

const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})

export function connectModules(moduleDefinitions) {
  if (!(moduleDefinitions instanceof Array)) {
    moduleDefinitions = [ moduleDefinitions ];
  }

  return ChildComponent => {
    class ModuleDependantComponent extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.store = context.store;

        if (this.store === undefined) {
          throw new Error("Missing require 'store' on context.");
        }
      }

      componentWillMount() {
        for (let i = 0; i < moduleDefinitions.length; i++) {
          let moduleDefinition = moduleDefinitions[i];
          if (moduleDefinition instanceof Function) {
            moduleDefinition = moduleDefinition(this.props);
          }

          if (!this.store.hasModule(moduleDefinition.moduleId)) {
            this.store.addModule(moduleDefinition.factory(moduleDefinition.moduleId, moduleDefinition.options));
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
};
