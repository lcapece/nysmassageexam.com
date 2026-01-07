#!/usr/bin/env python3
"""Convert questions 49-50 to markdown format (final missing questions)"""
import sys

with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

conversions = []

# Check if Q49 still needs conversion
if 'Pain only with active movement indicates the contractile tissues' in content:
    # Q49 needs conversion
    old_49 = """This assessment finding is a key diagnostic indicator in massage therapy. Active movement requires muscle contraction to produce motion, while passive movement involves an external force (therapist) moving the joint while muscles remain relaxed. Pain only with active movement indicates the contractile tissues (muscles and tendons) are the source of dysfunction, as they're only engaged during active motion. This could suggest muscle strain, tendonitis, or myofascial trigger points. Conversely, pain during both active AND passive movement typically indicates joint, ligament, or capsular involvement since these structures are stressed regardless of how the movement occurs."""
    new_49 = """🎯 **Key Concept**: Active movement requires muscle contraction while passive movement involves external force (therapist) with relaxed muscles. Pain only with active = contractile tissue issue.\\n\\n💡 **Memory Tip**: Active actors = muscle actors! If it hurts when the client is the 'actor' (active) but not when you're the 'actor' (passive), muscles are the problem!\\n\\n⚠️ **Exam Alert**: Pain during BOTH active AND passive = joint/ligament issue, not muscle. Don't confuse these!\\n\\n✅ **Why Correct**: Muscles and tendons only engage during active motion, so pain exclusively during active movement pinpoints muscle strain, tendonitis, or trigger points."""

    if old_49 in content:
        content = content.replace(old_49, new_49)
        conversions.append(49)
        print("Found and converted Q49")

# Check if Q50 still needs conversion
if 'Adduction means moving a body part toward the midline of the body. Gracilis adducts the thigh' in content:
    # Q50 needs conversion
    old_50 = """Adduction means moving a body part toward the midline of the body. Gracilis adducts the thigh at the hip, pectoralis major adducts the arm at the shoulder, and latissimus dorsi also adducts the arm at the shoulder. However, the soleus muscle only performs plantarflexion (pointing the foot downward) at the ankle joint. The soleus is located deep to the gastrocnemius in the posterior calf and works with the gastrocnemius to form the Achilles tendon. Unlike muscles that cross the hip or shoulder joints horizontally, the soleus runs vertically and only affects sagittal plane movement at the ankle, not frontal plane adduction movements."""
    new_50 = """🎯 **Key Concept**: Adduction = moving body parts toward midline. Gracilis adducts thigh, pec major adducts arm, lat dorsi adducts arm. Soleus only plantarflexes (points toes down).\\n\\n💡 **Memory Tip**: SOLE SURVIVOR! The SOLEus is the sole survivor that doesn't adduct! It just points toes down (plantarflexion).\\n\\n⚠️ **Exam Alert**: Don't assume all muscles adduct. Soleus runs vertically in the calf and only affects sagittal plane movement (up/down), not frontal plane adduction (side-to-side).\\n\\n✅ **Why Correct**: Soleus is deep to gastrocnemius, forms Achilles tendon, and exclusively performs plantarflexion at ankle joint. No horizontal crossing = no adduction!"""

    if old_50 in content:
        content = content.replace(old_50, new_50)
        conversions.append(50)
        print("Found and converted Q50")

# Write the file
with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Converted: {sorted(conversions)}")
print(f"Total: {len(conversions)}")
