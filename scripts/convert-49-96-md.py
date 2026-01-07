#!/usr/bin/env python3
import sys

# Read the file
with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

conversions = []
failed = []

# Q51: Olecranon/Triceps
old = """The olecranon process is the prominent bony projection at the posterior elbow - the 'funny bone' area. The triceps brachii muscle has three heads (long, lateral, and medial) that converge into a single tendon inserting directly onto the olecranon process. Repetitive elbow extension motions common in carpentry (hammering, lifting, pushing) can cause triceps tendonitis or inflammation at this insertion point. This condition is sometimes called 'olecranon bursitis' when the bursa is involved. The triceps is the primary elbow extensor, so overuse from occupational activities frequently affects this muscle-tendon unit. Biceps and deltoid do not attach to the olecranon process."""
new = """🎯 **Key Concept**: The olecranon process is the prominent bony projection at the posterior elbow (the 'funny bone' area). Triceps brachii has three heads that converge into one tendon inserting directly onto the olecranon.\\n\\n💡 **Memory Tip**: TRI-TIP AT THE TIP! TRIceps attaches at the olecranon TIP! Think 'three heads, one tip' - all three triceps heads meet at this bony point.\\n\\n⚠️ **Exam Alert**: Biceps inserts on radial tuberosity (anterior arm), not olecranon. Deltoid inserts on deltoid tuberosity of humerus (shoulder), not elbow. Only triceps inserts on olecranon!\\n\\n✅ **Why Correct**: Repetitive elbow extension in carpentry (hammering, pushing) causes triceps tendonitis at this insertion point. Triceps is the primary elbow extensor, making it vulnerable to occupational overuse."""
if old in content:
    content = content.replace(old, new)
    conversions.append(51)
else:
    failed.append(51)

# Q52: NY License
old = """New York State requires massage therapists to renew their license registration every three years to maintain legal practice status. This triennial renewal ensures practitioners stay current with continuing education requirements, maintain professional standards, and remain in good standing. Failure to renew results in license expiration and inability to legally practice massage therapy. The three-year cycle is standard for many healthcare professions in NY and allows adequate time for continuing education completion while ensuring regular oversight of licensed practitioners."""
new = """🎯 **Key Concept**: New York State requires massage therapists to renew their license registration every THREE years to maintain legal practice status.\\n\\n💡 **Memory Tip**: NY MASSAGE = 3's COMPANY! New York loves the number 3! Remember: 'Three years to stay free and legal in NY!'\\n\\n⚠️ **Exam Alert**: Don't confuse with other states or professions. It's NOT 10 years, NOT optional - it's mandated every 3 years!\\n\\n✅ **Why Correct**: This triennial renewal ensures practitioners stay current with continuing education requirements, maintain professional standards, and remain in good standing. Failure to renew = license expiration = cannot legally practice."""
if old in content:
    content = content.replace(old, new)
    conversions.append(52)
else:
    failed.append(52)

# Q53: Pregnancy Position
old = """Left lateral (side-lying) position is safest for third trimester pregnancy massage because it prevents compression of the inferior vena cava, the large vein that returns blood to the heart. When pregnant women lie supine (on back), the heavy uterus compresses this vein against the spine, reducing venous return and potentially causing supine hypotensive syndrome - dizziness, nausea, and reduced blood flow to baby. Left lateral position optimizes circulation, reduces back strain, and provides comfortable access for massage work while maintaining maternal and fetal safety."""
new = """🎯 **Key Concept**: Left lateral (side-lying) position is safest for third trimester pregnancy massage because it prevents compression of the inferior vena cava, the large vein returning blood to the heart.\\n\\n💡 **Memory Tip**: LEFT IS RIGHT FOR BABY'S SIGHT! The vena cava sits on the right, so left side lying keeps blood flowing bright. Remember: 'Left side = Life side!'\\n\\n⚠️ **Exam Alert**: Supine = dangerous vena cava compression. Prone = impossible (can't lie on belly!). Right lateral = still some compression. ONLY left lateral is safe!\\n\\n✅ **Why Correct**: Supine position causes the heavy uterus to compress the vena cava against the spine, reducing venous return and potentially causing supine hypotensive syndrome - dizziness, nausea, and reduced blood flow to baby."""
if old in content:
    content = content.replace(old, new)
    conversions.append(53)
else:
    failed.append(53)

# Q54: PNS
old = """The PNS is functionally divided into afferent (sensory) and efferent (motor) divisions based on signal direction. Afferent nerves carry sensory information FROM the body TO the CNS (think 'Afferent = Arrives at brain'). Efferent nerves carry motor commands FROM the CNS TO muscles and glands (think 'Efferent = Exits brain'). This is the primary functional classification. While somatic/autonomic divisions exist, they are subdivisions of the efferent system, not the main PNS divisions. Understanding this helps massage therapists recognize how touch sensations travel afferently to the brain and how the brain sends efferent signals to create therapeutic responses."""
new = """🎯 **Key Concept**: The PNS is functionally divided into afferent (sensory) and efferent (motor) divisions based on signal direction. Afferent = FROM body TO CNS. Efferent = FROM CNS TO muscles/glands.\\n\\n💡 **Memory Tip**: A-E Airways! Afferent Airways bring info IN (like inhaling), Efferent Airways send commands OUT (like exhaling). Think: Afferent = Arrives at brain, Efferent = Exits brain.\\n\\n⚠️ **Exam Alert**: Don't pick somatic/autonomic! Those are subdivisions of the EFFERENT system only, not the primary PNS divisions. The question asks for PRIMARY divisions!\\n\\n✅ **Why Correct**: Understanding afferent/efferent helps massage therapists recognize how touch sensations travel afferently to the brain and how the brain sends efferent signals to create therapeutic responses."""
if old in content:
    content = content.replace(old, new)
    conversions.append(54)
else:
    failed.append(54)

# Q55: Gluteus Medius
old = """The gluteus medius attaches to the greater trochanter of the femur and is crucial for hip stabilization and abduction. This muscle originates from the ilium and inserts on the lateral surface of the greater trochanter. It's essential for maintaining pelvic stability during walking and prevents hip drop on the opposite side. The greater trochanter is a prominent bony landmark that serves as an attachment point for several hip muscles, but gluteus medius is the primary muscle associated with this attachment in massage therapy contexts. Understanding this anatomy helps therapists locate and treat hip dysfunction, particularly in clients with gait issues or hip pain."""
new = """🎯 **Key Concept**: The gluteus medius attaches to the greater trochanter of the femur and is crucial for hip stabilization and abduction. It originates from the ilium and inserts on the lateral surface of the greater trochanter.\\n\\n💡 **Memory Tip**: Gluteus MEDIUS sits in the MIDDLE of the hip, right on the Greater Trochanter! Think 'MEDIUS = MIDDLE = Greater Trochanter MIDDLE attachment'.\\n\\n⚠️ **Exam Alert**: TFL attaches to iliotibial band, NOT greater trochanter. Gluteus maximus attaches to gluteal tuberosity and IT band, NOT greater trochanter. Only gluteus medius!\\n\\n✅ **Why Correct**: It's essential for maintaining pelvic stability during walking and prevents hip drop on the opposite side. Understanding this anatomy helps therapists locate and treat hip dysfunction, particularly in clients with gait issues or hip pain."""
if old in content:
    content = content.replace(old, new)
    conversions.append(55)
else:
    failed.append(55)

# Q56: Subdeltoid Bursitis
old = """Subdeltoid bursitis involves inflammation of the bursa located beneath the deltoid muscle and above the rotator cuff. During shoulder abduction (raising arm sideways), this bursa gets compressed between the acromion and the humeral head, causing significant pain. This compression peaks at 60-120 degrees of abduction (painful arc). The bursa normally provides smooth gliding between structures, but when inflamed, movement becomes painful. Abduction specifically aggravates this condition because it narrows the subacromial space where the bursa sits. Other movements like adduction, extension, or rotation don't create the same degree of compression in this anatomical space, making abduction the most painful movement."""
new = """🎯 **Key Concept**: Subdeltoid bursitis = inflammation of the bursa beneath the deltoid muscle and above the rotator cuff. During shoulder abduction (raising arm sideways), this bursa gets compressed between the acromion and humeral head.\\n\\n💡 **Memory Tip**: Subdeltoid Bursitis = 'OUCH when you REACH UP!' The bursa gets SQUISHED during ABduction like a water balloon being pressed between bones. Think 'AB-OUCH-tion!'\\n\\n⚠️ **Exam Alert**: The painful arc occurs at 60-120 degrees of abduction. Adduction, extension, and rotation don't compress the bursa in the same way!\\n\\n✅ **Why Correct**: Abduction specifically aggravates this condition because it narrows the subacromial space where the bursa sits. When inflamed, this compression causes significant pain, making abduction the most painful movement."""
if old in content:
    content = content.replace(old, new)
    conversions.append(56)
else:
    failed.append(56)

# Write back
with open(r'C:\git\nysmassageexam.com\data\questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Converted: {conversions}")
if failed:
    print(f"Failed: {failed}")
    sys.exit(1)
print("Success!")
