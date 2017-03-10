import React, { Component } from 'react';

import { FetchForm } from '../lib';

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

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      url: 'https://test-t6dnbai-zodr7ajad7mea.eu.platform.sh/api/v1/url?url=/node/2&_format=json',
      field: 'field_form',
    };
  }

  render() {

    return (
      <div>
        <label style={style.label}>Drupal url:</label>
        <input style={style.input} type='text' onChange={e => this.setState({ url: e.target.value })} value={this.state.url} />
        <br />

        <label style={style.label}>Drupal field:</label>
        <input style={style.input} type='text' onChange={e => this.setState({ field: e.target.value })} value={this.state.field} />
        <br />

        <button onClick={() => this.form.fetchForm()} style={style.refresh}>Refresh</button>
        <br />
        <FetchForm url={this.state.url} field={this.state.field} ref={e => this.form = e} />
      </div>
    )

  }

}
