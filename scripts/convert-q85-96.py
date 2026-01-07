#!/usr/bin/env python3
"""Convert questions 85-96 to markdown format"""
import sys

with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

conversions = []

# Q85: Lung Meridian 3-5 AM
old = """In TCM's circadian meridian clock, each meridian has a 2-hour peak activity period. The Lung (LU) meridian governs 3-5 AM, when respiratory function and oxygen processing are most active during deep sleep. This timing relates to lung detoxification and qi circulation. Understanding meridian timing helps therapists optimize treatment scheduling and explains why certain symptoms may worsen at specific times. The Lung meridian is associated with the Metal element and governs respiration, skin, and immune function."""
new = """🎯 **Key Concept**: In TCM's circadian meridian clock, each meridian has a 2-hour peak activity period. The Lung (LU) meridian governs 3-5 AM, when respiratory function and oxygen processing are most active during deep sleep.\\n\\n💡 **Memory Tip**: LUng time = Late night/early morning! 3-5 AM is when your LUngs do their deepest work while you sleep - LU meridian's prime time!\\n\\n⚠️ **Exam Alert**: Heart = 11 AM-1 PM (midday). Liver = 1-3 AM (before Lung). Spleen = 9-11 AM (morning). Only LUNG = 3-5 AM!\\n\\n✅ **Why Correct**: This timing relates to lung detoxification and qi circulation. Understanding meridian timing helps therapists optimize treatment scheduling and explains why certain symptoms may worsen at specific times."""
if old in content:
    content = content.replace(old, new)
    conversions.append(85)

# Q86: TFL and GB Meridian
old = """The Tensor Fascia Latae muscle is closely associated with the Gallbladder (GB) meridian pathway. The GB meridian runs along the lateral aspect of the body, including the lateral hip and thigh region where TFL is located. TFL dysfunction often correlates with GB meridian imbalances in TCM theory. The muscle's role in hip stability and IT band tension aligns with the Gallbladder meridian's function in decision-making, flexibility, and lateral body movement. This relationship is important for acupressure point selection and treatment planning."""
new = """🎯 **Key Concept**: The Tensor Fascia Latae muscle is closely associated with the Gallbladder (GB) meridian pathway. The GB meridian runs along the lateral aspect of the body, including the lateral hip and thigh region where TFL is located.\\n\\n💡 **Memory Tip**: TFL = Gallbladder's Buddy! Think 'Tight Fascia Lateral' = GB meridian runs down the lateral side where TFL lives!\\n\\n⚠️ **Exam Alert**: Liver meridian = medial leg (NOT lateral). Stomach meridian = anterior leg (NOT lateral hip). Only Gallbladder = lateral where TFL is!\\n\\n✅ **Why Correct**: TFL dysfunction often correlates with GB meridian imbalances in TCM theory. The muscle's role in hip stability and IT band tension aligns with the Gallbladder meridian's function in decision-making, flexibility, and lateral body movement."""
if old in content:
    content = content.replace(old, new)
    conversions.append(86)

# Q87: Small Intestine Meridian
old = """The Small Intestine meridian (SI) runs along the medial (inner) aspect of the arm and passes near the medial epicondyle of the humerus at the elbow. This meridian pathway starts at the pinky finger, travels up the ulnar side of the arm, crosses the elbow at the medial epicondyle region, continues up the posterior arm and shoulder to end at the ear. Key acupoint SI-8 (Xiaohai) is located at the ulnar groove behind the medial epicondyle. Understanding meridian pathways is crucial for acupressure techniques and energy work in massage therapy."""
new = """🎯 **Key Concept**: The Small Intestine meridian (SI) runs along the medial (inner) aspect of the arm and passes near the medial epicondyle of the humerus at the elbow. It starts at the pinky finger, travels up the ulnar side of the arm.\\n\\n💡 **Memory Tip**: Small Intestine stays MEDIAL - remember 'SI Meets Medially' - the small intestine meridian hugs the inside (medial) edge of your elbow!\\n\\n⚠️ **Exam Alert**: SI-8 (Xiaohai) acupoint is located at the ulnar groove behind the MEDIAL epicondyle, not lateral. Small = medial/inner side!\\n\\n✅ **Why Correct**: The meridian pathway crosses the elbow at the medial epicondyle region, continues up the posterior arm and shoulder to end at the ear. Understanding meridian pathways is crucial for acupressure techniques and energy work."""
if old in content:
    content = content.replace(old, new)
    conversions.append(87)

# Q88: Rhomboids
old = """The rhomboids (major and minor) attach from the vertebral column (C7-T5) to the medial border of the scapula. These muscles lie directly beneath the middle trapezius and are responsible for scapular retraction and downward rotation. When palpating the vertebral border of the scapula, you're working directly on rhomboid muscle belly. They commonly develop trigger points and tension from forward head posture and rounded shoulders. Effective treatment involves working along the entire medial scapular border from superior angle to inferior angle."""
new = """🎯 **Key Concept**: The rhomboids (major and minor) attach from the vertebral column (C7-T5) to the medial border of the scapula. When palpating the vertebral border of the scapula, you're working directly on rhomboid muscle belly.\\n\\n💡 **Memory Tip**: Rhomboids live in the RECTANGLE between spine and scapula - think 'Rhombus Rhomboids Rectangle' - they fill that diamond-shaped space!\\n\\n⚠️ **Exam Alert**: Teres minor = lateral scapular border (NOT vertebral border). Infraspinatus = posterior scapula below spine (NOT medial border). Only rhomboids attach to vertebral border!\\n\\n✅ **Why Correct**: These muscles lie directly beneath the middle trapezius and are responsible for scapular retraction and downward rotation. They commonly develop trigger points and tension from forward head posture and rounded shoulders."""
if old in content:
    content = content.replace(old, new)
    conversions.append(88)

# Q89: Deep Abdominal Work
old = """Anterior pelvic tilt involves tight hip flexors (especially psoas) and weak abdominal muscles, causing the pelvis to tip forward. Deep abdominal work helps release fascial restrictions, improve circulation to abdominal muscles, and facilitate better muscle activation patterns. The psoas muscle, which contributes significantly to anterior pelvic tilt, can be accessed through careful deep abdominal work. This technique helps restore proper pelvic alignment by addressing both muscular tension and fascial restrictions in the abdominal cavity. Always work slowly and with client feedback due to sensitive organs in the area."""
new = """🎯 **Key Concept**: Anterior pelvic tilt involves tight hip flexors (especially psoas) and weak abdominal muscles, causing the pelvis to tip forward. Deep abdominal work helps release fascial restrictions and improve circulation to abdominal muscles.\\n\\n💡 **Memory Tip**: APT needs ABS - Anterior Pelvic Tilt needs ABdominal Strengthening! Deep ab work helps tip that pelvis back to neutral!\\n\\n⚠️ **Exam Alert**: Weight loss = requires caloric deficit, NOT massage. Stomach cramps = CONTRAINDICATION (may indicate digestive issues). Only anterior pelvic tilt benefits from deep abdominal work!\\n\\n✅ **Why Correct**: The psoas muscle, which contributes significantly to anterior pelvic tilt, can be accessed through careful deep abdominal work. This technique helps restore proper pelvic alignment. Always work slowly and with client feedback due to sensitive organs."""
if old in content:
    content = content.replace(old, new)
    conversions.append(89)

# Q90: Gluteus Maximus Uphill
old = """The gluteus maximus is the primary muscle responsible for hip extension and is heavily recruited during uphill walking or running. An 8% incline significantly increases the demand on this muscle as it must work harder to extend the hip and propel the body upward against gravity. Buttock pain during inclined activity typically indicates gluteus maximus strain, overuse, or trigger points. This large, powerful muscle can develop pain from sudden increases in activity intensity, poor conditioning, or biomechanical issues. The pain pattern often presents as deep aching in the buttock region during or after hip extension activities."""
new = """🎯 **Key Concept**: The gluteus maximus is the primary muscle responsible for hip extension and is heavily recruited during uphill walking or running. An 8% incline significantly increases the demand on this muscle as it must work harder to propel the body upward against gravity.\\n\\n💡 **Memory Tip**: Going UP-hill = GLUTeus MAXimus working MAXimum! Max Glute powers you UP the mountain!\\n\\n⚠️ **Exam Alert**: Quadratus lumborum = lower back pain (NOT buttock). Tensor fascia latae = hip flexion/abduction (NOT extension), pain refers to lateral thigh. Only gluteus maximus = buttock pain on incline!\\n\\n✅ **Why Correct**: Buttock pain during inclined activity typically indicates gluteus maximus strain, overuse, or trigger points. The pain pattern often presents as deep aching in the buttock region during or after hip extension activities."""
if old in content:
    content = content.replace(old, new)
    conversions.append(90)

# Q91: Lung and Autumn
old = """In Five Element Theory, each season corresponds to specific organ meridians and emotional/physical qualities. Autumn is associated with the Metal element, which governs the Lung (LU) and Large Intestine meridians. This season represents letting go, like trees dropping leaves, which parallels the lung's function of releasing carbon dioxide and the large intestine's elimination role. Autumn is considered a time of gathering inward energy, reflection, and preparation for winter. The Lung meridian is particularly active during autumn months, and respiratory issues often surface during seasonal transitions."""
new = """🎯 **Key Concept**: In Five Element Theory, Autumn is associated with the Metal element, which governs the Lung (LU) and Large Intestine meridians. This season represents letting go, like trees dropping leaves.\\n\\n💡 **Memory Tip**: LUNG and AUTUMN both start with vowels - think 'Autumn Air for Lungs' - fall weather affects breathing, so LU meridian rules autumn!\\n\\n⚠️ **Exam Alert**: Stomach = late summer/Earth element. Heart = summer/Fire element. Only LUNG = autumn/Metal element!\\n\\n✅ **Why Correct**: The season parallels the lung's function of releasing carbon dioxide and the large intestine's elimination role. Autumn is a time of gathering inward energy, reflection, and preparation for winter. The Lung meridian is particularly active during autumn months."""
if old in content:
    content = content.replace(old, new)
    conversions.append(91)

# Q92: Quadratus Lumborum Hip Hiker
old = """The Quadratus Lumborum is the primary hip hiker muscle. Located deep in the posterior abdominal wall, it originates from the iliac crest and inserts on the 12th rib and lumbar vertebrae. When contracted unilaterally, it elevates the hip on the same side, creating the characteristic 'hip hiking' gait pattern. This muscle is crucial for lateral spinal stability and is often involved in lower back pain syndromes. In spasm, it pulls the iliac crest superiorly, causing apparent leg length discrepancy and compensatory movement patterns."""
new = """🎯 **Key Concept**: The Quadratus Lumborum is the primary hip hiker muscle. Located deep in the posterior abdominal wall, it originates from the iliac crest and inserts on the 12th rib and lumbar vertebrae.\\n\\n💡 **Memory Tip**: Queen Quadratus Quarters the hip - she's the royal Hip Hiker who lifts the iliac crest like a crown!\\n\\n⚠️ **Exam Alert**: When contracted unilaterally, it elevates the hip on the SAME side (not opposite). This creates the characteristic 'hip hiking' gait pattern!\\n\\n✅ **Why Correct**: This muscle is crucial for lateral spinal stability and is often involved in lower back pain syndromes. In spasm, it pulls the iliac crest superiorly, causing apparent leg length discrepancy and compensatory movement patterns."""
if old in content:
    content = content.replace(old, new)
    conversions.append(92)

# Q93: Compression Technique
old = """Compression is a fundamental massage technique involving sustained perpendicular pressure applied to tissues. It effectively promotes relaxation by stimulating parasympathetic nervous system responses and reducing muscle tension. It's also excellent for assessing muscle tone, density, and tissue quality through palpation. However, compression has minimal direct impact on immune system enhancement. While massage in general may have some immune benefits through stress reduction, compression specifically lacks the lymphatic drainage properties of techniques like effleurage or the circulation-boosting effects of petrissage that might support immune function."""
new = """🎯 **Key Concept**: Compression is a fundamental massage technique involving sustained perpendicular pressure applied to tissues. It effectively promotes relaxation and is excellent for assessing muscle tone, but has MINIMAL direct impact on immune system enhancement.\\n\\n💡 **Memory Tip**: Compression Calms and Checks muscles, but Can't Create immune Champions - it's not an immunity booster!\\n\\n⚠️ **Exam Alert**: Compression IS effective for relaxation (activates parasympathetic nervous system). Compression IS effective for assessing muscle tone (direct palpation). Compression is NOT effective for immune response!\\n\\n✅ **Why Correct**: While massage in general may have some immune benefits through stress reduction, compression specifically lacks the lymphatic drainage properties of techniques like effleurage or the circulation-boosting effects of petrissage that might support immune function."""
if old in content:
    content = content.replace(old, new)
    conversions.append(93)

# Q94: Pes Anserine
old = """The Pes Anserine (Latin for 'goose foot') is the combined tendinous insertion of three muscles on the anteromedial aspect of the proximal tibia: Sartorius, Gracilis, and Semitendinosus. This anatomical landmark is located about 2-3 inches below the medial joint line of the knee. The insertion resembles a goose's webbed foot, hence the name. These muscles work together for knee flexion and internal rotation. The pes anserine bursa lies beneath this insertion and can become inflamed in pes anserine bursitis, a common cause of medial knee pain."""
new = """🎯 **Key Concept**: The Pes Anserine (Latin for 'goose foot') is the combined tendinous insertion of three muscles on the anteromedial aspect of the proximal tibia: Sartorius, Gracilis, and Semitendinosus.\\n\\n💡 **Memory Tip**: SGS - Sartorius, Gracilis, Semitendinosus make a 'Goose Foot' that Says 'Go Swim!' at the knee.\\n\\n⚠️ **Exam Alert**: All THREE muscles required: Sartorius, Gracilis, AND Semitendinosus. The insertion resembles a goose's webbed foot, hence the name!\\n\\n✅ **Why Correct**: Located about 2-3 inches below the medial joint line of the knee. These muscles work together for knee flexion and internal rotation. The pes anserine bursa lies beneath this insertion and can become inflamed in pes anserine bursitis."""
if old in content:
    content = content.replace(old, new)
    conversions.append(94)

# Q95: Tibialis Anterior and ST Meridian
old = """The Tibialis Anterior muscle lies along the pathway of the Stomach (ST) meridian in Traditional Chinese Medicine. This meridian runs down the anterior lateral aspect of the leg, which corresponds closely to the location of the Tibialis Anterior. The Stomach meridian begins at the face, travels down the body, and continues along the front of the leg to end at the second toe. Important acupoints along this muscle include ST36 (Zusanli) near the tibialis anterior. Understanding meridian pathways helps massage therapists integrate TCM principles into their treatments for more comprehensive healing approaches."""
new = """🎯 **Key Concept**: The Tibialis Anterior muscle lies along the pathway of the Stomach (ST) meridian in Traditional Chinese Medicine. This meridian runs down the anterior lateral aspect of the leg, which corresponds closely to the location of Tibialis Anterior.\\n\\n💡 **Memory Tip**: Tibialis Anterior sits on the STomach meridian - think 'STrong Tibialis' for the ST pathway!\\n\\n⚠️ **Exam Alert**: Gallbladder = lateral leg (NOT anterior). Spleen = medial leg (opposite side). Kidney = posteromedial leg. Only STOMACH = anterior where Tibialis Anterior is!\\n\\n✅ **Why Correct**: The Stomach meridian begins at the face, travels down the body, and continues along the front of the leg to end at the second toe. Important acupoint ST36 (Zusanli) is located near the tibialis anterior."""
if old in content:
    content = content.replace(old, new)
    conversions.append(95)

# Q96: Adductor Magnus and LR Meridian
old = """The Adductor Magnus muscle corresponds to the Liver (LR) meridian pathway in Traditional Chinese Medicine. The Liver meridian travels along the medial aspect of the thigh, running through the area occupied by the adductor muscle group, particularly Adductor Magnus. This meridian begins at the big toe, travels up the medial leg and thigh, and ends at the lateral costal region. The Liver meridian is associated with emotional regulation, smooth muscle function, and blood circulation - functions that can be therapeutically addressed when working on the adductor muscles during massage therapy sessions."""
new = """🎯 **Key Concept**: The Adductor Magnus muscle corresponds to the Liver (LR) meridian pathway in Traditional Chinese Medicine. The Liver meridian travels along the medial aspect of the thigh, running through the area occupied by the adductor muscle group.\\n\\n💡 **Memory Tip**: Adductor Magnus Lives on the LiveR meridian - think 'Large adductor, LR meridian!'\\n\\n⚠️ **Exam Alert**: Kidney = more posterior on medial leg. Stomach = anterior-lateral leg. Spleen = more anterior on medial leg. Only LIVER = medial thigh through Adductor Magnus!\\n\\n✅ **Why Correct**: The meridian begins at the big toe, travels up the medial leg and thigh, and ends at the lateral costal region. The Liver meridian is associated with emotional regulation, smooth muscle function, and blood circulation."""
if old in content:
    content = content.replace(old, new)
    conversions.append(96)

with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Converted: {sorted(conversions)}")
print(f"Total: {len(conversions)}")
