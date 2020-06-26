$(document).ready(function(){
	// console.log("hi");
 //    $('.input').focus(function(){
 //    	var tab_id = $(this).attr('href');
 //        $(tab_id).addClass('current')
 //    }).blur(function(){
 //        var tab_id = $(this).attr('href');
 //        $(tab_id).removeClass('current')
 //    });
    // $(".slidebar-icon").click(function(){
	//     $("#full-view").toggleClass("width100");
	//     $("#full-view").toggleClass("left-right-padding");
	//     $("#side-view").toggleClass("zero-width");
	// });
	$('.tab-link').click(function(){
		var tab_id = $(this).attr('href');
		console.log(tab_id);
		$('.tab-link').removeClass('current');
		$(this).addClass('current');
	});
	
	var availableTags = [
		"ActionScript",
		"AppleScript",
		"Asp",
		"BASIC",
		"C",
		"C++",
		"Clojure",
		"COBOL",
		"ColdFusion",
		"Erlang",
		"Fortran",
		"Groovy",
		"Haskell",
		"Java",
		"JavaScript",
		"Lisp",
		"Perl",
		"PHP",
		"Python",
		"Ruby",
		"Scala",
		"Scheme"
	];
	// $( "#tags" ).autocomplete({
	// 	source: availableTags
	// });
});