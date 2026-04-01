// ==========================================================
// LIFEBOARD TASK MANAGER - PRODUCTION READY
// ==========================================================

import { CONFIG } from './config.js';

class LifeBoardApp {
    constructor() {
        this.STORAGE_KEY = CONFIG.STORAGE_KEY;

        // Load tasks from localStorage
        this.tasks = this.loadTasksFromStorage();
        this.taskChart = null;
        this.timer = {
            minutes: 25,
            seconds: 0,
            running: false,
            interval: null,
            sessions: 0,
            totalFocusTime: 0
        };
        this.init();
    }

    hideSpinner() {
        if (this.loading) {
            this.loading.style.display = 'none';
            this.loading.classList.add('hidden');
        }
    }

    // STORAGE MANAGEMENT
    loadTasksFromStorage() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const tasks = JSON.parse(saved);
                return tasks.map(task => ({
                    ...task,
                    dueDate: new Date(task.dueDate),
                    createdAt: new Date(task.createdAt)
                }));
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
        return [];
    }

    saveTasksToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

    // INITIALIZATION
    init() {
        this.setupDOMReferences();
        this.setupEventListeners();
        this.initializeComponents();
        this.loadInitialData();
    }

    setupDOMReferences() {
        // Core Elements
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.sidebar = document.querySelector('.sidebar');
        this.postForm = document.getElementById('postForm');
        this.postsList = document.getElementById('posts');
        this.loading = document.getElementById('loading');

        // Form Elements
        this.titleInput = document.getElementById('title');
        this.bodyInput = document.getElementById('body');
        this.taskCategory = document.getElementById('task-category');
        this.taskDeadline = document.getElementById('task-deadline');
        this.taskPriority = document.getElementById('task-priority');

        // Chart Elements
        this.chartCanvas = document.getElementById('taskProgressChart');
        this.chartTimeframe = document.getElementById('chart-timeframe');

        // Timer Elements
        this.timerDisplay = document.getElementById('timer-display');
        this.timerStart = document.getElementById('timer-start');
        this.timerPause = document.getElementById('timer-pause');
        this.timerReset = document.getElementById('timer-reset');
        this.sessionCount = document.getElementById('session-count');
        this.totalFocusTime = document.getElementById('total-focus-time');

        // Stats Elements
        this.greetNameEl = document.getElementById('greet-name');
        this.todayDateEl = document.getElementById('today-date');
        this.overallProgress = document.getElementById('overall-progress');
        this.progressMetaCount = document.getElementById('progress-meta-count');
        this.valToday = document.getElementById('val-today');
        this.valCompleted = document.getElementById('val-completed');
        this.valPending = document.getElementById('val-pending');
        this.valOverdue = document.getElementById('val-overdue');

        // Widget Elements
        this.priorityTasksList = document.getElementById('priority-tasks-list');
        this.deadlinesList = document.getElementById('deadlines-list');
        this.priorityCount = document.getElementById('priority-count');
        this.deadlineCount = document.getElementById('deadline-count');
        this.weeklyCompleted = document.getElementById('weekly-completed');
        this.completionRate = document.getElementById('completion-rate');
        this.avgCompletion = document.getElementById('avg-completion');
        this.productivityFill = document.getElementById('productivity-fill');
        this.productivityValue = document.getElementById('productivity-value');
        this.peakHours = document.getElementById('peak-hours');
        this.avgCompletionTime = document.getElementById('avg-completion-time');
        this.currentStreak = document.getElementById('current-streak');
        this.activityFeed = document.getElementById('activity-feed');
        this.weatherLocation = document.querySelector('.weather-location');
        this.weatherTemp = document.querySelector('.weather-temp');
        this.weatherDesc = document.querySelector('.weather-desc');
        this.focusSuggestion = document.getElementById('focus-suggestion');
        this.dailyTipText = document.getElementById('daily-tip-text');
        this.todayProgress = document.getElementById('today-progress');

        // Calendar Elements
        this.calendarGrid = document.getElementById('calendar-grid');
        this.currentMonth = document.getElementById('current-month');
        this.prevMonth = document.getElementById('prev-month');
        this.nextMonth = document.getElementById('next-month');

        // Quick Actions
        this.quickTask = document.getElementById('quick-task');
        this.bulkComplete = document.getElementById('bulk-complete');
        this.exportTasks = document.getElementById('export-tasks');
        this.clearCompleted = document.getElementById('clear-completed');

        // Task Filters
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    // EVENT LISTENERS SETUP
    setupEventListeners() {
        if (this.sidebarToggle && this.sidebar) {
            this.sidebarToggle.addEventListener('click', () => {
                this.sidebar.classList.toggle('active');
            });
        }

        if (this.sessionCount) {
            this.sessionCount.style.cursor = 'pointer';
            this.sessionCount.addEventListener('click', () => {
                this.showSessionStats();
            });
        }

        if (this.totalFocusTime) {
            this.totalFocusTime.style.cursor = 'pointer';
            this.totalFocusTime.addEventListener('click', () => {
                this.showFocusTimeStats();
            });
        }

        if (this.postForm) {
            this.postForm.addEventListener('submit', (e) => this.handleTaskCreate(e));
        }

        if (this.timerStart) {
            this.timerStart.addEventListener('click', () => this.startTimer());
        }
        if (this.timerPause) {
            this.timerPause.addEventListener('click', () => this.pauseTimer());
        }
        if (this.timerReset) {
            this.timerReset.addEventListener('click', () => this.resetTimer());
        }

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes, 10);
                this.setTimer(minutes);
            });
        });

        if (this.prevMonth) {
            this.prevMonth.addEventListener('click', () => this.navigateCalendar(-1));
        }
        if (this.nextMonth) {
            this.nextMonth.addEventListener('click', () => this.navigateCalendar(1));
        }

        if (this.quickTask) {
            this.quickTask.addEventListener('click', () => this.quickAddTask());
        }
        if (this.bulkComplete) {
            this.bulkComplete.addEventListener('click', () => this.bulkCompleteTasks());
        }
        if (this.exportTasks) {
            this.exportTasks.addEventListener('click', () => this.exportTasksData());
        }
        if (this.clearCompleted) {
            this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
        }

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterTasks(btn.dataset.filter, btn));
        });

        if (this.chartTimeframe) {
            this.chartTimeframe.addEventListener('change', () => this.refreshChartData());
        }
    }

    async handleTaskCreate(e) {
        e.preventDefault();

        if (!this.titleInput || !this.bodyInput) return;

        const title = this.titleInput.value.trim();
        const description = this.bodyInput.value.trim();

        if (!title) {
            this.showNotification('Please enter a task title', 'error');
            return;
        }

        try {
            this.showLoading(true);

            this.showNotification('Creating new Task');
            const aiAnalysis = await this.analyzeTaskWithAI(title, description);

            const newTask = {
                id: Date.now(),
                title: title,
                description: description,
                category: this.taskCategory ? this.taskCategory.value : aiAnalysis.category || 'personal',
                priority: this.taskPriority ? this.taskPriority.value : aiAnalysis.priority || 'medium',
                dueDate: this.taskDeadline && this.taskDeadline.value
                    ? new Date(this.taskDeadline.value)
                    : this.calculateDueDate(aiAnalysis.suggestedDeadline),
                completed: false,
                createdAt: new Date(),
                timeEstimate: aiAnalysis.estimatedMinutes || 30
            };

            this.tasks.unshift(newTask);
            this.saveTasksToStorage();

            this.renderTasks();
            this.updateAllWidgets();
            this.postForm.reset();

            this.showNotification(`Task created! Priority: ${newTask.priority}`, 'success');
            this.addActivity(`Created task: "${newTask.title}"`);
        } catch (error) {
            console.error('Error creating task:', error);
            this.showNotification('Failed to create task', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // COMPONENT INITIALIZATION
    initializeComponents() {
        this.setupGreeting();
        this.initializeChart();
        this.initializeCalendar();
        this.setupWeather();
        this.setupAIFeatures();
    }

    setupGreeting() {
        const currentEmail = localStorage.getItem('current_user_email');
        let firstName = 'User';

        if (currentEmail) {
            const rawUserData = localStorage.getItem('lifeboard_user_' + currentEmail);
            if (rawUserData) {
                const userData = JSON.parse(rawUserData);
                if (userData && userData.name) {
                    firstName = userData.name.split(' ')[0];
                }
            }
        }

        const now = new Date();
        const hour = now.getHours();

        const greeting = hour >= 5 && hour < 12
            ? 'Good Morning'
            : hour >= 12 && hour < 17
                ? 'Good Afternoon'
                : hour >= 17 && hour < 23
                    ? 'Good Evening'
                    : 'Hello';

        if (this.greetNameEl) {
            this.greetNameEl.textContent = `${greeting}, ${firstName} 👋`;
        }

        const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'];

        if (this.todayDateEl) {
            this.todayDateEl.textContent = `${DAYS[now.getDay()]} • ${MONTHS[now.getMonth()]} ${now.getDate()}`;
        }
    }

    initializeChart() {
        if (!this.chartCanvas || typeof Chart === 'undefined') return;

        const ctx = this.chartCanvas.getContext('2d');

        this.taskChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Total',
                        data: [],
                        borderColor: '#0a0572',
                        backgroundColor: 'rgba(10,5,114,0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Completed',
                        data: [],
                        borderColor: '#0f9d58',
                        backgroundColor: 'rgba(15,157,88,0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Pending',
                        data: [],
                        borderColor: '#f6c74b',
                        backgroundColor: 'rgba(246,199,75,0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Overdue',
                        data: [],
                        borderColor: '#e64a19',
                        backgroundColor: 'rgba(230,74,25,0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Today',
                        data: [],
                        borderColor: '#6a1b9a',
                        backgroundColor: 'rgba(106,27,154,0.1)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: {
                                size: 12,
                                weight: '600'
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 15, 35, 0.95)',
                        titleColor: 'rgba(255, 255, 255, 0.9)',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8
                    },
                    title: {
                        display: true,
                        text: 'Task Progress Over Time',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time',
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        ticks: {
                            maxRotation: 45,
                            autoSkip: true,
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Tasks',
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // AI POWERED FEATURES - NOW CALLING YOUR BACKEND
    async analyzeTaskWithAI(taskTitle, taskDescription) {
        try {
            const response = await fetch('/api/analyze-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    taskTitle,
                    taskDescription
                })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze task');
            }

            return await response.json();
        } catch (error) {
            console.error('AI analysis failed:', error);
            return {
                category: 'personal',
                priority: 'medium',
                estimatedMinutes: 30,
                suggestedDeadline: 'this_week'
            };
        }
    }

    async getAIFocusSuggestion() {
        try {
            const pendingTasks = this.tasks.filter(task => !task.completed);
            if (pendingTasks.length === 0) {
                return 'No pending tasks! Create some tasks to get suggestions.';
            }

            const taskList = pendingTasks.slice(0, 5).map(t => t.title);

            const response = await fetch('/api/focus-suggestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ taskList })
            });

            if (!response.ok) {
                throw new Error('Failed to get focus suggestion');
            }

            const data = await response.json();
            return data.suggestion;
        } catch (error) {
            console.error('Focus suggestion failed:', error);
            return 'Focus on your highest priority task first!';
        }
    }

    async getAIProductivityTip() {
        try {
            const response = await fetch('/api/productivity-tip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get productivity tip');
            }

            const data = await response.json();
            return data.tip;
        } catch (error) {
            console.error('Productivity tip failed:', error);
            return 'Break big tasks into small, actionable steps!';
        }
    }

    async setupAIFeatures() {
        try {
            const aiTip = await this.getAIProductivityTip();
            if (this.dailyTipText) {
                this.dailyTipText.textContent = aiTip;
            }

            const focusSuggestion = await this.getAIFocusSuggestion();
            if (this.focusSuggestion) {
                this.focusSuggestion.textContent = focusSuggestion;
            }
        } catch (error) {
            console.error('AI features setup failed:', error);
        }
    }

    calculateDueDate(suggestion) {
        const today = new Date();
        const result = new Date(today);

        switch (suggestion) {
            case 'today':
                return result;
            case 'tomorrow':
                result.setDate(result.getDate() + 1);
                return result;
            case 'this_week':
                result.setDate(result.getDate() + 3);
                return result;
            case 'next_week':
                result.setDate(result.getDate() + 7);
                return result;
            default:
                result.setDate(result.getDate() + 7);
                return result;
        }
    }

    // TASK MANAGEMENT
    loadInitialData() {
        this.renderTasks();
        this.refreshChartData();
        this.updateAllWidgets();
    }

    async updateTask(taskId, updates) {
        try {
            const index = this.tasks.findIndex(task => task.id === taskId);
            if (index !== -1) {
                this.tasks[index] = { ...this.tasks[index], ...updates };
                this.saveTasksToStorage();
                this.renderTasks();
                this.updateAllWidgets();
                this.showNotification('Task updated successfully!', 'success');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            this.showNotification('Failed to update task', 'error');
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const taskToDelete = this.tasks.find(task => task.id === taskId);
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasksToStorage();

            this.renderTasks();
            this.updateAllWidgets();

            this.showNotification('Task deleted successfully!', 'success');
            this.addActivity(`Deleted task: "${taskToDelete?.title || 'Unknown task'}"`);
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showNotification('Failed to delete task', 'error');
        }
    }

    // TASK RENDERING
    renderTasks(filter = 'all') {
        if (!this.postsList) return;

        this.postsList.innerHTML = '';

        let filteredTasks = this.tasks;
        if (filter === 'completed') {
            filteredTasks = this.tasks.filter(task => task.completed);
        } else if (filter === 'pending') {
            filteredTasks = this.tasks.filter(task => !task.completed);
        }

        if (filteredTasks.length === 0) {
            this.postsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">${filter === 'completed' ? '🎉' : '📝'}</div>
                    <h3>No ${filter === 'all' ? '' : filter} tasks yet</h3>
                    <p>${filter === 'completed' ? 'Complete some tasks to see them here!' : 'Create your first task to get started!'}</p>
                </div>
            `;
            return;
        }

        filteredTasks.forEach(task => {
            const taskEl = this.createTaskElement(task);
            this.postsList.appendChild(taskEl);
        });
    }

    createTaskElement(task) {
        const taskEl = document.createElement('li');
        taskEl.className = `post-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        taskEl.setAttribute('data-task-id', task.id);

        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const isOverdue = !task.completed && dueDate < now;
        const timeUntilDue = dueDate - now;
        const daysUntilDue = Math.ceil(timeUntilDue / (1000 * 60 * 60 * 24));

        const priorityIcons = {
            low: '🟢',
            medium: '🟡',
            high: '🔴'
        };

        const categoryIcons = {
            work: '💼',
            study: '📚',
            personal: '👤',
            health: '🏋️',
            other: '📦'
        };

        taskEl.innerHTML = `
            <div class="post-header">
                <div class="task-main-info">
                    <h3 class="${task.completed ? 'completed' : ''}">
                        ${task.completed ? '✅' : '⏳'} ${this.escapeHtml(task.title)}
                    </h3>
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">${priorityIcons[task.priority] || '⚪'} ${task.priority}</span>
                        <span class="task-category">${categoryIcons[task.category] || '📦'} ${task.category}</span>
                        <span class="task-due ${isOverdue ? 'overdue' : ''} ${daysUntilDue < 3 ? 'urgent' : ''}">
                            📅 ${dueDate.toLocaleDateString()}
                            ${isOverdue ? '(Overdue)' : daysUntilDue < 3 ? `(${daysUntilDue}d left)` : ''}
                        </span>
                    </div>
                </div>
                <div class="actions">
                    <button class="toggle-complete" title="${task.completed ? 'Mark pending' : 'Mark complete'}">
                        ${task.completed ? '↩️ Undo' : '✅ Complete'}
                    </button>
                    <button class="edit" title="Edit task">✏️ Edit</button>
                    <button class="delete" title="Delete task">🗑️ Delete</button>
                </div>
            </div>
            <p class="task-description">${this.escapeHtml(task.description || '')}</p>
            <div class="task-footer">
                <span class="task-time">⏱️ ${task.timeEstimate || 30} min estimate</span>
                <span class="task-created">Created: ${new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
        `;

        const toggleBtn = taskEl.querySelector('.toggle-complete');
        const editBtn = taskEl.querySelector('.edit');
        const deleteBtn = taskEl.querySelector('.delete');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleTaskComplete(task.id);
        });

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editTask(task);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTask(task.id);
        });

        taskEl.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                taskEl.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    taskEl.style.transform = '';
                }, 150);
            }
        });

        return taskEl;
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const newCompletedState = !task.completed;
            this.updateTask(taskId, {
                completed: newCompletedState,
                description: task.description
            });

            this.addActivity(`${newCompletedState ? 'Completed' : 'Marked pending'}: "${task.title}"`);

            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement) {
                taskElement.classList.toggle('completed', newCompletedState);
            }
        }
    }

    editTask(task) {
        const newTitle = prompt('Edit task title:', task.title);
        if (newTitle === null) return;

        const newDescription = prompt('Edit task description:', task.description || '');
        if (newDescription === null) return;

        if (newTitle.trim() && newDescription.trim()) {
            this.updateTask(task.id, {
                title: newTitle.trim(),
                description: newDescription.trim()
            });
            this.addActivity(`Edited task: "${newTitle}"`);
        } else {
            this.showNotification('Task title and description cannot be empty', 'error');
        }
    }

    // CHART DATA & VISUALIZATION
    refreshChartData() {
        if (!this.taskChart) return;

        const timeLabels = this.getTimeLabels();
        const chartData = this.generateRealChartData();

        this.taskChart.data.labels = timeLabels;
        this.taskChart.data.datasets[0].data = chartData.total;
        this.taskChart.data.datasets[1].data = chartData.completed;
        this.taskChart.data.datasets[2].data = chartData.pending;
        this.taskChart.data.datasets[3].data = chartData.overdue;
        this.taskChart.data.datasets[4].data = chartData.today;

        this.taskChart.update('active');
    }

    generateRealChartData() {
        const total = [];
        const completed = [];
        const pending = [];
        const overdue = [];
        const today = [];

        const now = new Date();
        const todayStr = now.toDateString();

        for (let i = 0; i < 12; i++) {
            const timePoint = new Date(now.getTime() - i * 2 * 60 * 60 * 1000);

            const tasksAtTime = this.tasks.filter(task =>
                new Date(task.createdAt) <= timePoint
            );

            const completedAtTime = tasksAtTime.filter(task => task.completed).length;
            const pendingAtTime = tasksAtTime.filter(task => !task.completed).length;
            const overdueAtTime = tasksAtTime.filter(task =>
                !task.completed && new Date(task.dueDate) < timePoint
            ).length;
            const todayAtTime = tasksAtTime.filter(task =>
                new Date(task.dueDate).toDateString() === todayStr
            ).length;

            total.push(tasksAtTime.length);
            completed.push(completedAtTime);
            pending.push(pendingAtTime);
            overdue.push(overdueAtTime);
            today.push(todayAtTime);
        }

        return {
            total: total.reverse(),
            completed: completed.reverse(),
            pending: pending.reverse(),
            overdue: overdue.reverse(),
            today: today.reverse()
        };
    }

    getTimeLabels() {
        const labels = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 2 * 60 * 60 * 1000);
            labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }

        return labels;
    }

    // CALENDAR FUNCTIONALITY
    initializeCalendar() {
        this.currentCalendarDate = new Date();
        this.renderCalendar();
    }

    renderCalendar() {
        if (!this.calendarGrid) return;

        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();

        if (this.currentMonth) {
            this.currentMonth.textContent = this.currentCalendarDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }

        this.calendarGrid.innerHTML = '';

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day-header';
            dayEl.textContent = day;
            this.calendarGrid.appendChild(dayEl);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        for (let i = 0; i < firstDay; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'calendar-day empty';
            this.calendarGrid.appendChild(emptyEl);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            const currentDate = new Date(year, month, day);

            if (currentDate.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }

            const hasRealTasks = this.tasks.some(task =>
                new Date(task.dueDate).toDateString() === currentDate.toDateString()
            );

            if (hasRealTasks) {
                dayEl.classList.add('has-tasks');
            }

            dayEl.addEventListener('click', () => {
                this.selectCalendarDate(currentDate);
            });

            this.calendarGrid.appendChild(dayEl);
        }
    }

    navigateCalendar(direction) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + direction);
        this.renderCalendar();
    }

    selectCalendarDate(date) {
        const tasksOnDate = this.tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === date.toDateString();
        });

        if (tasksOnDate.length > 0) {
            this.showNotification(`${tasksOnDate.length} tasks on ${date.toLocaleDateString()}`, 'info');
        } else {
            this.showNotification(`No tasks on ${date.toLocaleDateString()}`, 'info');
        }
    }

    // TIMER FUNCTIONALITY
    startTimer() {
        if (this.timer.running) return;

        this.timer.running = true;
        this.timer.interval = setInterval(() => {
            this.timer.seconds--;

            if (this.timer.seconds < 0) {
                this.timer.minutes--;
                this.timer.seconds = 59;
            }

            if (this.timer.minutes < 0) {
                this.timerComplete();
                return;
            }

            this.updateTimerDisplay();
        }, 1000);

        if (this.timerStart) {
            this.timerStart.textContent = '⏸️ Pause';
        }
        this.addActivity('Started focus timer');
    }

    pauseTimer() {
        if (!this.timer.running) return;

        this.timer.running = false;
        clearInterval(this.timer.interval);
        if (this.timerStart) {
            this.timerStart.textContent = '▶️ Start';
        }
        this.addActivity('Paused focus timer');
    }

    resetTimer() {
        this.timer.running = false;
        clearInterval(this.timer.interval);
        this.setTimer(25);
        if (this.timerStart) {
            this.timerStart.textContent = '▶️ Start';
        }
        this.addActivity('Reset focus timer');
    }

    setTimer(minutes) {
        this.timer.minutes = minutes;
        this.timer.seconds = 0;
        this.updateTimerDisplay();
    }

    timerComplete() {
        this.timer.running = false;
        clearInterval(this.timer.interval);

        this.timer.sessions++;
        this.timer.totalFocusTime += 25;

        if (this.sessionCount) {
            this.sessionCount.textContent = this.timer.sessions;
        }
        if (this.totalFocusTime) {
            const hours = Math.floor(this.timer.totalFocusTime / 60);
            const minutes = this.timer.totalFocusTime % 60;
            this.totalFocusTime.textContent = `${hours}h ${minutes}m`;
        }

        this.showNotification('Focus session completed! 🎉', 'success');
        this.addActivity('Completed a focus session');

        setTimeout(() => {
            this.setTimer(5);
            this.startTimer();
        }, 2000);
    }

    updateTimerDisplay() {
        if (this.timerDisplay) {
            const mins = String(this.timer.minutes).padStart(2, '0');
            const secs = String(this.timer.seconds).padStart(2, '0');
            this.timerDisplay.textContent = `${mins}:${secs}`;
        }
    }

    // TIMER STATS METHODS
    showSessionStats() {
        const stats = `
🎯 Session Stats:
• Total Sessions: ${this.timer.sessions}
• Today's Goal: 4 sessions
• Current Streak: ${this.getCurrentStreak()} days
• Best Streak: ${this.getBestStreak()} days
        `;
        this.showNotification(stats, 'info');
    }

    showFocusTimeStats() {
        const hours = Math.floor(this.timer.totalFocusTime / 60);
        const minutes = this.timer.totalFocusTime % 60;

        const stats = `
⏱️ Focus Time Stats:
• Total: ${hours}h ${minutes}m
• Daily Average: ${this.getDailyAverage()}m
• Productivity: ${this.calculateProductivityScore()}%
• Tasks Completed: ${this.tasks.filter(task => task.completed).length}
        `;
        this.showNotification(stats, 'info');
    }

    getCurrentStreak() {
        return this.timer.sessions > 0 ? 1 : 0;
    }

    getBestStreak() {
        return Math.max(1, this.timer.sessions);
    }

    getDailyAverage() {
        return this.timer.sessions > 0
            ? Math.round(this.timer.totalFocusTime / this.timer.sessions)
            : 0;
    }

    calculateProductivityScore() {
        const completed = this.tasks.filter(task => task.completed).length;
        const total = this.tasks.length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    // QUICK ACTIONS
    quickAddTask() {
        const quickTasks = [
            'Review daily goals',
            'Check emails',
            'Plan tomorrow',
            'Quick break',
            'Drink water'
        ];

        const randomTask = quickTasks[Math.floor(Math.random() * quickTasks.length)];

        if (this.titleInput) {
            this.titleInput.value = randomTask;
            this.titleInput.focus();
        }

        this.showNotification('Quick task added - fill in details!', 'info');
    }

    async bulkCompleteTasks() {
        const pendingTasks = this.tasks.filter(task => !task.completed);

        if (pendingTasks.length === 0) {
            this.showNotification('No pending tasks to complete!', 'info');
            return;
        }

        if (confirm(`Complete all ${pendingTasks.length} pending tasks?`)) {
            pendingTasks.forEach(task => {
                task.completed = true;
            });

            this.saveTasksToStorage();
            this.renderTasks();
            this.updateAllWidgets();

            this.showNotification(`Completed ${pendingTasks.length} tasks!`, 'success');
            this.addActivity(`Bulk completed ${pendingTasks.length} tasks`);
        }
    }

    exportTasksData() {
        const exportData = {
            exportedAt: new Date().toISOString(),
            totalTasks: this.tasks.length,
            completedTasks: this.tasks.filter(task => task.completed).length,
            tasks: this.tasks
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('Tasks exported successfully!', 'success');
        this.addActivity('Exported tasks data');
    }

    clearCompletedTasks() {
        const completedTasks = this.tasks.filter(task => task.completed);

        if (completedTasks.length === 0) {
            this.showNotification('No completed tasks to clear!', 'info');
            return;
        }

        if (confirm(`Clear all ${completedTasks.length} completed tasks?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasksToStorage();
            this.renderTasks();
            this.updateAllWidgets();
            this.addActivity(`Cleared ${completedTasks.length} completed tasks`);
            this.showNotification(`Cleared ${completedTasks.length} completed tasks`, 'success');
        }
    }

    filterTasks(filter, clickedBtn) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }

        this.renderTasks(filter);
        this.showNotification(`Showing ${filter} tasks`, 'info');
    }

    // WIDGET UPDATES & REAL-TIME DATA
    updateAllWidgets() {
        this.updateProgressStats();
        this.updatePriorityTasks();
        this.updateDeadlines();
        this.updateTaskStatistics();
        this.updateProductivityScore();
        this.updateInsights();
        this.refreshChartData();
        this.renderCalendar();
    }

    updateProgressStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const today = new Date();
        const todayTasks = this.tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === today.toDateString();
        });
        const overdue = this.tasks.filter(task =>
            !task.completed && new Date(task.dueDate) < today
        ).length;

        if (this.overallProgress) {
            const progressPercent = total > 0 ? (completed / total) * 100 : 0;

            this.overallProgress.style.transition = 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.overallProgress.style.width = `${progressPercent}%`;

            if (progressPercent >= 75) {
                this.overallProgress.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            } else if (progressPercent >= 50) {
                this.overallProgress.style.background = 'linear-gradient(135deg, #F59E0B, #D97706)';
            } else {
                this.overallProgress.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
            }
        }

        if (this.progressMetaCount) {
            this.animateCount(this.progressMetaCount, `${completed} / ${total}`);
        }
        if (this.valToday) this.animateCount(this.valToday, todayTasks.length);
        if (this.valCompleted) this.animateCount(this.valCompleted, completed);
        if (this.valPending) this.animateCount(this.valPending, pending);
        if (this.valOverdue) this.animateCount(this.valOverdue, overdue);
    }

    animateCount(element, newValue) {
        element.style.transform = 'scale(1.1)';
        element.style.color = '#8B5CF6';

        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
    }

    updatePriorityTasks() {
        if (!this.priorityTasksList) return;

        const highPriorityTasks = this.tasks.filter(task =>
            task.priority === 'high' && !task.completed
        ).slice(0, 5);

        if (this.priorityCount) {
            this.priorityCount.textContent = highPriorityTasks.length;
        }

        if (highPriorityTasks.length === 0) {
            this.priorityTasksList.innerHTML = '<li class="muted small">No high priority tasks</li>';
            return;
        }

        this.priorityTasksList.innerHTML = highPriorityTasks.map(task => `
            <li class="priority-task">
                <span class="task-title">${this.escapeHtml(task.title)}</span>
                <span class="task-due">${new Date(task.dueDate).toLocaleDateString()}</span>
            </li>
        `).join('');
    }

    updateDeadlines() {
        if (!this.deadlinesList) return;

        const upcomingDeadlines = this.tasks
            .filter(task => !task.completed)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5);

        if (this.deadlineCount) {
            this.deadlineCount.textContent = upcomingDeadlines.length;
        }

        if (upcomingDeadlines.length === 0) {
            this.deadlinesList.innerHTML = '<li class="muted small">No upcoming deadlines</li>';
            return;
        }

        this.deadlinesList.innerHTML = upcomingDeadlines.map(task => {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let urgency = '';
            if (diffDays < 0) urgency = 'overdue';
            else if (diffDays === 0) urgency = 'today';
            else if (diffDays <= 2) urgency = 'urgent';

            return `
                <li class="deadline-task ${urgency}">
                    <span class="task-title">${this.escapeHtml(task.title)}</span>
                    <span class="deadline-countdown">
                        ${diffDays < 0 ? 'Overdue' : diffDays === 0 ? 'Today' : `${diffDays}d`}
                    </span>
                </li>
            `;
        }).join('');
    }

    updateTaskStatistics() {
        const completedThisWeek = this.tasks.filter(task =>
            task.completed && this.isThisWeek(new Date(task.createdAt))
        ).length;

        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const avgCompletionTime = this.calculateAverageCompletionTime();

        if (this.weeklyCompleted) this.weeklyCompleted.textContent = completedThisWeek;
        if (this.completionRate) this.completionRate.textContent = `${completionRate}%`;
        if (this.avgCompletion) this.avgCompletion.textContent = `${avgCompletionTime}m`;
    }

    updateProductivityScore() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const onTimeTasks = this.tasks.filter(task =>
            task.completed && new Date(task.dueDate) >= new Date()
        ).length;

        let score = 0;
        if (total > 0) {
            const completionScore = (completed / total) * 50;
            const timelinessScore = completed > 0 ? (onTimeTasks / completed) * 30 : 0;
            const consistencyScore = 20;
            score = Math.min(100, completionScore + timelinessScore + consistencyScore);
        }

        if (this.productivityFill) {
            this.productivityFill.style.width = `${score}%`;
        }
        if (this.productivityValue) {
            this.productivityValue.textContent = `${Math.round(score)}%`;
        }
    }

    updateInsights() {
        if (this.peakHours) {
            this.peakHours.textContent = '10:00 AM - 12:00 PM';
        }

        if (this.avgCompletionTime) {
            const avgTime = this.calculateAverageCompletionTime();
            this.avgCompletionTime.textContent = `${avgTime} minutes`;
        }

        if (this.currentStreak) {
            const streak = this.calculateCurrentStreak();
            this.currentStreak.textContent = `${streak} days`;
        }
    }

    // WEATHER & EXTERNAL INTEGRATIONS
    async setupWeather() {
        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current_weather=true');
            const data = await response.json();

            if (this.weatherLocation) this.weatherLocation.textContent = 'Lagos, NG';
            if (this.weatherTemp) this.weatherTemp.textContent = `${data.current_weather.temperature}°C`;
            if (this.weatherDesc) this.weatherDesc.textContent = this.getWeatherDescription(data.current_weather.weathercode);

            if (this.focusSuggestion && !this.tasks.length) {
                this.focusSuggestion.textContent = this.getFocusSuggestion(data.current_weather.temperature);
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            if (this.weatherLocation) this.weatherLocation.textContent = 'Lagos, NG';
            if (this.weatherTemp) this.weatherTemp.textContent = '28°C';
            if (this.weatherDesc) this.weatherDesc.textContent = 'Partly Cloudy';
        }
    }

    // UTILITY FUNCTIONS
    escapeHtml(unsafe) {
        return String(unsafe || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    getTodayTasks() {
        const today = new Date();
        return this.tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === today.toDateString();
        });
    }

    isThisWeek(date) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return date >= startOfWeek && date <= endOfWeek;
    }

    calculateAverageCompletionTime() {
        const completedTasks = this.tasks.filter(task => task.completed);
        if (completedTasks.length === 0) return 0;

        const totalTime = completedTasks.reduce((sum, task) => {
            return sum + (task.timeEstimate || 30);
        }, 0);

        return Math.round(totalTime / completedTasks.length);
    }

    calculateCurrentStreak() {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const checkDate = new Date();
            checkDate.setDate(today.getDate() - i);

            const hasCompletedTask = this.tasks.some(task =>
                task.completed && new Date(task.createdAt).toDateString() === checkDate.toDateString()
            );

            if (hasCompletedTask) streak++;
            else break;
        }

        return streak;
    }

    getWeatherDescription(weatherCode) {
        const weatherMap = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            80: 'Rain showers',
            81: 'Rain showers',
            82: 'Violent rain showers'
        };
        return weatherMap[weatherCode] || 'Unknown';
    }

    getFocusSuggestion(temperature) {
        if (temperature > 30) return 'Stay hydrated and take regular breaks in this heat!';
        if (temperature < 15) return 'Perfect cozy weather for deep focus work!';
        return 'Ideal conditions for productive work sessions!';
    }

    showLoading(show) {
        if (this.loading) {
            if (show) {
                this.loading.classList.remove('hidden');
                this.loading.style.display = 'flex';
            } else {
                this.loading.classList.add('hidden');
                setTimeout(() => {
                    this.loading.style.display = 'none';
                }, 500);
            }
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    max-width: 320px;
                    white-space: pre-line;
                    animation: slideIn 0.3s ease;
                }
                .notification-success { background: #10B981; }
                .notification-error { background: #EF4444; }
                .notification-info { background: #3B82F6; }
                .notification-warning { background: #F59E0B; }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    addActivity(message, isError = false) {
        if (!this.activityFeed) return;

        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${isError ? 'error' : ''}`;
        activityItem.innerHTML = `
            <span class="activity-time">${new Date().toLocaleTimeString()}</span>
            <span class="activity-text">${this.escapeHtml(message)}</span>
        `;
        this.activityFeed.prepend(activityItem);

        const activities = this.activityFeed.querySelectorAll('.activity-item');
        if (activities.length > 10) {
            activities[activities.length - 1].remove();
        }
    }
}

// GLOBAL FUNCTIONS
function showPage(pageType, clickedBtn) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }

    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;

    contentArea.innerHTML = '<div class="loading">Loading...</div>';

    setTimeout(() => {
        if (pageType === 'tasks-content') {
            loadTasksContent();
        } else {
            fetch(pageType.replace('-content', '') + '.html')
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const content = doc.querySelector('main') || doc.querySelector('.main-content') || doc.body;
                    contentArea.innerHTML = content.innerHTML;
                })
                .catch(() => {
                    contentArea.innerHTML = '<div class="error">Error loading page</div>';
                });
        }
    }, 300);
}

function loadTasksContent() {
    const contentArea = document.getElementById('contentArea');
    const grid = document.querySelector('.grid');
    const bottomStrip = document.querySelector('.bottom-strip');

    if (!contentArea || !grid || !bottomStrip) return;

    contentArea.innerHTML = `
        <section class="grid" data-aos="fade-up" data-aos-duration="3000">
            ${grid.outerHTML}
        </section>
        <section class="bottom-strip" data-aos="fade-up" data-aos-duration="2500">
            ${bottomStrip.outerHTML}
        </section>
    `;
}

// INITIALIZE APPLICATION
document.addEventListener('DOMContentLoaded', () => {
    new LifeBoardApp();
});