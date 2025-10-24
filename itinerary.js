(() => {
  // Helper functions
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => document.querySelectorAll(sel);
  
  // DOM elements
  const yearEl = document.getElementById('year');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const tripName = qs('#tripName');
  const tripDates = qs('#tripDates');
  const tripDestination = qs('#tripDestination');
  const saveTripBtn = qs('#saveTrip');
  const clearTripBtn = qs('#clearTrip');
  const addDayBtn = qs('#addDay');
  const timeline = qs('#timeline');
  const activityModal = qs('#activityModal');
  const modalClose = qs('.modal-close');
  const activityForm = qs('#activityForm');
  const cancelActivityBtn = qs('#cancelActivity');
  const saveStatus = qs('#saveStatus');
  
  // State
  let tripData = {
    name: 'My Dream Trip',
    dates: '',
    destination: '',
    days: []
  };
  
  let nextActivityId = 1;
  let nextDayId = 1;
  let currentEditingActivity = null;
  
  // Initialize
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  // Mobile nav toggle
  navToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(!!open));
  });
  
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (ev) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
      if (nav?.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });
  
  // Load trip data from localStorage
  function loadTripData() {
    const saved = localStorage.getItem('travelItinerary');
    if (saved) {
      try {
        tripData = JSON.parse(saved);
        nextDayId = tripData.days.length > 0 ? Math.max(...tripData.days.map(d => d.id)) + 1 : 1;
        if (tripData.days.length > 0) {
          const maxActivityId = Math.max(...tripData.days.flatMap(d => d.activities.map(a => a.id)));
          nextActivityId = maxActivityId + 1;
        }
      } catch (e) {
        console.error('Failed to load trip data', e);
      }
    }
    updateUI();
  }
  
  // Save trip data to localStorage
  function saveTripData() {
    localStorage.setItem('travelItinerary', JSON.stringify(tripData));
    showSaveStatus('Saved automatically', 'success');
  }
  
  // Auto-save draft every 30 seconds
  function autoSave() {
    saveTripData();
  }
  setInterval(autoSave, 30000);
  
  // Update UI with current trip data
  function updateUI() {
    tripName.value = tripData.name;
    tripDates.value = tripData.dates;
    tripDestination.value = tripData.destination;
    renderTimeline();
  }
  
  // Render timeline
  function renderTimeline() {
    if (!timeline) return;
    
    if (tripData.days.length === 0) {
      timeline.innerHTML = `
        <div class="empty-state">
          <p>Your itinerary is empty. Click "Add Day" to start planning!</p>
        </div>
      `;
      return;
    }
    
    timeline.innerHTML = tripData.days.map(day => `
      <div class="day-card" data-day-id="${day.id}">
        <div class="day-header">
          <h3 class="day-title">
            <input type="text" class="day-title-input" value="${day.title}" data-day-id="${day.id}">
          </h3>
          <div class="day-actions">
            <button class="btn-icon" onclick="itineraryJS.addActivity(${day.id})" title="Add Activity">+</button>
            <button class="btn-icon btn-icon-danger" onclick="itineraryJS.deleteDay(${day.id})" title="Delete Day">🗑</button>
          </div>
        </div>
        <div class="day-activities" id="activities-${day.id}">
          ${day.activities.map(activity => `
            <div class="activity-item" data-activity-id="${activity.id}">
              <div class="activity-time">${activity.time || ''}</div>
              <div class="activity-content">
                <h4 class="activity-title">${activity.title}</h4>
                ${activity.location ? `<p class="activity-location">📍 ${activity.location}</p>` : ''}
                ${activity.notes ? `<p class="activity-notes">${activity.notes}</p>` : ''}
              </div>
              <div class="activity-actions">
                <button class="btn-icon" onclick="itineraryJS.editActivity(${day.id}, ${activity.id})" title="Edit">✏️</button>
                <button class="btn-icon btn-icon-danger" onclick="itineraryJS.deleteActivity(${day.id}, ${activity.id})" title="Delete">🗑</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    
    // Add event listeners for day title changes
    qsa('.day-title-input').forEach(input => {
      input.addEventListener('blur', (e) => {
        const dayId = parseInt(e.target.dataset.dayId);
        updateDayTitle(dayId, e.target.value);
      });
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.target.blur();
        }
      });
    });
  }
  
  // Update day title
  function updateDayTitle(dayId, title) {
    const day = tripData.days.find(d => d.id === dayId);
    if (day) {
      day.title = title;
      saveTripData();
    }
  }
  
  // Add new day
  function addDay() {
    const newDay = {
      id: nextDayId++,
      title: `Day ${tripData.days.length + 1}`,
      activities: []
    };
    tripData.days.push(newDay);
    saveTripData();
    renderTimeline();
  }
  
  // Delete day
  function deleteDay(dayId) {
    if (confirm('Are you sure you want to delete this day and all its activities?')) {
      tripData.days = tripData.days.filter(d => d.id !== dayId);
      saveTripData();
      renderTimeline();
    }
  }
  
  // Add activity
  function addActivity(dayId) {
    currentEditingActivity = null;
    qs('#modalTitle').textContent = 'Add Activity';
    qs('#activityForm').reset();
    qs('#activityDayId').value = dayId;
    qs('#activityId').value = '';
    activityModal.style.display = 'block';
  }
  
  // Edit activity
  function editActivity(dayId, activityId) {
    const day = tripData.days.find(d => d.id === dayId);
    const activity = day?.activities.find(a => a.id === activityId);
    
    if (!activity) return;
    
    currentEditingActivity = { dayId, activityId };
    qs('#modalTitle').textContent = 'Edit Activity';
    qs('#activityId').value = activityId;
    qs('#activityDayId').value = dayId;
    qs('#activityTitle').value = activity.title;
    qs('#activityTime').value = activity.time || '';
    qs('#activityLocation').value = activity.location || '';
    qs('#activityNotes').value = activity.notes || '';
    activityModal.style.display = 'block';
  }
  
  // Delete activity
  function deleteActivity(dayId, activityId) {
    if (confirm('Are you sure you want to delete this activity?')) {
      const day = tripData.days.find(d => d.id === dayId);
      if (day) {
        day.activities = day.activities.filter(a => a.id !== activityId);
        saveTripData();
        renderTimeline();
      }
    }
  }
  
  // Handle activity form submission
  activityForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const dayId = parseInt(qs('#activityDayId').value);
    const activityId = qs('#activityId').value;
    const day = tripData.days.find(d => d.id === dayId);
    
    if (!day) return;
    
    const activityData = {
      id: activityId ? parseInt(activityId) : nextActivityId++,
      title: qs('#activityTitle').value,
      time: qs('#activityTime').value,
      location: qs('#activityLocation').value,
      notes: qs('#activityNotes').value
    };
    
    if (activityId) {
      // Update existing activity
      const index = day.activities.findIndex(a => a.id === parseInt(activityId));
      if (index !== -1) {
        day.activities[index] = activityData;
      }
    } else {
      // Add new activity
      day.activities.push(activityData);
    }
    
    saveTripData();
    renderTimeline();
    activityModal.style.display = 'none';
  });
  
  // Close modal
  modalClose?.addEventListener('click', () => {
    activityModal.style.display = 'none';
  });
  
  cancelActivityBtn?.addEventListener('click', () => {
    activityModal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === activityModal) {
      activityModal.style.display = 'none';
    }
  });
  
  // Save trip
  saveTripBtn?.addEventListener('click', () => {
    tripData.name = tripName.value;
    tripData.dates = tripDates.value;
    tripData.destination = tripDestination.value;
    saveTripData();
    showSaveStatus('Trip saved successfully!', 'success');
  });
  
  // Clear trip
  clearTripBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your entire itinerary? This cannot be undone.')) {
      tripData = {
        name: 'My Dream Trip',
        dates: '',
        destination: '',
        days: []
      };
      nextDayId = 1;
      nextActivityId = 1;
      localStorage.removeItem('travelItinerary');
      updateUI();
      showSaveStatus('Trip cleared', 'info');
    }
  });
  
  // Add day button
  addDayBtn?.addEventListener('click', addDay);
  
  // Show save status
  function showSaveStatus(message, type = 'success') {
    if (!saveStatus) return;
    saveStatus.textContent = message;
    saveStatus.className = `save-status ${type}`;
    setTimeout(() => {
      saveStatus.textContent = '';
      saveStatus.className = 'save-status';
    }, 3000);
  }
  
  // Expose functions globally for onclick handlers
  window.itineraryJS = {
    addActivity,
    editActivity,
    deleteActivity,
    deleteDay
  };
  
  // Load trip data on page load
  loadTripData();
  
  // Auto-save trip details on change
  tripName?.addEventListener('blur', () => {
    tripData.name = tripName.value;
    saveTripData();
  });
  
  tripDates?.addEventListener('blur', () => {
    tripData.dates = tripDates.value;
    saveTripData();
  });
  
  tripDestination?.addEventListener('blur', () => {
    tripData.destination = tripDestination.value;
    saveTripData();
  });
})();

