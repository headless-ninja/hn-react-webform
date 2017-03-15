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
};

class RemoteForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      baseUrl: 'https://test-t6dnbai-zodr7ajad7mea.eu.platform.sh/api/v1',
      node: 4,
      field: 'field_form',
    };
  }

  render() {
    return (
      <div>
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
        <FetchForm baseUrl={this.state.baseUrl} node={this.state.node} field={this.state.field} />
      </div>
    );
  }
}

export default RemoteForm;
