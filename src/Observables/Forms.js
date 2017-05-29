import { observable } from 'mobx';
import Form from './Form';

class Forms {

  @observable forms = {};

  getForm(formID, options) {
    if(this.forms[formID]) return this.forms[formID];
    else if(!options) throw Error('Tried to get a form ', formID, 'but the form was not initiated.');

    this.forms[formID] = new Form(formID, options.settings, options.defaultValues);

    return this.getForm(formID);
  }
}

export default new Forms();
