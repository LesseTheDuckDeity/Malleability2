const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'malleability.db');

// Create or open database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to database for seeding.');
});

db.serialize(() => {
    // Clear existing data
    console.log('Clearing existing data...');
    db.run('DELETE FROM user_progress');
    db.run('DELETE FROM quizzes');
    db.run('DELETE FROM topic_pages');
    db.run('DELETE FROM topics');
    db.run('DELETE FROM tasks');
    db.run('DELETE FROM quotes');
    db.run('DELETE FROM subjects');
    db.run('DELETE FROM users');

    // Reset auto-increment counters
    console.log('Resetting auto-increment counters...');
    db.run('DELETE FROM sqlite_sequence WHERE name IN ("users", "subjects", "topics", "tasks", "quotes", "quizzes")');

    // Insert default user
    console.log('Inserting default user...');
    db.run(`INSERT INTO users (name, email, level, xp) VALUES ('Student', 'student@malleability.com', 1, 0)`);

    // Insert subjects
    console.log('Inserting subjects...');
    const biologyContent = `<h2>📖 Course Overview</h2><p>Biology is the scientific study of life and living organisms. This comprehensive course will take you through the fundamental concepts of biology, from the molecular level to entire ecosystems. You'll explore cellular processes, genetics, evolution, ecology, and the diversity of life on Earth.</p><h3>🎯 Learning Objectives</h3><ul><li>Understand the basic principles of cell biology and biochemistry</li><li>Explore genetic mechanisms and inheritance patterns</li><li>Learn about evolution and natural selection</li><li>Discover the diversity of life forms and their classifications</li><li>Study ecological relationships and environmental biology</li><li>Analyze human biology and physiology</li></ul><h3>🧬 Key Topics Covered</h3><ul><li><strong>Cell Biology:</strong> Cell structure, organelles, membrane transport, and cellular processes</li><li><strong>Genetics:</strong> DNA structure, gene expression, inheritance, and biotechnology</li><li><strong>Evolution:</strong> Natural selection, speciation, and phylogenetics</li><li><strong>Ecology:</strong> Ecosystems, population dynamics, and environmental interactions</li><li><strong>Human Biology:</strong> Anatomy, physiology, and health sciences</li></ul><h3>💡 Why Study Biology?</h3><p>Biology provides insights into how life works at every level, from molecules to ecosystems. It's essential for understanding medicine, environmental science, biotechnology, and our place in the natural world. This knowledge is crucial for addressing global challenges like climate change, disease prevention, and sustainable development.</p>`;
    
    const chemistryContent = `<h2>⚗️ Course Overview</h2><p>Chemistry is the scientific study of matter, its properties, and the changes it undergoes during chemical reactions. This course will guide you through the fundamental principles of chemistry, from atomic structure to complex molecular interactions. You'll learn about chemical bonding, reactions, thermodynamics, and the role of chemistry in everyday life.</p><h3>🎯 Learning Objectives</h3><ul><li>Master atomic theory and electronic structure</li><li>Understand chemical bonding and molecular geometry</li><li>Learn about chemical reactions and stoichiometry</li><li>Explore thermodynamics and kinetics</li><li>Study acids, bases, and equilibrium systems</li><li>Discover organic chemistry fundamentals</li></ul><h3>⚛️ Key Topics Covered</h3><ul><li><strong>Atomic Structure:</strong> Electron configuration, periodic trends, and quantum mechanics</li><li><strong>Chemical Bonding:</strong> Ionic, covalent, and metallic bonds, molecular geometry</li><li><strong>Stoichiometry:</strong> Chemical equations, mole calculations, and reaction yields</li><li><strong>Thermochemistry:</strong> Energy changes, enthalpy, and calorimetry</li><li><strong>Kinetics:</strong> Reaction rates, mechanisms, and catalysis</li><li><strong>Equilibrium:</strong> Chemical equilibrium, Le Chatelier's principle, acids and bases</li></ul><h3>🧪 Why Study Chemistry?</h3><p>Chemistry is often called the "central science" because it bridges physics and biology. Understanding chemistry is essential for medicine, materials science, environmental science, and technology. It helps us understand everything from how our bodies work to how to develop new materials and solve environmental challenges.</p>`;

    const biologyResources = JSON.stringify([
        {"title": "Campbell Biology", "description": "The definitive textbook for comprehensive biology education", "type": "textbook", "url": "https://www.pearson.com/campbell-biology"}, 
        {"title": "Khan Academy Biology", "description": "Free online courses with interactive lessons", "type": "online_course", "url": "https://www.khanacademy.org/science/biology"}, 
        {"title": "CrashCourse Biology", "description": "Engaging video series covering major topics", "type": "video_series", "url": "https://www.youtube.com/playlist?list=PL3EED4C1D684D3ADF"}, 
        {"title": "Nature Education", "description": "Scientific articles and research papers", "type": "research", "url": "https://www.nature.com/scitable/"}, 
        {"title": "BiologyOnline", "description": "Dictionary and study guides for terminology", "type": "reference", "url": "https://www.biologyonline.com/"}, 
        {"title": "Coursera Molecular Biology", "description": "University-level courses from top institutions", "type": "online_course", "url": "https://www.coursera.org/courses?query=molecular%20biology"}
    ]);

    const chemistryResources = JSON.stringify([
        {"title": "Atkins Physical Chemistry", "description": "Advanced textbook for physical chemistry", "type": "textbook", "url": "https://global.oup.com/academic/product/atkins-physical-chemistry"}, 
        {"title": "ChemLibreTexts", "description": "Comprehensive online chemistry library", "type": "online_resource", "url": "https://chem.libretexts.org/"}, 
        {"title": "Periodic Table Pro", "description": "Interactive periodic table with detailed elements", "type": "interactive_tool", "url": "https://ptable.com/"}, 
        {"title": "ChemSketch", "description": "Software for drawing chemical structures", "type": "software", "url": "https://www.acdlabs.com/resources/freeware/chemsketch/"}, 
        {"title": "MIT Chemistry Lectures", "description": "Free university-level chemistry courses", "type": "video_course", "url": "https://ocw.mit.edu/courses/chemistry/"}, 
        {"title": "Royal Society of Chemistry", "description": "Professional resources and journals", "type": "professional", "url": "https://www.rsc.org/"}
    ]);

    db.run(`INSERT INTO subjects (id, name, emoji, description, color_scheme, content, resources) VALUES 
        (1, 'Biology', '🧬', 'Explore the fascinating world of living organisms, from molecular processes to ecosystem dynamics.', 'green', ?, ?),
        (2, 'Chemistry', '⚗️', 'Discover the molecular world through atoms, bonds, reactions, and fundamental principles.', 'blue', ?, ?)`, 
        [biologyContent, biologyResources, chemistryContent, chemistryResources]);

    // Insert Biology topics
    console.log('Inserting Biology topics...');
    const biologyTopics = [
        [1, 'Cell Biology', 'Cell Structure and Function', 'Explore the anatomy of cells, organelles, and their specialized functions.', 'Beginner', '45 min read', 1, 
         `<h2>🔬 Cell Structure and Function</h2><p>Cells are the fundamental units of life. This topic explores the intricate structure of cells and the specialized functions of their various components. You'll learn about the different types of cells, their organelles, and how these microscopic structures work together to sustain life.</p><h3>🎯 Learning Objectives</h3><ul><li>Identify and describe the major cellular components</li><li>Compare and contrast prokaryotic and eukaryotic cells</li><li>Understand the function of each organelle</li><li>Explain how cell structure relates to function</li><li>Analyze the role of the cell membrane in maintaining homeostasis</li></ul><h3>🧬 Key Concepts</h3><ul><li><strong>Cell Theory:</strong> All living things are made of cells</li><li><strong>Nucleus:</strong> Control center containing genetic material</li><li><strong>Mitochondria:</strong> Powerhouses that produce ATP</li><li><strong>Endoplasmic Reticulum:</strong> Protein and lipid synthesis</li><li><strong>Golgi Apparatus:</strong> Processing and packaging center</li><li><strong>Cell Membrane:</strong> Selective barrier controlling entry and exit</li></ul><h3>🔍 Real-World Applications</h3><p>Understanding cell structure is crucial for medicine, biotechnology, and research. This knowledge helps in developing treatments for diseases, understanding genetic disorders, and advancing medical technologies like stem cell therapy.</p>`,
         '[{"title": "Campbell Biology Chapter 6", "description": "Comprehensive coverage of cell structure and organelles", "type": "textbook", "url": ""}, {"title": "Khan Academy: Cell Structure", "description": "Interactive lessons on cellular components", "type": "online_course", "url": "https://www.khanacademy.org/science/biology/structure-of-a-cell"}, {"title": "Cell Biology Animation Collection", "description": "Visual animations of cellular processes", "type": "video_series", "url": "https://www.cellsalive.com/"}, {"title": "Virtual Cell Interactive", "description": "3D exploration of cell components", "type": "interactive_tool", "url": "https://virtualcell.ndsu.edu/"}]'],
        [1, 'Cell Biology', 'Cell Division', 'Understand mitosis and meiosis - the processes that create new cells.', 'Intermediate', '50 min read', 2, null, null],
        [1, 'Cell Biology', 'Cellular Respiration', 'Learn how cells convert glucose and oxygen into ATP.', 'Intermediate', '60 min read', 3, null, null],
        [1, 'Genetics', 'DNA Structure and Replication', 'Explore the molecular architecture of DNA.', 'Intermediate', '55 min read', 4, 
         `<h2>🧬 DNA Structure and Replication</h2><p>DNA (Deoxyribonucleic acid) is the molecule that carries genetic information in all living organisms. This topic covers the elegant double helix structure of DNA and the precise mechanism by which it replicates to pass genetic information to new cells.</p><h3>🎯 Learning Objectives</h3><ul><li>Describe the structure of DNA including base pairing rules</li><li>Explain the process of DNA replication step by step</li><li>Identify the key enzymes involved in replication</li><li>Understand the significance of semi-conservative replication</li><li>Analyze how DNA structure relates to its function</li></ul><h3>🔬 Key Concepts</h3><ul><li><strong>Double Helix:</strong> Two complementary strands wound around each other</li><li><strong>Base Pairing:</strong> A-T and G-C hydrogen bonding</li><li><strong>DNA Helicase:</strong> Enzyme that unwinds the double helix</li><li><strong>DNA Polymerase:</strong> Enzyme that synthesizes new DNA strands</li><li><strong>Leading and Lagging Strands:</strong> Different replication mechanisms</li><li><strong>Proofreading:</strong> Error correction during replication</li></ul><h3>💡 Why This Matters</h3><p>DNA replication is fundamental to life itself. Understanding this process is essential for genetics, medicine, biotechnology, and forensic science. It's the basis for techniques like PCR, DNA sequencing, and gene therapy.</p>`,
         '[{"title": "DNA Learning Center", "description": "Interactive DNA structure and replication modules", "type": "interactive_tool", "url": "https://www.dnalc.org/"}, {"title": "Nature: DNA Replication", "description": "Detailed scientific review of replication mechanisms", "type": "research", "url": "https://www.nature.com/subjects/dna-replication"}, {"title": "Molecular Biology Animations", "description": "High-quality animations of DNA processes", "type": "video_series", "url": "https://www.youtube.com/playlist?list=PLHMvq5lGLkKPL6Af6L3N9y9B5lO-_j9DW"}, {"title": "NCBI Genetics Handbook", "description": "Comprehensive genetics reference", "type": "reference", "url": "https://www.ncbi.nlm.nih.gov/books/NBK21136/"}]'],
        [1, 'Genetics', 'Protein Synthesis', 'Understand transcription and translation.', 'Advanced', '50 min read', 5, null, null],
        [1, 'Genetics', 'Heredity and Variation', 'Learn about inheritance patterns and genetic variation.', 'Intermediate', '45 min read', 6, null, null]
    ];

    biologyTopics.forEach(topic => {
        db.run(`INSERT INTO topics (subject_id, category, name, description, difficulty, duration, order_index, content, resources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, topic);
    });

    // Insert Chemistry topics
    console.log('Inserting Chemistry topics...');
    const chemistryTopics = [
        [2, 'Atomic Structure', 'Atomic Theory', 'Journey through the evolution of atomic models.', 'Beginner', '40 min read', 1, null, null],
        [2, 'Atomic Structure', 'Electron Configuration', 'Understand how electrons are arranged in atoms.', 'Intermediate', '50 min read', 2, null, null],
        [2, 'Atomic Structure', 'Periodic Trends', 'Discover patterns in atomic properties.', 'Intermediate', '45 min read', 3, null, null],
        [2, 'Chemical Bonding', 'Ionic Bonding', 'Understanding electron transfer and ionic compounds.', 'Beginner', '45 min read', 4, null, null],
        [2, 'Chemical Bonding', 'Covalent Bonding', 'Explore electron sharing and molecular compounds.', 'Intermediate', '50 min read', 5, null, null],
        [2, 'Chemical Bonding', 'Molecular Geometry', 'Predict 3D molecular shapes using VSEPR theory.', 'Advanced', '55 min read', 6, null, null]
    ];

    chemistryTopics.forEach(topic => {
        db.run(`INSERT INTO topics (subject_id, category, name, description, difficulty, duration, order_index, content, resources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, topic);
    });

    // Insert Biology subject-level quizzes
    console.log('Inserting Biology subject-level quizzes...');
    const biologySubjectQuizzes = [
        [1, null, 'What is the basic unit of life?', JSON.stringify(['Cell', 'Atom', 'Molecule', 'Tissue']), 0, 'The cell is the smallest structural and functional unit of life. All living organisms are composed of one or more cells.', 1],
        [1, null, 'Which organelle is known as the powerhouse of the cell?', JSON.stringify(['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus']), 0, 'Mitochondria produce ATP through cellular respiration, providing energy for cellular processes.', 2],
        [1, null, 'What does DNA stand for?', JSON.stringify(['Deoxyribonucleic acid', 'Dinitrogen acid', 'Deoxyribose acid', 'Dinucleotide acid']), 0, 'DNA (Deoxyribonucleic acid) is the hereditary material that contains genetic instructions for all living organisms.', 3]
    ];

    biologySubjectQuizzes.forEach(quiz => {
        db.run(`INSERT INTO quizzes (subject_id, topic_id, question, options, correct_answer, explanation, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, quiz);
    });

    // Insert topic-specific quizzes (now IDs will start from 1)
    console.log('Inserting topic-specific quizzes...');
    
    // Topic-specific quizzes (now using correct IDs: 1-6 for Biology topics)
    // Cell Structure and Function (ID 1)
    const cellStructureQuizzes = [
        [null, 1, 'Which organelle contains the cell\'s DNA?', JSON.stringify(['Nucleus', 'Mitochondria', 'Endoplasmic reticulum', 'Golgi apparatus']), 0, 'The nucleus contains the cell\'s genetic material (DNA) and controls cellular activities.', 1],
        [null, 1, 'What is the function of ribosomes?', JSON.stringify(['Protein synthesis', 'Energy production', 'Waste removal', 'Cell division']), 0, 'Ribosomes are responsible for protein synthesis by translating mRNA into proteins.', 2]
    ];

    // Cell Division (ID 2)
    const cellDivisionQuizzes = [
        [null, 2, 'During which phase of mitosis do chromosomes line up at the cell\'s equator?', JSON.stringify(['Metaphase', 'Prophase', 'Anaphase', 'Telophase']), 0, 'During metaphase, chromosomes align at the metaphase plate (cell\'s equator) before separation.', 1],
        [null, 2, 'What is the main purpose of meiosis?', JSON.stringify(['Produce gametes', 'Repair tissues', 'Growth', 'Energy production']), 0, 'Meiosis produces gametes (sex cells) with half the chromosome number for sexual reproduction.', 2]
    ];

    // Cellular Respiration (ID 3)
    const cellularRespirationQuizzes = [
        [null, 3, 'Where does cellular respiration primarily occur?', JSON.stringify(['Mitochondria', 'Nucleus', 'Cytoplasm', 'Endoplasmic reticulum']), 0, 'Cellular respiration occurs primarily in the mitochondria, where glucose is converted to ATP.', 1],
        [null, 3, 'What is the main product of cellular respiration?', JSON.stringify(['ATP', 'Glucose', 'Oxygen', 'Carbon dioxide']), 0, 'ATP (Adenosine triphosphate) is the main energy currency produced by cellular respiration.', 2]
    ];

    // DNA Structure and Replication (ID 4)
    const dnaQuizzes = [
        [null, 4, 'DNA replication is described as:', JSON.stringify(['Semi-conservative', 'Conservative', 'Dispersive', 'Random']), 0, 'DNA replication is semi-conservative, meaning each new DNA molecule contains one original and one newly synthesized strand.', 1],
        [null, 4, 'Which enzyme is responsible for unwinding the DNA double helix?', JSON.stringify(['Helicase', 'Polymerase', 'Ligase', 'Primase']), 0, 'Helicase unwinds the DNA double helix by breaking hydrogen bonds between base pairs.', 2]
    ];

    // Insert all topic-specific quizzes
    const allTopicQuizzes = [
        ...cellStructureQuizzes,
        ...cellDivisionQuizzes,
        ...cellularRespirationQuizzes,
        ...dnaQuizzes
    ];

    allTopicQuizzes.forEach(quiz => {
        db.run(`INSERT INTO quizzes (subject_id, topic_id, question, options, correct_answer, explanation, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, quiz);
    });

    // Insert some sample quotes
    console.log('Inserting quotes...');
    const quotes = [
        ['The only way to do great work is to love what you do.', 'Steve Jobs', 'motivation'],
        ['Education is the most powerful weapon which you can use to change the world.', 'Nelson Mandela', 'education'],
        ['The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.', 'Brian Herbert', 'learning'],
        ['Science is not only a disciple of reason but also one of romance and passion.', 'Stephen Hawking', 'science'],
        ['The beautiful thing about learning is that no one can take it away from you.', 'B.B. King', 'learning']
    ];

    quotes.forEach(quote => {
        db.run(`INSERT INTO quotes (text, author, category) VALUES (?, ?, ?)`, quote);
    });

    // Insert some sample tasks
    console.log('Inserting sample tasks...');
    const tasks = [
        [1, 'Study Cell Biology', 'Review cell structure and organelles', '2024-12-20', 'Medium', 0, 1],
        [1, 'Chemistry Quiz Prep', 'Prepare for atomic structure quiz', '2024-12-22', 'High', 0, 2],
        [1, 'Read DNA Chapter', 'Complete reading on DNA structure', '2024-12-25', 'Low', 0, 1]
    ];

    tasks.forEach(task => {
        db.run(`INSERT INTO tasks (user_id, title, description, due_date, priority, completed, subject_id) VALUES (?, ?, ?, ?, ?, ?, ?)`, task);
    });

    console.log('Database seeding completed successfully!');
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
}); 