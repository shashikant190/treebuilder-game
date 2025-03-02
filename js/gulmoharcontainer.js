 $(document).ready(function() {
  let correctPartsCount = 0;
  let gulmoharPartsDropped = 0;
  let score = 0;
  let wrongAttempts = 0;
  localStorage.removeItem('totalScore');

  // Store the initial position of each part
  const initialPositions = {
    'mango-bark': { top: 120, left: 100 },
    'almond-bark': { top: 255, left: 100 },
    'tamarind-bark': { top: 390, left: 100 },
    'raintree-bark': { top: 525, left: 100 },
    'gulmohar-bark': { top: 660, left: 100 },

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
    containment: 'window',
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
  $('#gulmohar-tree-mainimg').droppable({
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

    if (['gulmohar-bark', 'gulmohar-leaf', 'gulmohar-fruit', 'gulmohar-flower'].includes(draggedPartId)) {
      correctSound.play();
      gulmoharPartsDropped++;

      // Scoring logic
      if (gulmoharPartsDropped === 1) {
        score += 10;
      } else if (gulmoharPartsDropped === 2) {
        score += 10;
      } else if (gulmoharPartsDropped === 3) {
        score += 10;
      } else if (gulmoharPartsDropped === 4) {
        score += 10;
      }

      updateScoreDisplay();

      // Show the corresponding main image part
      if (draggedPartId === 'gulmohar-bark') {
        $('#gulmoharmain-barkimg').fadeIn();
      } else if (draggedPartId === 'gulmohar-leaf') {
        $('#gulmoharmain-leaveimg').fadeIn();
      } else if (draggedPartId === 'gulmohar-fruit') {
        $('#gulmoharmain-fruitimg').fadeIn();
      } else if (draggedPartId === 'gulmohar-flower') {
        $('#gulmoharmain-flowerimg').fadeIn();
      }

      // Move the dragged part to the tree
      draggedPart.css({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: '0'
      });

      if (gulmoharPartsDropped === 4) {
        revealMainImage();
      }
    } else {
      wrongSound.play();
      showMessage('Please select another Part');
      score -= 2;
      updateScoreDisplay();
      wrongAttempts++;

      if (wrongAttempts >= 5) {
        //const totalScore = (parseInt(localStorage.getItem('totalScore')) || 0) + score;
       // $('#game-over-modal .total-score').text('Total Score: ' + totalScore);
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

  // Handle touch events
  $('.part').on('touchstart', function(event) {
    event.stopPropagation();
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
        $(document).off('touchend');

        const dropPosition = {
            left: draggedPart.css('left'),
            top: draggedPart.css('top')
        };

        const droppableArea = $('#gulmohar-tree-mainimg');
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
            if (!draggedPart.data('dropped')) {
                handleDrop(draggedPart);
                draggedPart.data('dropped', false);
            }
        } else {
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
      event.preventDefault();
    }
  });

  $(document).on('click', '#identify-next-tree', function() {
    // Calculate the total score from localStorage
    const mangoScore = parseInt(localStorage.getItem('mangoScore')) || 0;
    const tamarindScore = parseInt(localStorage.getItem('tamarindScore')) || 0;
    const raintreeScore = parseInt(localStorage.getItem('raintreeScore')) || 0;
    const almondScore = parseInt(localStorage.getItem('almondScore')) || 0;

    // Calculate the total score
    const totalScore = mangoScore + tamarindScore + raintreeScore + almondScore + score;

    // Ensure the total score does not exceed 200
    const finalScore = Math.min(totalScore, 200);

    // Store the final score in localStorage
    localStorage.setItem('totalScore', finalScore);

    // Show the result modal and update the total score display
    $('#gulmohar-tree-info-modal').fadeOut();
    $('#result-modal').fadeIn(); // Show the result modal
    $('#total-score').text(finalScore); // Update the total score display
});

$(document).on('click', '#playAgainBtnResult', function() {
    localStorage.removeItem('totalScore');
    window.location.href = 'mangocontainer.html';
});

$(document).on('click', '#mainMenuBtnResult', function() {
    localStorage.removeItem('totalScore');
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
  const mainImage = $('#gulmohar-tree-mainimg .main-image');
  const silhouette = $('#gulmohar-tree-mainimg .silhouette');

  silhouette.fadeOut(1000, function() {
    mainImage.fadeIn(1000);
    $('#gulmoharmain-barkimg, #gulmoharmain-leaveimg, #gulmoharmain-fruitimg, #gulmoharmain-flowerimg').css('z-index', -1);
    $('#gulmohar-info-modal').fadeIn();
  });
}

$(document).on('click', '.close-button', function() {
  $('#gulmohar-info-modal').fadeOut();
});

$(window).on('click', function(event) {
  if ($(event.target).is('#gulmohar-info-modal')) {
    $('#gulmohar-info-modal').fadeOut();
  }
});

$(document).on('click', '#closeGameOverModal', function() {
  $('#game-over-modal').fadeOut();
});

  $(document).on('click', '#playAgainBtn', function() {
    const totalScore = (parseInt(localStorage.getItem('totalScore')) || 0) + score;
    localStorage.setItem('totalScore', totalScore);
    location.reload();
    $('#game-over-modal').fadeOut();
    score = 0;
    updateScoreDisplay();
    gulmoharPartsDropped = 0;
  });



  $(document).on('click', '#mainMenuBtn', function() {
    const totalScore = (parseInt(localStorage.getItem('totalScore')) || 0) + score;
    localStorage.setItem('totalScore', totalScore);
    window.location.href = '../index.html';
  });
