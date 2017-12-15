var $ = jQuery;
var i = 0; // needs to be global
// What *is* all this for?
// Because we're using generic templates for our snippets
// and we can't iterate in the mustache templates (which is a pain)
// we have to do it in the browser and then ensure that all of the labels and
// radio button groups match and then recheck the active state

function iterateInitialFormElements () {
	$('.js-Align').each(function () {
		i++;
		var name = $(this).find('input').first().attr('name') + i;
		$(this).attr('for', name);
		$(this).find('input').attr('name', name);
		$(this).find('label').each(function () {
			var target = $(this).attr('for') + i;
			$(this).attr('for', target);
		});
		$(this).find('input').each(function () {
			var target = $(this).attr('id') + i;
			$(this).attr('id', target);
		});
	});
}
iterateInitialFormElements();

function instantiateRemove () {
	$('.js-Remove').each(function () {
		$(this).on('click', function (e) {
			e.preventDefault();
			if ($(this).parent().parent().hasClass('temp')) {
				$(this).parent().parent().remove();
			} else {
				$(this).parent().remove();
			}
		});
	});
};
instantiateRemove();

$('.js-AddImage').on('click', function (e) {
	e.preventDefault();
	var imgEl = document.createElement('div');
	imgEl.className = 'temp';
	var imgBox = '/editor/fragment/snippetimage';
	$(imgEl).load(imgBox, function () {
		$(imgEl).appendTo('.js-ContentDynamic');
		instantiateRemove();
	});
});
