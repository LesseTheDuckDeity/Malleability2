-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    profile_picture TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    emoji TEXT,
    description TEXT,
    color_scheme TEXT,
    content TEXT,
    resources TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    duration TEXT,
    order_index INTEGER DEFAULT 0,
    content TEXT,
    resources TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Topic pages table (for detailed content)
CREATE TABLE IF NOT EXISTS topic_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER NOT NULL,
    content TEXT,
    images TEXT, -- JSON array of image URLs
    breadcrumbs TEXT, -- JSON for navigation
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Topic quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER,
    subject_id INTEGER,
    question TEXT NOT NULL,
    options TEXT NOT NULL, -- JSON array of options
    correct_answer INTEGER NOT NULL, -- Index of correct option
    explanation TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    completed BOOLEAN DEFAULT FALSE,
    subject_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User progress table (for tracking completed topics, XP gains, etc.)
CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER,
    time_spent INTEGER, -- in minutes
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_topic_pages_topic_id ON topic_pages(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_quizzes_topic_id ON topic_quizzes(topic_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id); 