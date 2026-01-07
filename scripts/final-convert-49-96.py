#!/usr/bin/env python3
"""Complete conversion of questions 49-96 to markdown format"""
import sys

with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

conversions = []

# Q57: Fibromyalgia
old = """Fibromyalgia is a chronic pain condition characterized by widespread musculoskeletal pain and tender points throughout the body. Patients have hypersensitive nervous systems that amplify pain signals. Deep pressure can trigger pain flares and worsen symptoms. Light to moderate pressure with gentle techniques like effleurage and petrissage are recommended. The goal is to improve circulation and reduce muscle tension without overstimulating already sensitive tissues. Always start conservatively and adjust based on client feedback."""
new = """🎯 **Key Concept**: Fibromyalgia is a chronic pain condition with widespread musculoskeletal pain and hypersensitive nervous systems that amplify pain signals. Deep pressure can trigger pain flares and worsen symptoms.\\n\\n💡 **Memory Tip**: Fibromyalgia = FRAGILE - Don't Dig Deep, Keep it Gentle! Think 'Fiber-myal-GENTLE-a'.\\n\\n⚠️ **Exam Alert**: AVOID deep pressure! Light work is recommended, NOT avoided. Abdominal work is fine when gentle. First session = conservative approach!\\n\\n✅ **Why Correct**: Light to moderate pressure with gentle techniques like effleurage are recommended. The goal is to improve circulation and reduce muscle tension without overstimulating already sensitive tissues."""
if old in content:
    content = content.replace(old, new)
    conversions.append(57)

# Q58: Light Effleurage
old = """Light effleurage involves gentle, gliding strokes that primarily affect superficial tissues. This technique stimulates superficial capillaries through light mechanical pressure and warmth, causing vasodilation and increased local blood flow near the skin surface. The gentle pressure activates mechanoreceptors and promotes circulation in the capillary beds without deep tissue compression. This increased superficial circulation brings fresh oxygen and nutrients while helping remove metabolic waste products, contributing to the relaxing and therapeutic effects of massage."""
new = """🎯 **Key Concept**: Light effleurage involves gentle, gliding strokes that stimulate superficial capillaries through light mechanical pressure and warmth, causing vasodilation and increased local blood flow near the skin surface.\\n\\n💡 **Memory Tip**: Light Effleurage = Surface CAPILLARY PARTY! Think 'Effer-FLOWS-age' - it makes surface blood flow age backwards!\\n\\n⚠️ **Exam Alert**: Light effleurage INCREASES flow, not reduces! It increases arterial flow, increases venous return, and increases superficial capillary flow.\\n\\n✅ **Why Correct**: The gentle pressure activates mechanoreceptors and promotes circulation in the capillary beds without deep tissue compression. This increased superficial circulation brings fresh oxygen and nutrients while helping remove metabolic waste products."""
if old in content:
    content = content.replace(old, new)
    conversions.append(58)

# Q59: Four Tissue Types
old = """The human body consists of four basic tissue types, each with distinct functions. Connective tissue provides structural support and includes bone, cartilage, blood, and fascia. Epithelial tissue covers body surfaces and lines cavities, forming protective barriers like skin and organ linings. Muscle tissue enables movement through contraction and includes skeletal, cardiac, and smooth muscle. Nervous tissue transmits electrical signals and includes neurons and supporting glial cells. Understanding these tissue types is fundamental for massage therapy as each responds differently to manual techniques."""
new = """🎯 **Key Concept**: The human body consists of four basic tissue types: Connective (bone, cartilage, blood, fascia), Epithelial (skin, organ linings), Muscle (skeletal, cardiac, smooth), and Nervous (neurons, glial cells).\\n\\n💡 **Memory Tip**: CEMN - 'See 'Em Now!' Connective, Epithelial, Muscle, Nerve - the four tissue types you need to learn!\\n\\n⚠️ **Exam Alert**: All four types are distinct and essential. Each responds differently to manual techniques, so knowing them is fundamental for massage therapy!\\n\\n✅ **Why Correct**: Understanding these tissue types is fundamental for massage therapy as each has distinct functions and responds differently to manual techniques."""
if old in content:
    content = content.replace(old, new)
    conversions.append(59)

# Q60: Cartilage
old = """Cartilage is unique among body tissues as it is completely avascular (no blood vessels) and aneural (no nerve endings). This smooth, firm connective tissue relies on diffusion from surrounding tissues for nutrition and waste removal. Found in joints, ears, nose, and between vertebrae, cartilage provides cushioning and smooth surfaces for joint movement. Its lack of blood supply means it heals very slowly when injured. The absence of nerves means cartilage damage often goes unnoticed until surrounding tissues are affected."""
new = """🎯 **Key Concept**: Cartilage is unique - it's completely avascular (no blood vessels) and aneural (no nerve endings). This smooth, firm connective tissue relies on diffusion from surrounding tissues for nutrition.\\n\\n💡 **Memory Tip**: CARTILAGE = 'CAR-Till-AGE' - No gas (blood) and no GPS (nerves) needed! It's the tissue that travels solo!\\n\\n⚠️ **Exam Alert**: Adipose, bone, and muscle ALL have blood supply and nerves. Only cartilage lacks both! This means slow healing and delayed pain detection.\\n\\n✅ **Why Correct**: Found in joints, ears, nose, and between vertebrae. Its lack of blood supply = very slow healing. The absence of nerves = cartilage damage often goes unnoticed until surrounding tissues are affected."""
if old in content:
    content = content.replace(old, new)
    conversions.append(60)

# Q61: Serratus Posterior Inferior
old = """The serratus posterior inferior is a thin respiratory muscle located in the lower back that assists with forced expiration. It originates from the spinous processes of T11-L2 vertebrae and inserts on ribs 9-12. During forced expiration (like coughing or heavy breathing), this muscle contracts to depress the lower ribs, helping to reduce thoracic cavity volume and push air out of the lungs. This is opposite to inspiratory muscles that elevate ribs to expand the chest cavity."""
new = """🎯 **Key Concept**: The serratus posterior inferior is a thin respiratory muscle that assists with forced expiration. It originates from T11-L2 vertebrae and inserts on ribs 9-12, depressing the lower ribs.\\n\\n💡 **Memory Tip**: Serratus Posterior INFERIOR = 'INFERIOR pulls ribs DOWN for expiration!' Remember: INferior = INhalation opposite = EXpiration!\\n\\n⚠️ **Exam Alert**: Diaphragm = inspiration (pulls air IN). Serratus post. superior = elevates ribs for inspiration. Only serratus post. INFERIOR depresses ribs for expiration!\\n\\n✅ **Why Correct**: During forced expiration (coughing, heavy breathing), this muscle contracts to depress the lower ribs, helping to reduce thoracic cavity volume and push air OUT of the lungs."""
if old in content:
    content = content.replace(old, new)
    conversions.append(61)

# Q62: Skin Rolling
old = """Skin rolling is a specialized technique where the therapist lifts and rolls skin between fingers and thumbs, creating a wave-like motion across the tissue. This technique is uniquely effective for detecting subepidermal adhesions because it separates skin layers and reveals restrictions in fascial mobility. When adhesions are present, the skin won't roll smoothly - it will feel sticky, thick, or restricted in certain areas. The lifting action creates tension that highlights bound-down areas where fascia has adhered to underlying structures. This diagnostic quality makes skin rolling invaluable for assessment before treatment."""
new = """🎯 **Key Concept**: Skin rolling lifts and rolls skin between fingers and thumbs, creating a wave-like motion. It's uniquely effective for detecting subepidermal adhesions because it separates skin layers and reveals restrictions in fascial mobility.\\n\\n💡 **Memory Tip**: ROLL to REVEAL - Skin Rolling Reveals adhesions, like peeling back layers to find what's stuck underneath!\\n\\n⚠️ **Exam Alert**: Tapotement uses percussion (can't assess adhesions). Cupping creates suction (can't systematically detect). Only skin rolling provides controlled assessment capability!\\n\\n✅ **Why Correct**: When adhesions are present, the skin won't roll smoothly - it will feel sticky, thick, or restricted. The lifting action creates tension that highlights bound-down areas where fascia has adhered to underlying structures."""
if old in content:
    content = content.replace(old, new)
    conversions.append(62)

# Q63: Endorphins
old = """Endorphins are the body's natural painkillers, released during prolonged or intense stimulation. Heavy tapotement and extended massage stimulation trigger endorphin release through sustained activation of pressure receptors and the body's stress-response system. This follows the gate control theory - prolonged stimulation eventually shifts from fight-or-flight to healing mode. Endorphins provide lasting pain relief and euphoric feelings, explaining why clients feel relaxed after intense massage work. The key is duration - short-term stimulation releases stress hormones like epinephrine, but prolonged stimulation shifts to endorphin production for pain management and healing."""
new = """🎯 **Key Concept**: Endorphins are the body's natural painkillers, released during PROLONGED or intense stimulation. Heavy tapotement and extended massage trigger endorphin release through sustained activation of pressure receptors.\\n\\n💡 **Memory Tip**: LONG = ENDORPHINS - Think 'End-orphins END the pain' after PROLONGED stimulation, like a runner's high from long exercise!\\n\\n⚠️ **Exam Alert**: Epinephrine = SHORT-TERM/acute stress. Cortisol = chronic stress. Endorphins = PROLONGED stimulation. The key word is 'prolonged'!\\n\\n✅ **Why Correct**: This follows gate control theory - prolonged stimulation shifts from fight-or-flight to healing mode. Endorphins provide lasting pain relief and euphoric feelings, explaining why clients feel relaxed after intense massage work."""
if old in content:
    content = content.replace(old, new)
    conversions.append(63)

with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Converted: {sorted(conversions)}")
print(f"Total: {len(conversions)}")
