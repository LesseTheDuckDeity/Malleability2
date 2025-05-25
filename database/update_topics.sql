-- Update Cell Structure and Function topic with content and resources
UPDATE topics 
SET 
    content = '<h2>🔬 Cell Structure and Function</h2>
<p>Cells are the fundamental units of life. This topic explores the intricate structure of cells and the specialized functions of their various components. You''ll learn about the different types of cells, their organelles, and how these microscopic structures work together to sustain life.</p>

<h3>🎯 Learning Objectives</h3>
<ul>
    <li>Identify and describe the major cellular components</li>
    <li>Compare and contrast prokaryotic and eukaryotic cells</li>
    <li>Understand the function of each organelle</li>
    <li>Explain how cell structure relates to function</li>
    <li>Analyze the role of the cell membrane in maintaining homeostasis</li>
</ul>

<h3>🧬 Key Concepts</h3>
<ul>
    <li><strong>Cell Theory:</strong> All living things are made of cells</li>
    <li><strong>Nucleus:</strong> Control center containing genetic material</li>
    <li><strong>Mitochondria:</strong> Powerhouses that produce ATP</li>
    <li><strong>Endoplasmic Reticulum:</strong> Protein and lipid synthesis</li>
    <li><strong>Golgi Apparatus:</strong> Processing and packaging center</li>
    <li><strong>Cell Membrane:</strong> Selective barrier controlling entry and exit</li>
</ul>

<h3>🔍 Real-World Applications</h3>
<p>Understanding cell structure is crucial for medicine, biotechnology, and research. This knowledge helps in developing treatments for diseases, understanding genetic disorders, and advancing medical technologies like stem cell therapy.</p>',
    resources = '[
        {
            "title": "Campbell Biology Chapter 6",
            "description": "Comprehensive coverage of cell structure and organelles",
            "type": "textbook",
            "url": ""
        },
        {
            "title": "Khan Academy: Cell Structure",
            "description": "Interactive lessons on cellular components",
            "type": "online_course",
            "url": "https://www.khanacademy.org/science/biology/structure-of-a-cell"
        },
        {
            "title": "Cell Biology Animation Collection",
            "description": "Visual animations of cellular processes",
            "type": "video_series",
            "url": "https://www.cellsalive.com/"
        },
        {
            "title": "Virtual Cell Interactive",
            "description": "3D exploration of cell components",
            "type": "interactive_tool",
            "url": "https://virtualcell.ndsu.edu/"
        }
    ]'
WHERE id = 1;

-- Update DNA Structure and Replication topic
UPDATE topics 
SET 
    content = '<h2>🧬 DNA Structure and Replication</h2>
<p>DNA (Deoxyribonucleic acid) is the molecule that carries genetic information in all living organisms. This topic covers the elegant double helix structure of DNA and the precise mechanism by which it replicates to pass genetic information to new cells.</p>

<h3>🎯 Learning Objectives</h3>
<ul>
    <li>Describe the structure of DNA including base pairing rules</li>
    <li>Explain the process of DNA replication step by step</li>
    <li>Identify the key enzymes involved in replication</li>
    <li>Understand the significance of semi-conservative replication</li>
    <li>Analyze how DNA structure relates to its function</li>
</ul>

<h3>🔬 Key Concepts</h3>
<ul>
    <li><strong>Double Helix:</strong> Two complementary strands wound around each other</li>
    <li><strong>Base Pairing:</strong> A-T and G-C hydrogen bonding</li>
    <li><strong>DNA Helicase:</strong> Enzyme that unwinds the double helix</li>
    <li><strong>DNA Polymerase:</strong> Enzyme that synthesizes new DNA strands</li>
    <li><strong>Leading and Lagging Strands:</strong> Different replication mechanisms</li>
    <li><strong>Proofreading:</strong> Error correction during replication</li>
</ul>

<h3>💡 Why This Matters</h3>
<p>DNA replication is fundamental to life itself. Understanding this process is essential for genetics, medicine, biotechnology, and forensic science. It''s the basis for techniques like PCR, DNA sequencing, and gene therapy.</p>',
    resources = '[
        {
            "title": "DNA Learning Center",
            "description": "Interactive DNA structure and replication modules",
            "type": "interactive_tool",
            "url": "https://www.dnalc.org/"
        },
        {
            "title": "Nature: DNA Replication",
            "description": "Detailed scientific review of replication mechanisms",
            "type": "research",
            "url": "https://www.nature.com/subjects/dna-replication"
        },
        {
            "title": "Molecular Biology Animations",
            "description": "High-quality animations of DNA processes",
            "type": "video_series",
            "url": "https://www.youtube.com/playlist?list=PLHMvq5lGLkKPL6Af6L3N9y9B5lO-_j9DW"
        },
        {
            "title": "NCBI Genetics Handbook",
            "description": "Comprehensive genetics reference",
            "type": "reference",
            "url": "https://www.ncbi.nlm.nih.gov/books/NBK21136/"
        }
    ]'
WHERE id = 4; 