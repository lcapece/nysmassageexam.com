#!/usr/bin/env python3
"""Convert questions 73-84 to markdown format"""
import sys

with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

conversions = []

# Q73: Lung Meridian
old = """In Traditional Chinese Medicine's five-element theory, the lung meridian initiates the 24-hour energy circulation cycle, beginning at 3 AM. This system maps how qi (life energy) flows through twelve primary meridian pathways in a specific sequence over 24 hours. The lung governs respiration and is considered the 'master of qi,' making it the logical starting point for energy circulation. Each meridian is most active for two hours, with lung meridian active from 3-5 AM. This timing explains why respiratory issues often worsen in early morning hours and why breathing practices are fundamental to energy cultivation."""
new = """🎯 **Key Concept**: In Traditional Chinese Medicine's five-element theory, the lung meridian initiates the 24-hour energy circulation cycle, beginning at 3 AM. The lung governs respiration and is considered the 'master of qi.'\\n\\n💡 **Memory Tip**: LUNG Leads Life - Think 'First breath of life!' The energy cycle starts where life begins - with breathing. Lung meridian is like the ignition key that starts the energy engine!\\n\\n⚠️ **Exam Alert**: NOT Small Intestine (1-3 PM), NOT Bladder (3-5 PM), NOT Kidney (5-7 PM). Only LUNG meridian starts the cycle at 3 AM!\\n\\n✅ **Why Correct**: Each meridian is most active for two hours, with lung meridian active from 3-5 AM. This timing explains why respiratory issues often worsen in early morning hours and why breathing practices are fundamental to energy cultivation."""
if old in content:
    content = content.replace(old, new)
    conversions.append(73)

# Q74: Yin Characteristics
old = """In Traditional Chinese Medicine philosophy, yin represents the feminine, passive, receptive aspect of universal energy. Yin qualities include cold, soft, dark, moist, interior, descending, and restful characteristics. It contrasts with yang energy, which is hot, hard, bright, dry, exterior, ascending, and active. Yin governs the body's cooling and calming functions, including rest, nourishment, and tissue building. Understanding yin-yang balance is crucial for TCM diagnosis and treatment approaches. When yin is deficient, patients may experience heat symptoms, restlessness, or dryness. Therapeutic techniques aim to balance these opposing but complementary forces."""
new = """🎯 **Key Concept**: In TCM philosophy, yin represents the feminine, passive, receptive aspect of universal energy. Yin qualities include cold, soft, dark, moist, interior, descending, and restful characteristics.\\n\\n💡 **Memory Tip**: Yin = 'Chilly and Chill' - Think of a cool, soft moonlight night. Yin is the gentle, cooling, soft feminine energy that's receptive and nurturing, like a soft blanket on a cool evening.\\n\\n⚠️ **Exam Alert**: NOT deep and penetrating (that's yang - active and forceful). Yin = cold and soft. Yang = hot and hard. Don't confuse them!\\n\\n✅ **Why Correct**: Yin governs the body's cooling and calming functions, including rest, nourishment, and tissue building. When yin is deficient, patients may experience heat symptoms, restlessness, or dryness."""
if old in content:
    content = content.replace(old, new)
    conversions.append(74)

# Q75: Colles Fracture Treatment
old = """Colles' fracture is a specific type of wrist fracture involving the distal radius, typically occurring from falling on an outstretched hand. After cast removal, the primary issues are stiffness, muscle atrophy, reduced circulation, and limited range of motion in the hand, wrist, and fingers. Kneading techniques applied to the hand and fingers help restore circulation, reduce swelling, break up adhesions, and improve tissue mobility. The shoulder wasn't immobilized or injured, so focusing treatment on the actually affected area (hand/fingers) is most therapeutic. Gentle techniques are essential as tissues remain fragile during early healing phases."""
new = """🎯 **Key Concept**: Colles' fracture is a specific wrist fracture involving the distal radius, typically from falling on an outstretched hand. After cast removal, the primary issues are stiffness, muscle atrophy, reduced circulation, and limited ROM in the hand, wrist, and fingers.\\n\\n💡 **Memory Tip**: Colles = Close to Hand! Remember: Colles fracture = wrist break, so focus massage on Hand and fingers (where the problem is), not the shoulder (which wasn't injured).\\n\\n⚠️ **Exam Alert**: The shoulder wasn't immobilized or injured in Colles' fracture! Focus on the ACTUAL affected area (hand/fingers), not unrelated areas. Work where the problem is!\\n\\n✅ **Why Correct**: Kneading techniques applied to the hand and fingers help restore circulation, reduce swelling, break up adhesions, and improve tissue mobility. Gentle techniques are essential as tissues remain fragile during early healing."""
if old in content:
    content = content.replace(old, new)
    conversions.append(75)

# Q76: Menopause Symptoms
old = """Menopause typically occurs between ages 45-55, with perimenopause beginning several years earlier. The described symptoms - irritability, irregular menses, insomnia, and night sweats - are classic manifestations of declining estrogen and progesterone levels. Hormonal fluctuations during this transition affect the hypothalamic-pituitary-ovarian axis, causing vasomotor symptoms (hot flashes/night sweats), mood changes, and menstrual irregularities. The age (48) combined with this specific symptom cluster strongly indicates perimenopause/menopause. These symptoms significantly impact quality of life and may benefit from various therapeutic approaches including massage therapy for stress reduction and symptom management."""
new = """🎯 **Key Concept**: Menopause typically occurs between ages 45-55. The symptoms - irritability, irregular menses, insomnia, and night sweats - are classic manifestations of declining estrogen and progesterone levels.\\n\\n💡 **Memory Tip**: 48 + 4 symptoms = Menopause! Remember 'MINS': Moodiness, Irregular periods, Night sweats, Sleep problems - classic menopause signs in mid-40s woman.\\n\\n⚠️ **Exam Alert**: NOT pregnancy (causes missed periods, NOT irregular periods, and unlikely at 48). NOT high blood pressure (doesn't cause irregular menses). Age 48 + MINS symptoms = menopause!\\n\\n✅ **Why Correct**: Hormonal fluctuations during this transition affect the hypothalamic-pituitary-ovarian axis, causing vasomotor symptoms (hot flashes/night sweats), mood changes, and menstrual irregularities. The age combined with this symptom cluster strongly indicates menopause."""
if old in content:
    content = content.replace(old, new)
    conversions.append(76)

# Q77: KI/LR/HT Meridians
old = """The KI/LR/HT meridian combination (Kidney/Liver/Heart) represents a classic Traditional Chinese Medicine pattern for reproductive and emotional disorders. Kidney meridian governs reproductive function and essence, Liver meridian controls emotional flow and menstruation, and Heart meridian manages circulation and emotional stability. This trio commonly appears together in conditions involving hormonal imbalances, reproductive issues, emotional disturbances, and circulatory problems. When these meridians are disrupted, clients often experience symptoms like irregular cycles, mood swings, fatigue, and circulation issues."""
new = """🎯 **Key Concept**: The KI/LR/HT meridian combination (Kidney/Liver/Heart) represents a classic TCM pattern for reproductive and emotional disorders. Kidney = reproductive function, Liver = emotional flow/menstruation, Heart = circulation/emotional stability.\\n\\n💡 **Memory Tip**: KLH - Keep Love Happy! Kidney-Liver-Heart meridians work together for emotional balance and reproductive health.\\n\\n⚠️ **Exam Alert**: SP/ST/BL = digestive/elimination (NOT reproductive/emotional). PC/KI/SP = missing critical Liver meridian for emotional regulation. Only KI/LR/HT trinity addresses reproductive/emotional issues!\\n\\n✅ **Why Correct**: This trio commonly appears together in conditions involving hormonal imbalances, reproductive issues, emotional disturbances, and circulatory problems. When disrupted, clients experience irregular cycles, mood swings, fatigue, and circulation issues."""
if old in content:
    content = content.replace(old, new)
    conversions.append(77)

# Q78: Hot Flashes
old = """Hot flashes are a hallmark symptom of hormonal imbalances, particularly involving estrogen fluctuations during menopause or reproductive disorders. When the KI/LR/HT meridian system is disrupted, internal heat regulation becomes compromised. The Kidney meridian controls reproductive hormones, Liver meridian manages heat distribution and emotional stability, and Heart meridian governs circulation and body temperature. Hot flashes represent the body's inability to regulate internal temperature due to hormonal instability, often accompanied by night sweats, mood changes, and circulatory irregularities."""
new = """🎯 **Key Concept**: Hot flashes are a hallmark symptom of hormonal imbalances, particularly estrogen fluctuations during menopause. When the KI/LR/HT meridian system is disrupted, internal heat regulation becomes compromised.\\n\\n💡 **Memory Tip**: Hot FLASH = Hormonal Fire Losing All Stability - Heat! Classic sign of hormonal imbalance and meridian disruption.\\n\\n⚠️ **Exam Alert**: NOT water retention (Spleen/Kidney yang deficiency). NOT bruising (blood stasis/Spleen qi deficiency). Hot flashes = heat pattern from KI/LR/HT imbalance!\\n\\n✅ **Why Correct**: Hot flashes represent the body's inability to regulate internal temperature due to hormonal instability, often accompanied by night sweats, mood changes, and circulatory irregularities."""
if old in content:
    content = content.replace(old, new)
    conversions.append(78)

# Q79: Large Intestine Reflexology
old = """In reflexology, the Large Intestine reflex zones are mapped on both feet because the organ system is extensive and bilateral in function. The ascending colon appears on the right foot, the transverse colon crosses over requiring both feet, and the descending colon appears on the left foot. This bilateral representation reflects the organ's anatomical path through the abdominal cavity. Reflexology theory holds that working both feet ensures complete treatment of the entire large intestine system for optimal digestive function and elimination."""
new = """🎯 **Key Concept**: In reflexology, the Large Intestine reflex zones are mapped on BOTH feet because the organ system is extensive and bilateral in function. Ascending colon = right foot, transverse colon = crosses both feet, descending colon = left foot.\\n\\n💡 **Memory Tip**: Large Intestine = Large Coverage! It's BIG enough to need BOTH feet, just like your actual large intestine covers a lot of territory in your body.\\n\\n⚠️ **Exam Alert**: NOT just left foot (would miss ascending colon). NOT just right foot (would miss descending colon). NOT dorsal side (it's on plantar/bottom). BOTH feet required!\\n\\n✅ **Why Correct**: This bilateral representation reflects the organ's anatomical path through the abdominal cavity. Working both feet ensures complete treatment of the entire large intestine system for optimal digestive function and elimination."""
if old in content:
    content = content.replace(old, new)
    conversions.append(79)

# Q80: Stomach Acid and Protein
old = """Stomach acid (hydrochloric acid) is essential for protein digestion through multiple mechanisms. HCl activates pepsinogen into pepsin, the primary protein-digesting enzyme in the stomach. The acidic environment (pH 1.5-3.5) denatures protein structures, unfolding them for enzymatic access. Acid also activates other proteolytic enzymes and creates optimal conditions for protein breakdown into smaller peptides. Without adequate stomach acid, protein digestion is severely compromised, leading to malabsorption, digestive discomfort, and nutritional deficiencies."""
new = """🎯 **Key Concept**: Stomach acid (hydrochloric acid) is essential for protein digestion. HCl activates pepsinogen into pepsin, the primary protein-digesting enzyme. The acidic environment (pH 1.5-3.5) denatures protein structures.\\n\\n💡 **Memory Tip**: Protein Needs PEPSIN! Stomach acid activates pepsinogen into pepsin, the protein-chomping enzyme. Remember: Pepsin Pounds Proteins!\\n\\n⚠️ **Exam Alert**: Fats = digested by bile salts (alkaline) and lipase, NOT stomach acid. Carbs = digested by amylase (neutral/alkaline), NOT acid. Only proteins require stomach acid!\\n\\n✅ **Why Correct**: Acid activates proteolytic enzymes and creates optimal conditions for protein breakdown into smaller peptides. Without adequate stomach acid, protein digestion is severely compromised, leading to malabsorption and nutritional deficiencies."""
if old in content:
    content = content.replace(old, new)
    conversions.append(80)

# Q81: Depolarization
old = """Depolarization is the initial phase of an action potential where sodium channels open, allowing Na+ ions to rapidly rush into the neuron. This influx changes the membrane potential from negative (-70mV) toward positive (+30mV), creating the upstroke of the action potential. The sodium-potassium pump normally maintains higher Na+ outside and K+ inside the cell. During depolarization, voltage-gated sodium channels open first, causing the characteristic rapid depolarization. This process is essential for nerve impulse transmission and muscle contraction initiation."""
new = """🎯 **Key Concept**: Depolarization is the initial phase of an action potential where sodium channels open, allowing Na+ ions to rapidly rush INTO the neuron. This influx changes the membrane potential from negative (-70mV) toward positive (+30mV).\\n\\n💡 **Memory Tip**: Sodium RUSHES IN like fans rushing into a stadium! Depolarization = Sodium INVASION makes the inside positive. 'Na+ Needs Access!'\\n\\n⚠️ **Exam Alert**: Potassium rushes OUT during repolarization (recovery phase), NOT depolarization! Depolarization = Na+ IN. Repolarization = K+ OUT. Don't confuse!\\n\\n✅ **Why Correct**: During depolarization, voltage-gated sodium channels open first, causing the characteristic rapid depolarization. This process is essential for nerve impulse transmission and muscle contraction initiation."""
if old in content:
    content = content.replace(old, new)
    conversions.append(81)

# Q82: Diabetes Mellitus Client
old = """Diabetes Mellitus affects circulation, nerve sensation, and healing capacity - all critical for massage safety. Professional standards require obtaining physician clearance for clients with significant medical conditions. The therapist should request permission to contact the client's doctor to discuss contraindications, precautions, and appropriate modifications. This protects both client safety and therapist liability. Never assume diabetes automatically disqualifies someone from massage, but always ensure medical coordination for optimal care."""
new = """🎯 **Key Concept**: Diabetes Mellitus affects circulation, nerve sensation, and healing capacity - all critical for massage safety. Professional standards require obtaining physician clearance for clients with significant medical conditions.\\n\\n💡 **Memory Tip**: Diabetes = Doctor Discussion! Always ASK before you ACT - get Authorization to communicate with their physician.\\n\\n⚠️ **Exam Alert**: Don't refer elsewhere (abandons client unnecessarily). Don't demand prescriptions (not standard practice). ASK PERMISSION to contact their doctor for safe care coordination!\\n\\n✅ **Why Correct**: The therapist should request permission to contact the client's doctor to discuss contraindications, precautions, and appropriate modifications. This protects both client safety and therapist liability."""
if old in content:
    content = content.replace(old, new)
    conversions.append(82)

# Q83: Grand Mal Seizure
old = """Grand Mal seizures involve violent muscle contractions and loss of consciousness. The priority is preventing injury by cushioning/protecting the client (not restraining, which can cause harm), clearing the area of dangerous objects, and timing the seizure duration. Seizures lasting over 5 minutes or repeated seizures require emergency medical attention. Never put anything in their mouth or give water during/immediately after. Document timing and characteristics for medical personnel. Most seizures are self-limiting and the person will gradually regain consciousness."""
new = """🎯 **Key Concept**: Grand Mal seizures involve violent muscle contractions and loss of consciousness. The priority is preventing injury by cushioning/protecting the client (NOT restraining), clearing the area of dangerous objects, and TIMING the seizure duration.\\n\\n💡 **Memory Tip**: Seizure Safety = PROTECT & TIME! Don't restrain - just cushion and clock it. Water waits, timing tells the tale!\\n\\n⚠️ **Exam Alert**: NO water during/after (choking risk). 911 is NOT immediate first response (call if >5 minutes). First response = PROTECT with pillows and TIME the seizure!\\n\\n✅ **Why Correct**: Seizures lasting over 5 minutes or repeated seizures require emergency medical attention. Never put anything in their mouth or give water. Most seizures are self-limiting and the person will gradually regain consciousness."""
if old in content:
    content = content.replace(old, new)
    conversions.append(83)

# Q84: Electrical Stimulation
old = """Massage therapy scope of practice typically includes manual techniques and simple mechanical aids like battery-operated vibrators. However, electrical stimulation devices (TENS, EMS, galvanic stimulation) fall outside standard massage therapy scope and into physical therapy/medical domains. These require specialized training in electrical safety, contraindications, and physiological effects. Using electrical stimulation without proper credentials and scope expansion violates practice acts and creates liability issues. Exercise recommendations, while requiring knowledge, are generally within scope as wellness advice."""
new = """🎯 **Key Concept**: Massage therapy scope of practice includes manual techniques and simple mechanical aids like battery-operated vibrators. However, electrical stimulation devices (TENS, EMS) fall outside standard massage therapy scope.\\n\\n💡 **Memory Tip**: Electric = Off Limits! Massage therapists use MANUAL methods, not ELECTRICAL methods. Battery vibrators are manual tools, but electric stim needs special training!\\n\\n⚠️ **Exam Alert**: Battery vibrators = OK (mechanical aid). Exercise recommendations = OK (wellness advice). Electrical stimulation = NOT OK (requires special credentials and scope expansion)!\\n\\n✅ **Why Correct**: Electrical stimulation devices require specialized training in electrical safety, contraindications, and physiological effects. Using them without proper credentials violates practice acts and creates liability issues."""
if old in content:
    content = content.replace(old, new)
    conversions.append(84)

with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Converted: {sorted(conversions)}")
print(f"Total: {len(conversions)}")
