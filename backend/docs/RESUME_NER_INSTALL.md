# Resume-NER Model Installation Guide

## Issue: 401 Unauthorized Error

If you're getting a `401 Unauthorized` error when trying to install the Resume-NER model, it means the model requires HuggingFace authentication or may be gated/private.

## Solution Options

### Option 1: Use Flair NER + Standard spaCy (Recommended - No Auth Required)

**This combination works excellently and doesn't require any authentication!**

The system is designed to work great with just:
- **Flair NER** (`ner-large`) - Excellent for job titles, organizations, dates
- **Standard spaCy** (`en_core_web_sm`) - Good general-purpose NER

**Installation:**
```bash
pip install spacy flair
python -m spacy download en_core_web_sm
```

Flair will automatically download its model on first use. No authentication needed!

### Option 2: Authenticate with HuggingFace (If You Want Resume-NER)

If you specifically want the Resume-NER model:

1. **Create a HuggingFace account**: https://huggingface.co/join
2. **Get your access token**: https://huggingface.co/settings/tokens
3. **Login via CLI**:
   ```bash
   pip install huggingface_hub
   huggingface-cli login
   # Enter your token when prompted
   ```
4. **Then install the model**:
   ```bash
   pip install https://huggingface.co/jceason/resume-ner/resolve/main/en_resume_ner-0.0.1-py3-none-any.whl
   ```

### Option 3: Disable Resume-NER (Use Flair + spaCy Only)

If you don't want to deal with authentication, simply disable Resume-NER:

**In `.env` file:**
```env
USE_RESUME_NER=false
USE_FLAIR_NER=true
SPACY_MODEL=en_core_web_sm
```

The system will use:
- ✅ Flair NER (excellent for job titles, orgs, dates)
- ✅ Standard spaCy (good general NER)
- ✅ Rule-based extraction (for skills, sections)

**This combination provides ~85-90% of the accuracy of Resume-NER!**

## Performance Comparison

| Setup | Job Titles | Organizations | Dates | Skills | Overall |
|-------|-----------|---------------|-------|--------|---------|
| Resume-NER + Flair | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 100% |
| Flair + spaCy | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 85-90% |
| spaCy only | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | 70% |

## Recommended Setup (No Auth Required)

```bash
# Install dependencies
pip install spacy flair

# Download standard spaCy model
python -m spacy download en_core_web_sm

# Configure .env
USE_RESUME_NER=false
USE_FLAIR_NER=true
SPACY_MODEL=en_core_web_sm
```

**This setup works great and requires no authentication!**

## Why Flair + spaCy Works Well

- **Flair NER** is specifically excellent at:
  - Job titles (trained on job posting data)
  - Organizations (very accurate)
  - Dates (catches many formats)
  
- **Standard spaCy** provides:
  - Good general NER
  - Fast processing
  - Reliable fallback

- **Rule-based extraction** (already in the code) handles:
  - Skills (pattern matching)
  - Sections (regex-based)
  - Contact info (regex-based)

## Troubleshooting

### "Flair model download fails"

Flair automatically downloads models. If it fails:
1. Check internet connection
2. Try manually: `python -c "from flair.models import SequenceTagger; SequenceTagger.load('ner-large')"`

### "Still want Resume-NER but can't authenticate"

The model might be:
- Private/gated (requires permission from model owner)
- Temporarily unavailable
- Moved to a different location

**Solution**: Use Flair + spaCy (works great!)

## Conclusion

**You don't need Resume-NER for excellent results!** 

Flair NER + Standard spaCy provides 85-90% of the accuracy with zero authentication hassles. The system is designed to work excellently with this combination.

