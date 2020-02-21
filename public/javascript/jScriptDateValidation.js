/* Javascript code verifies that dates conform to requirements and prints
   an error message if they don't.
  */

getDate = document.getElementById('dateField');

getDate.addEventListener('input', function(e){
	var day = new Date(this.value);
	var dayWeek = new Date(this.value).getUTCDay();
	var today = new Date();
	if(day <= today )  /* The soonest date that is allowed to be chosen is tommorrow */
	{
		e.preventDefault();  /*prevent the form from submitting if the date is not permitted */
		this.value = '';
		getP = document.getElementById('dateError');
		getP.innerText = "Please select a valid day starting from tomorrow."
	}
	else if(dayWeek == 0 || dayWeek == 6 )  /* prevent the user from selecting weekends */
	{
		e.preventDefault(); /*prevent the form from submitting if the date is not permitted */
		this.value = '';
		getP = document.getElementById('dateError');
		getP.innerText = "Please select a day between Monday and Friday."
		
	}
	else  /* if there is no error then clear the error message if present */
	{
		getP = document.getElementById('dateError');
		getP.innerText = "";
	}
});