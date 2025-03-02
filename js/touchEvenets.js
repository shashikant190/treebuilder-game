$(document).ready(function() {
    // Make parts draggable with touch support
    $('.part').draggable({
      revert: 'invalid', // Revert if not dropped in a valid droppable
      helper: 'clone', // Use a clone of the element as the helper
      start: function(event, ui) {
        $(this).css('opacity', '0.5'); // Make the original part semi-transparent
        $(this).css('z-index', 10); // Bring the dragged part to front
      },
      stop: function(event, ui) {
        $(this).css('opacity', '1'); // Reset opacity
        $(this).css('z-index', ''); // Reset z-index after dragging
      }
    });
  
    // Make the tree silhouette droppable with touch support
    $('#mango-tree-mainimg').droppable({
      accept: '.part', // Accept only parts
      drop: function(event, ui) {
        const draggedPartId = ui.draggable.attr('id'); // Get the dragged part's ID
        const correctSound = document.getElementById('correctSound');
        const wrongSound = document.getElementById('wrongSound');
        console.log('Dragged Part ID:', draggedPartId);
  
        // Prevent the mango-tree-mainimg from shifting position
        $(this).css('position', 'absolute'); // Change to absolute positioning
  
        // Check if the dragged part matches the expected ID
        if (['mango-bark', 'mango-leaf', 'mango-fruit', 'mango-flower'].includes(draggedPartId)) {
          // Play correct sound
          correctSound.play();
          showMessage(`Correct ${draggedPartId.split('-')[1].charAt(0).toUpperCase() + draggedPartId.split('-')[1].slice(1)} selected`);
  
          // Update score for correct part
          score += 10; 
          updateScoreDisplay(); // Update the score display
  
          // Instead of appending, just hide the part
          ui.draggable.hide(); // Hide the part after dropping
  
          mangoPartsDropped++; // Increment the mango parts dropped
  
          // Reveal corresponding silhouette based on the dropped part
          if (draggedPartId === 'mango-bark') {
            $('#mangomain-barkimg').fadeIn(); // Reveal mango bark image
          } else if (draggedPartId === 'mango-leaf') {
            $('#mangomain-leaveimg').fadeIn(); // Reveal mango leaf image
          } else if (draggedPartId === 'mango-fruit') {
            $('#mangomain-fruitimg').fadeIn(); // Reveal mango fruit image
          } else if (draggedPartId === 'mango-flower') {
            $('#mangomain-flowerimg').fadeIn(); // Reveal mango flower image
          }
  
          // Check if four correct parts have been dropped
          if (mangoPartsDropped === 4) {
            revealMainImage(); // Call the function to reveal the main image
          }
        } else {
          // Play wrong sound
          wrongSound.play();
          showMessage('Please select another Part'); // For all other parts
          
          // Update score for incorrect part
          score -= 2; 
          updateScoreDisplay(); // Update the score display
  
          // Increment wrong attempts
          wrongAttempts++; 
  
          // Check if wrong attempts have reached 5
          if (wrongAttempts >= 5) {
            $('#game-over-modal').fadeIn(); // Show Game Over modal
          } else {
            ui.draggable.draggable('option', 'revert', true); // Revert the part back to its original position
          }
        }
      }
    });
  });