const fs = require('fs');

// Read the questions file
const filePath = 'C:\\git\\nysmassageexam.com\\data\\questions.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Conversion mappings for questions 1-48
const conversions = {
  1: {
    keyContent: "Spastic paralysis involves involuntary muscle contractions and increased muscle tone. Effleurage provides gentle, rhythmic, gliding strokes that calm the nervous system.",
    memoryTip: "\"Easy Flow\" = Effleurage for spastics. Gentle gliding soothes overactive nerves.",
    examAlert: "Don't pick stimulating strokes like tapotement - they worsen spasticity!",
    whyCorrect: "Effleurage's gentle, calming input reduces hyperactive muscle tone without triggering protective reflexes."
  },
  2: {
    keyContent: "The pisiform is a small, pea-shaped carpal bone located on the medial (pinky) side of the wrist at the wrist crease.",
    memoryTip: "Pisiform = Pea-shaped = Pinky side! Think 'Pea on Pinky side of Palm'.",
    examAlert: "Don't confuse with scaphoid (thumb side) or trapezium (base of thumb).",
    whyCorrect: "The pisiform sits directly at the medial wrist crease, easily palpable when flexing the wrist."
  },
  3: {
    keyContent: "Psoas Major flexes the hip, Biceps Femoris flexes the knee, and Popliteus flexes the knee. All three share flexion as their common action.",
    memoryTip: "PBP = Please Bend Please! All three muscles bend joints.",
    examAlert: "Focus on the common action, not individual muscles. They all flex different joints.",
    whyCorrect: "Despite working at different joints (hip and knee), flexion is the movement they all perform."
  },
  4: {
    keyContent: "The biceps brachii has two heads. The short head originates from the coracoid process of the scapula, while the long head comes from the supraglenoid tubercle.",
    memoryTip: "Short = Coracoid! Think 'Short Crow' (coracoid means crow-like). The short head attaches to the crow's beak!",
    examAlert: "Don't confuse coracoid (scapula) with coronoid (ulna) - they sound similar!",
    whyCorrect: "The coracoid process is the anterior projection of the scapula where the short head attaches."
  },
  5: {
    keyContent: "For edema treatment, work proximal segments FIRST to create space for fluid drainage, then work distal segments. This clears the 'highway' before directing traffic.",
    memoryTip: "Proximal First = Make Room! Think 'Empty the Highway before directing Traffic' - clear the upper route before moving fluid from below.",
    examAlert: "This is about segment order, NOT stroke direction. Work thigh before calf before foot.",
    whyCorrect: "Working proximal first opens lymphatic pathways so fluid has somewhere to drain when you work distally."
  },
  6: {
    keyContent: "Varicose ulcers have compromised tissue integrity. Use gentle finger kneading from the periphery (healthy tissue) toward the wound edge to promote circulation and healing.",
    memoryTip: "PUSH to WOUND: Push circulation from Periphery toward Wound - like pushing nutrients to the healing area!",
    examAlert: "Never use deep effleurage on varicose ulcers - too aggressive for fragile tissue!",
    whyCorrect: "Working from periphery inward brings fresh blood and lymph to the healing area without damaging fragile tissue."
  },
  7: {
    keyContent: "Tibialis anterior and tibialis posterior are the primary invertors of the foot. When contracted together, they turn the sole of the foot inward (inversion).",
    memoryTip: "Both Tibialis = Inversion! Think 'TIB = Turn Inward, Buddy!'",
    examAlert: "Both muscles invert - their other actions cancel out (dorsi vs plantar), leaving only inversion.",
    whyCorrect: "Inversion is the only action both muscles share. Their flexion actions oppose each other."
  },
  8: {
    keyContent: "The digestive tract follows this sequence: Mouth → Pharynx → Esophagus → Stomach → Small intestine → Large intestine → Rectum → Anus.",
    memoryTip: "My Purple Elephant Swallowed Small Little Red Apples! (Mouth, Pharynx, Esophagus, Stomach, Small, Large, Rectum, Anus)",
    examAlert: "The pharynx comes BEFORE the esophagus - it's the shared passage for food and air.",
    whyCorrect: "Food passes through the pharynx (throat) immediately after the mouth, before entering the esophagus."
  },
  9: {
    keyContent: "Bile is produced by the liver and stored in the gallbladder. Its primary function is to emulsify fats, breaking them into smaller droplets for easier digestion.",
    memoryTip: "Bile Breaks Blobs! It breaks fat blobs into tiny droplets for absorption.",
    examAlert: "Bile emulsifies (breaks down) fats - it doesn't digest proteins or carbs!",
    whyCorrect: "Bile's detergent-like properties emulsify dietary fats, increasing surface area for lipase enzymes to work."
  },
  10: {
    keyContent: "During muscle contraction, actin (thin filaments) slide past myosin (thick filaments), shortening the sarcomere. The filaments themselves don't change length.",
    memoryTip: "Actin Acts! Actin thin filaments slide over thick myosin to shorten the muscle.",
    examAlert: "Filaments SLIDE past each other - they don't shrink! The sarcomere shortens, not the filaments.",
    whyCorrect: "The sliding filament theory shows actin thin filaments are pulled toward the center of the sarcomere by myosin."
  },
  11: {
    keyContent: "NYS requires massage therapists to maintain all advertising records (business cards, websites, social media, etc.) in their permanent business files.",
    memoryTip: "Advertise? Archive! Keep ALL ads in your permanent files - NYS wants proof!",
    examAlert: "This includes digital advertising (websites, social media) - not just print materials!",
    whyCorrect: "NYS law mandates permanent record-keeping of all advertising to ensure compliance and accountability."
  },
  12: {
    keyContent: "NYS massage law allows therapists to specialize and limit their practice to specific populations (e.g., prenatal, geriatric, athletes) without restrictions.",
    memoryTip: "Specialize with Pride! NYS says you CAN limit your practice to your specialty.",
    examAlert: "You CAN refuse clients outside your specialty - it's professional, not discriminatory!",
    whyCorrect: "Specialization is encouraged in NYS as it promotes expertise and quality care within defined scopes."
  },
  13: {
    keyContent: "The soleus lies deep to the gastrocnemius in the posterior lower leg. Together they form the triceps surae and attach to the calcaneus via the Achilles tendon.",
    memoryTip: "Soleus = Solo under Gastrocnemius! It's the solo deep muscle under the twins (gastrocnemius heads).",
    examAlert: "Soleus is DEEP - you must work through gastrocnemius to reach it!",
    whyCorrect: "The soleus is positioned directly beneath the gastrocnemius in the posterior compartment of the leg."
  },
  14: {
    keyContent: "In TCM, the Lungs are called the 'lid of the Yin organs' because they sit at the top of the torso, protecting other Yin organs below like a lid.",
    memoryTip: "Lungs = Lid! They sit on top protecting organs below, just like a jar lid.",
    examAlert: "This is TCM theory terminology - 'lid' refers to position, not function!",
    whyCorrect: "The Lungs' superior anatomical position in the chest cavity makes them the 'lid' covering other Yin organs."
  },
  15: {
    keyContent: "In TCM, the Lungs control Wei Qi (defensive/protective energy), which circulates on the body's surface protecting against external pathogens.",
    memoryTip: "Lungs = Shield! They control Wei Qi, your body's protective shield on the surface.",
    examAlert: "Wei Qi is DEFENSIVE energy on the surface - different from nutritive Qi inside!",
    whyCorrect: "Lung Qi spreads Wei Qi to the skin and exterior, forming the body's first line of immune defense."
  },
  16: {
    keyContent: "In TCM, Yin organs (Zang) are solid, dense structures that store vital substances (Qi, Blood, Essence). They include Heart, Liver, Spleen, Lungs, Kidneys.",
    memoryTip: "Yin = Storage! Solid organs Store precious substances. Yang = Hollow, they transform and transport.",
    examAlert: "Don't confuse Yin (solid, store) with Yang (hollow, transform) organs!",
    whyCorrect: "Yin organs have dense, solid tissue structure designed for storing and preserving vital substances."
  },
  17: {
    keyContent: "The Spleen meridian (SP) travels up the medial leg, through the anterior pelvis, and connects to the spleen organ in the upper left abdomen.",
    memoryTip: "Spleen Sprints up the Medial Side! Think 'SP = Side Path' up the inner leg.",
    examAlert: "Spleen meridian is MEDIAL (inner leg) - don't confuse with lateral meridians!",
    whyCorrect: "The SP meridian pathway follows the medial aspect of the lower limb before reaching the abdomen."
  },
  18: {
    keyContent: "Retinaculum and ITB (iliotibial band) are both specialized fascial structures - dense connective tissue that provides structural support and compartmentalization.",
    memoryTip: "Retinaculum & ITB = Fascia Family! Both are tough connective tissue bands that stabilize.",
    examAlert: "They're FASCIA, not muscles! They're passive support structures.",
    whyCorrect: "Both are thickened bands of deep fascia that stabilize and organize surrounding structures."
  },
  19: {
    keyContent: "The Lung meridian (LU) begins at the lateral chest (pectoralis major), travels over the anterior shoulder, down the lateral arm, and ends at the thumb's lateral nail.",
    memoryTip: "Lung Loves Lateral! LU starts lateral chest, goes lateral arm, ends lateral thumb.",
    examAlert: "LU is on the THUMB side (lateral/radial) - not the pinky side!",
    whyCorrect: "The LU meridian follows the lateral/radial aspect of the upper limb, terminating at the thumb."
  },
  20: {
    keyContent: "Extensor carpi radialis brevis (ECRB) attaches directly to the lateral epicondyle of the humerus. It's a primary site of tennis elbow (lateral epicondylitis).",
    memoryTip: "ECRB = Epicondyle Connection! ECRB attaches at the lateral epicondyle where tennis elbow happens.",
    examAlert: "ECRB is THE tennis elbow muscle - know this attachment!",
    whyCorrect: "ECRB originates from the lateral epicondyle, making it vulnerable to repetitive strain (tennis elbow)."
  },
  21: {
    keyContent: "The biceps brachii performs two main actions: elbow flexion (bending) and forearm supination (turning palm up). Supination is the 'soup' motion.",
    memoryTip: "Biceps = Bend & Bring the Soup! Flex the elbow and supinate (turn palm up) to carry soup.",
    examAlert: "Supination is NOT pronation - it's turning the palm UP (like holding soup)!",
    whyCorrect: "The biceps' attachment on the radial tuberosity allows it to rotate the radius, causing supination."
  },
  22: {
    keyContent: "Teres minor is located superior to teres major along the lateral border of the scapula. It's part of the rotator cuff and externally rotates the shoulder.",
    memoryTip: "Minor = Higher! Teres MINOR sits ABOVE teres major on the scapula.",
    examAlert: "Don't flip them - minor is SUPERIOR, major is INFERIOR!",
    whyCorrect: "Teres minor originates from the upper lateral scapular border, positioned above the larger teres major."
  },
  23: {
    keyContent: "Rounded shoulders result from tight anterior muscles (pec major/minor, anterior deltoid). To correct posture, you must lengthen the SHORTENED anterior muscles.",
    memoryTip: "Rounded = Release the Front! Tight chest pulls shoulders forward - release the shortened side!",
    examAlert: "Work the TIGHT side (anterior) to lengthen it - not the already overstretched posterior muscles!",
    whyCorrect: "Lengthening the shortened anterior muscles allows the shoulders to return to neutral alignment."
  },
  24: {
    keyContent: "The sympathetic nervous system originates from the thoracolumbar region (T1-L2 spinal segments). This is the 'fight or flight' response center.",
    memoryTip: "Sympathetic = T-L = Thoraco-Lumbar! Think 'Fight from Torso & Lower back'.",
    examAlert: "Sympathetic is T1-L2 (middle), NOT craniosacral (that's parasympathetic)!",
    whyCorrect: "Sympathetic preganglionic neurons emerge from the thoracic and lumbar spinal cord segments."
  },
  25: {
    keyContent: "The musculocutaneous nerve (C5-C7) innervates three anterior arm muscles: biceps brachii, brachialis, and coracobrachialis (the BBC muscles).",
    memoryTip: "Musculocutaneous = BBC! Biceps, Brachialis, Coracobrachialis - the British Broadcasting Corporation of the arm!",
    examAlert: "All three BBC muscles are in the ANTERIOR compartment - not posterior!",
    whyCorrect: "The musculocutaneous nerve pierces and innervates all three muscles in the anterior arm compartment."
  },
  26: {
    keyContent: "Rectus femoris is unique - it's the only quadriceps muscle that crosses BOTH the hip and knee joints. The others only cross the knee.",
    memoryTip: "Rectus = Two Joints! It's the only quad that crosses hip AND knee - the overachiever!",
    examAlert: "The other three quads (vastus muscles) only cross the knee - rectus femoris is special!",
    whyCorrect: "Rectus femoris originates on the pelvis (AIIS), crossing the hip, while other quads originate on the femur."
  },
  27: {
    keyContent: "Fibrous ankylosis involves abnormal fibrous tissue formation that restricts joint movement. Massage helps by stretching and mobilizing the fibrous adhesions.",
    memoryTip: "Fibrous = Fibers stuck! Massage stretches the stuck fibers to restore movement.",
    examAlert: "Fibrous ankylosis is RESTRICTION from scar tissue - massage can help (unlike bony ankylosis)!",
    whyCorrect: "Massage mechanically stretches fibrous tissue, improving joint mobility when restriction is soft tissue-based."
  },
  28: {
    keyContent: "Tendons are dense fibrous connective tissue composed primarily of collagen fibers. They connect muscle to bone, transmitting contractile force.",
    memoryTip: "Tendons = Tough Cords! Collagen-packed cords connect muscle to bone.",
    examAlert: "Tendons connect muscle-to-bone. Ligaments connect bone-to-bone!",
    whyCorrect: "Collagen fibers provide tensile strength, allowing tendons to transmit muscle force to skeletal attachments."
  },
  29: {
    keyContent: "The Pes Anserine ('goose foot') is where three muscles insert on the medial tibia: Sartorius, Gracilis, Semitendinosus (SGS).",
    memoryTip: "SGS = Say Goodnight to Sartorius, Gracilis, Semitendinosus! They form the goose foot.",
    examAlert: "All THREE muscles attach at the pes anserine - memorize SGS!",
    whyCorrect: "These three tendons merge to form a flat, webbed insertion resembling a goose's foot on the medial tibia."
  },
  30: {
    keyContent: "Acute plantar fasciitis involves ACTIVE inflammation. Ice is contraindicated acutely because it can prolong healing by reducing necessary inflammatory responses.",
    memoryTip: "Acute = Active inflammation! Don't ice acute inflammation - you need it to heal!",
    examAlert: "This is ACUTE (recent injury) - chronic is different! Ice reduces helpful acute inflammation.",
    whyCorrect: "Acute inflammation is necessary for tissue healing. Suppressing it with ice delays the repair process."
  },
  31: {
    keyContent: "Plantar fasciitis treatment involves mobilizing the plantar fascia and surrounding muscles. Work the foot's bottom structures to reduce tension and adhesions.",
    memoryTip: "Plant your hands on the Plantar surface! Work the bottom of the foot directly.",
    examAlert: "Work the BOTTOM of the foot (plantar surface) - that's where the fascia is!",
    whyCorrect: "Direct work on the plantar fascia and intrinsic foot muscles addresses the source of pain and restriction."
  },
  32: {
    keyContent: "The plantar lymphatic plexus is a major lymphatic network in the feet, specifically in the plantar surface. Walking stimulates this 'pump' mechanism.",
    memoryTip: "Plantar Plexus = Foot Pump! Walking pumps lymph from the bottom of your feet.",
    examAlert: "The plexus is in the PLANTAR (bottom) surface - walking compresses it to pump lymph!",
    whyCorrect: "The plantar surface contains dense lymphatic vessels that are compressed during walking, pumping lymph upward."
  },
  33: {
    keyContent: "The Conception Vessel (Ren Mai) in TCM is an extraordinary meridian that runs along the anterior midline, governing Yin energy and reproductive functions.",
    memoryTip: "Conception = Front & Center! Ren Mai runs up the front midline, governing reproduction.",
    examAlert: "Conception Vessel is ANTERIOR midline - don't confuse with Governing Vessel (posterior)!",
    whyCorrect: "Ren Mai travels up the anterior midline from the perineum to the lower lip, regulating Yin."
  },
  34: {
    keyContent: "Accessory respiratory muscles include scalenes, SCM, pectoralis minor, and serratus posterior. They assist breathing when demand increases or in respiratory distress.",
    memoryTip: "Accessory = Emergency Air! These muscles kick in when you need extra breathing help.",
    examAlert: "These are ACCESSORY (helpers) - primary muscles are diaphragm and external intercostals!",
    whyCorrect: "Accessory muscles elevate the rib cage and expand the thorax when primary muscles need assistance."
  },
  35: {
    keyContent: "Muscles are classified as tonic (postural stabilizers with slow-twitch fibers) or phasic (movement muscles with fast-twitch fibers). They respond differently to dysfunction.",
    memoryTip: "Tonic = Tight! Tonic muscles tend to tighten when stressed. Phasic = Weak! They tend to weaken.",
    examAlert: "Tonic muscles SHORTEN when dysfunctional. Phasic muscles LENGTHEN and weaken!",
    whyCorrect: "Tonic postural muscles have more slow-twitch fibers that tend toward hypertonicity and shortening."
  },
  36: {
    keyContent: "The vagus nerve (CN X) is the primary parasympathetic nerve controlling heart rate via the 'rest and digest' system. It slows heart rate.",
    memoryTip: "Vagus = Vast Relaxation! It's the main nerve that slows your heart for rest.",
    examAlert: "Vagus DECREASES heart rate (parasympathetic) - sympathetic increases it!",
    whyCorrect: "Vagal stimulation releases acetylcholine, which reduces heart rate and promotes relaxation."
  },
  37: {
    keyContent: "Erythrocytes (red blood cells) are produced exclusively in red bone marrow through erythropoiesis. Red marrow is found in flat bones and epiphyses of long bones.",
    memoryTip: "Red cells from Red marrow! Erythrocytes are made in red bone marrow only.",
    examAlert: "RED marrow makes red blood cells - yellow marrow stores fat!",
    whyCorrect: "Red bone marrow contains hematopoietic stem cells that differentiate into erythrocytes."
  },
  38: {
    keyContent: "In TCM, Lung (LU) and Large Intestine (LI) are paired Metal element channels. Smoking damages Lung Qi, which weakens its paired Large Intestine, causing constipation.",
    memoryTip: "Lung & Large Intestine = Linked! Weak Lungs = Weak bowels in TCM Metal pair.",
    examAlert: "This is TCM theory - Lung and Large Intestine are energetically paired in the Metal element!",
    whyCorrect: "TCM Metal element pairs show that Lung Qi deficiency affects Large Intestine's transportation function."
  },
  39: {
    keyContent: "TCM Five Element generation cycle: Wood feeds Fire → Fire creates Earth (ash) → Earth bears Metal → Metal enriches Water → Water nourishes Wood.",
    memoryTip: "Wood Fire Earth Metal Water! Think: 'Campfire makes ash, ash has minerals, minerals feed streams, water grows trees.'",
    examAlert: "This is the GENERATION cycle (mother-child) - not the control cycle!",
    whyCorrect: "Each element generates/nourishes the next in the cycle: Wood → Fire → Earth → Metal → Water → Wood."
  },
  40: {
    keyContent: "In TCM, the Lung meridian governs skin health because Lungs control exterior defensive Qi and skin moisture. Lung dysfunction manifests as dry, rough skin.",
    memoryTip: "Lungs = Skin's Friend! Healthy Lungs = Healthy skin in TCM.",
    examAlert: "This is TCM theory - Lungs govern skin, hair, and pores through Wei Qi circulation!",
    whyCorrect: "Lung Qi spreads moisture and defensive energy to the skin surface, maintaining healthy skin texture."
  },
  41: {
    keyContent: "In TCM, the Heart is the supreme organ (the Emperor) that houses the Shen (Spirit/Mind) and governs consciousness, emotions, and mental clarity.",
    memoryTip: "Heart = Emperor! It rules all organs and houses your Spirit (Shen).",
    examAlert: "In TCM, Heart governs MIND/SPIRIT - not just circulation!",
    whyCorrect: "The Heart's role as Emperor means it coordinates all other organs and houses consciousness."
  },
  42: {
    keyContent: "Muscle contraction compresses blood vessels, reducing circulation. Decreased blood flow means less oxygen and nutrients, plus accumulation of metabolic waste (lactic acid).",
    memoryTip: "Contract = Constrict! Tight muscles squeeze blood vessels shut, starving the tissue.",
    examAlert: "Compression REDUCES blood flow - this causes pain and fatigue!",
    whyCorrect: "Sustained contraction occludes vessels, creating ischemia and metabolic waste buildup."
  },
  43: {
    keyContent: "Tapotement encompasses ALL percussive techniques: tapping, hacking, cupping, slapping, beating, and pounding. All involve rhythmic striking movements.",
    memoryTip: "Tapotement = Tap Tap! Any rhythmic percussion/striking is tapotement.",
    examAlert: "Tapotement is the CATEGORY - hacking, cupping, etc. are all types of tapotement!",
    whyCorrect: "Tapotement (from French 'tapoter' = to tap) includes all variations of percussive massage."
  },
  44: {
    keyContent: "Acetylcholine (ACh) is THE neurotransmitter at neuromuscular junctions. Motor neurons release ACh to trigger muscle fiber contraction.",
    memoryTip: "ACh = Action! Acetylcholine triggers muscle ACTION/contraction.",
    examAlert: "ACh is the ONLY neurotransmitter at skeletal muscle junctions - not dopamine or serotonin!",
    whyCorrect: "ACh binds to receptors on muscle fibers, initiating the contraction cascade."
  },
  46: {
    keyContent: "Putting muscles 'on slack' means positioning to SHORTEN the muscle, reducing tension for therapeutic work. This allows deeper, pain-free treatment.",
    memoryTip: "Slack = Shorten! Move joints to shorten the muscle for relaxed, easy treatment.",
    examAlert: "On slack = SHORTENED position - NOT stretched! Bring origin and insertion closer.",
    whyCorrect: "Shortening a muscle reduces tension and protective guarding, allowing more effective treatment."
  },
  47: {
    keyContent: "For low back pain clients, proper positioning reduces spinal compression and muscle strain. Prone: pillow under hips. Supine: knees supported/bent.",
    memoryTip: "Low Back = Lift & Support! Prone: lift hips. Supine: support knees.",
    examAlert: "Support the LOW back's natural curve - don't flatten it!",
    whyCorrect: "Proper support maintains lumbar lordosis and reduces muscle tension during treatment."
  },
  48: {
    keyContent: "A saddle joint has two concave-convex surfaces fitting together like a rider on a saddle. It allows flexion, extension, abduction, adduction, and circumduction.",
    memoryTip: "Saddle = Sitting Rider! Like sitting in a saddle - rock front/back, side/side, and circle around!",
    examAlert: "Saddle joints allow circumduction - think thumb CMC joint movement!",
    whyCorrect: "The reciprocal concave-convex surfaces allow multi-axial movement including circumduction."
  }
};

// Function to escape special characters for regex and create proper escaped string
function createMarkdownExplanation(data) {
  const parts = [
    `🎯 **Key Concept**: ${data.keyContent}`,
    `💡 **Memory Tip**: ${data.memoryTip}`,
    `⚠️ **Exam Alert**: ${data.examAlert}`,
    `✅ **Why Correct**: ${data.whyCorrect}`
  ];

  // Join with \\\\n\\\\n (this creates literal \n\n in the output file)
  // We need 4 backslashes because: 2 for JS string escaping -> 2 in output -> 1\n when read by TS
  return parts.join('\\\\n\\\\n');
}

// Process each question
let changedCount = 0;
for (let id = 1; id <= 48; id++) {
  if (!conversions[id]) {
    console.log(`⚠️  Skipping Q${id} - no conversion data`);
    continue;
  }

  // Find the topic_explanation line for this question ID
  const questionRegex = new RegExp(`"id":\\s*${id},([\\s\\S]*?)"topic_explanation":\\s*"[^"]*"`, 'm');
  const match = content.match(questionRegex);

  if (!match) {
    console.log(`❌ Could not find Q${id}`);
    continue;
  }

  // Extract just the topic_explanation value to replace
  const topicRegex = new RegExp(`("id":\\s*${id},[\\s\\S]*?"topic_explanation":\\s*")[^"]*"`, 'm');
  const newExplanation = createMarkdownExplanation(conversions[id]);

  content = content.replace(topicRegex, `$1${newExplanation}"`);
  changedCount++;
  console.log(`✅ Converted Q${id}`);
}

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 Successfully converted ${changedCount} questions!`);
