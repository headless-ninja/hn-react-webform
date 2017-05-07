export const supportedActions = {
  visible: 'visible',
  enabled: 'enabled',
  required: 'required',
};

export const supportedStates = {
  [supportedActions.visible]: supportedActions.visible,
  invisible: 'invisible',
  [supportedActions.enabled]: supportedActions.enabled,
  disabled: 'disabled',
  [supportedActions.required]: supportedActions.required,
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
  actions: supportedActions,
  states: supportedStates,
  conditions: supportedConditions,
  logic: supportedLogic,
};

export function defaultStates(field) {
  return {
    [supportedActions.visible]: true,
    [supportedActions.required]: field['#required'] || false,
    [supportedActions.enabled]: true,
  };
}

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
 *          value: true
 *        },
 *        {
 *          key: 'name',
 *          condition: 'visible',
 *          value: true
 *        }
 *     ]
 *    }
 *   ]
 */
export function formatConditionals(states = false) {
  if(!states) {
    return false;
  }

  const mappedStates = Object.keys(states).map((stateKey) => { // stateKey, e.g. visible.
    if(!supportedStates[stateKey]) {
      return false; // Don't format conditional if state isn't supported.
    }

    const conditionalKeys = Object.keys(states[stateKey]);
    const conditionLogic = states[stateKey][conditionalKeys[1]] === supportedLogic.or ? supportedLogic.or : supportedLogic.and; // Default conditional logic is and.

    const mappedConditions = conditionalKeys.map((conditionalKey2) => { // e.g. ':input[name="name"]'.
      let conditionalKey = conditionalKey2;
      let conditionObject = states[stateKey];

      if(conditionLogic === supportedLogic.or) { // If conditional logic is set to 'or'.
        if(conditionObject === supportedLogic.or) {
          return false; // Don't format the 'or' item.
        }

        conditionalKey = Object.keys(conditionObject)[0];
        conditionObject = conditionObject[Object.keys(conditionObject)[0]]; // Remove one level of nesting when logic is set to 'or'.
      }

      const dependencyKeyRegex = conditionalKey.match(/name="(\S+)"/);
      if(!dependencyKeyRegex) {
        return false;
      }
      const formattedDependencyKey = dependencyKeyRegex[1]; // Field key of dependency, e.g. 'name' in above example.
      const condition = Object.keys(conditionObject)[0]; // e.g. empty.
      const conditionValue = conditionObject[condition]; // e.g. true.

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

function formatNewStates(newStates) {
  const formattedStates = {};

  Object.keys(newStates).forEach((stateKey) => {
    const condition = newStates[stateKey];
    switch(stateKey) {
      case supportedStates.visible:
      case supportedStates.enabled:
      case supportedStates.required:
        formattedStates[stateKey] = condition;
        break;
      case supportedStates.invisible:
        formattedStates[supportedActions.visible] = !condition;
        break;
      case supportedStates.disabled:
        formattedStates[supportedActions.enabled] = !condition;
        break;
      case supportedStates.optional:
        formattedStates[supportedActions.required] = !condition;
        break;
      default:
        break;
    }
  });

  return formattedStates;
}

export function checkConditionals(formStore, fieldKey = false) {
  if(!fieldKey) {
    return false;
  }

  const field = formStore.getField(fieldKey);

  if(!field || !field.conditionals) {
    return false;
  }

  const newStates = {};

  /**
   * conditional example:
   *  {
   *    action: 'visible',
   *    logic: 'and',
   *    conditions: [condition, condition]
   *  }
   */
  // Reduce conditionals to true or false value, based on conditionals and logic.
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
    newStates[conditional.action] = conditional.conditions.reduce((prevOutcome, condition) => {
      let conditionalOutcome = false;

      const dependency = formStore.getField(condition.key);
      if(!dependency) {
        return false;
      }
      const dependencyValue = dependency.getValue();

      // See what the action of the condition should be.
      switch(condition.condition) {
        case supportedConditions.empty:
        case supportedConditions.filled: {
          const isEmpty = dependencyValue.toString().trim() === '';
          const check = condition.condition === supportedConditions.empty ? isEmpty : !isEmpty;
          conditionalOutcome = check;
          break;
        }
        case supportedConditions.checked:
        case supportedConditions.unchecked: {
          // When dependencyValue is true, then it is checked.
          const check = condition.condition === supportedConditions.checked;
          conditionalOutcome = check === (dependencyValue === true || dependencyValue === '1' || dependencyValue === 'true');
          break;
        }
        case supportedConditions.value: {
          // Check if value matches condition.
          conditionalOutcome = dependencyValue === condition.value;
          break;
        }
        default: {
          break;
        }
      }

      if(conditional.logic === supportedLogic.and) {
        return prevOutcome && conditionalOutcome;
      } else if(conditional.logic === supportedLogic.or) {
        return prevOutcome || conditionalOutcome;
      }
      return true;
    }, conditional.logic === supportedLogic.and);
  });

  return formatNewStates(newStates);
}
