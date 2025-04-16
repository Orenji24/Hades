document.addEventListener('DOMContentLoaded', function() {
    // Auth modal functionality
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeBtn = document.querySelector('.close-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Show modal
    loginBtn.addEventListener('click', () => {
        authModal.style.display = 'flex';
        switchTab('login');
    });

    signupBtn.addEventListener('click', () => {
        authModal.style.display = 'flex';
        switchTab('signup');
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            }
        });

        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
    }

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Add actual login logic here
        alert('Login functionality will be implemented');
        authModal.style.display = 'none';
    });

    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Add actual signup logic here
        alert('Account creation functionality will be implemented');
        authModal.style.display = 'none';
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
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
// Therapist Finder
const therapistsList = document.querySelector('.therapists-list');
const searchBtn = document.querySelector('.search-btn');

// Sample therapist data
const therapists = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "Anxiety, Depression",
        bio: "Licensed clinical psychologist with 10 years of experience helping clients manage anxiety and mood disorders.",
        insurance: ["Aetna", "Blue Cross"],
        image: "therapist1.jpg",
        rating: 4.8,
        available: "Mon, Wed, Fri"
    },
    {
        id: 2,
        name: "Michael Chen, LCSW",
        specialty: "Trauma, Relationships",
        bio: "Specializes in trauma-informed care and relationship counseling. LGBTQ+ affirming.",
        insurance: ["Blue Cross", "Medicare"],
        image: "therapist2.jpg",
        rating: 4.6,
        available: "Tue, Thu, Sat"
    },
    {
        id: 3,
        name: "Dr. Jamal Williams",
        specialty: "Men's Mental Health",
        bio: "Focuses on men's mental health issues and helping clients develop healthy coping strategies.",
        insurance: ["Aetna", "Medicare"],
        image: "therapist3.jpg",
        rating: 4.9,
        available: "Mon-Fri"
    }
];

function displayTherapists() {
    therapistsList.innerHTML = '';
    
    therapists.forEach(therapist => {
        const therapistEl = document.createElement('div');
        therapistEl.className = 'therapist-card';
        
        therapistEl.innerHTML = `
            <div class="therapist-image" style="background-image: url('images/${therapist.image}')"></div>
            <div class="therapist-info">
                <h3 class="therapist-name">${therapist.name}</h3>
                <div class="therapist-specialty">${therapist.specialty}</div>
                <p class="therapist-bio">${therapist.bio}</p>
                <div class="therapist-meta">
                    <span>⭐ ${therapist.rating}/5</span>
                    <span>Accepts: ${therapist.insurance.join(', ')}</span>
                </div>
                <button class="primary book-btn" data-id="${therapist.id}">Book Session</button>
            </div>
        `;
        
        therapistsList.appendChild(therapistEl);
    });
}

searchBtn.addEventListener('click', function() {
    const specialty = document.getElementById('specialty').value;
    const insurance = document.getElementById('insurance').value;
    
    // In a real app, you would filter therapists based on these criteria
    // For now, we'll just display all therapists
    displayTherapists();
});

// Initialize therapists display
displayTherapists();
