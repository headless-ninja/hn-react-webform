export const supportedStates = {
  visible: 'visible',
  invisible: 'invisible',
  enabled: 'enabled',
  disabled: 'disabled',
  required: 'required',
  optional: 'optional',
};

export const supportedConditions = {
  empty: 'empty',
  filled: 'filled',
  checked: 'checked',
  unchecked: 'unchecked',
  value: 'value',
};

export const supportedLogic = {
  and: 'and',
  or: 'or',
};

export const support = {
  states: supportedStates,
  conditions: supportedConditions,
  logic: supportedLogic,
};

/**
 * Method to format a states object from Drupal, into a more JavaScript friendly format.
 * @param {object} states States object from Drupal field.
 * @returns {boolean|Array} Returns array with formatted conditionals or false if no conditionals found.
 *
 * Example
 *   Old:
 *   {
 *    visible: [
 *      {
 *        ':input[name="name"]': {
 *          empty: true
 *        }
 *      },
 *      {
 *        ':input[name="name"]': {
 *          filled: true
 *        }
 *      }
 *    ]
 *   }
 *   New:
 *   [
 *    {
 *      action: 'visible',
 *      logic: 'and',
 *      conditions: [
 *        {
 *          key: 'name',
 *          condition: 'empty',
 *         value: true
 *       },
 *       {
 *         key: 'name',
 *         condition: 'visible',
 *         value: true
 *       }
 *     ]
 *    }
 *   ]
 */
export function formatConditionals(states = false) {
  if(!states) {
    return false;
  }

  const mappedStates = Object.keys(states).map((stateKey) => { // stateKey, e.g. visible.
    const conditions = Array.isArray(states[stateKey]) ? states[stateKey] : [states[stateKey]]; // If singular conditional, make into array.
    let conditionLogic = supportedLogic.and; // Default conditional logic is and.

    if(!supportedStates[stateKey]) {
      return false; // Don't format conditional if state isn't supported.
    }

    const mappedConditions = conditions.map((conditionObject) => { // One state object.
      if(conditionObject === supportedLogic.or) {
        conditionLogic = supportedLogic.or; // If conditional logic is set to or, save that...
        return false; // ...and don't format it.
      }

      const dependencyKey = Object.keys(conditionObject)[0]; // e.g. ':input[name="name"]'.
      const formattedDependencyKey = dependencyKey.match(/name="(\S+)"/)[1]; // Field key of dependency, e.g. 'name' in above example.
      const condition = Object.keys(conditionObject[dependencyKey])[0]; // e.g. empty.
      const conditionValue = conditionObject[dependencyKey][condition]; // e.g. true.

      if(!supportedConditions[condition]) {
        return false; // Don't format conditional if condition isn't supported.
      }

      return {
        key: formattedDependencyKey,
        condition,
        value: conditionValue,
      };
    });

    const filteredConditions = mappedConditions.filter(c => c);  // Filter out all 'false' values.

    if(!filteredConditions.length) {
      return false; // Return false when there are no valid conditions found.
    }

    return {
      action: stateKey,
      logic: conditionLogic,
      conditions: filteredConditions,
    };
  });

  const filteredStates = mappedStates.filter(s => s); // Filter out all 'false' values.

  return filteredStates.length ? filteredStates : false; // Return false when there are no valid states found.
}

function checkActionType(condition, action, states) {
  switch(action) {
    case supportedStates.visible:
    case supportedStates.enabled:
    case supportedStates.required:
      states[action] = condition;
      break;
    case supportedStates.invisible:
      states.visible = !condition;
      break;
    case supportedStates.disabled:
      states.enabled = !condition;
      break;
    case supportedStates.optional:
      states.required = !condition;
      break;
    default:
      break;
  }
}

export function checkConditionals(formStore, fieldKey = false, currentState = {}) {
  if(!fieldKey) {
    return false;
  }

  const field = formStore.getField(fieldKey);

  if(!field || !field.conditionals) {
    return false;
  }

  const states = {
    visible: currentState.visible,
    enabled: currentState.enabled,
    required: currentState.required,
  };

  /**
   * conditional example:
   *  {
   *    action: 'visible',
   *    logic: 'and',
   *    conditions: [condition, condition]
   *  }
   */
  // Go through conditionals.
  field.conditionals.forEach((conditional) => {
    /**
     * condition example:
     *  {
     *    key: 'name',
     *    condition: 'empty',
     *    value: true
     *  }
     */
    // Go through conditions per conditional.
    conditional.conditions.forEach((condition) => {
      // console.log(condition)
      const dependency = formStore.getField(condition.key);
      if(!dependency) {
        return;
      }
      const dependencyValue = dependency.getValue();

      // See what the action of the condition should be.
      switch(condition.condition) {
        case supportedConditions.empty:
        case supportedConditions.filled: {
          const isEmpty = dependencyValue.toString().trim() === '';
          const check = condition.condition === supportedConditions.empty ? isEmpty : !isEmpty;
          checkActionType(check, conditional.action, states);
          break;
        }
        case supportedConditions.checked:
        case supportedConditions.unchecked: {
          // When dependencyValue is true, then it is checked.
          const check = condition.condition === supportedConditions.checked;
          checkActionType(dependencyValue === check, conditional.action, states);
          break;
        }
        case supportedConditions.value: {
          // Check if value matches condition.
          checkActionType(dependencyValue === condition.value, conditional.action, states);
          break;
        }
        default: {
          break;
        }
      }
    });
  });

  return states;
}
