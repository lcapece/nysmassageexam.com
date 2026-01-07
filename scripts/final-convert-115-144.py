#!/usr/bin/env python3
"""
Convert topic_explanation fields for questions 115-144 to markdown format.
"""

# Read the file
with open('C:\\git\\nysmassageexam.com\\data\\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

conversions = [
    # Q115
    (
        "Protein absorption begins in the small intestine, specifically the duodenum and jejunum. While protein digestion starts in the stomach with pepsin breaking proteins into smaller polypeptides, actual absorption of amino acids and small peptides occurs only in the small intestine. The stomach's acidic environment and enzymes digest but don't absorb proteins. Pancreatic enzymes (trypsin, chymotrypsin) and intestinal brush border enzymes complete protein breakdown into absorbable amino acids. The small intestine's villi and microvilli provide massive surface area for absorption. This distinction between digestion (breaking down) and absorption (taking up nutrients into bloodstream) is crucial for understanding digestive physiology.",
        "🎯 **Key Concept**: Protein **absorption** begins in the **small intestine** (duodenum/jejunum). Digestion starts in stomach, but absorption happens only in small intestine!\\n\\n💡 **Memory Tip**: Small but MIGHTY! Think 'Small = Soak up' (absorption). Stomach DIGESTS, small intestine ABSORBS!\\n\\n⚠️ **Exam Alert**: Don't confuse digestion (breaking down) with absorption (taking up into bloodstream). Stomach = digest only, NOT absorb!\\n\\n✅ **Why Correct**: Stomach uses pepsin/acid to digest but doesn't absorb. Pancreatic enzymes (trypsin, chymotrypsin) + brush border enzymes complete breakdown. Villi/microvilli provide massive surface area for absorption of amino acids."
    ),
    # Q116
    (
        "When lupus is in subacute stage and physician-approved, massage as usual is appropriate. Lupus has three stages: acute (flare-up - contraindicated), subacute (manageable symptoms), and chronic/remission (generally safe). Subacute means the condition is present but not in active flare. With medical clearance, normal massage protocols apply. The key factors are: physician approval, subacute (not acute) stage, and established client relationship. Lupus patients often benefit from massage for pain relief, stress reduction, and improved circulation. Avoid massage during acute flares (fever, severe joint pain, rashes), but subacute stages with medical approval indicate the condition is stable enough for therapeutic benefits.",
        "🎯 **Key Concept**: When lupus is in **subacute stage** and **physician-approved**, massage as usual is appropriate. Subacute = manageable symptoms, not active flare.\\n\\n💡 **Memory Tip**: Doctor's Orders = Green Light GO! When doc says 'massage indicated' for subacute lupus, proceed as USUAL. Think 'Subacute = Suitable for usual massage'!\\n\\n⚠️ **Exam Alert**: Lupus stages: Acute (flare-up, contraindicated), Subacute (manageable, safe with MD approval), Chronic/Remission (generally safe). Key: physician approval!\\n\\n✅ **Why Correct**: With medical clearance and stable subacute stage, normal massage benefits include pain relief, stress reduction, improved circulation. Avoid during acute flares (fever, severe joint pain, rashes)."
    ),
    # Q117
    (
        "In Traditional Chinese Medicine, Yang represents the active, energetic, warm, and dynamic principles of life. While Yin embodies passive, cool, and material aspects, Yang is pure energy, movement, and transformation. Jing refers to essential life essence stored in the kidneys. Yang energy governs metabolic processes, circulation, and all active functions. Understanding this concept helps massage therapists work with clients who practice TCM or receive acupuncture, as Yang deficiency can manifest as fatigue, cold extremities, and sluggish healing.",
        "🎯 **Key Concept**: In TCM, **Yang** represents active, energetic, warm, dynamic principles - pure **energy, movement, and transformation** (vs. Yin = material/passive).\\n\\n💡 **Memory Tip**: YANG = YELLING with ACTIVITY and ENERGY! Yang sounds like 'YANK' - yanking things into motion with force and energy!\\n\\n⚠️ **Exam Alert**: Don't confuse with Jing (essential life essence/battery reserve) or Yin (passive, material, cool, structure). Yang = ENERGY in motion!\\n\\n✅ **Why Correct**: Yang governs metabolic processes, circulation, all active functions. Yang deficiency = fatigue, cold extremities, sluggish healing. Yin = substance/fluids/structure."
    ),
    # Q118
    (
        "The gluteus medius acts as a hip stabilizer during single-leg stance phase of walking. When stepping forward with the right foot, the left leg becomes the stance leg. The left gluteus medius must contract to prevent the right hip from dropping (Trendelenburg sign). If the left hip drops instead, it indicates weakness in the LEFT gluteus medius. This muscle is crucial for lateral pelvic stability and preventing compensatory gait patterns that can cause back pain and other issues.",
        "🎯 **Key Concept**: The **gluteus medius** acts as hip stabilizer during single-leg stance. If left hip drops when stepping on right foot, it indicates **weak LEFT gluteus medius** (Trendelenburg sign).\\n\\n💡 **Memory Tip**: TRENDELENBURG DROP = GLUTEUS MEDIUS FLOP! 'MEDIUS KEEPS YOU MEDIUM' - keeps pelvis level in the middle when you walk!\\n\\n⚠️ **Exam Alert**: Don't confuse with gluteus maximus (extends hip, stairs), iliopsoas (flexes hip), or rectus femoris (flexes hip/extends knee). Gluteus medius = LATERAL pelvic stability!\\n\\n✅ **Why Correct**: Crucial for lateral pelvic stability during single-leg stance phase. Prevents compensatory gait patterns that cause back pain and other issues."
    ),
    # Q119
    (
        "Type I diabetics have compromised circulation and delayed wound healing due to high blood glucose damaging blood vessels and nerves. The primary concern is overall skin integrity - checking for cuts, bruises, infections, or areas of breakdown that may not heal properly. Diabetics often have decreased sensation (neuropathy) and may not notice injuries. Any massage-induced micro-trauma could become problematic. Always perform thorough skin assessment and use lighter pressure. Document any findings and avoid areas of compromised skin integrity.",
        "🎯 **Key Concept**: For Type I diabetics, the primary concern is **overall skin integrity** - checking for cuts, bruises, infections, or breakdown that may not heal properly.\\n\\n💡 **Memory Tip**: DIABETES = DELAYED HEALING! 'SKIN INTEGRITY CHECK' - Sugar damages vessels, slow healing wrecks! Check skin before you begin!\\n\\n⚠️ **Exam Alert**: Don't focus on retinopathy (eyes, not massage-relevant) or just hair condition (too narrow). Full assessment: wounds, sensation, healing capacity!\\n\\n✅ **Why Correct**: High glucose damages blood vessels/nerves. Diabetics have decreased sensation (neuropathy), may not notice injuries. Any massage micro-trauma could become problematic. Use lighter pressure, document findings."
    ),
    # Q120
    (
        "Massage therapy can lower blood glucose levels by improving circulation and insulin sensitivity. Type II diabetics, especially those on medications, risk hypoglycemia (low blood sugar) after massage. Symptoms include shakiness, sweating, confusion, dizziness, and rapid heartbeat. Clients should monitor themselves for 2-4 hours post-massage and have a glucose source available (juice, glucose tablets). This is particularly important for clients on insulin or sulfonylurea medications. Always educate diabetic clients about this potential reaction.",
        "🎯 **Key Concept**: Massage can lower blood glucose levels. Type II diabetics risk **hypoglycemia** (low blood sugar) after massage, especially those on medications.\\n\\n💡 **Memory Tip**: MASSAGE MOVES GLUCOSE! 'HYPO-WATCH' - Massage can lower blood sugar, so watch for the shakes, sweats, and confusion!\\n\\n⚠️ **Exam Alert**: Hot/cold packs are contraindicated for diabetics (decreased sensation, burn risk, poor circulation). The answer is hypoglycemia monitoring!\\n\\n✅ **Why Correct**: Symptoms: shakiness, sweating, confusion, dizziness, rapid heartbeat. Monitor 2-4 hours post-massage. Have glucose source available (juice, tablets). Critical for insulin/sulfonylurea users."
    ),
    # Q121
    (
        "TMJ dysfunction with clicking and chewing pain primarily involves the muscles of mastication. The masseter (located at the jaw angle) and temporalis (fan-shaped muscle covering the temporal bone) are the primary muscles that close the jaw and generate chewing force. These muscles become tight, trigger-pointed, and painful with TMJ disorders, teeth grinding, and jaw clenching. Treatment focuses on releasing tension in these muscles through gentle massage, trigger point work, and client education about jaw habits.",
        "🎯 **Key Concept**: TMJ dysfunction with clicking/chewing pain primarily involves **masseter** (jaw angle) and **temporalis** (temple) - the muscles of mastication that close the jaw.\\n\\n💡 **Memory Tip**: JAW PAIN = CHEWING STRAIN! 'MASS-ETER and TEMP-ORALIS' - MASS (big) muscle at jaw angle, TEMPORAL muscle at your temple!\\n\\n⚠️ **Exam Alert**: Not buccinator (keeps food between teeth) or orbicularis oris (lips), not SCM/scalenes (neck). Mastication muscles = masseter + temporalis!\\n\\n✅ **Why Correct**: These muscles become tight, trigger-pointed, painful with TMJ disorders, grinding, clenching. Treatment: gentle massage, trigger point work, client education about jaw habits."
    ),
    # Q122
    (
        "The parotid lymph nodes are located anterior (in front of) and inferior (below) the ear, closely associated with the parotid salivary gland. These superficial lymph nodes drain lymphatic fluid from the temporal region, upper face, and parts of the external ear. They're part of the head and neck lymphatic system that massage therapists encounter when working on facial and cranial areas. The parotid nodes can become palpable when swollen due to infections or other conditions affecting the face and scalp regions.",
        "🎯 **Key Concept**: The **parotid lymph nodes** are located anterior (in front of) and inferior (below) the ear, associated with the parotid salivary gland.\\n\\n💡 **Memory Tip**: PAROTID sits by your EAR - think 'PARROT' sitting on your ear! Parrots love to be near ears to whisper secrets!\\n\\n⚠️ **Exam Alert**: Not facial lymph nodes (along jawline) or occipital (back of head). Parotid = specifically in FRONT of ear!\\n\\n✅ **Why Correct**: Drains temporal region, upper face, external ear parts. Part of head/neck lymphatic system. Becomes palpable when swollen from infections affecting face/scalp."
    ),
    # Q123
    (
        "The thoracic duct is the largest lymphatic vessel in the body, collecting lymph from approximately three-quarters of the body (everything except the right upper quadrant). It travels up through the thorax and empties into the venous system at the junction of the left subclavian and left internal jugular veins. This is crucial for returning filtered lymphatic fluid back to the bloodstream. The right lymphatic duct handles the remaining quarter, draining into the right subclavian vein. This knowledge helps massage therapists understand lymphatic drainage patterns.",
        "🎯 **Key Concept**: The **thoracic duct** is the largest lymphatic vessel, collecting lymph from **3/4 of the body** and emptying into the **left subclavian vein** (at junction with left internal jugular).\\n\\n💡 **Memory Tip**: Thoracic duct LOVES the LEFT - drains 3/4 of lymph into LEFT subclavian vein! Think 'Three-quarters LEFT at the subclavian CLUB'!\\n\\n⚠️ **Exam Alert**: Not axillary lymph nodes (filtering stations), not inferior vena cava (blood return), not hepatic duct (bile). Thoracic duct → LEFT subclavian vein!\\n\\n✅ **Why Correct**: Crucial for returning filtered lymphatic fluid to bloodstream. Right lymphatic duct handles remaining 1/4, draining to right subclavian. Essential for understanding lymphatic drainage patterns."
    ),
    # Q124 - continuing in next part due to length
]

# Apply replacements
for old_text, new_text in conversions:
    if old_text in content:
        content = content.replace(old_text, new_text)
        print(f"[OK] Converted question")
    else:
        print(f"[SKIP] Text not found - may be already converted")

# Write back
with open('C:\\git\\nysmassageexam.com\\data\\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nConversion complete for questions 115-123!")
