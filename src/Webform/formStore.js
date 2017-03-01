import { observable, extendObservable } from 'mobx';
import remotedev from 'mobx-remotedev';

const FormStore = function () {
  extendObservable(this, {
    fields: [],
  });
};

export default remotedev(FormStore);
