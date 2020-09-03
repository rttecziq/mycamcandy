function postButtonShowhide(isvalue){
	if(isvalue){
		$('.s_postBtn').css('display','inline-block');
	}else{
		$('.s_postBtn').css('display','none');
	}
}

$( ".s_boxComentRar " ).keypress(function() {
	var isvalue = '';
	if($('.s_boxComentRar .emojionearea-editor').html()){
		isvalue = '1';
	}
	postButtonShowhide(isvalue)
});

$('a[href^="#"]').click(function () {
	var ancherTagOrG = $.attr(this, 'href').substr(1);
	var topAncerPos = $('[id="' + $.attr(this, 'href').substr(1) + '"]').offset().top;
    $('html, body').animate({
        scrollTop: topAncerPos
    }, 800);
	$('#'+ancherTagOrG).focus();
    return false;
});
$('a[href="#s_replyArea"]').click(function () {
	$('.s_boxComentRar .emojionearea').addClass('focused');
	$('.s_boxComentRar .emojionearea .emojionearea-editor').focus();
    return false;
});
$(document).ready(function() {
  $("#s_replyArea").emojioneArea();
});