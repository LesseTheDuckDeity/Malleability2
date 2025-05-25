-- Fix Chemistry subject content with proper lists
UPDATE subjects 
SET content = '<h2>⚗️ Course Overview</h2>
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
<p>Chemistry is often called the "central science" because it bridges physics and biology. Understanding chemistry is essential for medicine, materials science, environmental science, and technology. It helps us understand everything from how our bodies work to how to develop new materials and solve environmental challenges.</p>'
WHERE name = 'Chemistry'; 