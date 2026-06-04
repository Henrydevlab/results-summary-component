document.addEventListener('DOMContentLoaded', () => {
  const dynamicWrapper = document.getElementById('js-summary-list');
  const mainScoreDisplay = document.getElementById('js-main-score');

  // Direct layout helper map matching JSON labels to class lists
  const modifierMap = {
    "Reaction": "reaction",
    "Memory": "memory",
    "Verbal": "verbal",
    "Visual": "visual"
  };

  /**
   * Helper function creating clean BEM elements for each metric item row
   */
  function createSummaryRow(item) {
    const classModifier = modifierMap[item.category] || item.category.toLowerCase();
    
    const row = document.createElement('div');
    row.className = `summary-row summary-row--${classModifier}`;

    row.innerHTML = `
      <div class="summary-row__label-group">
        <img class="summary-row__icon" src="${item.icon}" alt="" aria-hidden="true">
        <span class="summary-row__name">${item.category}</span>
      </div>
      <p class="summary-row__score-display">
        <span class="summary-row__earned-score">${item.score}</span> 
        <span class="summary-row__max-score">/ 100</span>
      </p>
    `;
    return row;
  }

  // Load and manage data formatting dynamically
  fetch('./data.json')
    .then(response => {
      if (!response.ok) throw new Error('Data payload unreachable.');
      return response.json();
    })
    .then(dataArray => {
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        // Clear all fallback HTML elements from the DOM list container
        dynamicWrapper.innerHTML = '';
        
        let totalScoreSum = 0;

        // Loop through each item in the data array
        dataArray.forEach(metricItem => {
          totalScoreSum += metricItem.score; // Add current category score to total running sum

          const generatedNode = createSummaryRow(metricItem);
          dynamicWrapper.appendChild(generatedNode);
        });

        // Compute the final average score and round it to the nearest integer
        const averageScore = Math.round(totalScoreSum / dataArray.length);

        // Update the big score number inside the purple circle dynamically!
        mainScoreDisplay.textContent = averageScore;
        
        // Update accessibility label on parent node for screen readers
        mainScoreDisplay.parentElement.setAttribute('aria-label', `Score: ${averageScore} out of 100`);
      }
    })
    .catch(err => {
      console.warn('Dynamic JavaScript render skipped:', err.message);
    });
});