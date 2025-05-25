require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Database connection
const dbPath = path.join(__dirname, 'database', 'malleability.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// API Routes

// Get all subjects
app.get('/api/subjects', (req, res) => {
    db.all('SELECT * FROM subjects ORDER BY name', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ subjects: rows });
    });
});

// Get topics by subject
app.get('/api/subjects/:id/topics', (req, res) => {
    const subjectId = req.params.id;
    db.all('SELECT * FROM topics WHERE subject_id = ? ORDER BY order_index', [subjectId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ topics: rows });
    });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks ORDER BY due_date', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ tasks: rows });
    });
});

// Add new task
app.post('/api/tasks', (req, res) => {
    const { title, description, due_date, priority, subject_id } = req.body;
    const user_id = 1; // Default user for now
    
    db.run(
        'INSERT INTO tasks (user_id, title, description, due_date, priority, subject_id) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, title, description, due_date, priority, subject_id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Task created successfully' });
        }
    );
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const { title, description, due_date, priority, completed, subject_id } = req.body;
    const taskId = req.params.id;
    
    db.run(
        'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, completed = ?, subject_id = ? WHERE id = ?',
        [title, description, due_date, priority, completed, subject_id, taskId],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Task updated successfully' });
        }
    );
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    
    db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Get all quotes
app.get('/api/quotes', (req, res) => {
    db.all('SELECT * FROM quotes WHERE is_active = 1', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ quotes: rows });
    });
});

// Add new quote
app.post('/api/quotes', (req, res) => {
    const { text, author, category } = req.body;
    
    db.run(
        'INSERT INTO quotes (text, author, category) VALUES (?, ?, ?)',
        [text, author, category],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Quote added successfully' });
        }
    );
});

// Delete quote
app.delete('/api/quotes/:id', (req, res) => {
    const quoteId = req.params.id;
    
    db.run('UPDATE quotes SET is_active = 0 WHERE id = ?', [quoteId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Quote deleted successfully' });
    });
});

// Quiz API endpoints
// Get quizzes for a subject (subject-level quizzes)
app.get('/api/subjects/:subjectId/quizzes', (req, res) => {
    const subjectId = req.params.subjectId;
    
    db.all(
        'SELECT * FROM quizzes WHERE subject_id = ? AND topic_id IS NULL ORDER BY order_index',
        [subjectId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Parse options JSON for each quiz
            const quizzes = rows.map(quiz => ({
                ...quiz,
                options: JSON.parse(quiz.options)
            }));
            
            res.json({ quizzes });
        }
    );
});

// Get quizzes for a topic (topic-level quizzes)
app.get('/api/topics/:topicId/quizzes', (req, res) => {
    const topicId = req.params.topicId;
    
    db.all(
        'SELECT * FROM quizzes WHERE topic_id = ? ORDER BY order_index',
        [topicId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Parse options JSON for each quiz
            const quizzes = rows.map(quiz => ({
                ...quiz,
                options: JSON.parse(quiz.options)
            }));
            
            res.json({ quizzes });
        }
    );
});

// Get all quizzes (for admin/testing purposes)
app.get('/api/quizzes', (req, res) => {
    db.all('SELECT * FROM quizzes ORDER BY subject_id, topic_id, order_index', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Parse options JSON for each quiz
        const quizzes = rows.map(quiz => ({
            ...quiz,
            options: JSON.parse(quiz.options)
        }));
        
        res.json({ quizzes });
    });
});

// Add new quiz
app.post('/api/quizzes', (req, res) => {
    const { subject_id, topic_id, question, options, correct_answer, explanation, order_index } = req.body;
    
    // Validate required fields
    if (!question || !options || correct_answer === undefined) {
        return res.status(400).json({ error: 'Question, options, and correct_answer are required' });
    }
    
    // Ensure either subject_id or topic_id is provided
    if (!subject_id && !topic_id) {
        return res.status(400).json({ error: 'Either subject_id or topic_id must be provided' });
    }
    
    const optionsJson = JSON.stringify(options);
    
    db.run(
        'INSERT INTO quizzes (subject_id, topic_id, question, options, correct_answer, explanation, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [subject_id, topic_id, question, optionsJson, correct_answer, explanation, order_index || 0],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Quiz added successfully' });
        }
    );
});

// Update quiz
app.put('/api/quizzes/:id', (req, res) => {
    const quizId = req.params.id;
    const { question, options, correct_answer, explanation, order_index } = req.body;
    
    const optionsJson = options ? JSON.stringify(options) : undefined;
    
    // Build dynamic query based on provided fields
    const updates = [];
    const values = [];
    
    if (question !== undefined) {
        updates.push('question = ?');
        values.push(question);
    }
    if (options !== undefined) {
        updates.push('options = ?');
        values.push(optionsJson);
    }
    if (correct_answer !== undefined) {
        updates.push('correct_answer = ?');
        values.push(correct_answer);
    }
    if (explanation !== undefined) {
        updates.push('explanation = ?');
        values.push(explanation);
    }
    if (order_index !== undefined) {
        updates.push('order_index = ?');
        values.push(order_index);
    }
    
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(quizId);
    
    db.run(
        `UPDATE quizzes SET ${updates.join(', ')} WHERE id = ?`,
        values,
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Quiz updated successfully' });
        }
    );
});

// Delete quiz
app.delete('/api/quizzes/:id', (req, res) => {
    const quizId = req.params.id;
    
    db.run('DELETE FROM quizzes WHERE id = ?', [quizId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Quiz deleted successfully' });
    });
});

// Get user info
app.get('/api/user', (req, res) => {
    const query = 'SELECT * FROM users ORDER BY id LIMIT 1';
    
    db.get(query, (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }
        
        // If no user exists, create a default one
        if (!user) {
            const createUserQuery = `
                INSERT INTO users (name, email, xp, level, created_at) 
                VALUES (?, ?, ?, ?, datetime('now'))
            `;
            
            db.run(createUserQuery, ['Student', 'student@malleability.com', 0, 1], function(err) {
                if (err) {
                    console.error('Error creating default user:', err);
                    return res.status(500).json({ error: 'Failed to create user' });
                }
                
                // Return the newly created user
                const newUser = {
                    id: this.lastID,
                    name: 'Student',
                    email: 'student@malleability.com',
                    xp: 0,
                    level: 1,
                    created_at: new Date().toISOString()
                };
                
                res.json({ user: newUser });
            });
        } else {
            res.json({ user });
        }
    });
});

// Update user progress
app.put('/api/user/progress', (req, res) => {
    const { xp_gained } = req.body;
    
    if (typeof xp_gained !== 'number') {
        return res.status(400).json({ error: 'xp_gained must be a number' });
    }
    
    // First, get current user or create one
    const getUserQuery = 'SELECT * FROM users ORDER BY id LIMIT 1';
    
    db.get(getUserQuery, (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }
        
        // If no user exists, create a default one first
        if (!user) {
            const createUserQuery = `
                INSERT INTO users (name, email, xp, level, created_at) 
                VALUES (?, ?, ?, ?, datetime('now'))
            `;
            
            db.run(createUserQuery, ['Student', 'student@malleability.com', Math.max(0, xp_gained), 1], function(err) {
                if (err) {
                    console.error('Error creating default user:', err);
                    return res.status(500).json({ error: 'Failed to create user' });
                }
                
                const newXP = Math.max(0, xp_gained);
                const newLevel = Math.floor(newXP / 100) + 1;
                
                // Update the user with correct level
                const updateQuery = 'UPDATE users SET xp = ?, level = ? WHERE id = ?';
                db.run(updateQuery, [newXP, newLevel, this.lastID], (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating new user level:', updateErr);
                        return res.status(500).json({ error: 'Failed to update user level' });
                    }
                    
                    res.json({
                        xp: newXP,
                        level: newLevel,
                        xp_gained: Math.max(0, xp_gained)
                    });
                });
            });
        } else {
            // Update existing user
            const newXP = Math.max(0, user.xp + xp_gained);
            const newLevel = Math.floor(newXP / 100) + 1;
            
            const updateQuery = 'UPDATE users SET xp = ?, level = ? WHERE id = ?';
            
            db.run(updateQuery, [newXP, newLevel, user.id], (err) => {
                if (err) {
                    console.error('Error updating user progress:', err);
                    return res.status(500).json({ error: 'Failed to update progress' });
                }
                
                res.json({
                    xp: newXP,
                    level: newLevel,
                    xp_gained: xp_gained
                });
            });
        }
    });
});

// Serve subject pages dynamically
app.get('/subject/:subjectId', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'subject.html'));
});

// Serve topic pages dynamically
app.get('/subject/:subjectId/topic/:topicId', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'topic.html'));
});

// Serve main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin panel
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve other specific HTML files if needed
app.get('/quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz.html'));
});

// Create new subject
app.post('/api/subjects', (req, res) => {
    const { name, emoji, description, color_scheme, content, resources } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Subject name is required' });
    }
    
    db.run(
        'INSERT INTO subjects (name, emoji, description, color_scheme, content, resources) VALUES (?, ?, ?, ?, ?, ?)',
        [name, emoji, description, color_scheme, content, resources],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Subject created successfully' });
        }
    );
});

// Update subject
app.put('/api/subjects/:id', (req, res) => {
    const subjectId = req.params.id;
    const { name, emoji, description, color_scheme, content, resources } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Subject name is required' });
    }
    
    db.run(
        'UPDATE subjects SET name = ?, emoji = ?, description = ?, color_scheme = ?, content = ?, resources = ? WHERE id = ?',
        [name, emoji, description, color_scheme, content, resources, subjectId],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Subject updated successfully' });
        }
    );
});

// Delete subject
app.delete('/api/subjects/:id', (req, res) => {
    const subjectId = req.params.id;
    
    db.run('DELETE FROM subjects WHERE id = ?', [subjectId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Subject deleted successfully' });
    });
});

// Create new topic
app.post('/api/topics', (req, res) => {
    const { subject_id, name, category, description, difficulty, duration, order_index, content, resources } = req.body;
    
    if (!subject_id || !name || !category) {
        return res.status(400).json({ error: 'Subject ID, name, and category are required' });
    }
    
    db.run(
        'INSERT INTO topics (subject_id, category, name, description, difficulty, duration, order_index, content, resources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [subject_id, category, name, description, difficulty, duration, order_index, content, resources],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Topic created successfully' });
        }
    );
});

// Update topic
app.put('/api/topics/:id', (req, res) => {
    const topicId = req.params.id;
    const { subject_id, name, category, description, difficulty, duration, order_index, content, resources } = req.body;
    
    if (!subject_id || !name || !category) {
        return res.status(400).json({ error: 'Subject ID, name, and category are required' });
    }
    
    db.run(
        'UPDATE topics SET subject_id = ?, category = ?, name = ?, description = ?, difficulty = ?, duration = ?, order_index = ?, content = ?, resources = ? WHERE id = ?',
        [subject_id, category, name, description, difficulty, duration, order_index, content, resources, topicId],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Topic updated successfully' });
        }
    );
});

// Delete topic
app.delete('/api/topics/:id', (req, res) => {
    const topicId = req.params.id;
    
    db.run('DELETE FROM topics WHERE id = ?', [topicId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Topic deleted successfully' });
    });
});

// AI Content Generation endpoint
app.post('/api/generate-content', async (req, res) => {
    try {
        const { prompt, type } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('Generating content with OpenAI...');
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages: [
                {
                    role: "system",
                    content: "You are an expert educational content creator specializing in creating comprehensive, well-structured learning materials. Generate content in clean HTML format using appropriate tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, etc. Make the content engaging, educational, and properly formatted for online learning. IMPORTANT: Return ONLY clean HTML content without any markdown code blocks, backticks, or ```html formatting. Do not wrap your response in code blocks - return the HTML directly as it should be inserted into a web page."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 3000,
            temperature: 0.7
        });

        let generatedContent = completion.choices[0].message.content;
        
        // Clean up any markdown code blocks that might have slipped through
        generatedContent = generatedContent
            .replace(/```html\s*/gi, '')  // Remove opening ```html
            .replace(/```\s*$/gm, '')     // Remove closing ```
            .replace(/^```.*$/gm, '')     // Remove any other code block markers
            .trim();
        
        res.json({ 
            content: generatedContent,
            usage: completion.usage
        });
        
    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        if (error.code === 'invalid_api_key') {
            return res.status(401).json({ error: 'Invalid OpenAI API key' });
        } else if (error.code === 'insufficient_quota') {
            return res.status(402).json({ error: 'OpenAI API quota exceeded' });
        } else {
            return res.status(500).json({ 
                error: 'Failed to generate content', 
                details: error.message 
            });
        }
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure to run "npm run init-db" and "npm run seed-db" first!');
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
}); 