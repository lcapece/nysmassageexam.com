#!/usr/bin/env python3
"""
Convert topic_explanation fields for questions 193-240 to markdown format.
"""

import re

# Read the file
with open('C:\\git\\nysmassageexam.com\\data\\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the conversions for each question
conversions = {
    193: {
        'old': 'Endangerment sites are body areas where vital structures (nerves, blood vessels, organs) lie close to the surface with minimal protective tissue. The sternal notch (suprasternal notch) is the depression at the top of the sternum where the trachea, major blood vessels, and thyroid gland are vulnerable to pressure. Deep pressure here can compress airways or blood vessels. Other common endangerment sites include the posterior triangle of the neck, axilla, and femoral triangle. Therapists must use only light pressure or avoid these areas entirely.',
        'new': '🎯 **Key Concept**: Endangerment sites are body areas where vital structures (nerves, blood vessels, organs) lie close to the surface with minimal protective tissue.\\n\\n💡 **Memory Tip**: NOTCH = NO TOUCH! The sternal notch is that hollow at the top of your sternum.\\n\\n⚠️ **Exam Alert**: The sternal notch (suprasternal notch) is where the trachea, major blood vessels, and thyroid gland are vulnerable to pressure. Deep pressure here can compress airways or blood vessels.\\n\\n✅ **Why Correct**: Other common endangerment sites include the posterior triangle of the neck, axilla, and femoral triangle. Therapists must use only light pressure or avoid these areas entirely.'
    },
    194: {
        'old': "The refractory period is a brief recovery phase after a neuron fires an action potential. During this time, the neuron cannot generate another impulse regardless of stimulus strength. This occurs because sodium channels are inactivated and the cell membrane must repolarize before becoming excitable again. There are two phases: absolute refractory period (completely unresponsive) and relative refractory period (requires stronger stimulus). This mechanism prevents backward propagation of impulses and limits firing frequency, ensuring proper nerve signal transmission and preventing cellular damage.",
        'new': "🎯 **Key Concept**: The refractory period is a brief recovery phase after a neuron fires an action potential when the neuron cannot generate another impulse regardless of stimulus strength.\\n\\n💡 **Memory Tip**: REFRACTORY = RESTING & REFUSING! Like a tired worker taking a mandatory break, the neuron absolutely cannot fire again.\\n\\n⚠️ **Exam Alert**: There are two phases: absolute refractory period (completely unresponsive) and relative refractory period (requires stronger stimulus). Sodium channels are inactivated and the cell membrane must repolarize.\\n\\n✅ **Why Correct**: This mechanism prevents backward propagation of impulses and limits firing frequency, ensuring proper nerve signal transmission and preventing cellular damage."
    },
    195: {
        'old': "In Traditional Chinese Medicine, migraines are commonly associated with Liver (LR) and Gallbladder (GB) meridian imbalances. The Liver meridian governs smooth qi flow and emotional stress, while the Gallbladder meridian runs along the temporal region where many migraines manifest. Liver qi stagnation can cause ascending yang energy creating head pain, while GB meridian dysfunction affects the sides of the head. Key points include LR3 (Taichong) for calming liver yang and GB20 (Fengchi) for headache relief. This meridian pair addresses both the root cause (liver imbalance) and local symptoms (gallbladder pathway).",
        'new': "🎯 **Key Concept**: In Traditional Chinese Medicine, migraines are commonly associated with Liver (LR) and Gallbladder (GB) meridian imbalances.\\n\\n💡 **Memory Tip**: LIVER & GALLBLADDER = LIGHTS & GRINDING! LR/GB meridians treat the 'lights out' pain and 'grinding' tension of migraines.\\n\\n⚠️ **Exam Alert**: The Liver meridian governs smooth qi flow and emotional stress, while the Gallbladder meridian runs along the temporal region where migraines manifest. Liver qi stagnation causes ascending yang energy creating head pain.\\n\\n✅ **Why Correct**: Key points include LR3 (Taichong) for calming liver yang and GB20 (Fengchi) for headache relief. This meridian pair addresses both root cause and local symptoms."
    },
    196: {
        'old': "The tibialis anterior is the most superficial and easily palpated muscle among these options. Located on the anterior (front) compartment of the lower leg, it runs along the lateral edge of the tibia (shin bone) and is immediately beneath the skin with minimal overlying tissue. It's easily felt during dorsiflexion (pulling foot upward). In contrast, the other muscles are deeper, smaller, or hidden behind other structures. This muscle is commonly assessed for strength testing and is a reliable landmark for practitioners learning palpation skills.",
        'new': "🎯 **Key Concept**: The tibialis anterior is the most superficial and easily palpated muscle among these options.\\n\\n💡 **Memory Tip**: TIBIALIS ANTERIOR = TOTALLY ACCESSIBLE! It's right on the shin - you can't miss this surface superstar!\\n\\n⚠️ **Exam Alert**: Located on the anterior compartment of the lower leg, it runs along the lateral edge of the tibia and is immediately beneath the skin. It's easily felt during dorsiflexion (pulling foot upward).\\n\\n✅ **Why Correct**: The other muscles (tibialis posterior, plantaris, flexor digitorum longus) are deeper, smaller, or hidden behind other structures."
    },
    197: {
        'old': "In TCM theory, each organ system has a corresponding sensory opening. The Heart (HT) opens to the tongue, particularly the tip. This connection explains why tongue diagnosis is crucial in TCM - the tongue's color, coating, and appearance reflect heart health and blood circulation. A red tip may indicate heart fire, while a pale tip suggests heart qi deficiency. This organ-sensory relationship helps practitioners assess internal organ function through external examination, making tongue diagnosis a fundamental diagnostic tool.",
        'new': "🎯 **Key Concept**: In TCM theory, each organ system has a corresponding sensory opening. The Heart (HT) opens to the tongue, particularly the tip.\\n\\n💡 **Memory Tip**: Heart Tips - The heart opens to the tongue's tip, like a heart-shaped kiss on the tip of your lips!\\n\\n⚠️ **Exam Alert**: Tongue diagnosis is crucial in TCM - the tongue's color, coating, and appearance reflect heart health and blood circulation. A red tip may indicate heart fire, while a pale tip suggests heart qi deficiency.\\n\\n✅ **Why Correct**: This organ-sensory relationship helps practitioners assess internal organ function through external examination, making tongue diagnosis a fundamental diagnostic tool."
    },
    198: {
        'old': "Yin represents the material, substantial, and nourishing aspects in TCM. Yin organs are solid (liver, heart, spleen, lung, kidney) and store essential substances like qi, blood, and essence. They're located on the ventral (front/belly) side of the body. Yin is associated with rest, storage, nourishment, coolness, and substance. This contrasts with Yang, which is functional, hollow, and transformative. Understanding Yin's solid and ventral nature helps identify which organs need nourishing versus activating treatments.",
        'new': "🎯 **Key Concept**: Yin represents the material, substantial, and nourishing aspects in TCM. Yin organs are solid and located on the ventral (front/belly) side.\\n\\n💡 **Memory Tip**: Yin is IN - Solid organs are IN the body (internal), and Ventral is the front/belly side where you bend IN!\\n\\n⚠️ **Exam Alert**: Yin organs (liver, heart, spleen, lung, kidney) store essential substances like qi, blood, and essence. Yin is associated with rest, storage, nourishment, coolness, and substance.\\n\\n✅ **Why Correct**: This contrasts with Yang, which is functional, hollow, and transformative. Understanding Yin's solid and ventral nature helps identify which organs need nourishing versus activating treatments."
    },
    199: {
        'old': "The Lung meridian governs both skin and respiratory function in TCM. Lungs control the dispersal of defensive qi (wei qi) to the skin surface, making them responsible for skin health and immunity. When lung qi is deficient or blocked, it manifests as both respiratory issues (asthma) and skin problems (eczema). The saying 'lungs govern skin and hair' reflects this connection. Lung meridian points like LU-5, LU-9, and LU-11 are commonly used to treat both conditions by strengthening lung qi and improving its dispersal function.",
        'new': "🎯 **Key Concept**: The Lung meridian governs both skin and respiratory function in TCM.\\n\\n💡 **Memory Tip**: LUNG-zema! Both eczema and asthma affect breathing - eczema makes skin breathe poorly, asthma makes lungs breathe poorly!\\n\\n⚠️ **Exam Alert**: Lungs control the dispersal of defensive qi (wei qi) to the skin surface, making them responsible for skin health and immunity. When lung qi is deficient or blocked, it manifests as both respiratory issues and skin problems.\\n\\n✅ **Why Correct**: The saying 'lungs govern skin and hair' reflects this connection. Lung meridian points like LU-5, LU-9, and LU-11 treat both conditions by strengthening lung qi."
    },
    200: {
        'old': "Passive ROM is contraindicated in acute rheumatoid arthritis because the joints are actively inflamed, swollen, and painful. Movement during acute flares can increase inflammation, damage already compromised joint structures, and cause severe pain. RA involves autoimmune destruction of synovial tissue, and mechanical stress during acute phases accelerates this destruction. Treatment during acute RA focuses on rest, anti-inflammatory measures, and gentle positioning. Passive ROM is only appropriate during remission phases when inflammation subsides.",
        'new': "🎯 **Key Concept**: Passive ROM is contraindicated in acute rheumatoid arthritis because the joints are actively inflamed, swollen, and painful.\\n\\n💡 **Memory Tip**: ACUTE RA = ABSOLUTELY NO! Active inflammation means NO passive movement - you'll make the fire worse!\\n\\n⚠️ **Exam Alert**: Movement during acute flares can increase inflammation, damage already compromised joint structures, and cause severe pain. RA involves autoimmune destruction of synovial tissue.\\n\\n✅ **Why Correct**: Treatment during acute RA focuses on rest, anti-inflammatory measures, and gentle positioning. Passive ROM is only appropriate during remission phases when inflammation subsides."
    },
}

# Apply each conversion
for qid, conversion in conversions.items():
    old_text = conversion['old']
    new_text = conversion['new']

    # Find and replace the topic_explanation for this question
    # We need to be careful with regex special characters
    old_escaped = re.escape(old_text)
    content = re.sub(old_escaped, new_text, content)
    print(f"Converted question {qid}")

# Write the file back
with open('C:\\git\\nysmassageexam.com\\data\\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Conversion complete for questions 193-200!")
