// Journal functionality
const moodOptions = document.querySelectorAll('.mood-option');
const journalTextarea = document.querySelector('.journal-entry textarea');
const saveEntryBtn = document.querySelector('.save-entry');
const entriesList = document.querySelector('.entries-list');
const streakNumber = document.querySelector('.streak-number');

let currentMood = null;
let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
let streak = localStorage.getItem('journalStreak') || 0;

// Update streak display
streakNumber.textContent = streak;

// Mood selection
moodOptions.forEach(option => {
    option.addEventListener('click', function() {
        moodOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        currentMood = this.getAttribute('data-mood');
    });
});

// Save entry
saveEntryBtn.addEventListener('click', function() {
    if (!currentMood) {
        alert('Please select your mood first');
        return;
    }
    
    if (!journalTextarea.value.trim()) {
        alert('Please write something in your journal');
        return;
    }
    
    const newEntry = {
        date: new Date().toLocaleDateString(),
        mood: currentMood,
        content: journalTextarea.value,
        timestamp: new Date().getTime()
    };
    
    entries.unshift(newEntry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    // Update streak
    updateStreak();
    
    // Clear inputs
    journalTextarea.value = '';
    moodOptions.forEach(opt => opt.classList.remove('selected'));
    currentMood = null;
    
    // Refresh entries display
    displayEntries();
});

function updateStreak() {
    const lastEntryDate = entries.length > 0 ? new Date(entries[0].timestamp) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (lastEntryDate) {
        lastEntryDate.setHours(0, 0, 0, 0);
        const diffTime = today - lastEntryDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        if (diffDays === 0) {
            // Already logged today
            return;
        } else if (diffDays === 1) {
            // Consecutive day
            streak++;
        } else {
            // Broken streak
            streak = 1;
        }
    } else {
        // First entry
        streak = 1;
    }
    
    localStorage.setItem('journalStreak', streak);
    streakNumber.textContent = streak;
}

function displayEntries() {
    entriesList.innerHTML = '';
    
    if (entries.length === 0) {
        entriesList.innerHTML = '<p>No entries yet. Start journaling!</p>';
        return;
    }
    
    entries.forEach(entry => {
        const entryEl = document.createElement('div');
        entryEl.className = 'entry-card';
        
        const moodEmoji = getMoodEmoji(entry.mood);
        
        entryEl.innerHTML = `
            <div class="entry-date">${entry.date}</div>
            <div class="entry-mood">${moodEmoji}</div>
            <div class="entry-content">${entry.content}</div>
        `;
        
        entriesList.appendChild(entryEl);
    });
}

function getMoodEmoji(mood) {
    const moods = {
        '1': '😢',
        '2': '😞',
        '3': '😐',
        '4': '😊',
        '5': '😁'
    };
    return moods[mood] || '😐';
}

// Initialize entries display
displayEntries();
