$(() => {
  $('textarea').on('input', updateCounter);
});

const updateCounter = function() {

  const charLength = MAX_CHARS - $(this).val().length;

  const $counter = $(this).siblings().children('.counter');

  $counter.val(charLength);

  if (charLength < 0) return $counter.addClass("red");
    
  $counter.removeClass("red");
};

