/* ========================================
   DREAM APP — Application Logic
   V2 — Enhanced with all 10 improvements
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ===== Elements =====
    const splashScreen = document.getElementById('splash-screen');
    const appContainer = document.getElementById('app-container');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const filterChips = document.querySelectorAll('.filter-chip');
    const periodBtns = document.querySelectorAll('.period-btn');
    const catOptions = document.querySelectorAll('.cat-option');
    const seeAllBtns = document.querySelectorAll('.see-all-btn');
    const fabAddTask = document.getElementById('fab-add-task');
    const fabAddGoal = document.getElementById('fab-add-goal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const btnCreateTask = document.getElementById('btn-create-task');
    const statusTime = document.getElementById('status-time');
    const completionToast = document.getElementById('completion-toast');

    // ===== Motivational Quotes =====
    const quotes = [
        '"The secret of getting ahead is getting started." — Mark Twain',
        '"Success is not final, failure is not fatal." — Winston Churchill',
        '"Believe you can and you\'re halfway there." — Theodore Roosevelt',
        '"The only way to do great work is to love what you do." — Steve Jobs',
        '"Don\'t watch the clock; do what it does. Keep going." — Sam Levenson',
        '"It does not matter how slowly you go as long as you do not stop." — Confucius',
        '"Dream big. Start small. Act now." — Robin Sharma',
        '"Push yourself, because no one else is going to do it for you."',
        '"The future belongs to those who believe in the beauty of their dreams."',
        '"Your limitation—it\'s only your imagination."',
    ];

    // ===== Productivity Points Counter =====
    let productivityPoints = 47;

    // ===== Splash Screen =====
    function initApp() {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            appContainer.classList.remove('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                animateProgressRings();
                animateWeekChart();
                animateHeroProgress();
            }, 600);
        }, 2500);
    }

    // ===== Time & Date =====
    function updateTime() {
        const now = new Date();
        statusTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    function updateDate() {
        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const todayDate = document.getElementById('today-date');
        if (todayDate) todayDate.textContent = `${months[now.getMonth()]} ${now.getDate()}`;

        const heroDate = document.getElementById('hero-date');
        if (heroDate) heroDate.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    }

    function updateGreeting() {
        const hour = new Date().getHours();
        const greetingSub = document.querySelector('.greeting-sub');
        if (hour < 12) greetingSub.textContent = 'Good Morning ☀️';
        else if (hour < 17) greetingSub.textContent = 'Good Afternoon 🌤️';
        else greetingSub.textContent = 'Good Evening ✨';
    }

    // ===== Random Quote =====
    function setRandomQuote() {
        const quoteEl = document.getElementById('hero-quote-text');
        if (quoteEl) {
            quoteEl.style.opacity = '0';
            setTimeout(() => {
                quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
                quoteEl.style.opacity = '1';
            }, 200);
        }
    }

    // ===== Animate Hero Progress =====
    function animateHeroProgress() {
        const fill = document.getElementById('hero-fill');
        if (fill) {
            fill.style.width = '0%';
            setTimeout(() => { fill.style.width = '67%'; }, 300);
        }
    }

    // ===== Navigation =====
    function navigateTo(pageName) {
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) targetPage.classList.add('active');

        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageName);
        });

        if (targetPage) {
            const scroll = targetPage.querySelector('.page-scroll');
            if (scroll) scroll.scrollTop = 0;
        }

        if (pageName === 'stats') animateBreakdownBars();
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.page));
    });

    seeAllBtns.forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.page));
    });

    document.getElementById('avatar-btn').addEventListener('click', () => navigateTo('profile'));

    // ===== Progress Cards — Clickable Navigation =====
    document.querySelectorAll('.progress-card[data-page]').forEach(card => {
        card.addEventListener('click', () => {
            navigateTo(card.dataset.page);
        });
    });

    // ===== Quick Actions =====
    const qaAddTask = document.getElementById('qa-add-task');
    const qaAddGoal = document.getElementById('qa-add-goal');
    const qaFocus = document.getElementById('qa-focus');
    const qaStats = document.getElementById('qa-stats-btn');

    if (qaAddTask) qaAddTask.addEventListener('click', openModal);
    if (qaAddGoal) qaAddGoal.addEventListener('click', () => { navigateTo('goals'); });
    if (qaFocus) qaFocus.addEventListener('click', () => {
        // Focus mode visual feedback
        qaFocus.querySelector('.qa-icon').style.animation = 'pulse-glow 1s ease';
        setTimeout(() => { qaFocus.querySelector('.qa-icon').style.animation = ''; }, 1000);
    });
    if (qaStats) qaStats.addEventListener('click', () => navigateTo('stats'));

    // ===== Filter Chips =====
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filter = chip.dataset.filter;
            const taskItems = document.querySelectorAll('#full-task-list .task-item');
            
            taskItems.forEach(item => {
                const isChecked = item.querySelector('.task-checkbox').checked;
                switch (filter) {
                    case 'all': item.style.display = 'flex'; break;
                    case 'completed': item.style.display = isChecked ? 'flex' : 'none'; break;
                    case 'today': item.style.display = 'flex'; break;
                    case 'upcoming': item.style.display = isChecked ? 'none' : 'flex'; break;
                }
            });
        });
    });

    // ===== Period Selector =====
    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ===== Category Options (Modal) =====
    catOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            catOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });

    // ===== Completion Toast / Animation (Improvement #8) =====
    function showCompletionToast() {
        productivityPoints++;
        const toastSub = completionToast.querySelector('.toast-sub');
        toastSub.textContent = `🎉 +1 Productivity Point (${productivityPoints} total)`;

        completionToast.classList.add('show');
        setTimeout(() => {
            completionToast.classList.remove('show');
        }, 2500);
    }

    // ===== Task Checkbox — Enhanced with Completion Animation =====
    function attachCheckboxListeners(container) {
        container.querySelectorAll('.task-checkbox').forEach(checkbox => {
            if (checkbox.dataset.listenerAttached) return;
            checkbox.dataset.listenerAttached = 'true';
            
            checkbox.addEventListener('change', (e) => {
                const taskItem = e.target.closest('.task-item');
                if (e.target.checked) {
                    // Animate check
                    const label = taskItem.querySelector('.task-check-label');
                    label.style.animation = 'check-pop 0.3s ease';
                    setTimeout(() => { label.style.animation = ''; }, 300);
                    
                    // Show completion toast
                    showCompletionToast();

                    // Subtle slide effect
                    taskItem.style.transition = 'all 0.5s ease 0.3s';
                }
            });
        });
    }

    // Attach to all task lists
    attachCheckboxListeners(document);

    // ===== Modal =====
    function openModal() {
        modalOverlay.classList.add('show');
    }

    function closeModal() {
        modalOverlay.classList.remove('show');
    }

    if (fabAddTask) fabAddTask.addEventListener('click', openModal);
    if (fabAddGoal) fabAddGoal.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Create Task
    if (btnCreateTask) {
        btnCreateTask.addEventListener('click', () => {
            const nameInput = document.getElementById('task-name-input');
            const name = nameInput.value.trim();

            if (!name) {
                nameInput.style.borderColor = 'var(--color-red)';
                nameInput.style.animation = 'shake 0.4s ease';
                setTimeout(() => {
                    nameInput.style.borderColor = '';
                    nameInput.style.animation = '';
                }, 500);
                return;
            }

            const activeCat = document.querySelector('.cat-option.active');
            const catMap = {
                study: { tag: '📚 Study', class: 'tag-study' },
                health: { tag: '💪 Health', class: 'tag-health' },
                personal: { tag: '🎯 Personal', class: 'tag-personal' },
                work: { tag: '💼 Work', class: 'tag-work' },
            };
            const cat = catMap[activeCat?.dataset.cat || 'study'];
            const priority = document.getElementById('task-priority-input').value;

            const priorityLabelMap = {
                high: 'priority-label-high',
                medium: 'priority-label-medium',
                low: 'priority-label-low'
            };

            const taskId = `task-${Date.now()}`;
            const taskHTML = `
                <div class="task-item" data-priority="${priority}" style="animation: slide-up 0.4s ease-out both;">
                    <div class="task-check">
                        <input type="checkbox" id="${taskId}" class="task-checkbox">
                        <label for="${taskId}" class="task-check-label"></label>
                    </div>
                    <div class="task-content">
                        <span class="task-name">${escapeHtml(name)}</span>
                        <span class="task-meta">
                            <span class="task-tag ${cat.class}">${cat.tag}</span>
                            <span class="task-time">🕒 Just added</span>
                            <span class="task-priority-label ${priorityLabelMap[priority]}">${capitalize(priority)}</span>
                        </span>
                    </div>
                    <div class="task-priority priority-${priority}"></div>
                </div>
            `;

            const taskList = document.getElementById('full-task-list');
            taskList.insertAdjacentHTML('afterbegin', taskHTML);

            // Re-attach listeners for new task
            attachCheckboxListeners(taskList);

            // Add ripple to new task
            const newItem = taskList.querySelector('.task-item:first-child');
            if (newItem) addRipple(newItem);

            nameInput.value = '';
            closeModal();
            navigateTo('tasks');
        });
    }

    // ===== Helpers =====
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ===== Animate Progress Rings =====
    function animateProgressRings() {
        document.querySelectorAll('.progress-ring-fill').forEach(ring => {
            const target = ring.getAttribute('data-target');
            if (target) {
                const totalLength = ring.getAttribute('stroke-dasharray');
                ring.style.strokeDashoffset = totalLength;
                setTimeout(() => { ring.style.strokeDashoffset = target; }, 200);
            }
        });
    }

    // ===== Animate Week Chart =====
    function animateWeekChart() {
        document.querySelectorAll('.chart-bar-fill').forEach((bar, i) => {
            bar.style.height = '0%';
            setTimeout(() => {
                bar.style.height = bar.parentElement.style.getPropertyValue('--bar-height');
            }, 100 + i * 80);
        });
    }

    // ===== Animate Breakdown Bars =====
    function animateBreakdownBars() {
        document.querySelectorAll('.breakdown-bar').forEach((bar, i) => {
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = bar.style.getPropertyValue('--width');
            }, 100 + i * 100);
        });
    }

    // ===== Notification Bell =====
    const notifBell = document.getElementById('notification-bell');
    if (notifBell) {
        notifBell.addEventListener('click', () => {
            const dot = notifBell.querySelector('.notification-dot');
            if (dot) dot.style.display = 'none';
            notifBell.style.animation = 'shake 0.4s ease';
            setTimeout(() => { notifBell.style.animation = ''; }, 400);
        });
    }

    // ===== Hero Card — change quote on click =====
    const heroCard = document.querySelector('.hero-card');
    if (heroCard) {
        heroCard.addEventListener('click', () => {
            setRandomQuote();
        });
        // Add transition for quote
        const quoteText = document.getElementById('hero-quote-text');
        if (quoteText) quoteText.style.transition = 'opacity 0.3s ease';
    }

    // ===== Streak Card — pulse on click =====
    const streakCard = document.querySelector('.streak-card');
    if (streakCard) {
        streakCard.addEventListener('click', () => {
            streakCard.style.animation = 'pulse-card 0.4s ease';
            setTimeout(() => { streakCard.style.animation = ''; }, 400);
        });
    }

    // ===== Touch Ripple Effect =====
    function addRipple(element) {
        element.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute; border-radius: 50%;
                background: rgba(167, 139, 250, 0.15);
                width: 0; height: 0;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
                transform: translate(-50%, -50%);
                animation: ripple-expand 0.6s ease forwards;
                pointer-events: none; z-index: 1;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    document.querySelectorAll('.task-item, .goal-card, .category-card, .settings-item, .quick-action, .badge-item').forEach(addRipple);

    // ===== Initialize =====
    updateTime();
    updateDate();
    updateGreeting();
    setInterval(updateTime, 30000);

    initApp();
});
