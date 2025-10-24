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
  const exportCalendarBtn = qs('#exportCalendar');
  const addDayBtn = qs('#addDay');
  const useTemplateBtn = qs('#useTemplate');
  const findHotelsBtn = qs('#findHotels');
  const findActivitiesBtn = qs('#findActivities');
  const timeline = qs('#timeline');
  const activityModal = qs('#activityModal');
  const templateModal = qs('#templateModal');
  const hotelModal = qs('#hotelModal');
  const modalClose = qsa('.modal-close');
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
  let allDestinations = [];
  
  // Activity templates based on destinations
  const activityTemplates = {
    'Paris, France': [
      { title: 'Visit Eiffel Tower', time: '9:00 AM', location: 'Champ de Mars, Paris', category: 'sightseeing', cost: 29, notes: 'Skip the line with advance booking' },
      { title: 'Explore the Louvre', time: '2:00 PM', location: 'Rue de Rivoli, Paris', category: 'culture', cost: 17, notes: 'World famous art museum' },
      { title: 'Seine River Cruise', time: '7:00 PM', location: 'Seine River', category: 'sightseeing', cost: 15, notes: 'Beautiful evening views' },
      { title: 'Café de Flore', time: '11:00 AM', location: 'Saint-Germain-des-Prés', category: 'food', cost: 20, notes: 'Historic café' }
    ],
    'Nice, France': [
      { title: 'Promenade des Anglais', time: '8:00 AM', location: 'Nice Beachfront', category: 'relaxation', cost: 0, notes: 'Morning walk along the famous promenade' },
      { title: 'Vieux Nice Old Town', time: '10:00 AM', location: 'Old Town Nice', category: 'sightseeing', cost: 0, notes: 'Charming cobblestone streets' },
      { title: 'Castle Hill', time: '12:00 PM', location: 'Colline du Château', category: 'sightseeing', cost: 0, notes: 'Panoramic views of Nice' },
      { title: 'Gelato at Fenocchio', time: '3:00 PM', location: 'Place Rossetti', category: 'food', cost: 8, notes: 'Try the lavender flavor!' }
    ],
    'Positano, Italy': [
      { title: 'Spiaggia Grande Beach', time: '9:00 AM', location: 'Beach, Positano', category: 'relaxation', cost: 15, notes: 'Beach chair rental included' },
      { title: 'Santuario della Madonna del Rosario', time: '11:00 AM', location: 'Church Square', category: 'culture', cost: 0, notes: 'Beautiful church views' },
      { title: 'Rooftop Dining', time: '7:00 PM', location: 'Centro Storico', category: 'food', cost: 80, notes: 'Try local seafood pasta' },
      { title: 'Path of the Gods Hike', time: '8:00 AM', location: 'Trail head', category: 'adventure', cost: 0, notes: 'Spectacular coastal views' }
    ],
    'Capri, Italy': [
      { title: 'Blue Grotto', time: '10:00 AM', location: 'Marina Grande', category: 'sightseeing', cost: 20, notes: 'Famous blue cave' },
      { title: 'Monte Solaro Chairlift', time: '2:00 PM', location: 'Anacapri', category: 'sightseeing', cost: 12, notes: 'Highest point on Capri' },
      { title: 'Arco Naturale', time: '11:00 AM', location: 'East Coast', category: 'sightseeing', cost: 0, notes: 'Natural rock arch' },
      { title: 'Marina Piccola', time: '4:00 PM', location: 'South Coast', category: 'relaxation', cost: 20, notes: 'Private beach club' }
    ],
    'Zurich, Switzerland': [
      { title: 'Old Town Walking Tour', time: '10:00 AM', location: 'Altstadt', category: 'sightseeing', cost: 0, notes: 'Explore historic streets' },
      { title: 'Lake Zurich Cruise', time: '2:00 PM', location: 'Lake Zurich', category: 'sightseeing', cost: 30, notes: 'Beautiful alpine lake views' },
      { title: 'Kunsthaus Zurich', time: '11:00 AM', location: 'Museum District', category: 'culture', cost: 18, notes: 'Swiss art collection' },
      { title: 'Lindenhof Hill', time: '9:00 AM', location: 'City Center', category: 'sightseeing', cost: 0, notes: 'Panoramic city views' }
    ],
    'Grindelwald, Switzerland': [
      { title: 'Jungfraujoch Railway', time: '8:00 AM', location: 'Train Station', category: 'adventure', cost: 200, notes: 'Top of Europe experience' },
      { title: 'First Cliff Walk', time: '2:00 PM', location: 'First Mountain', category: 'adventure', cost: 0, notes: 'Thrilling cliffside walkway' },
      { title: 'Hiking to Bachalpsee', time: '9:00 AM', location: 'Mountain Trail', category: 'adventure', cost: 0, notes: 'Alpine lake hike' },
      { title: 'Grindelwald Village', time: '5:00 PM', location: 'Village Center', category: 'sightseeing', cost: 0, notes: 'Charming Swiss village' }
    ]
  };
  
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
  
  // Load destinations from content.json
  fetch('content.json')
    .then(r => r.json())
    .then(data => {
      allDestinations = data.destinations || [];
    })
    .catch(err => console.error('Failed to load destinations', err));
  
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
    updateBudget();
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
    updateBudget();
  }
  
  // Update budget display
  function updateBudget() {
    let totalActivities = 0;
    let totalHotels = 0;
    
    tripData.days.forEach(day => {
      day.activities.forEach(activity => {
        const cost = parseFloat(activity.cost) || 0;
        if (activity.category === 'hotel') {
          totalHotels += cost;
        } else {
          totalActivities += cost;
        }
      });
    });
    
    const total = totalActivities + totalHotels;
    
    if (qs('#totalBudget')) qs('#totalBudget').textContent = `$${total.toFixed(2)}`;
    if (qs('#activitiesBudget')) qs('#activitiesBudget').textContent = `$${totalActivities.toFixed(2)}`;
    if (qs('#hotelsBudget')) qs('#hotelsBudget').textContent = `$${totalHotels.toFixed(2)}`;
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
              <div class="activity-icon">${getCategoryIcon(activity.category)}</div>
              <div class="activity-time">${activity.time || ''}</div>
              <div class="activity-content">
                <h4 class="activity-title">${activity.title}</h4>
                ${activity.location ? `<p class="activity-location">📍 ${activity.location}</p>` : ''}
                ${activity.cost ? `<p class="activity-cost">💵 $${parseFloat(activity.cost).toFixed(2)}</p>` : ''}
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
  
  function getCategoryIcon(category) {
    const icons = {
      'sightseeing': '🏛️',
      'food': '🍽️',
      'culture': '🎨',
      'relaxation': '🏖️',
      'shopping': '🛍️',
      'nightlife': '🌙',
      'adventure': '🏔️',
      'hotel': '🏨'
    };
    return icons[category] || '📍';
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
    qs('#activityCategory').value = activity.category || '';
    qs('#activityCost').value = activity.cost || '';
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
      category: qs('#activityCategory').value,
      cost: qs('#activityCost').value,
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
  
  // Export to Google Calendar (ICS format)
  function exportToCalendar() {
    if (tripData.days.length === 0) {
      alert('Your itinerary is empty! Add some activities first.');
      return;
    }
    
    // Generate ICS file content
    let icsContent = 'BEGIN:VCALENDAR\n';
    icsContent += 'VERSION:2.0\n';
    icsContent += 'PRODID:-//Drifted Travel Planner//EN\n';
    icsContent += 'CALSCALE:GREGORIAN\n';
    icsContent += 'METHOD:PUBLISH\n';
    
    const today = new Date();
    let currentDate = new Date(today);
    
    tripData.days.forEach((day, dayIndex) => {
      day.activities.forEach(activity => {
        const eventDate = new Date(currentDate);
        eventDate.setDate(today.getDate() + dayIndex);
        
        // Try to parse time if provided
        let eventDateTime = new Date(eventDate);
        if (activity.time) {
          const timeMatch = activity.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (timeMatch) {
            let hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            const ampm = timeMatch[3].toUpperCase();
            
            if (ampm === 'PM' && hours !== 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            
            eventDateTime.setHours(hours, minutes, 0, 0);
          }
        }
        
        const startDateTime = eventDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const endDateTime = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        icsContent += 'BEGIN:VEVENT\n';
        icsContent += `DTSTART:${startDateTime}\n`;
        icsContent += `DTEND:${endDateTime}\n`;
        icsContent += `SUMMARY:${activity.title}\n`;
        icsContent += `DESCRIPTION:${activity.location || ''}${activity.notes ? '\\n' + activity.notes : ''}\n`;
        icsContent += `LOCATION:${activity.location || tripData.destination}\n`;
        icsContent += 'END:VEVENT\n';
      });
    });
    
    icsContent += 'END:VCALENDAR';
    
    // Download file
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tripData.name || 'Itinerary'}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    
    showSaveStatus('Calendar file downloaded! Import it into Google Calendar.', 'success');
  }
  
  // Use template
  function useTemplate() {
    // Show template modal
    templateModal.style.display = 'block';
    
    // Render template options
    const templateGrid = qs('#templateGrid');
    if (templateGrid) {
      templateGrid.innerHTML = allDestinations.map(dest => {
        const hasTemplate = activityTemplates[dest.title];
        return `
          <div class="template-card" ${hasTemplate ? `onclick="itineraryJS.applyTemplate('${dest.title}')"` : ''}>
            <img src="${dest.image}" alt="${dest.title}">
            <h3>${dest.title}</h3>
            <p>${dest.meta}</p>
            ${hasTemplate ? '<button class="btn btn-primary">Use Template</button>' : '<p class="text-muted">No template available</p>'}
          </div>
        `;
      }).join('');
    }
  }
  
  // Apply template
  function applyTemplate(destination) {
    const template = activityTemplates[destination];
    if (!template) return;
    
    // Create days based on template
    template.forEach((activity, index) => {
      let day = tripData.days[index];
      if (!day) {
        day = {
          id: nextDayId++,
          title: `Day ${index + 1}`,
          activities: []
        };
        tripData.days.push(day);
      }
      
      const newActivity = {
        id: nextActivityId++,
        ...activity
      };
      day.activities.push(newActivity);
    });
    
    tripData.destination = destination;
    saveTripData();
    renderTimeline();
    templateModal.style.display = 'none';
    showSaveStatus(`Applied template for ${destination}!`, 'success');
  }
  
  // Find hotels
  function findHotels() {
    hotelModal.style.display = 'block';
    
    qs('#searchHotels')?.addEventListener('click', () => {
      const destination = qs('#hotelSearch').value || tripData.destination;
      const budget = qs('#budgetRange').value;
      
      // Simulate hotel search (in real app, would use API)
      const results = [
        { name: 'Cozy Boutique Hotel', price: budget === 'budget' ? 75 : budget === 'mid' ? 150 : 250, link: 'https://www.booking.com', rating: 4.5 },
        { name: 'Central Guesthouse', price: budget === 'budget' ? 85 : budget === 'mid' ? 160 : 280, link: 'https://www.airbnb.com', rating: 4.7 },
        { name: 'Stylish Downtown Hotel', price: budget === 'budget' ? 95 : budget === 'mid' ? 180 : 320, link: 'https://www.booking.com', rating: 4.8 }
      ];
      
      const resultsContainer = qs('#hotelResults');
      if (resultsContainer) {
        resultsContainer.innerHTML = results.map(hotel => `
          <div class="result-item">
            <h4>${hotel.name}</h4>
            <p>💵 $${hotel.price}/night • ⭐ ${hotel.rating}</p>
            <a href="${hotel.link}" target="_blank" class="btn btn-primary btn-small">View Details</a>
          </div>
        `).join('');
      }
    });
  }
  
  // Find activities
  function findActivities() {
    const destination = tripData.destination || 'your destination';
    alert(`Finding budget activities for ${destination}...\n\nIn a full implementation, this would:\n- Connect to tour booking APIs\n- Show activities with real-time pricing\n- Filter by budget range\n- Integrate with Airbnb Experiences, Viator, etc.`);
  }
  
  // Close modals
  modalClose.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });
  
  cancelActivityBtn?.addEventListener('click', () => {
    activityModal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
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
  
  // Event listeners
  addDayBtn?.addEventListener('click', addDay);
  exportCalendarBtn?.addEventListener('click', exportToCalendar);
  useTemplateBtn?.addEventListener('click', useTemplate);
  findHotelsBtn?.addEventListener('click', findHotels);
  findActivitiesBtn?.addEventListener('click', findActivities);
  
  // Show save status
  function showSaveStatus(message, type = 'success') {
    if (!saveStatus) return;
    saveStatus.textContent = message;
    saveStatus.className = `save-status ${type}`;
    setTimeout(() => {
      saveStatus.textContent = '';
      saveStatus.className = 'save-status';
    }, 5000);
  }
  
  // Expose functions globally for onclick handlers
  window.itineraryJS = {
    addActivity,
    editActivity,
    deleteActivity,
    deleteDay,
    applyTemplate
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
