/**
 * ProMinder - Main Application Logic
 * Vanilla JavaScript Implementation using LocalStorage
 */

/**
 * ProMinder - Main Application Logic
 * Vanilla JavaScript Implementation using LocalStorage
 */

// --- State Management ---
const AppState = {
    tasks: [],
    categories: [
        { id: 'cat-1', name: 'Work', color: '#3b82f6' },
        { id: 'cat-2', name: 'Personal', color: '#10b981' }
    ],
    settings: {
        theme: 'light',
        filter: 'all', // all, today, upcoming, active, completed
        sort: 'created' // created, due, priority, alpha
    },
    selectedTaskIds: new Set()
};

// --- DOM Elements ---
const DOM = {};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log("ProMinder Initializing...");
    loadState();
    cacheDOM();
    setupEventListeners();
    initGlobalTooltips();
    applyTheme(AppState.settings.theme);
    renderCategories();
    renderApp();
    
    // Initialize Lucide Icons
    lucide.createIcons();
}

/**
 * Loads the application state from localStorage
 */
function loadState() {
    try {
        const storedTasks = localStorage.getItem('pm_tasks');
        const storedCategories = localStorage.getItem('pm_categories');
        const storedSettings = localStorage.getItem('pm_settings');
        
        if (storedTasks) AppState.tasks = JSON.parse(storedTasks);
        if (storedCategories) AppState.categories = JSON.parse(storedCategories);
        if (storedSettings) AppState.settings = { ...AppState.settings, ...JSON.parse(storedSettings) };
    } catch (error) {
        console.error("Failed to load state from localStorage:", error);
    }
}

/**
 * Saves the current application state to localStorage
 */
function saveState() {
    try {
        localStorage.setItem('pm_tasks', JSON.stringify(AppState.tasks));
        localStorage.setItem('pm_categories', JSON.stringify(AppState.categories));
        localStorage.setItem('pm_settings', JSON.stringify(AppState.settings));
    } catch (error) {
        console.error("Failed to save state to localStorage:", error);
    }
}

/**
 * Caches DOM element references
 */
function cacheDOM() {
    DOM.body = document.body;
    DOM.sidebar = document.getElementById('sidebar');
    DOM.sidebarOverlay = document.getElementById('sidebarOverlay');
    DOM.openSidebarBtn = document.getElementById('openSidebarBtn');
    DOM.closeSidebarBtn = document.getElementById('closeSidebarBtn');
    
    DOM.themeToggleBtn = document.getElementById('themeToggleBtn');
    DOM.themeIconDark = document.querySelector('.theme-icon-dark');
    DOM.themeIconLight = document.querySelector('.theme-icon-light');

    DOM.taskList = document.getElementById('taskList');
    DOM.categoryList = document.getElementById('categoryList');
    DOM.taskCategoryInput = document.getElementById('taskCategoryInput');
    
    DOM.filterListItems = document.querySelectorAll('#filterList .nav-item');
    DOM.currentViewTitle = document.getElementById('currentViewTitle');
    
    DOM.searchInput = document.getElementById('searchInput');
    DOM.clearSearchBtn = document.getElementById('clearSearchBtn');

    DOM.emptyState = document.getElementById('emptyState');
    DOM.emptyStateAddBtn = document.getElementById('emptyStateAddBtn');

    DOM.newTaskSidebarBtn = document.getElementById('newTaskSidebarBtn');
    DOM.fabAddBtn = document.getElementById('fabAddBtn');

    // Modals
    DOM.taskModalOverlay = document.getElementById('taskModalOverlay');
    DOM.closeTaskModalBtn = document.getElementById('closeTaskModalBtn');
    DOM.cancelTaskBtn = document.getElementById('cancelTaskBtn');
    DOM.taskForm = document.getElementById('taskForm');
    DOM.taskIdInput = document.getElementById('taskIdInput');
    DOM.taskTitleInput = document.getElementById('taskTitleInput');
    DOM.taskDescInput = document.getElementById('taskDescInput');
    DOM.taskDueInput = document.getElementById('taskDueInput');
    DOM.taskPriorityInput = document.getElementById('taskPriorityInput');
    
    DOM.categoryModalOverlay = document.getElementById('categoryModalOverlay');
    DOM.addCategoryBtn = document.getElementById('addCategoryBtn');
    DOM.closeCatModalBtn = document.getElementById('closeCatModalBtn');
    DOM.cancelCatBtn = document.getElementById('cancelCatBtn');
    DOM.saveCatBtn = document.getElementById('saveCatBtn');
    DOM.categoryNameInput = document.getElementById('categoryNameInput');
    DOM.categoryColorPicker = document.getElementById('categoryColorPicker');
    
    // Toolbar & Bulk Actions
    DOM.sortToggle = document.getElementById('sortToggle');
    DOM.sortMenu = document.getElementById('sortMenu');
    DOM.currentSortLabel = document.getElementById('currentSortLabel');
    DOM.bulkActionsContainer = document.getElementById('bulkActionsContainer');
    DOM.selectionCount = document.getElementById('selectionCount');
    DOM.bulkCompleteBtn = document.getElementById('bulkCompleteBtn');
    DOM.bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    DOM.cancelSelectionBtn = document.getElementById('cancelSelectionBtn');

    // Stats
    DOM.dailyProgressRing = document.getElementById('dailyProgressRing');
    DOM.dailyProgressText = document.getElementById('dailyProgressText');
}

/**
 * Attach global and specific event listeners
 */
function setupEventListeners() {
    // Sidebar Toggles
    const openSidebar = () => {
        DOM.sidebar.classList.add('open');
        DOM.sidebarOverlay.classList.add('open');
    };
    const closeSidebar = () => {
        DOM.sidebar.classList.remove('open');
        DOM.sidebarOverlay.classList.remove('open');
    };
    
    DOM.openSidebarBtn.addEventListener('click', openSidebar);
    DOM.closeSidebarBtn.addEventListener('click', closeSidebar);
    DOM.sidebarOverlay.addEventListener('click', closeSidebar);
    
    // Theme Toggle
    DOM.themeToggleBtn.addEventListener('click', () => {
        AppState.settings.theme = AppState.settings.theme === 'light' ? 'dark' : 'light';
        applyTheme(AppState.settings.theme);
        saveState();
    });

    // Task Modal Toggles
    const openTaskModal = (task = null) => {
        if (task && task instanceof Event === false) {
            // Edit Mode
            DOM.taskIdInput.value = task.id;
            DOM.taskTitleInput.value = task.title;
            DOM.taskDescInput.value = task.desc || '';
            DOM.taskDueInput.value = task.dueDate || '';
            DOM.taskPriorityInput.value = task.priority || 'none';
            DOM.taskCategoryInput.value = task.categoryId || '';
            document.getElementById('taskModalTitle').innerText = "Edit Task";
        } else {
            // Add Mode
            DOM.taskForm.reset();
            DOM.taskIdInput.value = '';
            document.getElementById('taskModalTitle').innerText = "Add New Task";
            
            // Pre-select category if currently viewing one
            if (AppState.settings.filter.startsWith('cat-')) {
                DOM.taskCategoryInput.value = AppState.settings.filter;
            }
        }
        DOM.taskModalOverlay.classList.remove('hidden');
        setTimeout(() => DOM.taskTitleInput.focus(), 100);
    };

    const closeTaskModal = () => {
        DOM.taskModalOverlay.classList.add('hidden');
    };

    DOM.newTaskSidebarBtn.addEventListener('click', openTaskModal);
    DOM.fabAddBtn.addEventListener('click', openTaskModal);
    DOM.emptyStateAddBtn.addEventListener('click', openTaskModal);
    DOM.closeTaskModalBtn.addEventListener('click', closeTaskModal);
    DOM.cancelTaskBtn.addEventListener('click', (e) => { e.preventDefault(); closeTaskModal(); });

    // Close Modals on Overlay Click
    DOM.taskModalOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.taskModalOverlay) closeTaskModal();
    });

    // Task Form Submission
    DOM.taskForm.addEventListener('submit', handleTaskSubmit);

    // Filters & Navigation
    DOM.filterListItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.dataset.title || item.innerText.trim();
            setFilter(item.dataset.filter, title);
        });
    });

    // --- Search & Filtering ---
    let searchTimeout;
    DOM.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const val = e.target.value.trim();
        if (val) {
            DOM.clearSearchBtn.classList.remove('hidden');
        } else {
            DOM.clearSearchBtn.classList.add('hidden');
        }
        
        searchTimeout = setTimeout(() => {
            renderApp();
        }, 300);
    });

    DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        DOM.clearSearchBtn.classList.add('hidden');
        renderApp();
    });

    // --- Sorting Menu ---
    const positionSortMenu = () => {
        const dropdown = DOM.sortToggle.parentElement;
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) return;

        const toggleRect = DOM.sortToggle.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const padding = 8;

        // Fixed positioning to escape stacking/overflow issues
        menu.style.position = 'fixed';
        menu.style.zIndex = '2000';
        menu.style.top = `${toggleRect.bottom + padding}px`;

        // Prefer right-aligned to toggle, but keep within viewport and away from sidebar
        let left = toggleRect.right - menuRect.width;
        const sidebarRect = DOM.sidebar ? DOM.sidebar.getBoundingClientRect() : null;
        if (sidebarRect) {
            const minLeft = sidebarRect.right + padding;
            if (left < minLeft) left = minLeft;
        }
        if (left < padding) left = padding;
        if (left + menuRect.width > window.innerWidth - padding) {
            left = window.innerWidth - menuRect.width - padding;
        }
        menu.style.left = `${left}px`;
        menu.style.transform = 'translateY(0)';
    };

    const resetSortMenuPosition = () => {
        const dropdown = DOM.sortToggle.parentElement;
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) return;
        menu.style.position = '';
        menu.style.zIndex = '';
        menu.style.top = '';
        menu.style.left = '';
        menu.style.transform = '';
    };

    DOM.sortToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = DOM.sortToggle.parentElement;
        dropdown.classList.toggle('open');

        // Reposition dropdown to avoid clipping off-screen
        if (dropdown.classList.contains('open')) {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.classList.remove('align-left', 'align-right');
            requestAnimationFrame(positionSortMenu);
        } else {
            resetSortMenuPosition();
        }
    });

    document.addEventListener('click', () => {
        DOM.sortToggle.parentElement.classList.remove('open');
        resetSortMenuPosition();
    });

    window.addEventListener('resize', () => {
        if (DOM.sortToggle.parentElement.classList.contains('open')) {
            positionSortMenu();
        }
    });

    window.addEventListener('scroll', () => {
        if (DOM.sortToggle.parentElement.classList.contains('open')) {
            positionSortMenu();
        }
    }, true);

    DOM.sortMenu.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const sortVal = item.dataset.sort;
            AppState.settings.sort = sortVal;
            DOM.currentSortLabel.innerText = item.innerText;
            saveState();
            renderApp();
        });
    });

    // Initialize Sorting Label visually based on saved state
    const currentSortOption = DOM.sortMenu.querySelector(`li[data-sort="${AppState.settings.sort}"]`);
    if (currentSortOption) {
        DOM.currentSortLabel.innerText = currentSortOption.innerText;
    }

    // --- Category Modal & Creation ---
    const openCatModal = () => {
        DOM.categoryNameInput.value = '';
        DOM.categoryColorPicker.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
        DOM.categoryColorPicker.querySelector('.color-option').classList.add('selected'); // default blue
        DOM.categoryModalOverlay.classList.remove('hidden');
        setTimeout(() => DOM.categoryNameInput.focus(), 100);
    };

    const closeCatModal = () => DOM.categoryModalOverlay.classList.add('hidden');

    DOM.addCategoryBtn.addEventListener('click', openCatModal);
    DOM.closeCatModalBtn.addEventListener('click', closeCatModal);
    DOM.cancelCatBtn.addEventListener('click', closeCatModal);
    DOM.categoryModalOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.categoryModalOverlay) closeCatModal();
    });

    DOM.categoryColorPicker.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option')) {
            DOM.categoryColorPicker.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });

    DOM.saveCatBtn.addEventListener('click', () => {
        const name = DOM.categoryNameInput.value.trim();
        if (!name) return;
        
        const selectedColorEl = DOM.categoryColorPicker.querySelector('.color-option.selected');
        const color = selectedColorEl ? selectedColorEl.dataset.color : '#3b82f6';
        
        const newCat = {
            id: 'cat-' + Date.now(),
            name: name,
            color: color
        };
        
        AppState.categories.push(newCat);
        saveState();
        renderCategories(); // re-render sidebar and selects
        closeCatModal();
        showToast('Category created');
    });

    // --- Bulk Actions ---
    // (We will simulate an advanced feature here: Shift+Click to select or bulk mode, but for simplicity, we keep it hidden and assume an expansion path. I will add a keyboard shortcut implementation).
    document.addEventListener('keydown', (e) => {
        // Only trigger if not typing in an input/textarea
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                DOM.newTaskSidebarBtn.click();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
                e.preventDefault();
                DOM.searchInput.focus();
            }
        }
    });
}

/**
 * Applies the Light/Dark theme universally
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        DOM.themeIconDark.classList.add('hidden');
        DOM.themeIconLight.classList.remove('hidden');
        DOM.themeToggleBtn.querySelector('span').innerText = 'Light Mode';
    } else {
        DOM.themeIconDark.classList.remove('hidden');
        DOM.themeIconLight.classList.add('hidden');
        DOM.themeToggleBtn.querySelector('span').innerText = 'Dark Mode';
    }
}

/**
 * Handles Task Form creation/updating
 */
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const title = DOM.taskTitleInput.value.trim();
    if (!title) return;

    const taskData = {
        title: title,
        desc: DOM.taskDescInput.value.trim(),
        dueDate: DOM.taskDueInput.value,
        priority: DOM.taskPriorityInput.value,
        categoryId: DOM.taskCategoryInput.value,
        updatedAt: new Date().toISOString()
    };

    const editId = DOM.taskIdInput.value;

    if (editId) {
        // Edit existing task
        const index = AppState.tasks.findIndex(t => t.id === editId);
        if (index > -1) {
            AppState.tasks[index] = { ...AppState.tasks[index], ...taskData };
            showToast('Task updated successfully');
        }
    } else {
        // Create new task
        const newTask = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            completed: false,
            ...taskData
        };
        AppState.tasks.push(newTask);
        showToast('Task created successfully');
    }

    saveState();
    DOM.taskModalOverlay.classList.add('hidden');
    renderApp();
}

/**
 * Utility functions (will expand)
 */
function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
}

function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle-2"></i> ${message}`;
    toastContainer.appendChild(toast);
    lucide.createIcons({ root: toast });

    setTimeout(() => {
        toast.classList.add('toast-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

function setFilter(filterVal, titleText) {
    AppState.settings.filter = filterVal;
    
    // Update active class on nav
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => el.classList.remove('active'));
    
    const activeNav = document.querySelector(`[data-filter="${filterVal}"]`);
    if (activeNav) activeNav.classList.add('active');

    if (titleText) DOM.currentViewTitle.innerText = titleText;

    saveState();
    renderApp();
    
    // Close sidebar on mobile after clicking
    if (window.innerWidth <= 768) {
        DOM.sidebar.classList.remove('open');
        if (DOM.sidebarOverlay) DOM.sidebarOverlay.classList.remove('open');
    }
}

function renderCategories() {
    DOM.categoryList.innerHTML = '';
    DOM.taskCategoryInput.innerHTML = '<option value="">No Category</option>';

    AppState.categories.forEach(cat => {
        // Sidebar item
        const li = document.createElement('li');
        li.className = `nav-item ${AppState.settings.filter === cat.id ? 'active' : ''}`;
        li.dataset.filter = cat.id;
        li.innerHTML = `
            <div class="category-dot" style="background-color: ${cat.color}"></div>
            <span class="category-name">${cat.name}</span>
            <button class="icon-btn tooltip category-delete-btn" data-tooltip="Delete Category" aria-label="Delete Category">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        li.addEventListener('click', () => setFilter(cat.id, cat.name));

        const deleteBtn = li.querySelector('.category-delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCategory(cat.id);
        });

        DOM.categoryList.appendChild(li);

        // Select Options
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.innerText = cat.name;
        DOM.taskCategoryInput.appendChild(opt);
    });

    lucide.createIcons({ root: DOM.categoryList });
}

function initGlobalTooltips() {
    let tooltip = document.getElementById('globalTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'globalTooltip';
        tooltip.className = 'global-tooltip';
        document.body.appendChild(tooltip);
    }

    const showTooltip = (target) => {
        const text = target.getAttribute('data-tooltip');
        if (!text) return;
        tooltip.textContent = text;
        tooltip.classList.add('show');

        requestAnimationFrame(() => {
            const rect = target.getBoundingClientRect();
            const tipRect = tooltip.getBoundingClientRect();
            const padding = 8;

            let top = rect.top - tipRect.height - 8;
            let left = rect.left + rect.width / 2 - tipRect.width / 2;

            if (target.classList.contains('tooltip-left')) {
                top = rect.top + rect.height / 2 - tipRect.height / 2;
                left = rect.left - tipRect.width - 8;
            } else if (target.classList.contains('tooltip-right')) {
                top = rect.top + rect.height / 2 - tipRect.height / 2;
                left = rect.right + 8;
            }

            if (top < padding) {
                top = rect.bottom + 8;
            }
            if (left < padding) {
                left = padding;
            }
            if (left + tipRect.width > window.innerWidth - padding) {
                left = window.innerWidth - tipRect.width - padding;
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        });
    };

    const hideTooltip = () => {
        tooltip.classList.remove('show');
    };

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target) showTooltip(target);
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target) hideTooltip();
    });

    window.addEventListener('scroll', hideTooltip, true);
    window.addEventListener('resize', hideTooltip);
}

function deleteCategory(categoryId) {
    const cat = AppState.categories.find(c => c.id === categoryId);
    if (!cat) return;

    const confirmed = window.confirm(`Delete category "${cat.name}"? Tasks will be moved to "No Category".`);
    if (!confirmed) return;

    AppState.categories = AppState.categories.filter(c => c.id !== categoryId);
    AppState.tasks = AppState.tasks.map(t => t.categoryId === categoryId ? { ...t, categoryId: '' } : t);

    if (AppState.settings.filter === categoryId) {
        AppState.settings.filter = 'all';
        DOM.currentViewTitle.innerText = 'Inbox';
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => el.classList.remove('active'));
        const inbox = document.querySelector('[data-filter="all"]');
        if (inbox) inbox.classList.add('active');
    }

    saveState();
    renderCategories();
    renderApp();
    showToast('Category deleted');
}

function renderApp() {
    renderTasks();
    updateBadges();
    updateProductivityRing();
    lucide.createIcons(); // Refresh icons newly added to DOM
}

function getFilteredAndSortedTasks() {
    let tasks = [...AppState.tasks];

    // 1. Filter
    const filter = AppState.settings.filter;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (filter === 'active') {
        tasks = tasks.filter(t => !t.completed);
    } else if (filter === 'completed') {
        tasks = tasks.filter(t => t.completed);
    } else if (filter === 'today') {
        tasks = tasks.filter(t => {
            if (!t.dueDate) return false;
            const due = new Date(t.dueDate).getTime();
            return due >= today && due < today + 86400000;
        });
    } else if (filter === 'upcoming') {
        tasks = tasks.filter(t => {
            if (!t.dueDate) return false;
            const due = new Date(t.dueDate).getTime();
            return due >= today + 86400000 && !t.completed;
        });
    } else if (filter.startsWith('cat-')) {
        tasks = tasks.filter(t => t.categoryId === filter);
    }

    // Search filter
    const searchMode = DOM.searchInput.value.trim().toLowerCase();
    if (searchMode) {
        tasks = tasks.filter(t => 
            t.title.toLowerCase().includes(searchMode) || 
            (t.desc && t.desc.toLowerCase().includes(searchMode))
        );
    }

    // 2. Sort
    const sort = AppState.settings.sort;
    tasks.sort((a, b) => {
        if (sort === 'alpha') {
            return a.title.localeCompare(b.title);
        } else if (sort === 'due') {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sort === 'priority') {
            const levels = { urgent: 4, high: 3, medium: 2, low: 1, none: 0 };
            return (levels[b.priority] || 0) - (levels[a.priority] || 0);
        }
        // default 'created' implies retaining the structural order or array order
        return 0;
    });

    return tasks;
}

function renderTasks() {
    DOM.taskList.innerHTML = '';
    const filteredTasks = getFilteredAndSortedTasks();
    
    if (filteredTasks.length === 0) {
        DOM.emptyState.classList.remove('hidden');
        if (DOM.searchInput.value.trim() !== '') {
            DOM.emptyState.querySelector('h3').innerText = 'No results found';
            DOM.emptyState.querySelector('p').innerText = 'Try adjusting your search or filters.';
            DOM.emptyStateAddBtn.classList.add('hidden');
        } else {
            DOM.emptyState.querySelector('h3').innerText = 'Start your day right';
            DOM.emptyState.querySelector('p').innerText = 'You have no tasks here. Add a task to get started!';
            DOM.emptyStateAddBtn.classList.remove('hidden');
        }
    } else {
        DOM.emptyState.classList.add('hidden');
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item animate-task-in ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            // Generate Priority Tag
            let priorityTag = '';
            if (task.priority && task.priority !== 'none') {
                const icon = task.priority === 'urgent' ? 'alert-triangle' : 'flag';
                priorityTag = `<div class="meta-tag tag-priority-${task.priority}">
                    <i data-lucide="${icon}"></i> ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </div>`;
            }

            // Generate Due Date Tag
            let dueDateTag = '';
            if (task.dueDate) {
                const due = new Date(task.dueDate);
                const isOverdue = !task.completed && due.getTime() < new Date().setHours(0,0,0,0);
                dueDateTag = `<div class="meta-tag ${isOverdue ? 'tag-overdue' : ''}">
                    <i data-lucide="calendar"></i> ${due.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                </div>`;
            }

            // Generate Category Tag
            let categoryTag = '';
            if (task.categoryId) {
                const cat = AppState.categories.find(c => c.id === task.categoryId);
                if (cat) {
                    categoryTag = `<div class="meta-tag" style="background: ${cat.color}20; color: ${cat.color}">
                        <div class="category-dot" style="background-color: ${cat.color}; width: 8px; height: 8px;"></div> ${cat.name}
                    </div>`;
                }
            }

            li.innerHTML = `
                <div class="task-drag-handle">
                    <i data-lucide="grip-vertical"></i>
                </div>
                <label class="task-checkbox-container">
                    <input type="checkbox" class="task-toggle" ${task.completed ? 'checked' : ''}>
                    <div class="checkmark"></div>
                </label>
                <div class="task-content">
                    <div class="task-title">${escapeHTML(task.title)}</div>
                    ${task.desc ? `<div class="task-desc">${escapeHTML(task.desc)}</div>` : ''}
                    <div class="task-meta">
                        ${priorityTag}
                        ${dueDateTag}
                        ${categoryTag}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="icon-btn tooltip edit-task-btn" data-tooltip="Edit">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="icon-btn tooltip delete-task-btn" data-tooltip="Delete" style="color: var(--priority-urgent)">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;

            // Event Listeners for the Task Item
            li.querySelector('.task-toggle').addEventListener('change', (e) => toggleTaskComplete(task.id, e.target.checked));
            li.querySelector('.edit-task-btn').addEventListener('click', () => editTask(task.id));
            li.querySelector('.delete-task-btn').addEventListener('click', () => {
                li.classList.replace('animate-task-in', 'animate-task-out');
                setTimeout(() => deleteTask(task.id), 200);
            });

            DOM.taskList.appendChild(li);
        });
    }

    // Initialize/Refresh SortableJS
    initSortable();
}

function toggleTaskComplete(id, isCompleted) {
    const task = AppState.tasks.find(t => t.id === id);
    if (task) {
        task.completed = isCompleted;
        saveState();
        renderApp();
        if (isCompleted) {
            showToast('Task marked as completed');
        }
    }
}

function deleteTask(id) {
    AppState.tasks = AppState.tasks.filter(t => t.id !== id);
    saveState();
    renderApp();
    showToast('Task deleted');
}

function editTask(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (task) {
        // Find openTaskModal function in DOM elements closure - actually we need to trigger the click or call logic.
        // It's cleaner to duplicate the fill logic here, or make openTaskModal globally accessible.
        DOM.taskIdInput.value = task.id;
        DOM.taskTitleInput.value = task.title;
        DOM.taskDescInput.value = task.desc || '';
        DOM.taskDueInput.value = task.dueDate || '';
        DOM.taskPriorityInput.value = task.priority || 'none';
        DOM.taskCategoryInput.value = task.categoryId || '';
        document.getElementById('taskModalTitle').innerText = "Edit Task";
        DOM.taskModalOverlay.classList.remove('hidden');
        setTimeout(() => DOM.taskTitleInput.focus(), 100);
    }
}

let sortableInstance = null;
function initSortable() {
    if (sortableInstance) {
        sortableInstance.destroy();
    }
    
    // Only enable dragging if sorting is set to default/created
    // Otherwise dragging changes array index randomly without persisting meaning
    if (AppState.settings.sort !== 'created') return;

    sortableInstance = new Sortable(DOM.taskList, {
        handle: '.task-drag-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function (evt) {
            if (evt.oldIndex === evt.newIndex) return;
            
            // Because tasks can be filtered, we can't just splice the main AppState.tasks.
            // A more complex approach is required if filtering is active. 
            // For now, if dragged while filtered, we just find the actual items in the main array array and swap them.
            const filteredTasks = getFilteredAndSortedTasks();
            const movedTask = filteredTasks[evt.oldIndex];
            const targetTask = filteredTasks[evt.newIndex];
            
            if (movedTask && targetTask) {
                const movedId = movedTask.id;
                const targetId = targetTask.id;
                
                const mainOldIndex = AppState.tasks.findIndex(t => t.id === movedId);
                const mainNewIndex = AppState.tasks.findIndex(t => t.id === targetId);
                
                // Remove movedTask from main arr
                AppState.tasks.splice(mainOldIndex, 1);
                // Insert at mainNewIndex
                AppState.tasks.splice(mainNewIndex, 0, movedTask);
                
                saveState();
            }
        }
    });
}

function updateBadges() {
    const today = new Date(new Date().setHours(0,0,0,0)).getTime();
    
    let allCount = AppState.tasks.filter(t => !t.completed).length;
    let todayCount = AppState.tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate).getTime() >= today && new Date(t.dueDate).getTime() < today + 86400000).length;
    
    const allBadge = document.querySelector('[data-filter="all"] .badge');
    const todayBadge = document.querySelector('[data-filter="today"] .badge');
    
    if (allBadge) allBadge.innerText = allCount;
    if (todayBadge) todayBadge.innerText = todayCount;
}

function updateProductivityRing() {
    const total = AppState.tasks.length;
    let completed = AppState.tasks.filter(t => t.completed).length;
    
    // Calculate Today's completion rate specifically
    const today = new Date(new Date().setHours(0,0,0,0)).getTime();
    const todayTasks = AppState.tasks.filter(t => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate).getTime();
        return due >= today && due < today + 86400000;
    });
    
    const todayTotal = todayTasks.length;
    const todayCompleted = todayTasks.filter(t => t.completed).length;
    
    let percentage = 0;
    if (todayTotal > 0) {
        percentage = (todayCompleted / todayTotal) * 100;
    } else if (total > 0) {
        percentage = (completed / total) * 100;
    }

    const radius = 15;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    DOM.dailyProgressRing.style.strokeDashoffset = offset;
    DOM.dailyProgressText.innerText = `${Math.round(percentage)}%`;
}

// XSS Prevention Utility
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}
