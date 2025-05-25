# 📚 Malleability Study Dashboard

A beautiful, minimalistic study dashboard with task management, XP tracking, motivational quotes, and comprehensive subject resources. Built with vanilla HTML, CSS, and JavaScript for optimal performance and scalability. Now powered by Node.js and SQLite for scalable data management.

## ✨ Features

### 🏠 Dashboard Home
- **Task Management**: Daily task tracking with calendar integration
- **XP System**: Progressive leveling system with activity rewards (100 XP → Level 2, 200 XP → Level 3, etc.)
- **Calendar Widget**: Visual calendar with task indicators
- **Motivational Quotes**: Custom quote management system with add/delete functionality
- **Pastel Design**: Beautiful glass-morphism interface with rounded edges

### 📖 Comprehensive Subject Learning
- **10 Academic Subjects**: Biology, Chemistry, Physics, Mathematics, Latin, Music Theory, Psychology, Politics, Programming
- **Hierarchical Topic Structure**: Each subject broken down into categories and individual topics
- **100+ Detailed Topic Pages**: In-depth content with multiple sections, examples, and visual aids
- **Interactive Quizzes**: Topic-specific practice quizzes with XP rewards
- **Beautiful Styling**: Subject-specific color coding with hover effects

### 🧪 Advanced Topic System

#### **Biology** 🧬
- **Cell Biology**: Cell Structure, Cell Division, Cellular Respiration ✅
- **Genetics**: DNA Structure ✅, Protein Synthesis, Heredity
- **Evolution**: Natural Selection, Speciation, Phylogeny
- **Ecology**: Ecosystems, Food Chains, Populations

#### **Chemistry** ⚗️
- **Atomic Structure**: Atomic Theory ✅, Electron Configuration, Periodic Trends
- **Chemical Bonding**: Ionic Bonding ✅, Covalent Bonding, Molecular Geometry
- **Reactions**: Reaction Types, Stoichiometry, Kinetics

#### **Physics** ⚛️
- **Mechanics**: Newton's Laws ✅, Energy Conservation, Momentum
- **Thermodynamics**: Heat Transfer, Gas Laws, Entropy
- **Electricity**: Electric Fields, Circuits, Magnetism
- **Waves**: Wave Properties, Sound Waves, Electromagnetic Radiation

#### **Mathematics** 🔢
- **Algebra**: Linear Equations ✅, Quadratic Equations, Polynomials
- **Calculus**: Limits, Derivatives ✅, Integrals
- **Geometry**: Euclidean Geometry, Trigonometry, Coordinate Geometry
- **Statistics**: Descriptive Statistics, Probability, Hypothesis Testing

#### **Latin** 🏛️
- **Grammar**: Noun Declensions ✅, Verb Conjugations, Syntax
- **Vocabulary**: Basic Words, Verb Families, Thematic Vocabulary
- **Literature**: Caesar, Cicero, Vergil
- **Culture**: Roman History, Daily Life, Mythology

#### **Music Theory** 🎵
- **Fundamentals**: Major Scales ✅, Minor Scales, Intervals
- **Harmony**: Triads, Seventh Chords, Chord Progressions
- **Composition**: Voice Leading, Counterpoint, Form Analysis
- **Analysis**: Harmonic Analysis, Phrase Structure, Musical Styles

#### **Psychology** 🧠
- **Cognitive**: Memory Processes ✅, Attention & Perception, Problem Solving
- **Behavioral**: Classical Conditioning, Operant Conditioning, Behavior Modification
- **Developmental**: Child Development, Adolescent Psychology, Adult Development
- **Social**: Social Influence, Group Dynamics, Interpersonal Relationships

#### **Politics** 🏛️
- **Political Theory**: Democratic Theory ✅, Political Authority, Justice & Equality
- **Comparative Politics**: Electoral Systems, Political Parties, Federalism
- **International Relations**: Realism & Liberalism, International Law, Global Governance
- **Public Policy**: Policy Making, Policy Analysis, Implementation

#### **Programming** 💻
- **Fundamentals**: Variables & Data Types ✅, Control Structures, Functions
- **OOP**: Classes & Objects ✅, Inheritance, Polymorphism
- **Data Structures**: Arrays & Lists, Stacks & Queues, Trees & Graphs
- **Web Development**: HTML & CSS, JavaScript, Frameworks

### 🔧 Technical Features
- **Organized File Structure**: Separate CSS and JS modules for maintainability
- **Profile System**: Google authentication with demo mode
- **Local Storage**: Persistent data for tasks, XP, and quotes
- **Responsive Design**: Mobile-friendly with beautiful animations
- **Quiz System**: Interactive assessments with immediate feedback

## 🗂️ Project Structure

```
/
├── index.html                 # Main dashboard
├── css/
│   ├── main.css              # Core styles, sidebar, forms
│   ├── subjects.css          # Subject page styling
│   └── profile.css           # Profile page styling
├── js/
│   ├── main.js               # Core functionality
│   ├── auth.js               # Authentication system
│   └── quiz.js               # Quiz functionality
├── pages/
│   ├── profile.html          # User profile page
│   ├── [subject].html        # Main subject pages (10 subjects)
│   └── [subject]/
│       └── [category]/
│           └── [topic].html  # Individual topic pages (100+ topics)
└── README.md
```

## 🚀 Setup & Usage

### **Quick Start**
1. Clone or download the repository
2. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser
4. Try the demo account or set up Google authentication

### **Google Authentication Setup** (Optional)
1. Create a Google Cloud Console project
2. Enable Google Sign-In API
3. Get your client ID
4. Update `pages/profile.html` with your client ID:
   ```html
   <meta name="google-signin-client_id" content="your-client-id.googleusercontent.com">
   ```

### **Demo Mode**
- Click "Try Demo Account" on the profile page
- Explore all features without authentication
- Perfect for testing and development

## 🎨 Design Philosophy

### **Minimalistic Interface**
- Clean, distraction-free design
- Pastel color scheme with glass-morphism effects
- Each subject has unique color coding for easy navigation

### **Progressive Learning**
- Hierarchical content structure: Subject → Category → Topic
- Comprehensive coverage with detailed explanations
- Interactive quizzes reinforce learning with XP rewards

### **Responsive & Accessible**
- Mobile-friendly responsive design
- Intuitive navigation with breadcrumbs
- Clear visual feedback for all interactions

## 📊 Progress Tracking

### **XP System**
- Progressive leveling: Level 1→2 (100 XP), Level 2→3 (200 XP), etc.
- Earn XP from daily activities and quiz completion
- Visual progress bars show advancement

### **Task Management**
- Calendar integration with daily task tracking
- Mark tasks complete for XP rewards
- Persistent storage maintains progress

## 🛠️ Development

### **Adding New Topics**
1. Create HTML file in appropriate subject/category folder
2. Follow the established template structure
3. Include comprehensive content sections
4. Add interactive quiz with 3+ questions
5. Update navigation links

### **Customization**
- Modify CSS variables for color schemes
- Add new subjects by extending the sidebar structure
- Customize XP rewards and leveling progression

## 📝 Features in Development
- **Enhanced Quiz System**: More question types and difficulty levels
- **Study Streak Tracking**: Daily study habit monitoring
- **Social Features**: Study groups and progress sharing
- **Advanced Analytics**: Detailed learning progress insights
- **Mobile App**: Native iOS/Android applications

## 📱 Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License
This project is open source and available under the MIT License.

---

**Current Status**: ✅ **Production Ready** with comprehensive topic breakdown and full functionality
- ✅ Complete dashboard with task management, XP system, quotes
- ✅ 10 detailed subject pages with hierarchical navigation
- ✅ 100+ individual topic pages with extensive content
- ✅ Interactive quiz system with XP integration
- ✅ Profile system with Google auth and demo mode
- ✅ Beautiful, responsive design with pastel themes

# Malleability Study Dashboard

A comprehensive educational platform with task management, XP tracking, and subject learning. Now powered by Node.js and SQLite for scalable data management.

## 🚀 Features

- **📚 Multi-Subject Learning**: Biology, Chemistry, Physics, Mathematics, Latin, Music Theory, Psychology, Politics, and Programming
- **✅ Task Management**: Create, update, and track study tasks with priorities and deadlines
- **🎯 XP & Leveling System**: Gamified learning with progressive XP requirements (100, 200, 300 XP per level)
- **💡 Motivational Quotes**: Inspirational quotes with add/delete functionality
- **📅 Calendar Integration**: Compact calendar view for task scheduling
- **🔍 Topic Breakdown**: Hierarchical organization with 4 categories per subject, 3 topics per category
- **🎨 Beautiful UI**: Glass-morphism design with subject-specific gradient colors
- **🗄️ Database Storage**: SQLite database for scalable data management
- **🌐 RESTful API**: Full API backend for data operations

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic structure with modern layouts
- **CSS3**: Glass-morphism effects, gradients, responsive design
- **JavaScript (ES6+)**: Modern async/await, modular architecture
- **Responsive Design**: Mobile-friendly interface

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **SQLite**: Lightweight database
- **RESTful API**: Clean API endpoints

## 📁 Project Structure

```
malleability-dashboard/
├── 📄 server.js              # Main Express server
├── 📄 package.json           # Node.js dependencies
├── 📁 database/              # Database files
│   ├── 📄 schema.sql         # Database schema
│   ├── 📄 init.js            # Database initialization
│   ├── 📄 seed.js            # Sample data seeding
│   └── 📄 malleability.db    # SQLite database (created after setup)
├── 📁 css/                   # Stylesheets
│   ├── 📄 main.css           # Core styles & homepage
│   ├── 📄 subjects.css       # Subject pages styling
│   └── 📄 profile.css        # Profile page styling
├── 📁 js/                    # JavaScript modules
│   ├── 📄 main.js            # Core app with API integration
│   ├── 📄 auth.js            # Authentication handling
│   └── 📄 quiz.js            # Quiz functionality
├── 📁 pages/                 # HTML pages
│   ├── 📄 [subject].html     # 10 main subject pages
│   ├── 📄 profile.html       # User profile & settings
│   └── 📁 [subject]/         # Detailed topic pages
│       └── 📁 [category]/
│           └── 📄 [topic].html
└── 📄 index.html             # Main dashboard page
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize the database**:
   ```bash
   npm run init-db
   ```

4. **Seed the database** with sample data:
   ```bash
   npm run seed-db
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

6. **Open your browser** and go to `http://localhost:3000`

### Development Mode

For development with auto-restart:
```bash
npm run dev
```

## 🗄️ Database Schema

The SQLite database includes the following tables:

- **users**: User profiles with XP and level tracking
- **subjects**: Subject information (Biology, Chemistry, etc.)
- **topics**: Learning topics organized by subject and category
- **topic_pages**: Detailed content for each topic
- **topic_quizzes**: Quiz questions for topics
- **tasks**: User tasks with priorities and deadlines
- **quotes**: Motivational quotes system
- **user_progress**: Progress tracking for completed topics

## 🌐 API Endpoints

### Users
- `GET /api/user` - Get current user data
- `PUT /api/user/progress` - Update user XP and level

### Subjects & Topics
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id/topics` - Get topics for a subject

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Quotes
- `GET /api/quotes` - Get active quotes
- `POST /api/quotes` - Add new quote
- `DELETE /api/quotes/:id` - Delete quote

## 📚 Subject Coverage

### Implemented Subjects (with detailed topic pages):
- **🧬 Biology**: Cell Biology, Genetics, Evolution, Ecology
- **⚗️ Chemistry**: Atomic Structure, Chemical Bonding, Reactions
- **⚛️ Physics**: Mechanics, Thermodynamics, Electricity & Magnetism, Waves
- **🔢 Mathematics**: Algebra, Calculus, Geometry, Statistics
- **🏛️ Latin**: Grammar, Vocabulary, Literature, Roman Culture
- **🎵 Music Theory**: Fundamentals, Harmony, Composition, Analysis
- **🧠 Psychology**: Cognitive, Behavioral, Developmental, Social
- **🏛️ Politics**: Political Theory, Comparative Politics, International Relations, Political Economy
- **💻 Programming**: Data Structures, OOP, Algorithms, Web Development

### Each Subject Features:
- ✅ **4 main categories** with 3 topics each
- ✅ **Comprehensive topic pages** with detailed content
- ✅ **Interactive quizzes** for knowledge testing
- ✅ **Learning resources** (textbooks, videos, tools, apps)
- ✅ **Practice exams** with multiple difficulty levels
- ✅ **Beautiful visual design** with subject-specific styling

## 🎯 XP & Leveling System

- **Level 1**: 0-99 XP
- **Level 2**: 100-299 XP  
- **Level 3**: 300-599 XP
- **Level 4**: 600-999 XP
- And so on with progressive requirements...

### XP Sources:
- Completing topics: 25 XP
- Finishing quizzes: 15 XP
- Daily login bonus: 5 XP
- Completing tasks: 10 XP

## 🎨 Design Features

- **Glass-morphism Effects**: Modern translucent design
- **Subject-Specific Colors**: Each subject has unique gradients
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects and transitions
- **Dark/Light Themes**: Automatic theme adaptation
- **Compact Calendar**: Space-efficient task scheduling

## 🔧 Configuration

### Database
- SQLite database is stored in `database/malleability.db`
- Schema is defined in `database/schema.sql`
- Sample data in `database/seed.js`

### Server
- Default port: 3000
- Can be changed via `PORT` environment variable

## 📈 Future Enhancements

- [ ] User authentication with Google OAuth
- [ ] Real-time progress synchronization
- [ ] Advanced quiz analytics
- [ ] Study streaks and achievements
- [ ] Collaborative study features
- [ ] Mobile app version
- [ ] Offline mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. **Check the console** for error messages
2. **Ensure database is initialized**: `npm run init-db`
3. **Verify Node.js version**: Should be v14+
4. **Check if port 3000 is available**

For additional help, please create an issue in the repository.

---

**Status**: ✅ Production Ready with Database Integration  
**Version**: 2.0.0  
**Last Updated**: December 2024 