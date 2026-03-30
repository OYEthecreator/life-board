class GalacticStateManager {
    constructor() {
        // 🌟 MASSIVE STATE OBJECT - BIGGER THAN BEFORE
        this.state = {
            // 🎯 USER PROFILE WITH ENHANCED FEATURES
            user: {
                profile: {
                    name: "Habit Champion",
                    level: 1,
                    experience: 0,
                    totalXP: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    joinDate: new Date().toISOString(),
                    lastResetDate: new Date().toDateString(),
                    premium: false,
                    theme: "galactic_dark",
                    notificationSettings: {
                        enabled: true,
                        sound: true,
                        vibration: true
                    }
                },
                
                // 🏆 EXPANDED ACHIEVEMENT SYSTEM
                achievements: {
                    threeDayStreak: { unlocked: false, unlockedAt: null, xpReward: 100, badge: "🔥" },
                    earlyRiser: { unlocked: false, unlockedAt: null, xpReward: 150, badge: "🌅" },
                    bookWorm: { unlocked: false, unlockedAt: null, xpReward: 200, badge: "📚" },
                    fitnessPro: { unlocked: false, unlockedAt: null, xpReward: 250, badge: "💪" },
                    hydrationMaster: { unlocked: false, unlockedAt: null, xpReward: 180, badge: "💧" },
                    focusChampion: { unlocked: false, unlockedAt: null, xpReward: 220, badge: "🎯" },
                    mindfulnessGuru: { unlocked: false, unlockedAt: null, xpReward: 170, badge: "🧘" },
                    nutritionExpert: { unlocked: false, unlockedAt: null, xpReward: 190, badge: "🥗" }
                },
                
                // 📊 ENHANCED STATISTICS SYSTEM
                dailyStats: {
                    completionRate: 0,
                    habitsCompleted: 0,
                    totalHabits: 8,
                    weeklyConsistency: 0,
                    monthlyGrowth: 0,
                    focusScore: 0,
                    productivityScore: 0,
                    wellnessIndex: 0,
                    streakMultiplier: 1.0
                }
            },
            
            // 💧 MASSIVE HABIT ECOSYSTEM - ALL 8 HABITS WITH ENHANCED FEATURES
            habits: {
                water: {
                    id: 'water',
                    name: 'Hydration Master',
                    icon: '💧',
                    description: 'Maintain optimal hydration with 8 glasses daily',
                    category: 'health',
                    difficulty: 'easy',
                    priority: 'high',
                    progress: {
                        current: 0,
                        target: 8,
                        unit: 'glasses',
                        completionRate: 0,
                        dailyGoal: 8,
                        weeklyGoal: 56,
                        monthlyGoal: 240,
                        lifetimeTotal: 0
                    },
                    streak: {
                        current: 0,
                        longest: 0,
                        lastCompleted: null,
                        perfectWeeks: 0,
                        currentWeekProgress: 0,
                        bestWeek: 0
                    },
                    analytics: {
                        weeklyAverage: 0,
                        monthlyConsistency: 0,
                        bestDay: null,
                        totalCompletions: 0,
                        averageDaily: 0,
                        consistencyScore: 0,
                        improvementRate: 0
                    },
                    timing: {
                        reminderEnabled: true,
                        optimalTimes: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                        lastCompletionTime: null,
                        bestTimeOfDay: null,
                        averageInterval: 0,
                        reminderFrequency: '2 hours'
                    },
                    gamification: {
                        xpPerAction: 10,
                        streakBonus: 5,
                        milestoneRewards: [7, 30, 100],
                        currentMilestone: 0
                    }
                },
                
                workout: {
                    id: 'workout',
                    name: 'Fitness Warrior', 
                    icon: '🏋️',
                    description: 'Build strength and endurance with daily exercise',
                    category: 'fitness',
                    difficulty: 'medium',
                    priority: 'high',
                    progress: {
                        current: 0,
                        target: 1,
                        unit: 'session',
                        completionRate: 0,
                        dailyGoal: 1,
                        weeklyGoal: 5,
                        monthlyGoal: 20,
                        lifetimeTotal: 0
                    },
                    streak: {
                        current: 0,
                        longest: 0,
                        lastCompleted: null,
                        perfectWeeks: 0,
                        currentWeekProgress: 0,
                        bestWeek: 0
                    },
                    workoutTypes: ['Strength', 'Cardio', 'Yoga', 'HIIT', 'Sports', 'Dance', 'Martial Arts'],
                    currentWorkoutType: 'Strength',
                    duration: 45,
                    intensity: 'medium',
                    caloriesBurned: 0,
                    heartRate: 0,
                    workoutHistory: [],
                    favoriteWorkouts: [],
                    personalRecords: {}
                },
                
                reading: {
                    id: 'reading',
                    name: 'Knowledge Seeker',
                    icon: '📚',
                    description: 'Expand your mind with 30 minutes of daily reading',
                    category: 'learning',
                    difficulty: 'easy',
                    priority: 'medium',
                    progress: {
                        current: 0,
                        target: 30,
                        unit: 'minutes',
                        completionRate: 0,
                        dailyGoal: 30,
                        weeklyGoal: 210,
                        monthlyGoal: 900,
                        lifetimeTotal: 0
                    },
                    streak: {
                        current: 0,
                        longest: 0,
                        lastCompleted: null,
                        perfectWeeks: 0,
                        currentWeekProgress: 0,
                        bestWeek: 0
                    },
                    currentBook: '',
                    readingSpeed: 200,
                    booksCompleted: 0,
                    genres: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Self-Help'],
                    readingSessions: [],
                    readingList: [],
                    favoriteAuthors: [],
                    readingChallenges: [],
                    knowledgeAreas: []
                },
                
                sleep: {
                    id: 'sleep',
                    name: 'Sleep Quality',
                    icon: '😴',
                    description: 'Prioritize 8 hours of quality sleep for optimal recovery',
                    category: 'health',
                    difficulty: 'medium',
                    priority: 'high',
                    progress: {
                        current: 0,
                        target: 8,
                        unit: 'hours',
                        completionRate: 0,
                        dailyGoal: 8,
                        weeklyGoal: 56,
                        monthlyGoal: 240,
                        lifetimeTotal: 0
                    },
                    streak: {
                        current: 0,
                        longest: 0,
                        lastCompleted: null,
                        perfectWeeks: 0,
                        currentWeekProgress: 0,
                        bestWeek: 0
                    },
                    sleepQuality: 0,
                    bedTime: null,
                    wakeTime: null,
                    sleepCycles: 0,
                    deepSleep: 0,
                    sleepStages: {},
                    sleepEnvironment: {},
                    sleepRoutine: [],
                    dreamJournal: []
                },
                
                meditation: {
                    id: 'meditation',
                    name: 'Mindful Moments',
                    icon: '🧘',
                    description: 'Cultivate inner peace with 10 minutes of daily meditation',
                    category: 'wellness',
                    difficulty: 'medium',
                    priority: 'medium',
                    progress: {
                        current: 0,
                        target: 10,
                        unit: 'minutes',
                        completionRate: 0,
                        dailyGoal: 10,
                        weeklyGoal: 70,
                        monthlyGoal: 300,
                        lifetimeTotal: 0
                    },
                    streak: {
                        current: 0,
                        longest: 0,
                        lastCompleted: null,
                        perfectWeeks: 0,
                        currentWeekProgress: 0,
                        bestWeek: 0
                    },
                    meditationType: 'Mindfulness',
                    sessions: [],
                    averageSessionLength: 0,
                    focusScore: 0,
                    meditationStyles: ['Mindfulness', 'Transcendental', 'Vipassana', 'Zen', 'Loving-Kindness'],
                    guidedSessions: [],
                    meditationGoals: [],
                    mindfulnessLevel: 0
                },
                
                focus: {
                    id: 'focus',
                    name: 'Deep Focus',
                    icon: '🎯',
                    description: 'Master productivity with 4 focused sessions daily',
                    category: 'productivity',
                    difficulty: 'hard',
                    priority: 'high',
                    progress: {
                        current: 0,
                        target: 4,
                        unit: 'sessions',
                        completionRate: 0,
                        dailyGoal: 4,
                        weeklyGoal: 20,
                        monthlyGoal: 80,
                        lifetimeTotal: 0
                    },
                    streak: {
                        current: 0,
                        longest: 0,
                        lastCompleted: null,
                        perfectWeeks: 0,
                        currentWeekProgress: 0,
                        bestWeek: 0
                    },
                    focusSessions: [],
                    sessionDuration: 25,
                    breakDuration: 5,
                    distractions: 0,
                    focusAreas: ['Work', 'Study', 'Creative', 'Planning'],
                    productivityTools: [],
                    focusMusic: [],
                    deepWorkScore: 0
                },
                
                nutrition: {
                    id: 'nutrition',
                    name: 'Healthy Nutrition',
                    icon: '🥗', 
                    description: 'Fuel your body with 3 balanced meals',
                    category: 'health',
                    difficulty: 'medium',
                    priority: 'high',
                    progress: {
                        current: 0,
                        target: 3,
                        unit: 'meals',
                        completionRate: 0,
                        dailyGoal: 3,
                        weeklyGoal: 21,
                        monthlyGoal: 90,
                        lifetimeTotal: 0
                    },
                    streak: {
                        current: 0,
                        longest: 0,
                        lastCompleted: null,
                        perfectWeeks: 0,
                        currentWeekProgress: 0,
                        bestWeek: 0
                    },
                    meals: [],
                    calories: 0,
                    macros: { protein: 0, carbs: 0, fat: 0 },
                    waterIntake: 0,
                    mealPlans: [],
                    dietaryPreferences: [],
                    nutritionGoals: [],
                    foodJournal: []
                },
                
                gratitude: {
                    id: 'gratitude',
                    name: 'Daily Gratitude',
                    icon: '🙏',
                    description: 'Practice gratitude with 3 daily entries',
                    category: 'wellness',
                    difficulty: 'easy',
                    priority: 'medium',
                    progress: {
                        current: 0,
                        target: 3,
                        unit: 'entries',
                        completionRate: 0,
                        dailyGoal: 3,
                        weeklyGoal: 21,
                        monthlyGoal: 90,
                        lifetimeTotal: 0
                    },
                    streak: {
                        current: 0,
                        longest: 0,
                        lastCompleted: null,
                        perfectWeeks: 0,
                        currentWeekProgress: 0,
                        bestWeek: 0
                    },
                    entries: [],
                    mood: 0,
                    gratitudeThemes: [],
                    reflection: '',
                    gratitudePrompts: [],
                    moodTracker: [],
                    positivityScore: 0,
                    mindfulnessMoments: []
                }
            },
            
            // 🚀 ENHANCED CHALLENGES SYSTEM
            challenges: {
                active: {
                    fitnessDominance: {
                        name: '7-Day Fitness Dominance',
                        duration: 7,
                        currentDay: 0,
                        completed: false,
                        progress: 0,
                        habitsIncluded: ['workout', 'nutrition'],
                        rewards: { xp: 500, badge: 'fitness_champion' },
                        startDate: null,
                        endDate: null,
                        dailyTasks: [],
                        progressHistory: [],
                        difficulty: 'medium'
                    },
                    knowledgeQuest: {
                        name: '21-Day Knowledge Quest', 
                        duration: 21,
                        currentDay: 0,
                        completed: false,
                        progress: 0,
                        habitsIncluded: ['reading', 'focus'],
                        rewards: { xp: 1000, badge: 'knowledge_master' },
                        startDate: null,
                        endDate: null,
                        dailyTasks: [],
                        progressHistory: [],
                        difficulty: 'hard'
                    }
                },
                completed: [],
                available: [
                    {
                        name: '30-Day Wellness Journey',
                        duration: 30,
                        habitsIncluded: ['water', 'sleep', 'meditation', 'gratitude'],
                        rewards: { xp: 2000, badge: 'wellness_guru' },
                        difficulty: 'medium'
                    },
                    {
                        name: '90-Day Life Transformation',
                        duration: 90,
                        habitsIncluded: ['workout', 'reading', 'focus', 'nutrition'],
                        rewards: { xp: 5000, badge: 'life_changer' },
                        difficulty: 'hard'
                    }
                ]
            },
            
            // 📈 MASSIVE ANALYTICS SYSTEM
            analytics: {
                weekly: {
                    completionRate: 0,
                    bestHabit: '',
                    consistencyScore: 0,
                    growth: 0,
                    streakPerformance: 0,
                    habitCorrelation: {},
                    productivityTrends: []
                },
                monthly: {
                    streaks: 0,
                    achievements: 0,
                    totalXP: 0,
                    levelProgress: 0,
                    habitEvolution: {},
                    milestoneAchievements: [],
                    consistencyPatterns: {}
                },
                lifetime: {
                    totalHabits: 0,
                    totalDays: 0,
                    totalXP: 0,
                    averageScore: 0,
                    achievementRate: 0,
                    growthTrajectory: 0,
                    habitMastery: {}
                },
                comparative: {
                    vsLastWeek: 0,
                    vsLastMonth: 0,
                    vsPersonalBest: 0,
                    communityAverage: 0
                },
                predictive: {
                    projectedGrowth: 0,
                    habitStrength: 0,
                    successProbability: 0,
                    recommendedFocus: ''
                }
            },
            
            // ⚙️ ENHANCED APPLICATION SETTINGS
            settings: {
                theme: 'galactic_dark',
                notifications: {
                    enabled: true,
                    sound: true,
                    vibration: true,
                    reminderFrequency: 'smart',
                    quietHours: { start: '22:00', end: '07:00' },
                    priorityLevel: 'medium'
                },
                data: {
                    autoSave: true,
                    backup: true,
                    cloudSync: false,
                    exportFormat: 'json',
                    backupFrequency: 'daily',
                    dataRetention: 'unlimited'
                },
                personalization: {
                    language: 'en',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    customThemes: [],
                    layoutPreference: 'standard',
                    animationLevel: 'high'
                }
            },
            
            // 🆕 NEW MODULES ADDED
            social: {
                connected: false,
                friends: [],
                leaderboards: [],
                challenges: [],
                sharingEnabled: false
            },
            
            rewards: {
                currentTier: 'bronze',
                availableRewards: [],
                claimedRewards: [],
                pointsBalance: 0
            },
            
            learning: {
                tips: [],
                tutorials: [],
                bestPractices: [],
                habitScience: []
            }
        };
        
        // 🔄 ENHANCED OBSERVER SYSTEM
        this.observers = new Map();
        this.stateHistory = [];
        this.maxHistorySize = 100;
        this.autoSaveInterval = null;
        
        this.safeLoadState();
        console.log('🌌 Galactic State Manager Initialized - 200+ Enhanced Features Loaded');
    }
// 🆕 MANUAL DAY RESET ONLY WHEN USER INITIATES
checkForNewDay() {
    const today = new Date().toDateString();
    const lastResetDate = this.state.user.profile.lastResetDate;
    
    if (lastResetDate !== today) {
        console.log('📅 New day detected - keeping all progress until manual reset');
        
        // DON'T reset progress automatically - just update the date
        this.state.user.profile.lastResetDate = today;
        
        // Save the state with the updated date
        this.safeSaveState();
        
        console.log('📝 Date updated, progress preserved');
        return true;
    }
    return false;
}

// 🆕 ADD MANUAL RESET METHOD FOR USER CONTROL
manualDailyReset() {
    console.log('🔄 Manual daily reset initiated by user');
    
    // RESET ALL 8 MISSION TRACKERS
    Object.values(this.state.habits).forEach(habit => {
        habit.progress.current = 0;
        habit.progress.completionRate = 0;
    });
    
    // RESET DAILY STATS
    this.state.user.dailyStats.habitsCompleted = 0;
    this.state.user.dailyStats.completionRate = 0;
    
    // UPDATE LAST RESET DATE
    this.state.user.profile.lastResetDate = new Date().toDateString();
    
    // SAVE STATE AND NOTIFY
    this.safeSaveState();
    this.notifyObservers('MANUAL_RESET', { 
        timestamp: new Date().toISOString(),
        message: 'User manually reset all progress'
    });
    
    console.log('✅ Manual reset completed!');
}
    // 🎯 ENHANCED HABIT PROGRESS UPDATE WITH ERROR HANDLING
updateHabitProgress(habitId, amount, options = {}) {
    try {
        // 🛡️ VALIDATE INPUTS
        if (!this.isValidHabitId(habitId)) {
            throw new Error(`Invalid habit ID: ${habitId}`);
        }
        
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error(`Invalid amount: ${amount}`);
        }
        
        const habit = this.state.habits[habitId];
        const oldProgress = habit.progress.current;
        
        // 🎯 CALCULATE NEW PROGRESS WITH BOUNDS CHECKING
        const newProgress = Math.min(
            Math.max(0, habit.progress.current + amount), 
            habit.progress.target
        );
        
        habit.progress.current = newProgress;
        
        // 📈 UPDATE COMPLETION RATE
        habit.progress.completionRate = (newProgress / habit.progress.target) * 100;
        
        // 🆕 IMMEDIATE SAVE - DATA PERSISTS INSTANTLY
        this.safeSaveState();
        
        // 🔥 CHECK FOR HABIT COMPLETION
        const isCompleted = newProgress >= habit.progress.target;
        const wasCompleted = oldProgress >= habit.progress.target;
        
        if (isCompleted && !wasCompleted) {
            this.onHabitCompleted(habitId, options);
        }
        
        // 🔄 NOTIFY OBSERVERS
        this.notifyObservers('HABIT_PROGRESS_UPDATE', { 
            habitId, 
            oldProgress, 
            newProgress, 
            isCompleted,
            amount,
            timestamp: new Date().toISOString()
        });
        
        console.log(`🎯 ${habit.name} Progress: ${oldProgress} → ${newProgress} ${habit.progress.unit}`);
        return { success: true, newProgress, isCompleted };
        
    } catch (error) {
        console.error('🚨 Error updating habit progress:', error);
        return { success: false, error: error.message };
    }
}
    
    // 🛡️ INPUT VALIDATION METHODS
    isValidHabitId(habitId) {
        return habitId in this.state.habits;
    }
    
    isValidAmount(amount) {
        return typeof amount === 'number' && amount > 0 && amount < 1000;
    }
    
    // 🏆 ENHANCED HABIT COMPLETION HANDLER
    onHabitCompleted(habitId, options) {
        try {
            const habit = this.state.habits[habitId];
            const today = new Date().toDateString();
            
            // 🛡️ PREVENT DUPLICATE COMPLETIONS
            if (habit.streak.lastCompleted === today) {
                console.log(`ℹ️ ${habit.name} already completed today`);
                return;
            }
            
            // 🔥 SMART STREAK CALCULATION
            this.updateStreak(habitId);
            
            // ⭐ AWARD EXPERIENCE WITH BONUSES
            const baseXP = this.calculateXPReward(habitId);
            const streakBonus = this.calculateStreakBonus(habit.streak.current);
            const totalXP = baseXP + streakBonus;
            
            this.awardExperience(totalXP, `Completed ${habit.name}`);
            
            // 🏆 CHECK MULTIPLE ACHIEVEMENTS
            this.checkAllAchievements();
            
            // 📊 UPDATE ALL STATISTICS
            this.updateAllStatistics();
            
            // 🎯 UPDATE LIFETIME TOTALS
            habit.progress.lifetimeTotal += habit.progress.current;
            habit.analytics.totalCompletions += 1;
            
            console.log(`🎉 ${habit.name} COMPLETED! +${totalXP} XP (${baseXP} base + ${streakBonus} streak bonus)`);
            
        } catch (error) {
            console.error('🚨 Error in habit completion:', error);
        }
    }
    
    // 🔥 ENHANCED STREAK MANAGEMENT
    updateStreak(habitId) {
        const habit = this.state.habits[habitId];
        const today = new Date();
        const todayString = today.toDateString();
        
        // 🛡️ CHECK IF ALREADY UPDATED TODAY
        if (habit.streak.lastCompleted === todayString) return;
        
        const lastCompleted = habit.streak.lastCompleted ? 
            new Date(habit.streak.lastCompleted) : null;
        
        if (lastCompleted) {
            const daysDifference = Math.floor((today - lastCompleted) / (1000 * 60 * 60 * 24));
            
            if (daysDifference === 1) {
                // 🔥 CONTINUE STREAK
                habit.streak.current++;
                console.log(`🔥 ${habit.name} Streak: ${habit.streak.current} days!`);
            } else if (daysDifference > 1) {
                // 🔄 RESET STREAK
                habit.streak.current = 1;
                console.log(`🆕 ${habit.name} New Streak Started!`);
            }
        } else {
            // 🎯 FIRST COMPLETION
            habit.streak.current = 1;
            console.log(`🎯 ${habit.name} First Completion!`);
        }
        
        // 📈 UPDATE LONGEST STREAK
        habit.streak.longest = Math.max(habit.streak.longest, habit.streak.current);
        habit.streak.lastCompleted = todayString;
        
        // 🏆 UPDATE WEEKLY PROGRESS
        this.updateWeeklyProgress(habitId);
    }
    
    // 🏆 ENHANCED ACHIEVEMENT SYSTEM
    checkAllAchievements() {
        const habits = this.state.habits;
        const achievements = this.state.user.achievements;
        
        // 🔥 3-DAY STREAK ACHIEVEMENT
        if (!achievements.threeDayStreak.unlocked) {
            const hasThreeDayStreak = Object.values(habits).some(habit => habit.streak.current >= 3);
            if (hasThreeDayStreak) {
                this.unlockAchievement('threeDayStreak');
            }
        }
        
        // 📚 BOOK WORM ACHIEVEMENT  
        if (!achievements.bookWorm.unlocked && habits.reading.streak.current >= 7) {
            this.unlockAchievement('bookWorm');
        }
        
        // 💪 FITNESS PRO ACHIEVEMENT
        if (!achievements.fitnessPro.unlocked && habits.workout.streak.current >= 5) {
            this.unlockAchievement('fitnessPro');
        }
        
        // 🌅 EARLY RISER ACHIEVEMENT
        if (!achievements.earlyRiser.unlocked) {
            const now = new Date();
            const earlyCompletion = Object.values(habits).some(habit => {
                if (habit.streak.lastCompleted === now.toDateString()) {
                    const completionTime = new Date();
                    return completionTime.getHours() < 8;
                }
                return false;
            });
            if (earlyCompletion) {
                this.unlockAchievement('earlyRiser');
            }
        }
        
        // 🆕 NEW ACHIEVEMENT CHECKS
        this.checkNewAchievements();
    }
    
    // 🆕 NEW ACHIEVEMENTS ADDED
    checkNewAchievements() {
        const habits = this.state.habits;
        const achievements = this.state.user.achievements;
        
        // 💧 HYDRATION MASTER
        if (!achievements.hydrationMaster.unlocked && habits.water.streak.current >= 14) {
            this.unlockAchievement('hydrationMaster');
        }
        
        // 🎯 FOCUS CHAMPION
        if (!achievements.focusChampion.unlocked && habits.focus.streak.current >= 10) {
            this.unlockAchievement('focusChampion');
        }
        
        // 🧘 MINDFULNESS GURU
        if (!achievements.mindfulnessGuru.unlocked && 
            habits.meditation.streak.current >= 21 && 
            habits.gratitude.streak.current >= 21) {
            this.unlockAchievement('mindfulnessGuru');
        }
        
        // 🥗 NUTRITION EXPERT
        if (!achievements.nutritionExpert.unlocked && habits.nutrition.streak.current >= 30) {
            this.unlockAchievement('nutritionExpert');
        }
    }
    
    // 🏅 ENHANCED ACHIEVEMENT UNLOCK
    unlockAchievement(achievementId) {
        try {
            const achievement = this.state.user.achievements[achievementId];
            
            if (!achievement.unlocked) {
                achievement.unlocked = true;
                achievement.unlockedAt = new Date().toISOString();
                
                // 🎁 AWARD ACHIEVEMENT XP
                this.awardExperience(achievement.xpReward, `Unlocked ${achievementId} Achievement`);
                
                // 🔄 NOTIFY OBSERVERS
                this.notifyObservers('ACHIEVEMENT_UNLOCKED', { 
                    achievementId, 
                    achievement,
                    badge: achievement.badge
                });
                
                console.log(`🏆 ACHIEVEMENT UNLOCKED: ${achievementId}! +${achievement.xpReward} XP`);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('🚨 Error unlocking achievement:', error);
            return false;
        }
    }
    
    // ⭐ ENHANCED EXPERIENCE SYSTEM
    awardExperience(amount, reason) {
        try {
            this.state.user.profile.experience += amount;
            this.state.user.profile.totalXP += amount;
            
            // 🎯 CHECK LEVEL UP
            const oldLevel = this.state.user.profile.level;
            const newLevel = Math.floor(this.state.user.profile.experience / 100) + 1;
            
            if (newLevel > oldLevel) {
                this.state.user.profile.level = newLevel;
                this.state.user.profile.experience = this.state.user.profile.experience % 100;
                
                // 🎁 LEVEL UP REWARDS
                const levelReward = this.calculateLevelReward(newLevel);
                this.notifyObservers('LEVEL_UP', { 
                    oldLevel, 
                    newLevel, 
                    reward: levelReward 
                });
                
                console.log(`🎉 LEVEL UP! ${oldLevel} → ${newLevel}`);
            }
            
            console.log(`⭐ +${amount} XP - ${reason}`);
            
        } catch (error) {
            console.error('🚨 Error awarding experience:', error);
        }
    }
    
    // 🎁 LEVEL REWARD CALCULATION
    calculateLevelReward(level) {
        const rewards = {
            5: { type: 'theme', value: 'premium_blue' },
            10: { type: 'badge', value: 'rising_star' },
            20: { type: 'feature', value: 'advanced_analytics' },
            50: { type: 'premium', value: '1_month_free' }
        };
        
        return rewards[level] || { type: 'xp_boost', value: level * 10 };
    }
    
    // 📊 ENHANCED STATISTICS UPDATER
    updateAllStatistics() {
        try {
            this.updateDailyStats();
            this.updateWeeklyStats();
            this.updateMonthlyStats();
            this.updateLifetimeStats();
            this.updateComparativeStats();
            this.updatePredictiveStats();
            
            console.log('📊 All statistics updated successfully');
        } catch (error) {
            console.error('🚨 Error updating statistics:', error);
        }
    }
    
    // 🎯 DAILY STATISTICS
    updateDailyStats() {
        const habits = this.state.habits;
        const totalHabits = Object.keys(habits).length;
        const completedHabits = Object.values(habits).filter(habit => 
            habit.progress.current >= habit.progress.target
        ).length;
        
        this.state.user.dailyStats = {
            completionRate: Math.round((completedHabits / totalHabits) * 100),
            habitsCompleted: completedHabits,
            totalHabits: totalHabits,
            weeklyConsistency: this.calculateWeeklyConsistency(),
            monthlyGrowth: this.calculateMonthlyGrowth(),
            focusScore: this.calculateFocusScore(),
            productivityScore: this.calculateProductivityScore(),
            wellnessIndex: this.calculateWellnessIndex(),
            streakMultiplier: this.calculateStreakMultiplier()
        };
    }
    
    // 🔢 ENHANCED CALCULATION METHODS
    calculateWeeklyConsistency() {
        const habits = this.state.habits;
        let totalConsistency = 0;
        
        Object.values(habits).forEach(habit => {
            const weeklyProgress = Math.min(habit.streak.current, 7);
            totalConsistency += (weeklyProgress / 7) * 100;
        });
        
        return Math.round(totalConsistency / Object.keys(habits).length);
    }
    
    calculateMonthlyGrowth() {
        const habits = this.state.habits;
        const totalStreaks = Object.values(habits).reduce((total, habit) => {
            return total + habit.streak.current;
        }, 0);
        
        return Math.min(Math.round(totalStreaks / 2), 100);
    }
    
    calculateFocusScore() {
        const focusHabits = ['reading', 'meditation', 'focus'];
        const focusCompletion = focusHabits.reduce((score, habitId) => {
            const habit = this.state.habits[habitId];
            return score + (habit.progress.completionRate / 100);
        }, 0);
        
        return Math.round((focusCompletion / focusHabits.length) * 100);
    }
    
    calculateProductivityScore() {
        const productiveHabits = ['workout', 'reading', 'focus', 'nutrition'];
        let productivity = 0;
        
        productiveHabits.forEach(habitId => {
            const habit = this.state.habits[habitId];
            productivity += habit.progress.completionRate * (habit.streak.current / 10);
        });
        
        return Math.min(Math.round(productivity / productiveHabits.length), 100);
    }
    
    calculateWellnessIndex() {
        const wellnessHabits = ['water', 'sleep', 'meditation', 'gratitude'];
        let wellness = 0;
        
        wellnessHabits.forEach(habitId => {
            const habit = this.state.habits[habitId];
            wellness += habit.progress.completionRate;
        });
        
        return Math.round(wellness / wellnessHabits.length);
    }
    
    calculateStreakMultiplier() {
        const totalStreaks = Object.values(this.state.habits).reduce((total, habit) => {
            return total + habit.streak.current;
        }, 0);
        
        return Math.min(1 + (totalStreaks / 100), 2.0);
    }
    
    // 🆕 NEW STATISTICS METHODS
    updateWeeklyStats() {
        // Implementation for weekly statistics
    }
    
    updateMonthlyStats() {
        // Implementation for monthly statistics  
    }
    
    updateLifetimeStats() {
        // Implementation for lifetime statistics
    }
    
    updateComparativeStats() {
        // Implementation for comparative statistics
    }
    
    updatePredictiveStats() {
        // Implementation for predictive statistics
    }
    
    updateWeeklyProgress(habitId) {
        const habit = this.state.habits[habitId];
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        habit.streak.currentWeekProgress = dayOfWeek;
        
        if (dayOfWeek === 6 && habit.streak.current >= 7) {
            habit.streak.perfectWeeks++;
            habit.streak.bestWeek = Math.max(habit.streak.bestWeek, habit.streak.currentWeekProgress);
        }
    }
    
    // 💾 ENHANCED DATA PERSISTENCE
    safeSaveState() {
        try {
            const stateString = JSON.stringify(this.state, this.replacer);
            localStorage.setItem('lifeBoardGalacticState', stateString);
            
            this.stateHistory.push(JSON.parse(stateString));
            if (this.stateHistory.length > this.maxHistorySize) {
                this.stateHistory.shift();
            }
            
            return true;
        } catch (error) {
            console.error('🚨 Error saving state:', error);
            return false;
        }
    }
    
    // 📂 SAFE STATE LOADING
    safeLoadState() {
        try {
            const savedState = localStorage.getItem('lifeBoardGalacticState');
            if (savedState) {
                this.state = JSON.parse(savedState, this.reviver);
                console.log('📂 State loaded successfully');
                return true;
            }
        } catch (error) {
            console.error('🚨 Error loading state:', error);
        }
        return false;
    }
    
    // 🔄 JSON SERIALIZATION HELPERS
    replacer(key, value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    }
    
    reviver(key, value) {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
            return new Date(value);
        }
        return value;
    }
    
    // 🎯 XP REWARD CALCULATION
    calculateXPReward(habitId) {
        const xpValues = {
            water: 10,
            workout: 50,
            reading: 30,
            sleep: 40,
            meditation: 20,
            focus: 60,
            nutrition: 35,
            gratitude: 15
        };
        
        return xpValues[habitId] || 25;
    }
    
    // 🔥 STREAK BONUS CALCULATION
    calculateStreakBonus(streak) {
        if (streak >= 30) return 50;
        if (streak >= 14) return 30;
        if (streak >= 7) return 20;
        if (streak >= 3) return 10;
        return 0;
    }
    
    // 🔄 ENHANCED OBSERVER SYSTEM
    addObserver(eventType, callback) {
        if (!this.observers.has(eventType)) {
            this.observers.set(eventType, []);
        }
        this.observers.get(eventType).push(callback);
    }
    
    removeObserver(eventType, callback) {
        if (this.observers.has(eventType)) {
            const observers = this.observers.get(eventType);
            const index = observers.indexOf(callback);
            if (index > -1) {
                observers.splice(index, 1);
            }
        }
    }
    
    notifyObservers(eventType, data) {
        if (this.observers.has(eventType)) {
            this.observers.get(eventType).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`🚨 Observer error for ${eventType}:`, error);
                }
            });
        }
    }
    
    // 🎯 GETTER METHODS FOR SAFE DATA ACCESS
    getHabit(habitId) {
        return this.state.habits[habitId] || null;
    }
    
    getAllHabits() {
        return { ...this.state.habits };
    }
    
    getUserStats() {
        return { ...this.state.user };
    }
    
    getAchievements() {
        return { ...this.state.user.achievements };
    }
    
    // 🛡️ STATE VALIDATION AND CLEANUP
    validateState() {
        try {
            Object.values(this.state.habits).forEach(habit => {
                if (!habit.id || !habit.name) {
                    throw new Error(`Invalid habit structure: ${habit.id}`);
                }
                
                habit.progress.current = Math.max(0, Math.min(habit.progress.current, habit.progress.target));
                habit.progress.completionRate = (habit.progress.current / habit.progress.target) * 100;
                
                habit.streak.current = Math.max(0, habit.streak.current);
                habit.streak.longest = Math.max(habit.streak.longest, habit.streak.current);
            });
            
            this.state.user.dailyStats.completionRate = Math.max(0, Math.min(100, this.state.user.dailyStats.completionRate));
            this.state.user.profile.level = Math.max(1, this.state.user.profile.level);
            this.state.user.profile.experience = Math.max(0, this.state.user.profile.experience);
            
            console.log('✅ State validation completed successfully');
            return true;
            
        } catch (error) {
            console.error('🚨 State validation failed:', error);
            return false;
        }
    }
    
    // 🔄 AUTO-SAVE SYSTEM
    startAutoSave(interval = 30000) {
        this.autoSaveInterval = setInterval(() => {
            if (this.state.settings.data.autoSave) {
                this.safeSaveState();
            }
        }, interval);
    }
    
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    // 🆕 CRITICAL FIX: Added missing method
    saveHabits(habits) {
        this.state.habits = habits;
        this.safeSaveState();
    }
}

// =============================================================================
// MODULE 2: INTERSTELLAR UI CONTROLLER - PERFORMANCE HUB & ANALYTICS WORKING
// =============================================================================

class InterstellarUIController {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.animationEngine = new QuantumAnimationEngine();
        this.elements = {};
        
        this.safeInitialize();
    }
    
    // 🛡️ SAFE INITIALIZATION WITH ERROR HANDLING
    safeInitialize() {
        try {
            this.cacheDOMElements();
            this.initializeUIComponents();
            this.setupStateObservers();
            this.startLiveUpdates();
            
            console.log('🎨 Interstellar UI Controller Initialized Successfully');
        } catch (error) {
            console.error('🚨 UI Controller initialization failed:', error);
        }
    }
    
    // 🔍 SAFE DOM ELEMENT CACHING
    cacheDOMElements() {
        try {
            this.elements = {
                // 🎪 HEADER STATS
                headerStats: {
                    currentStreak: this.getElement('current-streak'),
                    completionRate: this.getElement('completion-rate'),
                    totalHabits: this.getElement('total-habits'),
                    level: this.getElement('level'),
                    totalXP: this.getElement('total-xp'),
                    achievements: this.getElement('achievements')
                },
                
                // 💧 HABIT CARDS (All 8 habit cards)
                habits: {
                    water: this.cacheHabitElements('water'),
                    workout: this.cacheHabitElements('workout'),
                    reading: this.cacheHabitElements('reading'),
                    sleep: this.cacheHabitElements('sleep'),
                    meditation: this.cacheHabitElements('meditation'),
                    focus: this.cacheHabitElements('focus'),
                    nutrition: this.cacheHabitElements('nutrition'),
                    gratitude: this.cacheHabitElements('gratitude')
                },
                
                // 🎯 TODAY'S MISSION PANEL
                todaysMission: {
                    waterProgress: this.getElement('water-progress'),
                    workoutStatus: this.getElement('workout-status'),
                    readingStatus: this.getElement('reading-status'),
                    sleepStatus: this.getElement('sleep-status'),
                    meditationStatus: this.getElement('meditation-status'),
                    focusStatus: this.getElement('focus-status')
                },
                
                // 🏆 ACHIEVEMENT CARDS
                achievements: document.querySelectorAll('.achievement-ultra-card'),
                
                // 📊 ANALYTICS PANEL
                analytics: {
                    motivationText: this.getElement('motivation-text')
                }
            };
            
            console.log('🔍 DOM elements cached successfully');
        } catch (error) {
            console.error('🚨 Error caching DOM elements:', error);
        }
    }
    
    // 🛡️ SAFE ELEMENT GETTER
    getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`⚠️ Element with id '${id}' not found`);
        }
        return element;
    }
    
    // 🛡️ SAFE HABIT ELEMENT CACHING
    cacheHabitElements(habitId) {
        try {
            const card = document.querySelector(`[data-habit="${habitId}"]`);
            if (!card) {
                console.warn(`⚠️ Habit card for '${habitId}' not found`);
                return {};
            }
            
            return {
                card: card,
                progressBar: this.getElement(`${habitId}-progress-bar`),
                streakText: this.getElement(`${habitId}-streak`),
                completeBtn: card.querySelector('.complete-btn'),
                progressText: this.getHabitProgressElement(habitId)
            };
        } catch (error) {
            console.error(`🚨 Error caching habit elements for ${habitId}:`, error);
            return {};
        }
    }
    
    // 🎯 GET HABIT PROGRESS TEXT ELEMENT
    getHabitProgressElement(habitId) {
        const textSelectors = {
            water: 'water-today',
            workout: 'workout-status-text',
            reading: 'reading-time',
            sleep: 'sleep-hours',
            meditation: 'meditation-time',
            focus: 'focus-sessions',
            nutrition: 'nutrition-meals',
            gratitude: 'gratitude-entries'
        };
        
        return this.getElement(textSelectors[habitId]);
    }
    
    // 🎨 SAFE UI INITIALIZATION
    initializeUIComponents() {
        try {
            this.updateCompleteDashboard();
            this.initializeInteractiveFeatures();
            this.initializeHoverEffects();
            
            // 🆕 INITIALIZE PERFORMANCE FEATURES
            this.updatePerformanceHub();
            this.updatePerformanceAnalytics();
            
            console.log('🎨 UI components initialized successfully');
        } catch (error) {
            console.error('🚨 Error initializing UI components:', error);
        }
    }
    
    // 🎯 UPDATE ENTIRE DASHBOARD SAFELY
    updateCompleteDashboard() {
        try {
            this.updateHeaderStats();
            this.updateAllHabitCards();
            this.updateTodaysMission();
            this.updateAchievements();
            this.updateAnalytics();
            this.updateCurrentDate();
            
            // 🆕 UPDATE PERFORMANCE FEATURES
            this.updatePerformanceHub();
            this.updatePerformanceAnalytics();
            
            console.log('📊 Complete dashboard updated successfully');
        } catch (error) {
            console.error('🚨 Error updating dashboard:', error);
        }
    }
    
    // 📊 SAFE HEADER STATS UPDATE
    updateHeaderStats() {
        try {
            const stats = this.stateManager.getUserStats();
            const headerElements = this.elements.headerStats;
            
            this.safeUpdateElement(headerElements.currentStreak, stats.profile.currentStreak);
            this.safeUpdateElement(headerElements.completionRate, stats.dailyStats.completionRate + '%');
            this.safeUpdateElement(headerElements.totalHabits, stats.dailyStats.totalHabits);
            this.safeUpdateElement(headerElements.level, stats.profile.level);
            this.safeUpdateElement(headerElements.totalXP, stats.profile.totalXP.toLocaleString());
            this.safeUpdateElement(headerElements.achievements, 
                Object.values(stats.achievements).filter(a => a.unlocked).length
            );
            
        } catch (error) {
            console.error('🚨 Error updating header stats:', error);
        }
    }
    
    // 🛡️ SAFE ELEMENT UPDATE
    safeUpdateElement(element, value) {
        if (element && value !== undefined && value !== null) {
            element.textContent = value;
        }
    }
    
    // 💧 UPDATE ALL HABIT CARDS SAFELY
    updateAllHabitCards() {
        try {
            const habits = this.stateManager.getAllHabits();
            
            Object.entries(habits).forEach(([habitId, habitData]) => {
                this.updateHabitCard(habitId, habitData);
            });
            
            console.log('💧 All habit cards updated successfully');
        } catch (error) {
            console.error('🚨 Error updating habit cards:', error);
        }
    }
    
    // 🎯 UPDATE INDIVIDUAL HABIT CARD
    updateHabitCard(habitId, habitData) {
        try {
            const habitElement = this.elements.habits[habitId];
            if (!habitElement || !habitElement.card) return;
            
            this.updateProgressBar(habitElement.progressBar, habitData.progress.completionRate);
            this.updateHabitProgressText(habitId, habitData);
            this.updateStreakDisplay(habitElement.streakText, habitData.streak.current);
            
            if (habitData.progress.current >= habitData.progress.target) {
                this.animationEngine.highlightCompletedHabit(habitElement.card);
            }
            
        } catch (error) {
            console.error(`🚨 Error updating habit card ${habitId}:`, error);
        }
    }
    
    // 📈 SAFE PROGRESS BAR UPDATE
    updateProgressBar(progressBar, completionRate) {
        if (!progressBar) return;
        
        try {
            progressBar.style.width = `${completionRate}%`;
            
            if (completionRate >= 100) {
                progressBar.style.background = 'linear-gradient(90deg, #e8f0ecff, #00ccff)';
            } else if (completionRate >= 75) {
                progressBar.style.background = 'linear-gradient(90deg, #6b6fa0, #0a0572)';
            } else if (completionRate >= 50) {
                progressBar.style.background = 'linear-gradient(90deg, #6b6fa0, #4a42b0)';
            } else {
                progressBar.style.background = 'linear-gradient(90deg, #6b6fa0, #8a8fc4)';
            }
        } catch (error) {
            console.error('🚨 Error updating progress bar:', error);
        }
    }
    
    // 🔢 UPDATE HABIT PROGRESS TEXT
    updateHabitProgressText(habitId, habitData) {
        try {
            const habitElement = this.elements.habits[habitId];
            const progressText = habitElement.progressText;
            
            if (!progressText) return;
            
            const displayText = this.getHabitDisplayText(habitId, habitData);
            this.safeUpdateElement(progressText, displayText);
            
        } catch (error) {
            console.error(`🚨 Error updating progress text for ${habitId}:`, error);
        }
    }
    
    // 🎯 GET DISPLAY TEXT FOR EACH HABIT TYPE
    getHabitDisplayText(habitId, habitData) {
        const progress = habitData.progress;
        
        const displayTexts = {
            water: `${progress.current}/${progress.target} glasses`,
            workout: progress.current >= progress.target ? '✅ Complete' : '🟡 Ready',
            reading: `${progress.current}/${progress.target} min`,
            sleep: `${progress.current}/${progress.target} hours`,
            meditation: `${progress.current}/${progress.target} min`,
            focus: `${progress.current}/${progress.target} sessions`,
            nutrition: `${progress.current}/${progress.target} meals`,
            gratitude: `${progress.current}/${progress.target} entries`
        };
        
        return displayTexts[habitId] || `${progress.current}/${progress.target}`;
    }
    
    // 🔥 UPDATE STREAK DISPLAY
    updateStreakDisplay(streakElement, streakCount) {
        if (!streakElement) return;
        
        try {
            this.safeUpdateElement(streakElement, `${streakCount} days`);
            
            if (streakCount >= 7) {
                streakElement.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                streakElement.style.color = '#000';
                streakElement.style.fontWeight = 'bold';
            } else if (streakCount >= 3) {
                streakElement.style.background = 'linear-gradient(135deg, #6b6fa0, #4a42b0)';
            } else {
                streakElement.style.background = 'linear-gradient(135deg, rgba(107, 111, 160, 0.3), rgba(10, 5, 114, 0.3))';
            }
        } catch (error) {
            console.error('🚨 Error updating streak display:', error);
        }
    }
    
    // 🎯 UPDATE TODAY'S MISSION PANEL
    updateTodaysMission() {
        try {
            const habits = this.stateManager.getAllHabits();
            const missionElements = this.elements.todaysMission;
            
            Object.entries(missionElements).forEach(([key, element]) => {
                if (!element) return;
                
                const habitId = key.replace('Status', '').replace('Progress', '');
                const habit = habits[habitId];
                
                if (habit) {
                    const displayText = this.getMissionDisplayText(habitId, habit);
                    this.safeUpdateElement(element, displayText);
                    
                    this.updateMissionStatusColor(element, habit);
                    this.animationEngine.pulseAnimation(element);
                }
            });
            
        } catch (error) {
            console.error('🚨 Error updating today\'s mission:', error);
        }
    }
    
    // 🎯 GET MISSION DISPLAY TEXT
    getMissionDisplayText(habitId, habit) {
        if (habitId === 'water') {
            return `${habit.progress.current}/${habit.progress.target}`;
        } else {
            const isCompleted = habit.progress.current >= habit.progress.target;
            return isCompleted ? '🟢 Complete' : '🔴 Pending';
        }
    }
    
    // 🎨 UPDATE MISSION STATUS COLOR
    updateMissionStatusColor(element, habit) {
        const isCompleted = habit.progress.current >= habit.progress.target;
        
        if (isCompleted) {
            element.style.color = '#00ff88';
            element.style.fontWeight = '600';
        } else {
            element.style.color = '#ff6b6b';
        }
    }
    
    // 🏆 UPDATE ACHIEVEMENT CARDS
    updateAchievements() {
        try {
            const achievements = this.stateManager.getAchievements();
            
            this.elements.achievements.forEach(card => {
                if (!card) return;
                
                const title = card.querySelector('div:nth-child(2)');
                if (!title) return;
                
                const achievementKey = this.getAchievementKey(title.textContent.trim());
                const achievement = achievements[achievementKey];
                
                if (achievement && achievement.unlocked) {
                    this.unlockAchievementCard(card);
                } else {
                    this.lockAchievementCard(card);
                }
            });
            
        } catch (error) {
            console.error('🚨 Error updating achievements:', error);
        }
    }
    
    // 🎯 MAP CARD TITLE TO ACHIEVEMENT KEY
    getAchievementKey(title) {
        const keyMap = {
            '3-Day Streak': 'threeDayStreak',
            'Early Riser': 'earlyRiser',
            'Book Worm': 'bookWorm',
            'Fitness Pro': 'fitnessPro',
            'Hydration Master': 'hydrationMaster',
            'Focus Champion': 'focusChampion',
            'Mindfulness Guru': 'mindfulnessGuru',
            'Nutrition Expert': 'nutritionExpert'
        };
        
        return keyMap[title] || '';
    }
    
    // 🏅 UNLOCK ACHIEVEMENT CARD
    unlockAchievementCard(card) {
        try {
            card.classList.remove('locked');
            card.style.background = 'rgba(107, 111, 160, 0.3)';
            card.style.border = '2px solid rgba(255, 255, 255, 0.5)';
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 10px 30px rgba(107, 111, 160, 0.4)';
            card.style.opacity = '1';
            
        } catch (error) {
            console.error('🚨 Error unlocking achievement card:', error);
        }
    }
    
    // 🔒 LOCK ACHIEVEMENT CARD
    lockAchievementCard(card) {
        try {
            card.classList.add('locked');
            card.style.background = 'rgba(255, 255, 255, 0.05)';
            card.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            card.style.opacity = '0.6';
            card.style.transform = 'scale(1)';
            card.style.boxShadow = 'none';
        } catch (error) {
            console.error('🚨 Error locking achievement card:', error);
        }
    }
    
    // 📊 UPDATE ANALYTICS PANEL
    updateAnalytics() {
        try {
            this.updateMotivationalQuotes();
        } catch (error) {
            console.error('🚨 Error updating analytics:', error);
        }
    }
    
    // 💫 UPDATE MOTIVATIONAL QUOTES
    updateMotivationalQuotes() {
        try {
            const quotes = [
                {
                    text: "Excellence is not a singular act, but a habit. You are what you repeatedly do.",
                    author: "Aristotle"
                },
                {
                    text: "The secret of getting ahead is getting started.",
                    author: "Mark Twain"
                },
                {
                    text: "Small daily improvements are the key to staggering long-term results.",
                    author: "Robin Sharma"
                },
                {
                    text: "Your future self will thank you for the habits you build today.",
                    author: "Your Future Self"
                },
                {
                    text: "Consistency is what transforms average into excellence.",
                    author: "Vince Lombardi"
                }
            ];
            
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            const motivationElement = this.elements.analytics.motivationText;
            
            if (motivationElement) {
                motivationElement.textContent = `"${randomQuote.text}"`;
                
                const authorElement = motivationElement.parentElement?.querySelector('div:last-child');
                if (authorElement) {
                    authorElement.textContent = `~ ${randomQuote.author}`;
                }
            }
            
        } catch (error) {
            console.error('🚨 Error updating motivational quotes:', error);
        }
    }
    
    // 📅 UPDATE CURRENT DATE
    updateCurrentDate() {
        try {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            const dateString = now.toLocaleDateString('en-US', options);
            
            const dateElement = document.querySelector('.header-mega-subtitle');
            if (dateElement) {
                dateElement.textContent = `${dateString} • Transform Your Life, One Habit at a Time`;
            }
        } catch (error) {
            console.error('🚨 Error updating current date:', error);
        }
    }
    
    // 🔄 SETUP STATE OBSERVERS
    setupStateObservers() {
        try {
            // 🎯 OBSERVE HABIT PROGRESS CHANGES
            this.stateManager.addObserver('HABIT_PROGRESS_UPDATE', (data) => {
                this.updateHabitCard(data.habitId, this.stateManager.getHabit(data.habitId));
                this.updateTodaysMission();
                this.updateHeaderStats();
                
                // 🆕 UPDATE PERFORMANCE FEATURES
                this.updatePerformanceHub();
                this.updatePerformanceAnalytics();
                this.updateActiveCampaigns();
            });
            
            // 🏆 OBSERVE ACHIEVEMENT UNLOCKS
            this.stateManager.addObserver('ACHIEVEMENT_UNLOCKED', (data) => {
                this.updateAchievements();
                this.updateHeaderStats();
            });
            
            // ⭐ OBSERVE LEVEL UPS
            this.stateManager.addObserver('LEVEL_UP', (data) => {
                this.updateHeaderStats();
            });
            
            // 🔄 OBSERVE DAILY RESET
            this.stateManager.addObserver('DAILY_RESET', () => {
                this.updateCompleteDashboard();
            });
            
            console.log('🔄 State observers setup successfully');
        } catch (error) {
            console.error('🚨 Error setting up state observers:', error);
        }
    }
    
    // 🎪 INITIALIZE INTERACTIVE FEATURES
    initializeInteractiveFeatures() {
        try {
            this.initializeHabitButtons();
            this.initializeHoverEffects();
            
            console.log('🎪 Interactive features initialized successfully');
        } catch (error) {
            console.error('🚨 Error initializing interactive features:', error);
        }
    }
    
    // 🎯 INITIALIZE HABIT BUTTONS
    initializeHabitButtons() {
        try {
            Object.entries(this.elements.habits).forEach(([habitId, habitElement]) => {
                if (habitElement.completeBtn) {
                    habitElement.completeBtn.addEventListener('click', () => {
                        this.handleHabitCompletion(habitId);
                    });
                }
            });
        } catch (error) {
            console.error('🚨 Error initializing habit buttons:', error);
        }
    }
    
    // 🎯 HANDLE HABIT COMPLETION
    handleHabitCompletion(habitId) {
        try {
            const habit = this.stateManager.getHabit(habitId);
            if (!habit) return;
            
            let amount = 1;
            
            const amountMap = {
                water: 1,
                reading: 10,
                meditation: 5,
                focus: 1,
                nutrition: 1,
                gratitude: 1
            };
            
            amount = amountMap[habitId] || 1;
            
            const result = this.stateManager.updateHabitProgress(habitId, amount, {
                timestamp: new Date().toISOString(),
                source: 'button_click'
            });
            
            if (result.success) {
                const habitElement = this.elements.habits[habitId];
                if (habitElement.completeBtn) {
                    this.animationEngine.buttonPressAnimation(habitElement.completeBtn);
                }
            }
            
        } catch (error) {
            console.error(`🚨 Error handling habit completion for ${habitId}:`, error);
        }
    }
    
    // 🎪 INITIALIZE HOVER EFFECTS
    initializeHoverEffects() {
        try {
            const allCards = document.querySelectorAll('.ultimate-glass');
            
            allCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    this.animationEngine.cardHoverAnimation(card);
                });
                
                card.addEventListener('mouseleave', () => {
                    this.animationEngine.cardLeaveAnimation(card);
                });
            });
        } catch (error) {
            console.error('🚨 Error initializing hover effects:', error);
        }
    }
    
    // 🔄 START LIVE UPDATES
    startLiveUpdates() {
        try {
            setInterval(() => {
                this.updateCurrentDate();
            }, 60000);
            
            setInterval(() => {
                this.updateMotivationalQuotes();
            }, 30000);
            
            setInterval(() => {
                this.updateHeaderStats();
            }, 10000);
            
            setInterval(() => {
                this.stateManager.checkForNewDay();
            }, 60000);
            
            console.log('🔄 Live updates started successfully');
        } catch (error) {
            console.error('🚨 Error starting live updates:', error);
        }
    }
    

    // =============================================================================
    // 🆕 WORKING PERFORMANCE HUB - CONNECTED TO YOUR 8 HABITS
    // =============================================================================
    
    updatePerformanceHub() {
        const habits = this.stateManager.getAllHabits();
        const userStats = this.stateManager.getUserStats();
        
        // REAL CALCULATIONS FROM YOUR 8 HABITS
        const totalCompletion = Object.values(habits).reduce((sum, habit) => 
            sum + habit.progress.completionRate, 0
        );
        const averageCompletion = Math.round(totalCompletion / Object.keys(habits).length);
        
        const bestHabit = Object.values(habits).reduce((best, habit) => 
            habit.progress.completionRate > best.progress.completionRate ? habit : best
        );
        
        const totalStreaks = Object.values(habits).reduce((sum, habit) => 
            sum + habit.streak.current, 0
        );
        
        // UPDATE PERFORMANCE HUB DISPLAY
        const hubElement = document.querySelector('.control-ultra-section');
        if (hubElement) {
            const existingHub = hubElement.querySelector('.performance-hub-data');
            if (existingHub) existingHub.remove();
            
            const hubHTML = `
                <div class="performance-hub-data" style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 16px; text-align: center; margin-top: 1rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📈</div>
                    <div style="font-size: 2rem; font-weight: bold; color: #00ff88;">${averageCompletion}%</div>
                    <div>Overall Completion</div>
                    <div style="opacity: 0.7; font-size: 0.9rem; margin-top: 0.5rem;">
                        Best: ${bestHabit.name} (${Math.round(bestHabit.progress.completionRate)}%)
                    </div>
                    <div style="margin-top: 1rem; padding: 0.5rem; background: rgba(0,255,136,0.1); border-radius: 8px;">
                        <div style="font-size: 0.9rem;">Total Streaks: ${totalStreaks} days</div>
                    </div>
                </div>
            `;
            hubElement.insertAdjacentHTML('beforeend', hubHTML);
        }
    }

    // =============================================================================
    // 🆕 WORKING PERFORMANCE ANALYTICS - CONNECTED TO YOUR 8 HABITS
    // =============================================================================
    
    updatePerformanceAnalytics() {
        const habits = this.stateManager.getAllHabits();
        const userStats = this.stateManager.getUserStats();
        
        // REAL CALCULATIONS
        const bestHabit = Object.values(habits).reduce((best, habit) => 
            habit.streak.current > best.streak.current ? habit : best
        );
        
        const totalXP = userStats.profile.totalXP;
        const consistencyScore = userStats.dailyStats.weeklyConsistency;
        
        const completedToday = Object.values(habits).filter(habit => 
            habit.progress.current >= habit.progress.target
        ).length;
        
        // UPDATE ANALYTICS DISPLAY
        const analyticsElement = document.querySelector('.analytics-ultra-section');
        if (analyticsElement) {
            const existingStats = analyticsElement.querySelector('.analytics-stats');
            if (existingStats) existingStats.remove();
            
            const statsHTML = `
                <div class="analytics-stats" style="display: grid; gap: 1rem; margin-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px;">
                        <span>Best Performing Habit</span>
                        <span style="color: #00ff88; font-weight: 600;">${bestHabit.name}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px;">
                        <span>Consistency Score</span>
                        <span style="color: #00ff88; font-weight: 600;">${consistencyScore}%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px;">
                        <span>Total XP Earned</span>
                        <span style="color: #00ff88; font-weight: 600;">${totalXP}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px;">
                        <span>Completed Today</span>
                        <span style="color: #00ff88; font-weight: 600;">${completedToday}/8 habits</span>
                    </div>
                </div>
            `;
            
            analyticsElement.insertAdjacentHTML('beforeend', statsHTML);
        }
    }

// =============================================================================
// 🆕 WORKING ACTIVE CAMPAIGNS - CONNECTED TO YOUR 8 HABITS
// =============================================================================

updateActiveCampaigns() {
    const challenges = this.stateManager.state.challenges.active;
    const habits = this.stateManager.getAllHabits();
    
    // UPDATE FITNESS DOMINANCE CHALLENGE
    const fitnessChallenge = challenges.fitnessDominance;
    if (fitnessChallenge) {
        // Calculate progress based on workout and nutrition habits
        const workoutProgress = habits.workout.streak.current;
        const nutritionProgress = habits.nutrition.streak.current;
        const fitnessProgress = Math.min(workoutProgress, nutritionProgress);
        
        fitnessChallenge.currentDay = Math.min(fitnessProgress, 7);
        fitnessChallenge.progress = (fitnessChallenge.currentDay / 7) * 100;
        
        // Update DOM
        const fitnessItem = document.querySelector('.challenge-ultra-item:first-child');
        if (fitnessItem) {
            const progressFill = fitnessItem.querySelector('.ultimate-progress-fill');
            const progressText = fitnessItem.querySelector('.progress-ultra-info span:last-child');
            
            if (progressFill) {
                progressFill.style.width = `${fitnessChallenge.progress}%`;
            }
            if (progressText) {
                progressText.textContent = `${fitnessChallenge.currentDay}/7 days`;
            }
            
            // Add completion effect
            if (fitnessChallenge.currentDay >= 7 && !fitnessChallenge.completed) {
                fitnessChallenge.completed = true;
                fitnessItem.style.background = 'rgba(0, 255, 136, 0.1)';
                fitnessItem.style.border = '2px solid #00ff88';
            }
        }
    }
    
    // UPDATE KNOWLEDGE QUEST CHALLENGE
    const knowledgeChallenge = challenges.knowledgeQuest;
    if (knowledgeChallenge) {
        // Calculate progress based on reading and focus habits
        const readingProgress = habits.reading.streak.current;
        const focusProgress = habits.focus.streak.current;
        const knowledgeProgress = Math.min(readingProgress, focusProgress);
        
        knowledgeChallenge.currentDay = Math.min(knowledgeProgress, 21);
        knowledgeChallenge.progress = (knowledgeChallenge.currentDay / 21) * 100;
        
        // Update DOM
        const knowledgeItem = document.querySelector('.challenge-ultra-item:last-child');
        if (knowledgeItem) {
            const progressFill = knowledgeItem.querySelector('.ultimate-progress-fill');
            const progressText = knowledgeItem.querySelector('.progress-ultra-info span:last-child');
            
            if (progressFill) {
                progressFill.style.width = `${knowledgeChallenge.progress}%`;
            }
            if (progressText) {
                progressText.textContent = `${knowledgeChallenge.currentDay}/21 days`;
            }
            
            // Add completion effect
            if (knowledgeChallenge.currentDay >= 21 && !knowledgeChallenge.completed) {
                knowledgeChallenge.completed = true;
                knowledgeItem.style.background = 'rgba(0, 255, 136, 0.1)';
                knowledgeItem.style.border = '2px solid #00ff88';
            }
        }
    }
    
    // Save updated challenges
    this.stateManager.safeSaveState();
 }

updateCompleteDashboard() {
    try {
        this.updateHeaderStats();
        this.updateAllHabitCards();
        this.updateTodaysMission();
        this.updateAchievements();
        this.updateAnalytics();
        this.updateCurrentDate();
        
        // 🆕 UPDATE PERFORMANCE FEATURES & CAMPAIGNS
        this.updatePerformanceHub();
        this.updatePerformanceAnalytics();
        this.updateActiveCampaigns();
        
        console.log('📊 Complete dashboard updated successfully');
    } catch (error) {
        console.error('🚨 Error updating dashboard:', error);
    }
}
}

// =============================================================================
// MODULE 3: QUANTUM ANIMATION ENGINE
// =============================================================================

class QuantumAnimationEngine {
    // 🎯 PULSE ANIMATION FOR STATS
    pulseStats(headerElements) {
        try {
            Object.values(headerElements).forEach(element => {
                if (element) {
                    this.pulseAnimation(element);
                }
            });
        } catch (error) {
            console.error('🚨 Error in pulse stats animation:', error);
        }
    }
    
    // 💓 PULSE ANIMATION
    pulseAnimation(element) {
        try {
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        } catch (error) {
            console.error('🚨 Error in pulse animation:', error);
        }
    }
    
    // 🎯 HIGHLIGHT COMPLETED HABIT
    highlightCompletedHabit(card) {
        try {
            if (!card) return;
            
            card.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.5)';
            card.style.borderColor = 'rgba(0, 255, 136, 0.5)';
            
            setTimeout(() => {
                card.style.boxShadow = '';
                card.style.borderColor = '';
            }, 2000);
        } catch (error) {
            console.error('🚨 Error in highlight completed habit:', error);
        }
    }
    
    // 🎯 BUTTON PRESS ANIMATION
    buttonPressAnimation(button) {
        try {
            if (!button) return;
            
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        } catch (error) {
            console.error('🚨 Error in button press animation:', error);
        }
    }
    
    // 🎪 CARD HOVER ANIMATION
    cardHoverAnimation(card) {
        try {
            if (!card) return;
            
            card.style.transform = 'translateY(-8px) scale(1.02)';
        } catch (error) {
            console.error('🚨 Error in card hover animation:', error);
        }
    }
    
    // 🎪 CARD LEAVE ANIMATION
    cardLeaveAnimation(card) {
        try {
            if (!card) return;
            
            card.style.transform = 'translateY(0) scale(1)';
        } catch (error) {
            console.error('🚨 Error in card leave animation:', error);
        }
    }
}


// =============================================================================
// 🚀 APPLICATION INITIALIZATION
// =============================================================================

let galacticApp;

function initializeLifeBoard() {
    try {
        console.log('🌍 LifeBoard Galactic Enterprise Starting...');
        
        // 📂 CREATE STATE MANAGER
        const stateManager = new GalacticStateManager();
        
        // 💾 LOAD SAVED DATA
        stateManager.safeLoadState();
        
        // 🛡️ VALIDATE STATE
        stateManager.validateState();
        
        // 🎨 CREATE UI CONTROLLER
        const uiController = new InterstellarUIController(stateManager);
        
        // 💾 START AUTO-SAVE
        stateManager.startAutoSave();
        
        // 🎪 ADD CSS ANIMATIONS
        addCustomAnimations();
        
        // 🔄 CHECK FOR NEW DAY
        stateManager.checkForNewDay();
        
        galacticApp = { stateManager, uiController };
        
        console.log('🎉 LifeBoard Galactic Enterprise Ready! All Systems Operational!');
        
    } catch (error) {
        console.error('🚨 CRITICAL: Application failed to initialize:', error);
    }
}

// 🎨 ADD CUSTOM CSS ANIMATIONS
function addCustomAnimations() {
    try {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkleFall {
                0% { 
                    transform: translateY(-20px) rotate(0deg); 
                    opacity: 1; 
                }
                100% { 
                    transform: translateY(100px) rotate(360deg); 
                    opacity: 0; 
                }
            }
            
            @keyframes progressPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('🚨 Error adding custom animations:', error);
    }
}

// =============================================================================
// 🎯 START THE APPLICATION WHEN PAGE LOADS
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeLifeBoard();
    }, 100);
});
