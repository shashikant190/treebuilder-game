$(document).ready(function() {
  let correctPartsCount = 0;
  let raintreePartsDropped = 0;
  let score = 0;
  let wrongAttempts = 0;
  localStorage.removeItem('totalScore');

  // Store the initial position of each part
  const initialPositions = {
    'mango-bark': { top: 120, left: 100 },
    'almond-bark': { top: 255, left: 100 },
    'tamarind-bark': { top: 390, left: 100 },
    'raintree-bark': { top: 525, left: 100 },
    'gulmohar-bark': { top: 660, left: 100},

    'mango-leaf': { top: 120, left: 1650 },
    'almond-leaf': { top: 255, left: 1650 },
    'tamarind-leaf': { top: 390, left: 1650 },
    'raintree-leaf': { top: 525, left: 1650 },
    'gulmohar-leaf': { top: 660, left: 1650 },

    'mango-fruit': { top: 800, left: 100 },
    'almond-fruit': { top: 800, left: 260 },
    'tamarind-fruit': { top: 800, left: 410 },
    'raintree-fruit': { top: 800, left: 550 },
    'gulmohar-fruit': { top: 800, left: 700 },

    'mango-flower': { top: 800, left: 1050 },
    'almond-flower': { top: 800, left: 1180 },
    'tamarind-flower': { top: 800, left: 1350 },
    'raintree-flower': { top: 800, left: 1480 },
    'gulmohar-flower': { top: 800, left: 1620 }
  };

  // Initialize positions for all parts
  $('.part').each(function() {
    let partId = $(this).attr('id');
    let initialPosition = initialPositions[partId];
    $(this).data('initialPosition', initialPosition);
    
    // Set position using top and left only
    $(this).css({
      position: 'absolute',
      top: initialPosition.top + 'px',
      left: initialPosition.left + 'px'
    });
  });

  // Update the score display
  function updateScoreDisplay() {
    $('.score').text('Score: ' + score);
  }

  // Make all parts draggable
  $('.part').draggable({
    revert: 'invalid',
    helper: 'clone',
    containment: 'window', // Keep elements within window bounds
    start: function(event, ui) {
      $(this).css('opacity', '0.5');
      $(this).css('z-index', 10);
    },
    stop: function(event, ui) {
      $(this).css('opacity', '1');
      $(this).css('z-index', '');
    }
  });

  // Make the tree silhouette droppable
  $('#raintree-tree-mainimg').droppable({
    accept: '.part',
    drop: function(event, ui) {
      handleDrop(ui.draggable);
    }
  });

  // Handle drop logic
  function handleDrop(draggedPart) {
    const draggedPartId = draggedPart.attr('id');
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');

    if (['raintree-bark', 'raintree-leaf', 'raintree-fruit', 'raintree-flower'].includes(draggedPartId)) {
      correctSound.play();
      raintreePartsDropped++;

      // Scoring logic based on the number of correct parts dropped
      if (raintreePartsDropped === 1) {
        score += 10; // First correct part
      } else if (raintreePartsDropped === 2) {
        score += 10; // Second correct part
      } else if (raintreePartsDropped === 3) {
        score += 10; // Third correct part
      } else if (raintreePartsDropped === 4) {
        score += 10; // Fourth correct part
      }

      updateScoreDisplay();

      // Show the corresponding main image part
      if (draggedPartId === 'raintree-bark') {
        $('#raintreemain-barkimg').fadeIn();
      } else if (draggedPartId === 'raintree-leaf') {
        $('#raintreemain-leaveimg').fadeIn();
      } else if (draggedPartId === 'raintree-fruit') {
        $('#raintreemain-fruitimg').fadeIn();
      } else if (draggedPartId === 'raintree-flower') {
        $('#raintreemain-flowerimg').fadeIn();
      }

      // Move the dragged part to the tree instead of hiding it
      draggedPart.css({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: '0'
      });

      if (raintreePartsDropped === 4) {
        revealMainImage();
      }
    } else {
      wrongSound.play();
      showMessage('Please select another Part');
      score -= 2; // Deduct points for wrong attempts
      updateScoreDisplay();
      wrongAttempts++;

      if (wrongAttempts >= 5) {
        $('#game-over-modal').fadeIn();
      } else {
        let initialPosition = draggedPart.data('initialPosition');
        draggedPart.css({
          position: 'absolute',
          top: initialPosition.top + 'px',
          left: initialPosition.left + 'px',
        });
      }
    }
  }

  // Handle touch events for draggable parts
  $('.part').on('touchstart', function(event) {
    event.stopPropagation(); // Prevent touch events from propagating to other elements
    const touch = event.originalEvent.touches[0];
    const draggedPart = $(this);
    const offset = draggedPart.offset();
    const touchX = touch.pageX - offset.left;
    const touchY = touch.pageY - offset.top;

    draggedPart.css({
        position: 'absolute',
        left: touch.pageX - touchX,
        top: touch.pageY - touchY,
        opacity: '0.5',
        zIndex: 10
    });

    $(document).on('touchmove', function(event) {
        const touch = event.originalEvent.touches[0];
        draggedPart.css({
            left: touch.pageX - touchX,
            top: touch.pageY - touchY
        });
    });

    $(document).on('touchend', function(event) {
        $(document).off('touchmove');
        $(document).off('touchend'); // Remove touchend listener to prevent multiple triggers

        const dropPosition = {
            left: draggedPart.css('left'),
            top: draggedPart.css('top')
        };

        // Check if the dragged part is dropped within the droppable area
        const droppableArea = $('#raintree-tree-mainimg');
        const droppableOffset = droppableArea.offset();
        const droppableWidth = droppableArea.outerWidth();
        const droppableHeight = droppableArea.outerHeight();

        const isDroppedInArea = (
            parseInt(dropPosition.left) >= droppableOffset.left &&
            parseInt(dropPosition.left) <= droppableOffset.left + droppableWidth &&
            parseInt(dropPosition.top) >= droppableOffset.top &&
            parseInt(dropPosition.top) <= droppableOffset.top + droppableHeight
        );

        if (isDroppedInArea) {
            // Check if the part has already been dropped
            if (!draggedPart.data('dropped')) {
                handleDrop(draggedPart);
                draggedPart.data('dropped', false); // Mark as dropped
            }
        } else {
            // Reset to initial position if not dropped in the area
            let initialPosition = draggedPart.data('initialPosition');
            draggedPart.css({
                position: 'absolute',
                top: initialPosition.top + 'px',
                left: initialPosition.left + 'px'
            });
        }
    });
  });

  // Prevent touch events on the rest of the screen
  $(document).on('touchstart', function(event) {
    if (!$(event.target).hasClass('part')) {
      event.preventDefault(); // Prevent default touch behavior if not on a part
    }
  });

  $(document).on('click', '#identify-next-tree', function() {
    const raintreeScore = score; // Get the current score
    localStorage.setItem('raintreeScore', raintreeScore); // Store it in localStorage
    // Redirect to the next container
    window.location.href = 'almondcontainer.html';
});

  $(document).on('click', '.restartBtn', function() {
    location.reload();
  });

  $(document).on('click', '.quitBtn', function() {
    window.location.href = '../index.html';
  });
});

function showMessage(message) {
  const messageElement = $('<div class="message"></div>').text(message);
  $('body').append(messageElement);

  setTimeout(() => {
    messageElement.remove();
  }, 2000);
}

function revealMainImage() {
  const mainImage = $('#raintree-tree-mainimg .main-image');
  const silhouette = $('#raintree-tree-mainimg .silhouette');

  silhouette.fadeOut(1000, function() {
    mainImage.fadeIn(1000);
    $('#raintreemain-barkimg, #raintreemain-leaveimg, #raintreemain-fruitimg, #raintreemain-flowerimg').css('z-index', -1);
    $('#raintree-info-modal').fadeIn();
  });
}

$(document).on('click', '.close-button', function() {
  $('#raintree-info-modal').fadeOut();
});

$(window).on('click', function(event) {
  if ($(event.target).is('#raintree-info-modal')) {
    $('#raintree-info-modal').fadeOut();
  }
});

$(document).on('click', '#closeGameOverModal', function() {
  $('#game-over-modal').fadeOut();
});

$(document).on('click', '#playAgainBtn', function() {
  localStorage.removeItem('totalScore');
  location.reload();
  $('#game-over-modal').fadeOut();
  score = 0;
  updateScoreDisplay();
  raintreePartsDropped = 0;
});

$(document).on('click', '#mainMenuBtn', function() {
  localStorage.removeItem('totalScore');
  window.location.href = '../index.html';
});
