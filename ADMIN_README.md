# Admin Panel - Malleability Dashboard

## Overview

The Admin Panel is a comprehensive web-based interface for managing the content of the Malleability study dashboard. It provides full CRUD (Create, Read, Update, Delete) operations for subjects, topics, and quizzes without requiring any external libraries or frameworks - built with vanilla HTML, CSS, and JavaScript.

## Features

### 📚 Subjects Management
- **Create** new subjects with custom emojis, descriptions, and color schemes
- **View** all subjects in a clean table format
- **Edit** existing subjects with pre-populated forms
- **Delete** subjects (with confirmation prompts)
- **Color schemes**: Blue, Green, Purple, Red, Orange, Teal

### 📖 Topics Management
- **Create** topics linked to specific subjects
- **Organize** topics by category and difficulty level
- **Set** duration estimates and order indices
- **Edit** all topic properties
- **Delete** topics (with confirmation prompts)
- **Difficulty levels**: Beginner, Intermediate, Advanced

### ❓ Quizzes Management
- **Create** quizzes at subject or topic level
- **Multiple choice** questions with 4 options
- **Set** correct answers and explanations
- **Order** quizzes with custom indices
- **Edit** all quiz properties
- **Delete** quizzes (with confirmation prompts)

## Access

### From Main Dashboard
- Click the "🛠️ Admin Panel" button in the sidebar footer
- Opens in a new tab for easy navigation

### Direct URL
- Navigate to `http://localhost:3000/admin.html`

## Interface

### Navigation Tabs
- **Subjects**: Manage all subjects
- **Topics**: Manage topics across all subjects
- **Quizzes**: Manage quizzes for subjects and topics

### Modal Forms
- Clean, responsive modal dialogs for all CRUD operations
- Form validation with required field indicators
- Real-time feedback with success/error messages

### Data Tables
- Sortable columns with relevant information
- Action buttons for Edit/Delete operations
- Empty state messages when no data exists
- Loading indicators during data fetching

## API Endpoints

### Subjects
- `GET /api/subjects` - List all subjects
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Topics
- `GET /api/subjects/:id/topics` - List topics for a subject
- `POST /api/topics` - Create new topic
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic

### Quizzes
- `GET /api/quizzes` - List all quizzes
- `GET /api/subjects/:id/quizzes` - List subject-level quizzes
- `GET /api/topics/:id/quizzes` - List topic-level quizzes
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

## Data Structure

### Subject
```json
{
  "name": "Biology",
  "emoji": "🧬",
  "description": "Study of living organisms",
  "color_scheme": "green"
}
```

### Topic
```json
{
  "subject_id": 1,
  "name": "Cell Biology",
  "category": "Fundamentals",
  "description": "Study of cellular structures",
  "difficulty": "Beginner",
  "duration": "30 min read",
  "order_index": 1
}
```

### Quiz
```json
{
  "subject_id": 1,
  "topic_id": null,
  "question": "What is the powerhouse of the cell?",
  "options": ["Nucleus", "Mitochondria", "Ribosome", "Golgi"],
  "correct_answer": 1,
  "explanation": "Mitochondria produce ATP energy",
  "order_index": 1
}
```

## Features

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly buttons and controls

### User Experience
- Intuitive navigation with clear visual hierarchy
- Confirmation dialogs for destructive actions
- Real-time validation and feedback
- Loading states and empty state handling

### Data Relationships
- Automatic population of subject dropdowns in topic/quiz forms
- Dynamic topic loading based on selected subject
- Relationship indicators (e.g., topic count per subject)

## Security Notes

- The admin panel is currently open access
- In production, implement authentication and authorization
- Consider rate limiting for API endpoints
- Validate all input data on both client and server side

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features used
- CSS Grid and Flexbox for layouts
- No external dependencies required

## Development

### No Build Process Required
- Pure HTML/CSS/JavaScript
- No compilation or bundling needed
- Direct file editing and refresh

### Code Organization
- Modular JavaScript functions
- Separated concerns (data loading, rendering, CRUD operations)
- Clean CSS with organized sections
- Semantic HTML structure

## Future Enhancements

- Bulk operations (import/export)
- Advanced filtering and search
- Drag-and-drop reordering
- Rich text editor for descriptions
- Image upload for subjects/topics
- Analytics and usage statistics
- User management and permissions 