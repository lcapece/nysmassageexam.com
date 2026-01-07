#!/usr/bin/env python3
"""
Convert topic_explanation for questions 97-144 to markdown format with emojis
"""

import re

# Read the file
with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define all the replacements for questions 97-144
# Each tuple: (question_id, old_text, new_text)
replacements = [
    # Question 108
    (108,
     '"topic_explanation": "The Governing Vessel (Du Mai/GV) is one of the eight extraordinary meridians in Traditional Chinese Medicine that runs along the posterior midline of the body. It travels from the perineum, up the spine, over the crown of the head, and down to the upper lip - following the exact midsagittal plane. This meridian \'governs\' all yang meridians and is crucial for spinal health and neurological function. Unlike the bilateral meridians (GB, BL, etc.) that run on both sides of the body, the Governing Vessel is singular and central, making it unique among the meridian system.",',
     '"topic_explanation": "🎯 **Key Concept**: The **Governing Vessel** (Du Mai/GV) runs along the posterior midline - the exact **midsagittal plane** from perineum → spine → head crown → upper lip.\\n\\n💡 **Memory Tip**: GV = GOVERNS the VERTICAL midline! Think \\"Governor sits at the CENTER of power\\" - right down the center spine!\\n\\n⚠️ **Exam Alert**: Not GB or BL (bilateral, on both sides). Governing Vessel is SINGULAR and CENTRAL - the only major meridian on the midsagittal plane!\\n\\n✅ **Why Correct**: One of eight extraordinary meridians. \'Governs\' all yang meridians. Crucial for spinal health and neurological function. Unlike bilateral meridians, it\'s unique and central.",'),

    # Question 109
    (109,
     '"topic_explanation": "Venous valves are one-way structures within veins that prevent blood from flowing backward due to gravity. When standing, blood in the legs must travel upward against gravitational force to return to the heart. These pocket-like valves open to allow blood flow toward the heart and snap shut when blood tries to flow backward. Without functional valves, blood would pool in the lower extremities causing venous insufficiency, varicose veins, and edema. While muscle contractions help pump blood (muscle pump mechanism), the valves are the primary mechanism preventing gravitational backflow in the standing position.",',
     '"topic_explanation": "🎯 **Key Concept**: **Venous valves** are one-way structures that prevent blood from flowing backward due to gravity when standing upright.\\n\\n💡 **Memory Tip**: VALVES are like tiny VELCRO - they GRIP and don\'t let blood slip backward! Think \'Valves Victory over Gravity!\' One-way doors that slam shut!\\n\\n⚠️ **Exam Alert**: Don\'t confuse with skeletal contractions (help pump, but don\'t prevent backflow). VALVES are the primary anti-gravity mechanism!\\n\\n✅ **Why Correct**: Pocket-like valves open for blood flow toward heart, snap shut to prevent backflow. Without them: venous insufficiency, varicose veins, edema. The muscle pump helps, but valves are key.",'),

    # Question 110
    (110,
     '"topic_explanation": "The medial epicondyle of the humerus serves as the common flexor origin where the wrist and finger flexor muscles attach via the common flexor tendon. This includes flexor carpi radialis, flexor carpi ulnaris, palmaris longus, and flexor digitorum superficialis. Friction applied to this area directly affects these flexor muscles and can treat conditions like golfer\'s elbow (medial epicondylitis). The medial epicondyle is located on the inner (thumb-side) aspect of the elbow and is the opposite of the lateral epicondyle where extensors attach.",',
     '"topic_explanation": "🎯 **Key Concept**: The **medial epicondyle** is the common flexor origin where **wrist/finger flexors** attach via common flexor tendon.\\n\\n💡 **Memory Tip**: Medial = Make fists! **MEDIAL epicondyle = FLEXORS** that make fists and bend wrists down! \'Medial Muscles Make\' - they\'re the grippers!\\n\\n⚠️ **Exam Alert**: Not extensors (lateral epicondyle) or intrinsic hand muscles (originate in hand). Medial = flexors, Lateral = extensors!\\n\\n✅ **Why Correct**: Includes flexor carpi radialis/ulnaris, palmaris longus, flexor digitorum superficialis. Friction here treats golfer\'s elbow (medial epicondylitis). Inner elbow, thumb-side aspect.",'),

    # Question 111
    (111,
     '"topic_explanation": "Clients on blood thinners (anticoagulants) require extreme caution because these medications reduce the blood\'s ability to clot, significantly increasing bleeding and bruising risk. Even moderate pressure can cause internal hemorrhaging, hematomas, or excessive bruising that may be difficult to control. Blood thinners include warfarin, heparin, and newer medications like rivaroxaban. Massage must be very gentle, avoiding deep pressure, friction, and percussive techniques. This condition poses immediate physical danger, unlike constipation (relatively minor) or recovering sprains (manageable with modifications).",',
     '"topic_explanation": "🎯 **Key Concept**: Clients on **blood thinners** (anticoagulants) require EXTREME caution - even moderate pressure can cause internal bleeding, hematomas, excessive bruising.\\n\\n💡 **Memory Tip**: BLOOD THINNERS = BRUISE MAKERS! Think \'Thin blood = Thick caution!\' Clients are \'fragile like tissue paper\' - light pressure only!\\n\\n⚠️ **Exam Alert**: This is the HIGHEST risk condition! Not constipation (minor) or sprains (localized). Blood thinners = systemic danger throughout entire body!\\n\\n✅ **Why Correct**: Medications (warfarin, heparin, rivaroxaban) reduce clotting ability. Use gentle massage only - avoid deep pressure, friction, percussive techniques. Immediate physical danger.",'),

    # Question 112
    (112,
     '"topic_explanation": "For cancer patients with edema, work proximal to distal as a treatment strategy. This approach is gentler and safer for compromised lymphatic systems. Cancer treatments often damage lymph nodes, creating fragile fluid dynamics. Starting proximally helps open pathways before addressing distal accumulation. The lymphatic system flows toward the heart, but in compromised patients, aggressive distal-to-proximal work can overwhelm damaged nodes. Proximal-to-distal strategy allows gentle preparation of tissues and avoids forcing fluid through potentially blocked or damaged lymphatic channels. This approach prioritizes comfort and safety over traditional lymphatic flow direction.",',
     '"topic_explanation": "🎯 **Key Concept**: For cancer patients with edema, work **proximal to distal** as a treatment strategy - gentler and safer for compromised lymphatic systems.\\n\\n💡 **Memory Tip**: Cancer Care = Comfort Central! Start at the CENTER (proximal) and work outward. Think \'Proximal for Protection\' - protecting delicate tissues!\\n\\n⚠️ **Exam Alert**: NOT distal-to-proximal (can overwhelm damaged lymph nodes). Direction MATTERS in cancer care! Proximal-to-distal = gentle pathway opening.\\n\\n✅ **Why Correct**: Cancer treatments damage lymph nodes, creating fragile fluid dynamics. Starting proximally opens pathways before addressing distal accumulation. Avoids forcing fluid through blocked/damaged channels. Prioritizes comfort and safety.",'),

    # Question 113
    (113,
     '"topic_explanation": "In reflexology, the big toe represents the head and brain. This follows reflexology\'s anatomical mapping where the foot mirrors the entire body. The toes correspond to the head region, with the big toe specifically representing the head, brain, and sometimes neck area. This mapping is based on the theory that specific points on the feet correspond to organs and body parts. The big toe\'s size and prominence make it the natural representative for the head - the body\'s control center. Reflexologists work this area to potentially influence head-related issues like headaches, stress, or mental clarity.",',
     '"topic_explanation": "🎯 **Key Concept**: In reflexology, the **big toe represents the head and brain** - following the anatomical mapping where the foot mirrors the entire body.\\n\\n💡 **Memory Tip**: Big Toe = Big Boss! The HEAD is the \'big boss\' of your body, so it gets the biggest toe. Think \'TOP toe = TOP of body\'!\\n\\n⚠️ **Exam Alert**: Not eyes (smaller toe points) or heart (ball of foot). Big toe = HEAD specifically! Toes = head region.\\n\\n✅ **Why Correct**: Big toe\'s size/prominence makes it natural representative for the head (body\'s control center). Reflexologists work this area for headaches, stress, mental clarity. Theory: specific foot points correspond to organs/body parts.",'),

    # Question 114
    (114,
     '"topic_explanation": "RICE stands for Rest, Ice, Compression, and Elevation - a standard acute injury protocol. Ice (the \'I\') is crucial for managing acute injuries in the first 24-48 hours. Ice causes vasoconstriction, reducing blood flow to injured tissues, which minimizes swelling, inflammation, and pain. Apply ice for 15-20 minutes every 2-3 hours initially. Ice slows cellular metabolism, reducing secondary tissue damage from lack of oxygen. Modern protocols sometimes use PRICE (adding Protection) or POLICE (adding Optimal Loading). The mnemonic helps remember this fundamental first aid approach that massage therapists must know for acute injury management and contraindications.",',
     '"topic_explanation": "🎯 **Key Concept**: RICE = **Rest, Ice, Compression, Elevation**. The \'I\' stands for **ICE** - crucial for acute injury management in first 24-48 hours.\\n\\n💡 **Memory Tip**: RICE is NICE when it\'s ICE! Think of putting ICE in your drink - the \'I\' makes it cold and reduces swelling!\\n\\n⚠️ **Exam Alert**: Not irritation or inflammation (those are what we\'re treating, not part of RICE). I = ICE!\\n\\n✅ **Why Correct**: Ice causes vasoconstriction, reducing blood flow, swelling, inflammation, pain. Apply 15-20 min every 2-3 hrs. Slows cellular metabolism, reduces secondary tissue damage. Modern variations: PRICE (Protection), POLICE (Optimal Loading).",'),
]

# Apply each replacement
for q_id, old_text, new_text in replacements:
    if old_text in content:
        content = content.replace(old_text, new_text)
        print(f"[OK] Converted question {q_id}")
    else:
        print(f"[SKIP] Could not find question {q_id} - may already be converted")

# Write the updated content back
with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nConversion complete for questions 108-114!")
