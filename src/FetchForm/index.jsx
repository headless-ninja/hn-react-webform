import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'fetch-everywhere';
import { observer } from 'mobx-react';
import Webform from '../Webform';

const LOAD_STATES = {
  LOADING: 0,
  SUCCESS: 1,
  ERROR: 2,
};


@observer
class FetchForm extends Component {
  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    field: PropTypes.string,
  }

  static defaultProps = {
    field: 'field_form',
  }

  constructor(props) {
    super(props);

    this.state = {
      loadState: LOAD_STATES.LOADING,
    };

    this.fetchForm = this.fetchForm.bind(this);
  }

  componentDidMount() {
    this.fetchForm();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.baseUrl !== this.props.baseUrl || prevProps.path !== this.props.path || prevProps.field !== this.props.field) {
      this.fetchForm();
    }
  }

  fetchForm() {
    if(!this.props.baseUrl) {
      this.setState({ loadState: LOAD_STATES.ERROR });
      return;
    }

    // console.info('Loading..');
    this.setState({ loadState: LOAD_STATES.LOADING });

    this.fetch = fetch(`${this.props.baseUrl}/url?url=/${this.props.path}&_format=json`)
      .then(data => data.json())
      .then((json) => {
        if(typeof json.content !== 'object' || (!this.props.field && !json.content.form_id) || (this.props.field && !json.content[this.props.field].form_id)) {
          throw Error('Combination of url && field didn\'t work');
        }
        // console.info('JSON!', json.content[this.props.field]);
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
          form={this.state.form}
          settings={{
            title: 'Form',
            postUrl: `${this.props.baseUrl}/form?_format=json`,
            postcodeApiKey: 'KlPuqvDkZk3pERM81Epi74Bof4FwrBPLMMNtm83a',
          }}
          onSubmit={() => {
            const block = false;
            console.info('submithook, block:', block);
            return Promise.resolve({
              submit: !block,
              errors: ['Custom error, override submit'],
            });
          }}
          onAfterSubmit={() => console.info('afterhook')}
        />);
      default:
        return null;
    }
  }
}

export default FetchForm;
