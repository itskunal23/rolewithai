"""
Lightweight NLP extraction using Flair NER + basic spaCy
Optimized for speed: ≤ 0.4 sec parsing
"""
from typing import List, Dict, Optional
import re

# Optional spaCy import (only for basic sentence splitting)
try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False
    spacy = None

# Optional Flair import (primary NER model)
try:
    # Monkey patch for PyTorch 2.6+ compatibility
    # Flair 0.13.1 doesn't support weights_only=True default in torch.load()
    try:
        import flair.file_utils
        import torch
        original_load_torch_state = flair.file_utils.load_torch_state
        
        def patched_load_torch_state(model_file):
            """Patched version that adds weights_only=False for PyTorch 2.6+ compatibility"""
            import warnings
            from flair.file_utils import load_big_file
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore")
                f = load_big_file(model_file)
                return torch.load(f, map_location="cpu", weights_only=False)
        
        flair.file_utils.load_torch_state = patched_load_torch_state
    except Exception:
        pass  # If patching fails, continue anyway
    
    from flair.models import SequenceTagger
    from flair.data import Sentence
    FLAIR_AVAILABLE = True
except ImportError:
    FLAIR_AVAILABLE = False
    SequenceTagger = None
    Sentence = None


class NLPExtractor:
    """
    Lightweight resume extraction using:
    1. Flair NER (ner-large) - primary for ORG, DATE, PERSON, LOC
    2. spaCy en_core_web_sm - only for basic sentence splitting (optional)
    3. Rule-based section parsing with regex
    4. Keyword-based skill extraction
    """
    
    def __init__(self):
        self.nlp = None  # Basic spaCy model (optional, for sentence splitting only)
        self.flair_tagger = None  # Primary NER model
        
        # Initialize basic spaCy (optional, lightweight)
        if SPACY_AVAILABLE:
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except OSError:
                # spaCy model not installed - that's OK, we'll use regex for splitting
                pass
        
        # Initialize Flair NER (primary model)
        if FLAIR_AVAILABLE:
            try:
                self.flair_tagger = SequenceTagger.load("ner-large")
            except Exception as e:
                print(f"⚠ Flair NER model 'ner-large' failed to load: {e}")
                print(f"  Pre-download with: python -c \"from flair.models import SequenceTagger; SequenceTagger.load('ner-large')\"")
                print(f"  Or it will download automatically on first use.")
    
    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """
        Extract named entities using Flair NER (fast & accurate)
        
        Args:
            text: Input text
            
        Returns:
            Dict with entity types and values
        """
        entities = {
            "persons": [],
            "organizations": [],
            "dates": [],
            "locations": [],
            "job_titles": [],
        }
        
        if self.flair_tagger is None:
            return entities
        
        try:
            # Flair works best on sentences, so split text into sentences
            sentences = re.split(r'[.!?]\s+', text)
            
            for sentence_text in sentences:
                if not sentence_text.strip() or len(sentence_text.strip()) < 3:
                    continue
                
                sentence = Sentence(sentence_text)
                self.flair_tagger.predict(sentence)
                
                # Extract entities from Flair spans
                for span in sentence.get_spans('ner'):
                    label = span.tag
                    text_clean = span.text.strip()
                    
                    # Flair NER labels
                    if label == "PER" or label.startswith("PER"):
                        entities["persons"].append(text_clean)
                    elif label == "ORG" or label.startswith("ORG"):
                        entities["organizations"].append(text_clean)
                    elif label == "LOC" or label.startswith("LOC"):
                        entities["locations"].append(text_clean)
                    elif label == "MISC" or label.startswith("MISC"):
                        # MISC might contain job titles
                        job_keywords = ['engineer', 'developer', 'analyst', 'manager', 'intern', 
                                      'assistant', 'specialist', 'coordinator', 'consultant', 
                                      'director', 'lead', 'senior', 'junior', 'associate']
                        if any(keyword in text_clean.lower() for keyword in job_keywords):
                            entities["job_titles"].append(text_clean)
            
            # Extract dates using regex (Flair doesn't always catch dates well)
            date_pattern = r'\b(20\d{2}|19\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s\-–—]*(20\d{2}|19\d{2}|Present|Current)?\b'
            dates = re.findall(date_pattern, text, re.IGNORECASE)
            for date_match in dates:
                date_str = ' '.join([d for d in date_match if d]).strip()
                if date_str:
                    entities["dates"].append(date_str)
            
        except Exception as e:
            print(f"⚠ Flair NER extraction error: {e}")
        
        # Deduplicate
        for key in entities:
            entities[key] = list(set(entities[key]))
        
        return entities
    
    def extract_sections(self, text: str) -> Dict[str, str]:
        """
        Extract resume sections using regex patterns (fast & reliable)
        
        Args:
            text: Resume text
            
        Returns:
            Dict mapping section names to content
        """
        sections = {}
        lines = text.split('\n')
        
        # Section header patterns (case-insensitive)
        section_patterns = {
            "education": r"^(education|academic|university|school|college|degree|bachelor|master|phd|graduation)",
            "experience": r"^(experience|work|employment|professional|career|work history|employment history|professional experience)",
            "skills": r"^(skills|technical skills|competencies|expertise|technical expertise|proficiencies|technologies|tools)",
            "projects": r"^(projects|portfolio|work samples|technical projects|personal projects|technical projects & data analytics|data analytics)",
            "certifications": r"^(certifications|certificates|credentials|licenses)",
            "summary": r"^(summary|objective|profile|about|overview|professional summary)",
        }
        
        current_section = None
        current_content = []
        
        for line in lines:
            line_stripped = line.strip()
            if not line_stripped:
                if current_section:
                    current_content.append(line)
                continue
            
            line_lower = line_stripped.lower()
            matched_section = None
            
            # Check if line looks like a section header
            is_likely_header = (
                line_stripped.isupper() and len(line_stripped) < 80  # Allow longer all-caps headers
            ) or (
                line_stripped[0].isupper() and 
                line_stripped.count(' ') < 8 and  # Allow more words for compound headers
                len(line_stripped) < 80
            )
            
            # Check if line matches a section pattern
            for section_name, pattern in section_patterns.items():
                if re.search(pattern, line_lower):  # Use search instead of match to find patterns anywhere in line
                    if is_likely_header or len(line_stripped.split()) <= 8:  # Allow more words
                        # Save previous section
                        if current_section:
                            sections[current_section] = '\n'.join(current_content).strip()
                        current_section = section_name
                        current_content = []
                        matched_section = section_name
                        break
            
            if not matched_section:
                if current_section:
                    current_content.append(line)
        
        # Save last section
        if current_section:
            sections[current_section] = '\n'.join(current_content).strip()
        
        return sections
    
    def extract_skills(self, text: str, known_skills: Optional[List[str]] = None) -> List[str]:
        """
        Extract skills using keyword lists and categorized extraction (fast & comprehensive)
        
        Args:
            text: Resume text
            known_skills: Optional list of known skills to match against
            
        Returns:
            List of extracted skills
        """
        found_skills = set()
        text_lower = text.lower()
        
        # Comprehensive skill keyword lists
        skill_keywords = {
            # Programming Languages
            "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", 
            "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Ruby", "PHP", "HTML", "CSS", "VBA",
            # Databases
            "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "DynamoDB", 
            "Oracle", "SQLite", "Firebase", "Neo4j",
            # Frameworks & Libraries
            "React", "Vue", "Angular", "Node.js", "Express", "Django", "Flask", "FastAPI", 
            "Spring", "Laravel", "Rails", "Next.js", "Nuxt.js", "Svelte",
            # Cloud & DevOps
            "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible", 
            "Jenkins", "GitLab", "GitHub Actions", "CI/CD", "GitHub",
            # Data Science & ML
            "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", 
            "Keras", "Pandas", "NumPy", "SciPy", "Jupyter",
            # Analytics & BI
            "Tableau", "Power BI", "Excel", "Looker", "Qlik", "SAS", "SPSS", "R Studio",
            # Version Control & Tools
            "Git", "Bitbucket", "SVN", "Mercurial", "VS Code", "Visual Studio Code",
            # Other common skills
            "Agile", "Scrum", "JIRA", "Confluence", "Slack", "Microsoft Office", 
            "Google Workspace", "REST API", "GraphQL", "Microservices", "API Development",
            "Web Development", "Data Analysis", "Data Visualization", "Statistical Analysis",
            "A/B Testing", "Project Management", "Product Management", "Business Analysis",
            # Additional common skills
            "VBA", "CRM", "Salesforce", "HubSpot", "Zendesk", "ServiceNow",
            # Analytical Skills
            "Data Modeling", "Data Cleaning", "Data Warehousing", "Business Intelligence", "BI",
            "PowerPoint", "Microsoft Excel",
        }
        
        # Method 1: Extract from categorized skills section
        skills_section = self.extract_sections(text).get("skills", "")
        if skills_section:
            # Handle categorized skills (e.g., "Programming Languages: Python, SQL, VBA")
            category_patterns = [
                r'(?:Programming\s+Languages?|Languages?)[:\s]+(.+?)(?=\n|Tools|Analytical|$)',
                r'(?:Tools?)[:\s]+(.+?)(?=\n|Programming|Analytical|$)',
                r'(?:Analytical\s+Skills?|Skills?)[:\s]+(.+?)(?=\n|Programming|Tools|$)',
            ]
            
            for pattern in category_patterns:
                matches = re.finditer(pattern, skills_section, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    category_skills = match.group(1).strip()
                    # Split by comma, semicolon, or newline
                    skill_items = re.split(r'[,;•\n|&]', category_skills)
                    for item in skill_items:
                        item = item.strip()
                        if item and 2 <= len(item) < 50:
                            # Remove common prefixes
                            item = re.sub(r'^(proficient in|experienced with|knowledge of|familiar with)\s+', '', item, flags=re.IGNORECASE)
                            item = item.strip()
                            if item:
                                found_skills.add(item.title())
            
            # If no categories found, try simple list extraction
            if not found_skills:
                skill_items = re.split(r'[,;•\n|]', skills_section)
                for item in skill_items:
                    item = item.strip()
                    # Skip category headers
                    if any(word in item.lower() for word in ['programming', 'languages', 'tools', 'analytical', 'skills']):
                        continue
                    if item and 2 <= len(item) < 50:
                        item = re.sub(r'^(proficient in|experienced with|knowledge of|familiar with)\s+', '', item, flags=re.IGNORECASE)
                        item = item.strip()
                        if item:
                            found_skills.add(item.title())
        
        # Method 2: Direct keyword matching (case-insensitive) from full text
        for skill in skill_keywords:
            if skill.lower() in text_lower:
                found_skills.add(skill)
        
        # Method 3: Extract skills mentioned in experience/projects sections
        # Look for common skill patterns in context
        skill_context_patterns = [
            r'\b(?:using|with|via|through)\s+([A-Z][a-zA-Z0-9.#\s]+?)(?:\s+and|\s*,|\s+to|\s+for|\.|$)',
        ]
        for pattern in skill_context_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                potential_skill = match.group(1).strip()
                # Check if it matches known skills
                for known_skill in skill_keywords:
                    if known_skill.lower() in potential_skill.lower() or potential_skill.lower() in known_skill.lower():
                        found_skills.add(known_skill)
        
        # Method 4: If known_skills provided, match against them
        if known_skills:
            for skill in known_skills:
                if skill.lower() in text_lower:
                    found_skills.add(skill)
        
        return sorted(list(found_skills))
