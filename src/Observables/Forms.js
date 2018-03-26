import { observable, action } from 'mobx';
import Form from './Form';

class Forms {

  @observable forms = {};

  getForm(formID, options) {
    if(this.forms[formID]) return this.forms[formID];
    else if(!options) throw Error('Tried to get a form ', formID, 'but the form was not initiated.');

    this.forms[formID] = Forms.createForm(formID, options);

    return this.forms[formID];
  }

  @action
  deleteForm(formID) {
    delete this.forms[formID];
  }

  @action
  static createForm(formID, options) {
    return new Form(formID, options);
  }
}

const form = new Forms();

export default form;
