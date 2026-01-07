#!/usr/bin/env python3
"""
Convert topic_explanation fields for questions 193-240 to markdown format.
CRITICAL: Must use \\n\\n escape sequence, not actual newlines!
"""

import re

# Read the file
with open('C:\\git\\nysmassageexam.com\\data\\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# First, let's fix the ones that were already converted with actual newlines
# Convert multi-line topic_explanation back to single line with \\n\\n

# Fix question 199
content = content.replace(
    '"topic_explanation": "🎯 **Key Concept**: The Lung meridian governs both skin and respiratory function in TCM.\n\n💡 **Memory Tip**: LUNG-zema! Both eczema and asthma affect breathing - eczema makes skin breathe poorly, asthma makes lungs breathe poorly!\n\n⚠️ **Exam Alert**: Lungs control the dispersal of defensive qi (wei qi) to the skin surface, making them responsible for skin health and immunity. When lung qi is deficient or blocked, it manifests as both respiratory issues and skin problems.\n\n✅ **Why Correct**: The saying \'lungs govern skin and hair\' reflects this connection. Lung meridian points like LU-5, LU-9, and LU-11 treat both conditions by strengthening lung qi."',
    '"topic_explanation": "🎯 **Key Concept**: The Lung meridian governs both skin and respiratory function in TCM.\\n\\n💡 **Memory Tip**: LUNG-zema! Both eczema and asthma affect breathing - eczema makes skin breathe poorly, asthma makes lungs breathe poorly!\\n\\n⚠️ **Exam Alert**: Lungs control the dispersal of defensive qi (wei qi) to the skin surface, making them responsible for skin health and immunity. When lung qi is deficient or blocked, it manifests as both respiratory issues and skin problems.\\n\\n✅ **Why Correct**: The saying \'lungs govern skin and hair\' reflects this connection. Lung meridian points like LU-5, LU-9, and LU-11 treat both conditions by strengthening lung qi."'
)

# Fix question 200
content = content.replace(
    '"topic_explanation": "🎯 **Key Concept**: Passive ROM is contraindicated in acute rheumatoid arthritis because the joints are actively inflamed, swollen, and painful.\n\n💡 **Memory Tip**: ACUTE RA = ABSOLUTELY NO! Active inflammation means NO passive movement - you\'ll make the fire worse!\n\n⚠️ **Exam Alert**: Movement during acute flares can increase inflammation, damage already compromised joint structures, and cause severe pain. RA involves autoimmune destruction of synovial tissue.\n\n✅ **Why Correct**: Treatment during acute RA focuses on rest, anti-inflammatory measures, and gentle positioning. Passive ROM is only appropriate during remission phases when inflammation subsides."',
    '"topic_explanation": "🎯 **Key Concept**: Passive ROM is contraindicated in acute rheumatoid arthritis because the joints are actively inflamed, swollen, and painful.\\n\\n💡 **Memory Tip**: ACUTE RA = ABSOLUTELY NO! Active inflammation means NO passive movement - you\'ll make the fire worse!\\n\\n⚠️ **Exam Alert**: Movement during acute flares can increase inflammation, damage already compromised joint structures, and cause severe pain. RA involves autoimmune destruction of synovial tissue.\\n\\n✅ **Why Correct**: Treatment during acute RA focuses on rest, anti-inflammatory measures, and gentle positioning. Passive ROM is only appropriate during remission phases when inflammation subsides."'
)

# Now add the remaining questions 201-210
conversions = [
    # Q201
    (
        "Acute whiplash (within 24-72 hours) involves tissue trauma, inflammation, and potential structural damage to cervical vertebrae, discs, and soft tissues. Even with medical prescription, direct neck work is contraindicated during the acute inflammatory phase. Early intervention can exacerbate inflammation and cause further tissue damage. Instead, focus on areas away from injury site, gentle positioning, ice application, and supportive care. Neck-specific work should wait until acute inflammation subsides (typically 3-5 days) and symptoms begin stabilizing.",
        "🎯 **Key Concept**: Acute whiplash (within 24-72 hours) involves tissue trauma, inflammation, and potential structural damage to cervical vertebrae, discs, and soft tissues.\\n\\n💡 **Memory Tip**: 24-Hour WAIT Rule - Whiplash Acute = Wait! Don't rush to touch the neck - inflammation needs time to settle first!\\n\\n⚠️ **Exam Alert**: Even with medical prescription, direct neck work is contraindicated during the acute inflammatory phase. Early intervention can exacerbate inflammation and cause further tissue damage.\\n\\n✅ **Why Correct**: Neck-specific work should wait until acute inflammation subsides (typically 3-5 days). Instead, focus on areas away from injury site, gentle positioning, ice application, and supportive care."
    ),
    # Q202
    (
        "Rocking stimulates the parasympathetic nervous system, our 'rest and digest' response. This gentle, rhythmic movement activates mechanoreceptors that send calming signals to the brain, triggering parasympathetic dominance. This results in decreased heart rate, lowered blood pressure, increased digestion, and overall relaxation. The repetitive, soothing nature of rocking mimics the comfort experienced in the womb, naturally promoting a parasympathetic state. This is why rocking techniques are excellent for stress relief and relaxation in massage therapy.",
        "🎯 **Key Concept**: Rocking stimulates the parasympathetic nervous system, our 'rest and digest' response.\\n\\n💡 **Memory Tip**: Rock-a-bye baby = RELAX! Rocking = Rest & digest = paRasympathetic. When you rock someone gently, they get sleepy and calm (like a baby being rocked to sleep).\\n\\n⚠️ **Exam Alert**: This gentle, rhythmic movement activates mechanoreceptors that send calming signals to the brain, triggering parasympathetic dominance. Results include decreased heart rate, lowered blood pressure, increased digestion, and overall relaxation.\\n\\n✅ **Why Correct**: The repetitive, soothing nature of rocking mimics the comfort experienced in the womb, naturally promoting a parasympathetic state. This is why rocking techniques are excellent for stress relief and relaxation in massage therapy."
    ),
    # Q203
    (
        "The Achilles tendon connects the gastrocnemius and soleus muscles to the calcaneus (heel bone). When these calf muscles contract, they pull on the Achilles tendon to produce plantarflexion - pointing the foot downward. Complete severance eliminates this connection, making plantarflexion impossible. The other movements (dorsiflexion, inversion, eversion) are controlled by different muscle groups: tibialis anterior for dorsiflexion, tibialis posterior for inversion, and peroneal muscles for eversion. These remain intact with isolated Achilles injury.",
        "🎯 **Key Concept**: The Achilles tendon connects the gastrocnemius and soleus muscles to the calcaneus (heel bone). When these calf muscles contract, they pull on the Achilles tendon to produce plantarflexion - pointing the foot downward.\\n\\n💡 **Memory Tip**: Achilles = Point your toes! Think 'Achilles heel kick' - you kick DOWN (plantarflex) with your heel/calf. No Achilles = No pointing toes down = No plantarflex!\\n\\n⚠️ **Exam Alert**: Complete severance eliminates this connection, making plantarflexion impossible. The other movements are controlled by different muscle groups.\\n\\n✅ **Why Correct**: Dorsiflexion (tibialis anterior), inversion (tibialis posterior), and eversion (peroneal muscles) remain intact with isolated Achilles injury."
    ),
    # Q204
    (
        "In Traditional Chinese Medicine, the Spleen (SP) meridian governs blood circulation and vessel integrity. The spleen is responsible for transforming and transporting nutrients, and maintaining blood within vessels. Varicose veins represent blood stasis and weakened vessel walls, indicating spleen qi deficiency. The spleen meridian runs along the medial aspect of the legs where varicose veins commonly appear. When spleen qi is weak, it cannot properly hold blood in vessels or maintain healthy circulation, leading to pooling and varicosities.",
        "🎯 **Key Concept**: In Traditional Chinese Medicine, the Spleen (SP) meridian governs blood circulation and vessel integrity.\\n\\n💡 **Memory Tip**: SP = Spleen = SuPports circulation! Varicose veins = bad circulation = Spleen meridian problem. Think 'SPider veins need SPleen support!'\\n\\n⚠️ **Exam Alert**: Varicose veins represent blood stasis and weakened vessel walls, indicating spleen qi deficiency. The spleen meridian runs along the medial aspect of the legs where varicose veins commonly appear.\\n\\n✅ **Why Correct**: When spleen qi is weak, it cannot properly hold blood in vessels or maintain healthy circulation, leading to pooling and varicosities."
    ),
    # Q205
    (
        "The levator scapulae muscle originates from the transverse processes of C1-C4 vertebrae and inserts directly at the superior angle of the scapula. Its primary function is to elevate (lift) the scapula and assist in downward rotation. This muscle commonly becomes tight from sustained elevated shoulder postures, causing pain specifically at its insertion point - the superior angle. Trigger points and tension in the levator scapulae create a characteristic ache at the top corner of the shoulder blade, often radiating up the neck.",
        "🎯 **Key Concept**: The levator scapulae muscle originates from C1-C4 vertebrae and inserts directly at the superior angle of the scapula.\\n\\n💡 **Memory Tip**: Levator = ELEVATor goes UP! Superior angle is the TOP corner = Levator scapulae lifts/elevates = attaches at superior angle. 'Levator lifts the top!'\\n\\n⚠️ **Exam Alert**: This muscle commonly becomes tight from sustained elevated shoulder postures, causing pain specifically at its insertion point - the superior angle.\\n\\n✅ **Why Correct**: Trigger points and tension in the levator scapulae create a characteristic ache at the top corner of the shoulder blade, often radiating up the neck."
    ),
    # Q206
    (
        "Effleurage stroke speed directly affects nervous system response through mechanoreceptor stimulation. Slow, gentle effleurage activates large-diameter nerve fibers that promote parasympathetic (relaxation) responses, creating sedating effects. The rhythmic, prolonged pressure calms the nervous system. Fast effleurage stimulates more mechanoreceptors rapidly, activating sympathetic responses and increasing alertness and circulation. This principle applies regardless of pressure depth - speed is the key variable determining whether the stroke is calming or energizing.",
        "🎯 **Key Concept**: Effleurage stroke speed directly affects nervous system response through mechanoreceptor stimulation.\\n\\n💡 **Memory Tip**: SLOW = SLEEPY (sedating). FAST = FIRED UP (stimulating). Think 'Slow songs make you sleepy, fast songs fire you up!' Same with massage strokes.\\n\\n⚠️ **Exam Alert**: Slow, gentle effleurage activates large-diameter nerve fibers that promote parasympathetic (relaxation) responses. Fast effleurage stimulates more mechanoreceptors rapidly, activating sympathetic responses.\\n\\n✅ **Why Correct**: Speed is the key variable determining whether the stroke is calming or energizing, regardless of pressure depth."
    ),
    # Q207
    (
        "Healed lacerations often develop scar tissue with collagen fibers laid down haphazardly, creating adhesions and restricted mobility. Cross fiber friction is the gold standard for scar tissue because it applies pressure perpendicular to fiber direction, mechanically breaking up adhesions and realigning collagen. This technique increases tissue pliability and reduces tightness. Effleurage and petrissage work with fiber direction and lack the specific mechanical force needed to address scar tissue restrictions. Always ensure scars are fully healed before applying friction techniques.",
        "🎯 **Key Concept**: Cross fiber friction is the gold standard for scar tissue because it applies pressure perpendicular to fiber direction, mechanically breaking up adhesions and realigning collagen.\\n\\n💡 **Memory Tip**: Scar tissue is like tangled yarn - Cross Fiber Friction 'CuFFs' it back into order by breaking up adhesions across the grain!\\n\\n⚠️ **Exam Alert**: Healed lacerations develop scar tissue with collagen fibers laid down haphazardly, creating adhesions and restricted mobility. Effleurage and petrissage work with fiber direction and lack the specific mechanical force needed.\\n\\n✅ **Why Correct**: This technique increases tissue pliability and reduces tightness. Always ensure scars are fully healed before applying friction techniques."
    ),
    # Q208
    (
        "The trapezius is the most superficial muscle of the upper back, forming a diamond/kite shape from occiput to T12 and spanning both shoulders. It has three parts: upper (elevates shoulders), middle (retracts scapula), and lower (depresses scapula). Being most superficial makes it easily palpable and commonly tight from postural stress. The rhomboids lie deep to the middle trap, while latissimus dorsi is more lateral and inferior. Understanding muscle layers is crucial for effective treatment - you must address superficial restrictions before accessing deeper tissues.",
        "🎯 **Key Concept**: The trapezius is the most superficial muscle of the upper back, forming a diamond/kite shape from occiput to T12 and spanning both shoulders.\\n\\n💡 **Memory Tip**: TRAP on TOP - Trapezius is the Topmost muscle you can see, like a cape TRAPped on Superman's back!\\n\\n⚠️ **Exam Alert**: It has three parts: upper (elevates shoulders), middle (retracts scapula), and lower (depresses scapula). Being most superficial makes it easily palpable and commonly tight from postural stress.\\n\\n✅ **Why Correct**: The rhomboids lie deep to the middle trap, while latissimus dorsi is more lateral and inferior. You must address superficial restrictions before accessing deeper tissues."
    ),
    # Q209
    (
        "The skeleton divides into axial (central axis) and appendicular (appendages/limbs) systems. The axial skeleton includes skull, vertebral column, and rib cage - essentially the central core. The appendicular skeleton includes all limb bones (arms, legs) and their attachment points (shoulder and pelvic girdles). The humerus, being the upper arm bone, is clearly appendicular. This distinction is important for understanding body mechanics, as appendicular bones create movement while axial bones provide stability and protect vital organs.",
        "🎯 **Key Concept**: The skeleton divides into axial (central axis) and appendicular (appendages/limbs) systems.\\n\\n💡 **Memory Tip**: ARMS and LEGS Append to your body - Humerus is in your ARM, so it's Appendicular! Axial = AXis (spine/skull), Appendicular = APPendages (limbs)!\\n\\n⚠️ **Exam Alert**: The axial skeleton includes skull, vertebral column, and rib cage. The appendicular skeleton includes all limb bones and their attachment points (shoulder and pelvic girdles).\\n\\n✅ **Why Correct**: The humerus, being the upper arm bone, is clearly appendicular. Appendicular bones create movement while axial bones provide stability and protect vital organs."
    ),
    # Q210
    (
        "The gastrocnemius has two actions: plantarflexion (pointing foot down) and knee flexion (bending knee). To stretch any muscle, you do the opposite of its actions. Therefore, to stretch gastrocnemius, you must dorsiflex the foot (opposite of plantarflex) AND extend the knee (opposite of flex). Both actions must occur simultaneously because gastrocnemius crosses both ankle and knee joints. This distinguishes it from soleus, which only crosses the ankle and only requires dorsiflexion to stretch.",
        "🎯 **Key Concept**: The gastrocnemius has two actions: plantarflexion (pointing foot down) and knee flexion (bending knee). To stretch it, you must do the opposite of both actions.\\n\\n💡 **Memory Tip**: 'Gas-TROCK' needs TWO things: Dorsiflex foot AND extend knee - it crosses TWO joints! Think 'opposite of both actions!'\\n\\n⚠️ **Exam Alert**: To stretch any muscle, you do the opposite of its actions. Therefore, dorsiflex the foot (opposite of plantarflex) AND extend the knee (opposite of flex).\\n\\n✅ **Why Correct**: Both actions must occur simultaneously because gastrocnemius crosses both ankle and knee joints. This distinguishes it from soleus, which only crosses the ankle."
    ),
]

# Apply conversions
for old_text, new_text in conversions:
    old_escaped = re.escape(old_text)
    content = re.sub(old_escaped, new_text, content)

# Write the file back
with open('C:\\git\\nysmassageexam.com\\data\\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Conversion complete for questions 193-210!")
