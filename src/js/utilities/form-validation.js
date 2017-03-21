import $ from 'jquery';
import 'jquery-validation';

export let validateInput = (formId) => {
  $(formId).validate();
};
