/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const MAX_CHARS = 140; // MAX Letter per tweets
let topHeader;

// back to the top button appears as the user scrolls

$(() => {
  topHeader = $('.avatar').offset().top;

  $('#post-tweet').submit(postTweet);
  $('.write-tweet').on('click', toggleComposeTweet);
  $(window).scroll(toggleBackToTopButton);
  $('.back-to-top').on('click', scrollBackTop);

  loadTweets();

});

// Toggle the text form for Tweet when clicking the Write a tweet
const toggleComposeTweet = function() {
  $newTweet = $(this).closest('nav').siblings('main').find('.new-tweet');
  $newTweet.slideToggle();

  if (!$newTweet.is(':visible')) $('#tweet-text').focus();
};

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

// escape any 'unsafe' characters from the tweet content
const safeHTML = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
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
      <p>${safeHTML(tweet.content.text)}</p>
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

const postTweet = function(event) {
  event.preventDefault();
  const textField = $(this).children('#tweet-text').val().trim();

  if (!textField) {
    showError(true);
    return $('.error p').text('There seems to be a problem, tweets cannot be empty');
  }

  if (textField.length > MAX_CHARS) {
    showError(true);
    return $('.error p').text(`Sorry! You have exceeded maximum alloted characters of ${MAX_CHARS}`);
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
  // it should remove the error message when user tweet
  $error.removeClass('error border-error');
  $tweetText.removeClass('border-error');
  $error.addClass('no-error');
  $tweetText.addClass('line-border');
};

// The button to return back to top should appear and hides the Write a tweet
const toggleBackToTopButton = function() {
  if ($(this).scrollTop() > topHeader) {
    $('.write-tweet').hide();
    $('.back-to-top').show();
  } else {
    $('.write-tweet').show();
    $('.back-to-top').hide();
  }
};

// Scroll to top of page, focus on textarea for new tweet
const scrollBackTop = function() {
  window.scrollTo({
    top: 0, 
    behavior: 'smooth'
  });
  $('.new-tweet').slideDown();
  $('#tweet-text').focus();
};
