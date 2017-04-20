/*
description: jQuery script for landing page form validation and posting of values to Venturetech marketing API
author: cramos@debt.com
version: 1.0.0, April 2017
dependencies:
1 - jQuery library,
2- jQuery Validation Plugin (https://jqueryvalidation.org),
3- intl-tel-input Plugin (http://formvalidation.io/examples/validating-international-phone-numbers/)
*/

//Begin main jQuery function
$( document ).ready(function() {

/*****Validate user input*****/

//Custom jQuery validator method to extend functionality of basic jQuery validation plugin

//Letters only for first_name and last_name
$.validator.addMethod( 'lettersonly', function( value, element ) {
	return this.optional( element ) || /^[a-z]+$/i.test( value );
}, 'Letters only please' );

//Validation for valid Canadian zip code format
$.validator.addMethod( 'postalCodeCA', function( value, element ) {
	return this.optional( element ) || /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ] *\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test( value );
}, 'Please specify a valid postal code' );

//Make selection of debtamount mandatory
$.validator.addMethod('mustNotEqual', function(value, element, arg){
  return arg != value;
}, 'Please select an item');

//Validate form
$('#lead-form').validate({
  rules: {
      first_name: {
        required: true,
        lettersonly: true
      },
      last_name:  {
        required: true,
        lettersonly: true
      },
      email: {
        required: true,
        email: true
      },
      primary_phone: {
        required: true,
        phoneUS: true
      },
      zip: {
        required: true,
        postalCodeCA: true
      },
      debtamount: {
        required: true,
        mustNotEqual: 'default'
      },
  },//end validation rules
  messages: {
    first_name: {
      required: 'Please enter your first name',
      lettersonly: 'Only letters are allowed',
    },
    last_name: {
      required: 'Please enter your last name',
      lettersonly: 'Only letters are allowed',
    },
    email: 'Please correct your email',
    primary_phone: 'Please enter your phone number',
    zip: {
      required: 'Please correct your zip code',
      postalCodeCA: 'Please enter a valid CA zip code',
    },
    debtamount: {
      mustNotEqual: 'Please select a debt amount',
    },
  }//end messages
});
/*****End user input validation*****/

/*****Create spinner effect for submit button*********/
var spinner = Ladda.create(document.querySelector('#start'));

/*****Create function to empty out error message div*****/

function emptyErrorMessages(){
	if( ! $('.alert-message').is(':empty')){
		$('.alert-message > p').remove();
		$('.alert-message').hide();
	}
}

/*****Begin AJAX post*****/

//Create function to handle Cake Data for future use and display success message to user
function handleCakeSuccess() {
	$('.alert-message').addClass('success').prepend('<p>Thank you for submitting your information.</p><p>A debt counselor will contact you soon.').toggle();
}

//Campaign values
var apiKey = 'paXyp86qoM05pGTXmjyVg88P6AE9DpSn';
var campaignID = '13585';
var postKey = 'NcoqpUdw2qw';
var verticalID = '82';
var affiliateID = '954';
var partnerID = '96339';
var subID1 = '96339';
var routeType = 'data_direct';

//Trigger AJAX request using GET (default for information sent via query string)
$('#start').click(function(){
	//Validate form using jQuery Validate Plugin .valid() method
	if($('#lead-form').valid() === false) {
		/*First, check if there are <p> tags in divs from prior alerts, and remove them to avoid multiple <p> tags
		then, alert the customer*/
		emptyErrorMessages();
		$('.alert-message').addClass('warning').prepend('<p>Please fill out all the required fields before submitting the form.</p>').toggle();
	} else {
		/*If there are <p> tags in divs from prior alerts, and remove them to avoid multiple <p> tags
		 and hide alert div after successful submission*/
		emptyErrorMessages();
		//Lead Values - user supplied values (from lead form) and hard-coded values
    var firstName = $('input[name="first_name"]').val();
    var lastName = $('input[name="last_name"]').val();
    var primaryPhone = $('input[name="primary_phone"]').val();
    var email = $('input[name="email"]').val();
    var state = 'fl';
    var zip = $('input[name="zip"]').val(); //Note: this is Canadian format (e.g. K1A 0G9)
    var country = 'CA';
		var source = 'www.google.com';
		// var source = location.hostname;
    var ccDebtAmount = $('select[name="debtamount"]').val();
    var ipAddress = $('input[name="ip-address"]').val();
    var optIn = '1';

    /*Build URL
    1 - To build more complex URL's follow the example below from Venturetech docs:
    2- https://marketingapi.vtgr.net/?apikey=paXyp86qoM05pGTXmjyVg88P6AE9DpSn&ckm_campaign_id=13585&ckm_key=NcoqpUdw2qw&vid=82&aff_id=954&pid=96339&first_name=Contact&last_name=Us&email=cccscctest954@vtsqa.com&primary_phone=7543326039&state=fl&country=CA&debtamount=11000&ip_address=63.25.58.7&source=www.google.com&ckm_subid=963398&ckm_subid_2=test&ckm_subid_3=test&ckm_subid_4=test&ckm_subid_5=test&opt_in=1
    */

    var url = "https://marketingapi.vtgr.net/?apikey=" + apiKey + "&ckm_campaign_id=" + campaignID + "&ckm_key=" + postKey + "&vid=" + verticalID + "&aff_id=" + affiliateID + "&pid="+ partnerID + "&first_name=" + firstName + "&last_name=" + lastName + "&email=" + email + "&primary_phone=" + primaryPhone + "&state=" + state + "&country=" + country + "&debtamount=" + ccDebtAmount + "&ip_address=" + ipAddress + "&source=" + source + "&ckm_subid=" + subID1 + "&opt_in=" + optIn + "";
		console.log(url);
    /*****Initiate AJAX call*****/

    $.ajax({
      url: url,
      dataType: 'JSONP',
      jsonpCallback: 'callback',
      type: 'GET',
			beforeSend: function() {
				spinner.start();
      },
      success: function (data) {
					//Receive JSON response from Cake
					var cakeData = JSON.parse(data);

					if (cakeData.Status === 'Success') {
						emptyErrorMessages();
						handleCakeSuccess();
						spinner.stop();
					} else if (cakeData.Status === 'Errors') {
						emptyErrorMessages();
						$('.alert-message').addClass('failure').prepend('<p>We were unable to process your submission.</p><p>Please try again.</p>').toggle();
						spinner.stop();
					}
      },
      error: function(jqXHR, exception){
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        alert(msg);
      },
    });//end of AJAX call
  }//end if

}); //end #start click function

}); //end main jQuery function
