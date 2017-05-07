// import { formatConditionals, checkConditionals, defaultStates, supportedActions } from './index';
import { formatConditionals } from '../index';

const { test, expect } = global;

const oldStatesObjects = [
  {
    visible: {
      ':input[name="name"]': {
        value: true,
      },
    },
  },
  {
    visible: {
      ':input[name="name"]': {
        value: true,
      },
      ':input[name="last_name"]': {
        filled: true,
      },
    },
  },
  {
    visible: [
      {
        ':input[name="name"]': {
          value: true,
        },
      },
      'or',
      {
        ':input[name="last_name"]': {
          filled: true,
        },
      },
    ],
  },
  {
    visible: [
      {
        ':input[name="name"]': {
          value: true,
        },
      },
      'or',
      {
        ':input[name="last_name"]': {
          filled: true,
        },
      },
    ],
    required: {
      ':input[name="last_name"]': {
        value: true,
      },
    },
  },
];

const newStatesObjects = [
  [
    {
      action: 'visible',
      logic: 'and',
      conditions: [
        {
          key: 'name',
          condition: 'value',
          value: true,
        },
      ],
    },
  ],
  [
    {
      action: 'visible',
      logic: 'and',
      conditions: [
        {
          key: 'name',
          condition: 'value',
          value: true,
        },
        {
          key: 'last_name',
          condition: 'filled',
          value: true,
        },
      ],
    },
  ],
  [
    {
      action: 'visible',
      logic: 'or',
      conditions: [
        {
          key: 'name',
          condition: 'value',
          value: true,
        },
        {
          key: 'last_name',
          condition: 'filled',
          value: true,
        },
      ],
    },
  ],
  [
    {
      action: 'visible',
      logic: 'or',
      conditions: [
        {
          key: 'name',
          condition: 'value',
          value: true,
        },
        {
          key: 'last_name',
          condition: 'filled',
          value: true,
        },
      ],
    },
    {
      action: 'required',
      logic: 'and',
      conditions: [
        {
          key: 'last_name',
          condition: 'value',
          value: true,
        },
      ],
    },
  ],
];

for(let i = 0, l = oldStatesObjects.length; i < l; i += 1) {
  test(`Test formatting of conditionals: #${i + 1}`, () => {
    expect(formatConditionals(oldStatesObjects[i])).toEqual(newStatesObjects[i]);
  });
}
