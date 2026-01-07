#!/usr/bin/env python3
"""
Convert topic_explanation for questions 49-96 to markdown format with emojis.
"""

import re

# Read the file
with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the conversions for each question
conversions = {
    49: {
        "old": r'"topic_explanation": "This assessment finding is a key diagnostic indicator in massage therapy\. Active movement requires muscle contraction to produce motion, while passive movement involves an external force \(therapist\) moving the joint while muscles remain relaxed\. Pain only with active movement indicates the contractile tissues \(muscles and tendons\) are the source of dysfunction, as they\'re only engaged during active motion\. This could suggest muscle strain, tendonitis, or myofascial trigger points\. Conversely, pain during both active AND passive movement typically indicates joint, ligament, or capsular involvement since these structures are stressed regardless of how the movement occurs\.",',
        "new": r'"topic_explanation": "🎯 **Key Concept**: Active movement requires muscle contraction while passive movement involves external force (therapist) with relaxed muscles. Pain only with active = contractile tissue issue.\\n\\n💡 **Memory Tip**: Active actors = muscle actors! If it hurts when the client is the \'actor\' (active) but not when you\'re the \'actor\' (passive), muscles are the problem!\\n\\n⚠️ **Exam Alert**: Pain during BOTH active AND passive = joint/ligament issue, not muscle. Don\'t confuse these!\\n\\n✅ **Why Correct**: Muscles and tendons only engage during active motion, so pain exclusively during active movement pinpoints muscle strain, tendonitis, or trigger points.",'
    },
    50: {
        "old": r'"topic_explanation": "Adduction means moving a body part toward the midline of the body\. Gracilis adducts the thigh at the hip, pectoralis major adducts the arm at the shoulder, and latissimus dorsi also adducts the arm at the shoulder\. However, the soleus muscle only performs plantarflexion \(pointing the foot downward\) at the ankle joint\. The soleus is located deep to the gastrocnemius in the posterior calf and works with the gastrocnemius to form the Achilles tendon\. Unlike muscles that cross the hip or shoulder joints horizontally, the soleus runs vertically and only affects sagittal plane movement at the ankle, not frontal plane adduction movements\.",',
        "new": r'"topic_explanation": "🎯 **Key Concept**: Adduction = moving body parts toward midline. Gracilis adducts thigh, pec major adducts arm, lat dorsi adducts arm. Soleus only plantarflexes (points toes down).\\n\\n💡 **Memory Tip**: SOLE SURVIVOR! The SOLEus is the sole survivor that doesn\'t adduct! It just points toes down (plantarflexion).\\n\\n⚠️ **Exam Alert**: Don\'t assume all muscles adduct. Soleus runs vertically in the calf and only affects sagittal plane movement (up/down), not frontal plane adduction (side-to-side).\\n\\n✅ **Why Correct**: Soleus is deep to gastrocnemius, forms Achilles tendon, and exclusively performs plantarflexion at ankle joint. No horizontal crossing = no adduction!",'
    },
    51: {
        "old": r'"topic_explanation": "The olecranon process is the prominent bony projection at the posterior elbow - the \'funny bone\' area\. The triceps brachii muscle has three heads \(long, lateral, and medial\) that converge into a single tendon inserting directly onto the olecranon process\. Repetitive elbow extension motions common in carpentry \(hammering, lifting, pushing\) can cause triceps tendonitis or inflammation at this insertion point\. This condition is sometimes called \'olecranon bursitis\' when the bursa is involved\. The triceps is the primary elbow extensor, so overuse from occupational activities frequently affects this muscle-tendon unit\. Biceps and deltoid do not attach to the olecranon process\.",',
        "new": r'"topic_explanation": "🎯 **Key Concept**: The olecranon process is the prominent bony projection at the posterior elbow (the \'funny bone\' area). Triceps brachii has three heads that converge into one tendon inserting directly onto the olecranon.\\n\\n💡 **Memory Tip**: TRI-TIP AT THE TIP! TRIceps attaches at the olecranon TIP! Think \'three heads, one tip\' - all three triceps heads meet at this bony point.\\n\\n⚠️ **Exam Alert**: Biceps inserts on radial tuberosity (anterior arm), not olecranon. Deltoid inserts on deltoid tuberosity of humerus (shoulder), not elbow. Only triceps inserts on olecranon!\\n\\n✅ **Why Correct**: Repetitive elbow extension in carpentry (hammering, pushing) causes triceps tendonitis at this insertion point. Triceps is the primary elbow extensor, making it vulnerable to occupational overuse.",'
    },
}

# Apply each conversion
for question_id, replacement in conversions.items():
    pattern = replacement["old"]
    new_text = replacement["new"]

    if re.search(pattern, content):
        content = re.sub(pattern, new_text, content, count=1)
        print(f"✅ Converted question {question_id}")
    else:
        print(f"⚠️  Could not find pattern for question {question_id}")

# Write the updated content
with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Conversion complete!")
