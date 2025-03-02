// Get the elements for drag-and-drop interaction
const draggableParts = document.querySelectorAll('.draggable');
const treeSilhouette = document.getElementById('tree-silhouette');
const feedback = document.getElementById('feedback');

// Add drag start event to each draggable element
draggableParts.forEach(part => {
    part.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id); // Store the dragged part's ID
    });
});

// Add drag over event to allow dropping on the silhouette
treeSilhouette.addEventListener('dragover', (event) => {
    event.preventDefault(); // Allow drop
});

// Handle the drop event to check if the correct part is placed
treeSilhouette.addEventListener('drop', (event) => {
    event.preventDefault();
    const draggedPartId = event.dataTransfer.getData('text');
    const droppedElement = document.getElementById(draggedPartId);

    // Check if the dropped part matches the correct part (in this case mango-bark)
    if (draggedPartId === 'mango-bark' && !droppedElement.classList.contains('dropped')) {
        feedback.innerText = 'Correct bark selected!';
        droppedElement.classList.add('dropped');
        treeSilhouette.appendChild(droppedElement); // Attach part to silhouette
    } else if (draggedPartId === 'mango-leaf' && !droppedElement.classList.contains('dropped')) {
        feedback.innerText = 'Correct leaf selected!';
        droppedElement.classList.add('dropped');
        treeSilhouette.appendChild(droppedElement);
    } else if (draggedPartId === 'mango-fruit' && !droppedElement.classList.contains('dropped')) {
        feedback.innerText = 'Correct fruit selected!';
        droppedElement.classList.add('dropped');
        treeSilhouette.appendChild(droppedElement);
    } else if (draggedPartId === 'mango-flower' && !droppedElement.classList.contains('dropped')) {
        feedback.innerText = 'Correct flower selected!';
        droppedElement.classList.add('dropped');
        treeSilhouette.appendChild(droppedElement);
    } else {
        feedback.innerText = 'Wrong part! Please try again.';
    }
});
