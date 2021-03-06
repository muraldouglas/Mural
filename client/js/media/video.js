const $ = require('jquery');
const mediaUtils = require('./media');

const MEDIA = [];
const DATA = [];

function stopVideo(id) {
  const video = MEDIA[id];

  if (DATA[id].playPromise) {
    DATA[id].playPromise.then(() => {
      video.pause();
    });
  } else {
    video.pause();
  }
}

function playBackgroundVideo (id, attrs) {
  const video = MEDIA[id];

  video.loop = attrs.loop;
  video.muted = attrs.muted;

  if ((!DATA[id].paused && attrs.autoplay) ||
      (DATA[id].playTriggered && !DATA[id].paused)) {
    DATA[id].playPromise = video.play();
  }
}

function removeBackgroundVideo ($el, id) {
  const $container = $el.find('.video-container');
  $container.css('position', '');
  const video = MEDIA[id];
  stopVideo(id);
}

function fixBackgroundVideo ($el) {
  const $container = $el.find('.video-container');
  $container.css('position', 'fixed');
}

function unfixBackgroundVideo ($el) {
  const $container = $el.find('.video-container');
  $container.css('position', '');
}

function prepareVideo (scrollStory, $el, id, srcs, attrs) {
  const video = document.createElement('video');
  video.poster = attrs.poster;
  video.preload = 'auto';
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('playsinline', '');
  MEDIA[id] = video;
  DATA[id] = {};

  const canPlayThrough = mediaUtils.canPlayThroughPromise(video, srcs);

  $el.find('.video-container').html(video);

  $el.find('.play').click(function() {
    DATA[id].playPromise = video.play();
    DATA[id].paused = false;
    DATA[id].playTriggered = true;
    $(this).hide();
    $el.find('.pause').show();
  });

  $el.find('.pause').click(function() {
    stopVideo(id);
    DATA[id].paused = true;
    $(this).hide();
    $el.find('.play').show();
  });

  if (attrs.autoplay === true) {
    $el.find('.play').hide();
  } else {
    $el.find('.pause').hide();
  }

  if (attrs.autoAdvance) {
    video.addEventListener('ended', () => {
      const count = scrollStory.getItems().length;
      const next = id + 1;

      if (next < count) {
        scrollStory.index(id + 1);
      }

      // Allow it to restart from the beginning.
      video.currentTime = 0;
    });
  }

  video.load();

  return canPlayThrough;
}

function setMuted (id, muted) {
  const video = MEDIA[id];
  video.muted = muted;
}

module.exports = {
  playBackgroundVideo,
  prepareVideo,
  removeBackgroundVideo,
  fixBackgroundVideo,
  unfixBackgroundVideo,
  setMuted
};
