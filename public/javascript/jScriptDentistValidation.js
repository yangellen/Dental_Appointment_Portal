/* Javascript code verifies that when a new dentist is inserted that the
   first name and last name fields are valid and returns
   an error message if they are not.
  */

/* get the form with the new dentist's data */
var dentistForm = document.getElementById('dentistInfo');

/* when the submit button is pressed verify the fields */
dentistForm.addEventListener('submit', function(event){
  
  var getfirstName = document.getElementById('firstName').value;
  var getlastName = document.getElementById('lastName').value;

  /* use to ensure names consist of alphabet characters only */
  var alphaPattern = RegExp("[A-Za-z]{2,}");

  /* Initialize the frontend elements holding the error messages to blank */

  getfirstN = document.getElementById('firstNameError');
  getfirstN.innerText = "";

  getlastN = document.getElementById('lastNameError');
  getlastN.innerText = "";



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

  

});
