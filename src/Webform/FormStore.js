import { observable } from 'mobx';
import remotedev from 'mobx-remotedev';

@remotedev
class FormStore {
  @observable fields = [];
}

export default FormStore;
