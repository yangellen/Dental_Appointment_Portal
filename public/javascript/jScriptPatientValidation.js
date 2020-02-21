/* Javascript code verifies that when a new patient is inserted that the
   first name, last name and phone number fields are valid and returns
   an error message if they are not.
  */

/* get the form with the new patient's data */
var patientForm = document.getElementById('patientInfo');

/* when the submit button is pressed verify the fields */
patientForm.addEventListener('submit', function(event){
  var getfirstName = document.getElementById('firstName').value;
  var getlastName = document.getElementById('lastName').value;
  var getphoneNumber = document.getElementById('phoneNumber').value;

  /* use to ensure names consist of alphabet characters only */
  var alphaPattern = RegExp("[A-Za-z]{2,}");

  /* use to ensure the phone number is valid; can contain spaces, -, (), and numbers */
  var phonePattern = RegExp("^[0-9-+\s()]*$");

  /* Initialize the frontend elements holding the error messages to blank */

  getfirstN = document.getElementById('firstNameError');
  getfirstN.innerText = "";

  getlastN = document.getElementById('lastNameError');
  getlastN.innerText = "";

  getphoneN = document.getElementById('phoneNumberError');
  getphoneN.innerText = "";

  /* If the regular expression is not satisfied print an error message and
   * prevent the submit button from submitting. Check the regular expressions
   * are true or false for first name, last name and phone number fields:
   */
  
  if (alphaPattern.test(getfirstName) == false )
  {
      event.preventDefault();
      getfirstN.innerText = "Please enter a valid first name.";
  }

  if (alphaPattern.test(getlastName) == false)
  {
    event.preventDefault();
    getlastN.innerText = "Please enter a valid last name.";
  }

  if (phonePattern.test(getphoneNumber) == false)
  {
    event.preventDefault();
    getphoneN.innerText = "Please enter a valid phone number.";
  }

});
