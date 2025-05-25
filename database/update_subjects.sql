-- Update Biology subject with content and resources
UPDATE subjects 
SET 
    content = '<h2>📖 Course Overview</h2>
<p>Biology is the scientific study of life and living organisms. This comprehensive course will take you through the fundamental concepts of biology, from the molecular level to entire ecosystems. You''ll explore cellular processes, genetics, evolution, ecology, and the diversity of life on Earth.</p>

<h3>🎯 Learning Objectives</h3>
<ul>
    <li>Understand the basic principles of cell biology and biochemistry</li>
    <li>Explore genetic mechanisms and inheritance patterns</li>
    <li>Learn about evolution and natural selection</li>
    <li>Discover the diversity of life forms and their classifications</li>
    <li>Study ecological relationships and environmental biology</li>
    <li>Analyze human biology and physiology</li>
</ul>

<h3>🧬 Key Topics Covered</h3>
<ul>
    <li><strong>Cell Biology:</strong> Cell structure, organelles, membrane transport, and cellular processes</li>
    <li><strong>Genetics:</strong> DNA structure, gene expression, inheritance, and biotechnology</li>
    <li><strong>Evolution:</strong> Natural selection, speciation, and phylogenetics</li>
    <li><strong>Ecology:</strong> Ecosystems, population dynamics, and environmental interactions</li>
    <li><strong>Human Biology:</strong> Anatomy, physiology, and health sciences</li>
</ul>

<h3>💡 Why Study Biology?</h3>
<p>Biology provides insights into how life works at every level, from molecules to ecosystems. It''s essential for understanding medicine, environmental science, biotechnology, and our place in the natural world. This knowledge is crucial for addressing global challenges like climate change, disease prevention, and sustainable development.</p>',
    resources = '[
        {
            "title": "Campbell Biology",
            "description": "The definitive textbook for comprehensive biology education",
            "type": "textbook",
            "url": "https://www.pearson.com/campbell-biology"
        },
        {
            "title": "Khan Academy Biology",
            "description": "Free online courses with interactive lessons",
            "type": "online_course",
            "url": "https://www.khanacademy.org/science/biology"
        },
        {
            "title": "CrashCourse Biology",
            "description": "Engaging video series covering major topics",
            "type": "video_series",
            "url": "https://www.youtube.com/playlist?list=PL3EED4C1D684D3ADF"
        },
        {
            "title": "Nature Education",
            "description": "Scientific articles and research papers",
            "type": "research",
            "url": "https://www.nature.com/scitable/"
        },
        {
            "title": "BiologyOnline",
            "description": "Dictionary and study guides for terminology",
            "type": "reference",
            "url": "https://www.biologyonline.com/"
        },
        {
            "title": "Coursera Molecular Biology",
            "description": "University-level courses from top institutions",
            "type": "online_course",
            "url": "https://www.coursera.org/courses?query=molecular%20biology"
        }
    ]'
WHERE id = 1;

-- Update Chemistry subject with content and resources
UPDATE subjects 
SET 
    content = '<h2>⚗️ Course Overview</h2>
<p>Chemistry is the scientific study of matter, its properties, and the changes it undergoes during chemical reactions. This course will guide you through the fundamental principles of chemistry, from atomic structure to complex molecular interactions. You''ll learn about chemical bonding, reactions, thermodynamics, and the role of chemistry in everyday life.</p>

<h3>🎯 Learning Objectives</h3>
<ul>
    <li>Master atomic theory and electronic structure</li>
    <li>Understand chemical bonding and molecular geometry</li>
    <li>Learn about chemical reactions and stoichiometry</li>
    <li>Explore thermodynamics and kinetics</li>
    <li>Study acids, bases, and equilibrium systems</li>
    <li>Discover organic chemistry fundamentals</li>
</ul>

<h3>⚛️ Key Topics Covered</h3>
<ul>
    <li><strong>Atomic Structure:</strong> Electron configuration, periodic trends, and quantum mechanics</li>
    <li><strong>Chemical Bonding:</strong> Ionic, covalent, and metallic bonds, molecular geometry</li>
    <li><strong>Stoichiometry:</strong> Chemical equations, mole calculations, and reaction yields</li>
    <li><strong>Thermochemistry:</strong> Energy changes, enthalpy, and calorimetry</li>
    <li><strong>Kinetics:</strong> Reaction rates, mechanisms, and catalysis</li>
    <li><strong>Equilibrium:</strong> Chemical equilibrium, Le Chatelier''s principle, acids and bases</li>
</ul>

<h3>🧪 Why Study Chemistry?</h3>
<p>Chemistry is often called the "central science" because it bridges physics and biology. Understanding chemistry is essential for medicine, materials science, environmental science, and technology. It helps us understand everything from how our bodies work to how to develop new materials and solve environmental challenges.</p>',
    resources = '[
        {
            "title": "Atkins Physical Chemistry",
            "description": "Advanced textbook for physical chemistry",
            "type": "textbook",
            "url": "https://global.oup.com/academic/product/atkins-physical-chemistry"
        },
        {
            "title": "ChemLibreTexts",
            "description": "Comprehensive online chemistry library",
            "type": "online_resource",
            "url": "https://chem.libretexts.org/"
        },
        {
            "title": "Periodic Table Pro",
            "description": "Interactive periodic table with detailed elements",
            "type": "interactive_tool",
            "url": "https://ptable.com/"
        },
        {
            "title": "ChemSketch",
            "description": "Software for drawing chemical structures",
            "type": "software",
            "url": "https://www.acdlabs.com/resources/freeware/chemsketch/"
        },
        {
            "title": "MIT Chemistry Lectures",
            "description": "Free university-level chemistry courses",
            "type": "video_course",
            "url": "https://ocw.mit.edu/courses/chemistry/"
        },
        {
            "title": "Royal Society of Chemistry",
            "description": "Professional resources and journals",
            "type": "professional",
            "url": "https://www.rsc.org/"
        }
    ]'
WHERE id = 2; 