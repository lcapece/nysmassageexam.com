# Image Quality Issues - Root Cause Analysis

## Problem Summary

All 287 educational diagrams in the NYS Massage Exam app have severe quality issues including:
- Text rendering errors (garbled text, wrong fonts, Russian/Cyrillic characters)
- Poor diagram quality
- Inconsistent visual style
- Unprofessional appearance unsuitable for commercial sale

## Root Cause: Wrong AI Model Used

### Current Implementation
- **Model Used**: `gemini-2.0-flash-exp` (Gemini 2.0 Flash Experimental)
- **Location**: `generate-images.js` line 11
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`

### Why This Is Wrong

**Gemini 2.0 Flash is NOT an image generation model** - it's a multimodal LLM that has experimental image generation capabilities as a side feature. Key limitations:

1. **Poor text rendering**: Gemini cannot reliably render text in images
2. **Experimental quality**: The model is in beta and produces inconsistent results
3. **Not designed for diagrams**: Lacks the precision needed for educational diagrams
4. **Font issues**: Cannot control fonts, leading to random character sets (including Cyrillic)

## Correct Solutions

### Option 1: Use Imagen 3 (Google's Dedicated Image Model) ⭐ RECOMMENDED

```javascript
// Replace gemini-2.0-flash-exp with Imagen 3
const IMAGEN_API_URL = 'https://aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict';
```

**Advantages**:
- Purpose-built for high-quality image generation
- Better text rendering (though still imperfect)
- More consistent results
- Professional quality output

**Cost**: ~$0.02-0.04 per image (287 images = ~$6-12 total)

### Option 2: Use DALL-E 3 (OpenAI)

```javascript
const DALLE_API_URL = 'https://api.openai.com/v1/images/generations';
// model: "dall-e-3"
```

**Advantages**:
- Excellent quality
- Better at following detailed prompts
- Good text rendering

**Cost**: $0.04-0.08 per image (287 images = ~$12-23 total)

### Option 3: Use Stable Diffusion 3 (Best for Text)

```javascript
// Via Stability AI API
const SD_API_URL = 'https://api.stability.ai/v2beta/stable-image/generate/sd3';
```

**Advantages**:
- **BEST for text in images**
- Can render labels, anatomical terms clearly
- Most affordable option
- Good diagram quality

**Cost**: $0.01-0.02 per image (287 images = ~$3-6 total)

### Option 4: Hybrid Approach - Generate WITHOUT Text ⭐ BEST QUALITY

Generate diagrams WITHOUT embedded text labels, then add text programmatically:

1. Use any image model to generate clean diagram (no text)
2. Add labels/annotations using Canvas API or image manipulation library
3. Full control over fonts, positioning, clarity

**Advantages**:
- Perfect text quality
- Full typography control
- Can use professional fonts
- Easy to update labels
- Lower generation cost

## Immediate Action Required

### Step 1: Audit Existing Images

Check random sample for quality issues:
```bash
# Download 10 random images to verify issues
for i in 1 22 45 78 99 150 200 245 270 287; do
  curl -o "audit-$i.png" "https://nysmassageexam-images.s3.amazonaws.com/diagrams/question-$i.png"
done
```

### Step 2: Choose New Model

Recommendation: **Stable Diffusion 3** for best text rendering + affordability

### Step 3: Regenerate All Images

Update `generate-images.js` with proper image generation model, then:

```bash
# Set proper API key
export STABILITY_API_KEY="your-key"

# Run regeneration
node generate-images.js
```

### Step 4: Update Image URLs

After regeneration, update all question entries with new URLs.

## Cost Comparison

| Model | Per Image | Total (287) | Text Quality | Overall Quality |
|-------|-----------|-------------|--------------|-----------------|
| **Current (Gemini Flash)** | FREE | FREE | ❌ Poor | ❌ Poor |
| **Imagen 3** | $0.02-0.04 | $6-12 | ⚠️ Fair | ✅ Good |
| **DALL-E 3** | $0.04-0.08 | $12-23 | ✅ Good | ✅ Excellent |
| **Stable Diffusion 3** | $0.01-0.02 | $3-6 | ✅ Excellent | ✅ Good |
| **Hybrid (No text)** | $0.005-0.01 | $1.50-3 | ✅ Perfect | ✅ Excellent |

## Timeline to Fix

- **Audit**: 30 minutes
- **Update code**: 1-2 hours
- **Regeneration**: 6-8 hours (with rate limits)
- **Testing**: 2-3 hours
- **Total**: 1-2 days

## Business Impact

**CRITICAL**: Cannot sell app with current image quality. This is a show-stopper issue that must be resolved before any commercial launch.

**After fix**: Professional diagrams will be a major selling point and competitive advantage.
