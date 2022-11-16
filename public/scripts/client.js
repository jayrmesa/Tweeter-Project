/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const MAX_CHARS = 140; // MAX Letter per tweets
let topHeader;

// to click back to the top appears as the user scrolls

$(() => {
  topHeader = $('.avatar').offset().top;
  $(window).scroll(toggleBackToTopButton);
  $('.back-to-top').on('click', scrollBackTop);
  loadTweets();

});

const renderTweets = (tweets) => {
  const $tweetsContainer = $('#tweets-container');
  $tweetsContainer.empty();

  for (const tweet of tweets) {
    $tweetsContainer.prepend(createTweetElement(tweet));
  }

};

const loadTweets = () => {
  $.get("/tweets")
    .then((data) => {
      renderTweets(data);
    })    
};

const createTweetElement = (tweet) => {
  let $tweet = (`
  <article class="tweet">
    <div class="header">
      <div>
        <img src="${tweet.user.avatars}">
        <h3>${tweet.user.name}</h3>
      </div>
      <p class="handle">${tweet.user.handle}</p>
    </div>
    <div class="message">
      <p>${tweet.content.text}</p>
    </div>
    <div class="footer"> 
      <p class="date">${timeago.format(tweet.created_at)}</p>
      <div class="icons">
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-retweet"></i>
        <i class="fa-solid fa-heart"></i>
      </div>
    </div>
  </article>
  `);

  return $tweet;
};


// The button to return back to top should appear
const toggleBackToTopButton = function() {
  if ($(this).scrollTop() > topHeader) {
    $('.back-to-top').show();
  } else {
    $('.back-to-top').hide();
  }
};

const scrollBackTop = function() {
  window.scroll({
    top: 0, 
    left: 0, 
    behavior: 'smooth'
  });
  $('.new-tweet').slideDown();
  $('#tweet-text').focus();
};
