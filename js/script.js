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
    email: 'Please enter your email',
    primary_phone: 'Please enter your phone number',
    zip: {
      required: 'Please enter your zip code',
      postalCodeCA: 'Please enter a valid CA zip code',
    },
    debtamount: {
      mustNotEqual: 'Please select a debt amount',
    },
  }//end messages
});//end form validation

/*****End user input validation*****/

/*****Begin AJAX post*****/

//Campaign values
var apiKey = 'paXyp86aoM05pGTmjyVg88P6AE9DpSn';
var campaignID = '13585';
var postKey = 'NcoqpUdw2qw';
var verticalID = '82';
var affiliateID = '954';
var partnerID = '96339';
var subID1 = '96339';
var routeType = 'data_direct';

//Trigger AJAX request using GET (default for information sent via query string)
$('button[type="button"]').click(function(){

  //User supplied values (from lead form) and hard-coded values

  var firstName = $('input[name="first_name"]').val();
  var lastName = $('input[name="last_name"]').val();
  var primaryPhone = $('input[name="primary_phone"]').val();
  // var secondaryPhone = '';
  // var cellPhone = '';
  var email = $('input[name="email"]').val();
  // var address = '';
  // var city = '';
  var state = 'fl';
  var zip = $('input[name="zip"]').val(); //Note: this is Canadian format (e.g. K1A 0G9)
  var country = 'CA';
  var source = location.hostname;
  var ccDebtAmount = $('select[name="debtamount"]').val();
  var ipAddress = $('input[name="ip-address"]').val();
  // var subID2 = '';
  // var subID3 = '';
  // var subID4 = '';
  // var subID5 = '';
  var optIn = '1';

  console.log(firstName, ipAddress);

});

/*****End AJAX*****/

}); //end main jQuery function
