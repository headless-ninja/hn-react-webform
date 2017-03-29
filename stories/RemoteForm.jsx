import React from 'react';

import { FetchForm } from '../src';

const style = {
  label: {
    width: 100,
  },
  input: {
    width: 'calc(99% - 110px)',
  },
  refresh: {
    marginLeft: 108,
  },
  formWrapper: {
    overflow: 'hidden',
    backgroundColor: '#a1a1a1',
  },
  form: {
    padding: '16px',
    boxSizing: 'border-box',
  },
  hidden: {
    display: 'none',
  },
  collapsed: {
    maxHeight: 0,
  },
  expand: {
    position: 'fixed',
    top: 0,
    right: '30px',
    cursor: 'pointer',
    fontSize: '30px',
  },
  expanded: {
    top: '120px',
    transform: 'rotate(180deg)',
  },
};

class RemoteForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      baseUrl: 'https://test-t6dnbai-zodr7ajad7mea.eu.platform.sh/api/v1',
      // baseUrl: 'http://dev.natuurmonumenten.nl/api/v1',
      node: 4,
      field: 'field_form',
      visible: false,
    };
  }

  render() {
    return (
      <div>
        <div style={Object.assign({}, style.formWrapper, this.state.visible ? {} : style.collapsed)}>
          <form style={style.form} onSubmit={e => e.preventDefault()}>
            <label htmlFor='baseUrl' style={style.label}>Drupal baseUrl:</label>
            <input id='baseUrl' style={style.input} type='text' onChange={e => this.setState({ baseUrl: e.target.value })} value={this.state.baseUrl} />
            <br />

            <label htmlFor='node' style={style.label}>Drupal node:</label>
            <input id='node' style={style.input} type='number' onChange={e => this.setState({ node: e.target.value })} value={this.state.node} />
            <br />

            <label htmlFor='field' style={style.label}>Drupal field:</label>
            <input id='field' style={style.input} type='text' onChange={e => this.setState({ field: e.target.value })} value={this.state.field} />
            <br />

            <button onClick={() => this.form.fetchForm()} style={style.refresh}>Refresh</button>
            <br />
          </form>
        </div>
        <span
          style={Object.assign({}, style.expand, !this.state.visible ? {} : style.expanded)}
          onClick={() => this.setState({ visible: !this.state.visible })}
        >&#8659;</span>
        <FetchForm
          ref={component => this.form = component}
          baseUrl={this.state.baseUrl}
          node={this.state.node}
          field={this.state.field}
        />
      </div>
    );
  }
}

export default RemoteForm;
