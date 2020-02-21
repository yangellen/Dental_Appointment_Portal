/* Javascript to rotate images in a slide show
*/

var slideIndex = 0;
showSlides();
	
/* recursive function to run slide show */
function showSlides()
{
	var i;
	var slides = document.getElementsByClassName("mySlides");
	for (i = 0; i<slides.length; i++)
	{
		slides[i].style.display = "none";
	}

	slideIndex++;  /* move to the next image */
	if(slideIndex > slides.length){slideIndex = 1}
	slides[slideIndex-1].style.display ="block";
	setTimeout(showSlides, 5000);
}
