/* Javascript code verifies that when a new procedure is inserted that the
   procedure name and description fields are valid and returns
   an error message if they are not.
  */

/* get the form with the new procedures's data */
var procedureForm = document.getElementById('procedureInfo');

/* when the submit button is pressed verify the fields */
procedureForm.addEventListener('submit', function(event){

  /* the minimum number of characters each field must be */
  var minimumNameLength = 2;
  var minimumDescriptionLength = 20;

  var getName = document.getElementById('name').value;
  var getDescription = document.getElementById('description').value;

  /* Initialize the frontend elements holding the error messages to blank */

  getNerror = document.getElementById('nameError');
  getNerror.innerText = "";

  getDerror = document.getElementById('descriptionError');
  getDerror.innerText = "";


  /* If the fields are not long enough then print an error message
   */
  
  if (getName.length < minimumNameLength )
  {
      event.preventDefault();
      getNerror.innerText = "The procedure name must be at least 2 characters.";
  }

  if (getDescription.length < minimumDescriptionLength )
  {
    event.preventDefault();
    getDerror.innerText = "The description must be at least 20 characters.";
  }

  

});
