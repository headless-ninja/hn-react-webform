import React, { Component, PropTypes } from 'react';
import Webform from '../Webform';
import fetch from 'fetch-everywhere';

const LOAD_STATES = {
  LOADING: 0,
  SUCCESS: 1,
  ERROR: 2,
};

export default class FetchForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loadState: LOAD_STATES.LOADING,
    };

    this.fetchForm = this.fetchForm.bind(this);

    console.error(this.state);
  }

  componentDidMount() {
    this.fetchForm();
  }
  componentDidUpdate(prevProps) {
    if(prevProps.url != this.props.url || prevProps.field != this.props.field) {
      this.fetchForm();
    }
  }

  fetchForm() {
    if(!this.props.url) {
      this.setState({ loadState: LOAD_STATES.ERROR });
      return;
    }

    console.error('Loading..');
    this.setState({ loadState: LOAD_STATES.LOADING });

    this.fetch = fetch(this.props.url)
      .then(data => data.json())
      .then((json) => {
        if(typeof json.content !== 'object' || (!this.props.field && !json.content.form_id) || (this.props.field && !json.content[this.props.field].form_id)) {
          throw Error('Combination of url && field didn\'t work');
        }
      console.error('JSON!', json.content[this.props.field]);
        this.setState({
          form: this.props.field ? json.content[this.props.field] : json.content,
          loadState: LOAD_STATES.SUCCESS,
        });
      })
      .catch((error) => {
        console.error('Error loading form:', error);
        this.setState({ loadState: LOAD_STATES.ERROR });
      });
  }


  render() {
    switch(this.state.loadState) {
      case LOAD_STATES.LOADING:
        return <div>LOADING..</div>;
      case LOAD_STATES.ERROR:
        return <div>ERROR LOADING FORM.</div>;
      case LOAD_STATES.SUCCESS:
        return (<Webform
          form={this.state.form} settings={{
            title: 'Routeboekje form',
          }}
        />);
    }
  }

}

FetchForm.propTypes = {
  url: PropTypes.string.isRequired,
  field: PropTypes.string,
};
