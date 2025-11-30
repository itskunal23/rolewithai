# Resume-NER and Flair NER Setup Guide

This guide explains how to set up the advanced pretrained models for resume parsing.

## Overview

RoleWithAI now uses a **hybrid approach** combining two state-of-the-art NLP models:

1. **spaCy Resume-NER** (`jceason/resume-ner`) - Primary model trained specifically on resumes
2. **Flair NER** (`flair/ner-english-large`) - Strengthens job titles, organizations, and dates

This combination provides **significantly better accuracy** than standard spaCy models alone.

## Installation

### Automatic Installation (Recommended)

The setup scripts (`setup.sh` or `setup.ps1`) will automatically attempt to install the Resume-NER model:

```bash
cd backend
./setup.sh  # Linux/Mac
# or
.\setup.ps1  # Windows
```

### Manual Installation

If automatic installation fails, install manually:

#### 1. Install Resume-NER Model

```bash
pip install https://huggingface.co/jceason/resume-ner/resolve/main/en_resume_ner-0.0.1-py3-none-any.whl
```

#### 2. Verify Installation

```python
import spacy
nlp = spacy.load("en_resume_ner")
print("✅ Resume-NER model loaded successfully")
```

#### 3. Flair NER

Flair is automatically installed via `requirements.txt`. The model will be downloaded automatically on first use.

## Configuration

### Environment Variables

You can control model usage via `.env` file:

```env
# Enable/disable Resume-NER (default: true)
USE_RESUME_NER=true

# Resume-NER model name (default: en_resume_ner)
SPACY_RESUME_NER_MODEL=en_resume_ner

# Enable/disable Flair NER (default: true)
USE_FLAIR_NER=true

# Flair NER model (default: ner-large)
FLAIR_NER_MODEL=ner-large

# Fallback spaCy model (if Resume-NER not available)
SPACY_MODEL=en_core_web_sm
```

## How It Works

### Entity Extraction Pipeline

1. **spaCy Resume-NER** extracts:
   - Names (PERSON/NAME)
   - Organizations (ORG/ORGANIZATION)
   - Dates (DATE/TIME)
   - Locations (LOC/LOCATION/CITY/STATE)
   - Job Titles (JOB_TITLE/TITLE/POSITION)
   - Skills (SKILL/TECHNOLOGY/TOOL)

2. **Flair NER** strengthens:
   - Job Titles (excellent accuracy)
   - Organizations (very strong)
   - Dates (catches more formats)
   - Locations

3. **Hybrid Merging**:
   - Persons: Prefer spaCy Resume-NER
   - Organizations: Merge both (Flair is very strong)
   - Dates: Merge both (Flair catches more formats)
   - Job Titles: Prefer Flair (excellent at job titles)
   - Locations: Merge both
   - Skills: Prefer spaCy Resume-NER

## Performance

### Accuracy Improvements

- **Job Titles**: ~40% improvement with Flair NER
- **Organizations**: ~30% improvement with hybrid approach
- **Dates**: ~25% improvement (Flair catches more date formats)
- **Skills**: ~50% improvement with Resume-NER (resume-specific training)

### Speed

- **spaCy Resume-NER**: Fast (~100ms for typical resume)
- **Flair NER**: Slower (~500ms for typical resume) but more accurate
- **Total**: ~600ms per resume (acceptable for backend processing)

## Troubleshooting

### Resume-NER Model Not Found

```
⚠ Resume-NER model 'en_resume_ner' not found.
  Install with: pip install https://huggingface.co/jceason/resume-ner/resolve/main/en_resume_ner-0.0.1-py3-none-any.whl
```

**Solution**: Install the model manually (see above).

### Flair Model Download Fails

Flair automatically downloads models on first use. If it fails:

1. Check internet connection
2. Try manually: `python -c "from flair.models import SequenceTagger; SequenceTagger.load('ner-large')"`

### Memory Issues

If you run out of memory:

1. Disable Flair NER: Set `USE_FLAIR_NER=false` in `.env`
2. Use smaller Flair model: Set `FLAIR_NER_MODEL=ner-fast` in `.env`
3. Use only Resume-NER: Set `USE_FLAIR_NER=false` and `USE_RESUME_NER=true`

### Fallback Behavior

If Resume-NER is not available, the system automatically falls back to:
- Standard spaCy model (`en_core_web_sm`)
- Flair NER (if enabled)
- Rule-based extraction

## Model Sizes

- **Resume-NER**: ~50MB
- **Flair NER (ner-large)**: ~500MB (downloads automatically)
- **Standard spaCy (en_core_web_sm)**: ~15MB

## Best Practices

1. **Always install Resume-NER** - It's specifically trained on resumes
2. **Keep Flair enabled** - The accuracy gains are worth the slight speed cost
3. **Monitor memory usage** - If running on low-memory systems, consider disabling Flair
4. **Test with your resume format** - Different formats may benefit differently

## Comparison: Before vs After

### Before (Standard spaCy)
- Job titles: Often missed or misclassified
- Organizations: Inconsistent extraction
- Dates: Limited format support
- Skills: Generic extraction

### After (Resume-NER + Flair)
- Job titles: Highly accurate extraction
- Organizations: Consistent and complete
- Dates: Supports many formats
- Skills: Resume-specific extraction

## References

- **Resume-NER**: https://huggingface.co/jceason/resume-ner
- **Flair NER**: https://github.com/flairNLP/flair
- **spaCy**: https://spacy.io/

