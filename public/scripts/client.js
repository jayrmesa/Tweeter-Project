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

  $('#post-tweet').submit(postTweet);
  $('.write-tweet').on('click', toggleComposeTweet);
  $(window).scroll(toggleBackToTopButton);
  $('.back-to-top').on('click', scrollBackTop);

  loadTweets();

});

const renderTweets = (tweets) => {
  const $tweetsContainer = $('#tweets-container');
  $tweetsContainer.empty();

  //form should reset
  $tweetsContainer.siblings('section').find('#post-tweet').trigger('reset');

  for (const tweet of tweets) {
    $tweetsContainer.prepend(createTweetElement(tweet));
  }

};

const loadTweets = () => {
  $.get("/tweets")
    .then((data) => {
      renderTweets(data);
    })
    .catch((err) => {
      console.log("Error:", err);
    });    
};

const postTweet = function(event) {
  event.preventDefault();
  const textField = $(this).children('#tweet-text').val().trim();

  if (!textField) {
    showError(true);
    return $('.error p').text('This field cannot be empty');
  }

  if (textField.length > MAX_CHARS) {
    showError(true);
    return $('.error p').text(`Exceeded maximum alloted characters of ${MAX_CHARS}`);
  }

  $.post("/tweets", $(this).serialize())
    .then(() => {
      showError(false);
      loadTweets();
    })
    .catch((err) => {
      console.log("Error:", err);
    });
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


const toggleComposeTweet = function() {
  $newTweet = $(this).closest('nav').siblings('main').find('.new-tweet');
  $newTweet.slideToggle();

  if (!$newTweet.is(':visible')) $('#tweet-text').focus();
};

const showError = (flag) => {
  $error = $('#error');
  $tweetText = $('#tweet-text');
  
  if (flag) {
    $error.addClass('error');
    $tweetText.addClass('border-error');
    $error.removeClass('no-error');
    $tweetText.removeClass('line-border');
    $tweetText.focus();
    return;
  }
  // it should remove the error messag when user type
  $error.removeClass('error border-error');
  $tweetText.removeClass('border-error');
  $error.addClass('no-error');
  $tweetText.addClass('line-border');
};

// The button to return back to top should appear
const toggleBackToTopButton = function() {
  if ($(this).scrollTop() > topHeader) {
    $('.write-tweet').hide();
    $('.back-to-top').show();
  } else {
    $('.write-tweet').show();
    $('.back-to-top').hide();
  }
};

const scrollBackTop = function() {
  window.scrollTo({
    top: 0, 
    behavior: 'smooth'
  });
  $('.new-tweet').slideDown();
  $('#tweet-text').focus();
};
