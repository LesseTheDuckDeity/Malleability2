# 📚 Malleability Study Dashboard

A beautiful, minimalistic study dashboard with task management, XP tracking, motivational quotes, and comprehensive subject resources. Built with vanilla HTML, CSS, and JavaScript for optimal performance and scalability.

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