import $ from 'jquery';
import 'jquery-validation';
// import formUtilities from './utilities/formUtilities';

$(document).ready( () => { 
  $('.header').css({ background: 'blue', color: 'white' });
  let index = localStorage.getItem('index') || 1;
  let currentView = `./views/step${index}.html`;
  let formId = `#simple-form-${index}`;

  let incrementIndexAndReplaceView = () => {
    index++;
    localStorage.setItem('index', index);
    currentView = `./views/step${index}.html`;
    formId = `#simple-form-${index}`;
  };

  let loadView = () => {
    $('.wrapper').load(currentView, () => {

      $(formId).validate({
        submitHandler: (form) => {
          incrementIndexAndReplaceView();
          loadView();
        }
      });

    });
  };

  loadView();

});



