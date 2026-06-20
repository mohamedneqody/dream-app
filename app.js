/* ========================================
   DREAM APP — Application Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ===== Elements =====
    const splashScreen = document.getElementById('splash-screen');
    const appContainer = document.getElementById('app-container');
    const bottomNav = document.getElementById('bottom-nav');
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
    const todayDate = document.getElementById('today-date');
    const motivationQuote = document.getElementById('motivation-quote');

    // ===== Motivational Quotes =====
    const quotes = [
        { text: '"The secret of getting ahead is getting started."', author: '— Mark Twain' },
        { text: '"Success is not final, failure is not fatal: it is the courage to continue that counts."', author: '— Winston Churchill' },
        { text: '"Believe you can and you\'re halfway there."', author: '— Theodore Roosevelt' },
        { text: '"The only way to do great work is to love what you do."', author: '— Steve Jobs' },
        { text: '"Don\'t watch the clock; do what it does. Keep going."', author: '— Sam Levenson' },
        { text: '"It does not matter how slowly you go as long as you do not stop."', author: '— Confucius' },
        { text: '"Your limitation—it\'s only your imagination."', author: '— Unknown' },
        { text: '"Dream big. Start small. Act now."', author: '— Robin Sharma' },
        { text: '"The future belongs to those who believe in the beauty of their dreams."', author: '— Eleanor Roosevelt' },
        { text: '"Push yourself, because no one else is going to do it for you."', author: '— Unknown' },
    ];

    // ===== Splash Screen =====
    function initApp() {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            appContainer.classList.remove('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                animateProgressRings();
                animateWeekChart();
            }, 600);
        }, 2500);
    }

    // ===== Time & Date =====
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        statusTime.textContent = `${hours}:${minutes}`;
    }

    function updateDate() {
        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        todayDate.textContent = `${months[now.getMonth()]} ${now.getDate()}`;
    }

    function updateGreeting() {
        const hour = new Date().getHours();
        const greetingSub = document.querySelector('.greeting-sub');
        if (hour < 12) {
            greetingSub.textContent = 'Good Morning ☀️';
        } else if (hour < 17) {
            greetingSub.textContent = 'Good Afternoon 🌤️';
        } else {
            greetingSub.textContent = 'Good Evening ✨';
        }
    }

    // ===== Random Quote =====
    function setRandomQuote() {
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        const quoteEl = document.querySelector('.motivation-quote');
        const authorEl = document.querySelector('.motivation-author');
        quoteEl.textContent = q.text;
        authorEl.textContent = q.author;
    }

    // ===== Navigation =====
    function navigateTo(pageName) {
        // Update pages
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update nav
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageName);
        });

        // Scroll to top
        if (targetPage) {
            const scroll = targetPage.querySelector('.page-scroll');
            if (scroll) scroll.scrollTop = 0;
        }

        // Re-animate elements on page switch
        if (pageName === 'stats') {
            animateBreakdownBars();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });
    });

    // See All buttons
    seeAllBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.page);
        });
    });

    // Avatar -> Profile
    document.getElementById('avatar-btn').addEventListener('click', () => {
        navigateTo('profile');
    });

    // ===== Filter Chips =====
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            // Filter tasks visually
            const filter = chip.dataset.filter;
            const taskItems = document.querySelectorAll('#full-task-list .task-item');
            
            taskItems.forEach(item => {
                const isChecked = item.querySelector('.task-checkbox').checked;
                switch (filter) {
                    case 'all':
                        item.style.display = 'flex';
                        break;
                    case 'completed':
                        item.style.display = isChecked ? 'flex' : 'none';
                        break;
                    case 'today':
                        item.style.display = 'flex';
                        break;
                    case 'upcoming':
                        item.style.display = isChecked ? 'none' : 'flex';
                        break;
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

    // ===== Task Checkbox Animation =====
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (e.target.checked) {
                taskItem.style.transition = 'opacity 0.4s ease 0.2s';
                // Subtle completion feedback
                const label = taskItem.querySelector('.task-check-label');
                label.style.animation = 'check-pop 0.3s ease';
                setTimeout(() => {
                    label.style.animation = '';
                }, 300);
            } else {
                taskItem.style.transition = 'opacity 0.2s ease';
            }
        });
    });

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
                nameInput.style.animation = 'shake 0.3s ease';
                setTimeout(() => {
                    nameInput.style.borderColor = '';
                    nameInput.style.animation = '';
                }, 500);
                return;
            }

            // Get selected category
            const activeCat = document.querySelector('.cat-option.active');
            const catMap = {
                study: { tag: '📚 Study', class: 'tag-study' },
                health: { tag: '💪 Health', class: 'tag-health' },
                personal: { tag: '🎯 Personal', class: 'tag-personal' },
                work: { tag: '💼 Work', class: 'tag-work' },
            };
            const cat = catMap[activeCat?.dataset.cat || 'study'];
            const priority = document.getElementById('task-priority-input').value;

            // Create new task element
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
                            <span class="task-time">Just added</span>
                        </span>
                    </div>
                    <div class="task-priority priority-${priority}"></div>
                </div>
            `;

            const taskList = document.getElementById('full-task-list');
            taskList.insertAdjacentHTML('afterbegin', taskHTML);

            // Re-attach checkbox listener
            const newCheckbox = taskList.querySelector(`#${taskId}`);
            if (newCheckbox) {
                newCheckbox.addEventListener('change', (e) => {
                    const taskItem = e.target.closest('.task-item');
                    if (e.target.checked) {
                        const label = taskItem.querySelector('.task-check-label');
                        label.style.animation = 'check-pop 0.3s ease';
                        setTimeout(() => { label.style.animation = ''; }, 300);
                    }
                });
            }

            // Reset and close
            nameInput.value = '';
            closeModal();

            // Switch to tasks page
            navigateTo('tasks');
        });
    }

    // ===== Helper: Escape HTML =====
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== Animate Progress Rings =====
    function animateProgressRings() {
        const rings = document.querySelectorAll('.progress-ring-fill');
        rings.forEach(ring => {
            const target = ring.getAttribute('data-target');
            if (target) {
                ring.style.strokeDashoffset = 163.36; // Start at full offset
                setTimeout(() => {
                    ring.style.strokeDashoffset = target;
                }, 100);
            }
        });
    }

    // ===== Animate Week Chart =====
    function animateWeekChart() {
        const bars = document.querySelectorAll('.chart-bar-fill');
        bars.forEach((bar, i) => {
            bar.style.height = '0%';
            setTimeout(() => {
                bar.style.height = bar.parentElement.style.getPropertyValue('--bar-height');
            }, 100 + i * 80);
        });
    }

    // ===== Animate Breakdown Bars =====
    function animateBreakdownBars() {
        const bars = document.querySelectorAll('.breakdown-bar');
        bars.forEach((bar, i) => {
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
            if (dot) {
                dot.style.display = 'none';
            }
            // Bell ring animation
            notifBell.style.animation = 'shake 0.4s ease';
            setTimeout(() => {
                notifBell.style.animation = '';
            }, 400);
        });
    }

    // ===== Motivation Card — change on click =====
    const motivCard = document.querySelector('.motivation-card');
    if (motivCard) {
        motivCard.addEventListener('click', () => {
            setRandomQuote();
            motivCard.style.animation = 'none';
            motivCard.offsetHeight; // trigger reflow
            motivCard.style.animation = 'pulse-card 0.4s ease';
        });
    }

    // ===== Touch Ripple Effect =====
    function addRipple(element) {
        element.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(167, 139, 250, 0.2);
                width: 0;
                height: 0;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
                transform: translate(-50%, -50%);
                animation: ripple-expand 0.6s ease forwards;
                pointer-events: none;
                z-index: 1;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // Add ripple to interactive cards
    document.querySelectorAll('.task-item, .goal-card, .category-card, .settings-item').forEach(addRipple);

    // ===== Add ripple animation =====
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-expand {
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px) rotate(-2deg); }
            50% { transform: translateX(3px) rotate(2deg); }
            75% { transform: translateX(-2px) rotate(-1deg); }
        }
        @keyframes pulse-card {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.01); }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ===== Initialize =====
    updateTime();
    updateDate();
    updateGreeting();
    setInterval(updateTime, 30000);

    initApp();
});
