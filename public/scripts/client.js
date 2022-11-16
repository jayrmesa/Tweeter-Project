/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const MAX_CHARS = 140; // MAX Letter per tweets

// to click back on top appears as the user scrolls

$(() => {

  $(window).scroll(toggleBackToTopButton);
  $('.back-to-top').on('click', scrollBackTop);

  loadTweets();
});


const scrollBackTop = function() {
  window.scroll({
    top: 0, 
    left: 0, 
    behavior: 'smooth'
  });
};
