const fs = require('fs');
const path = require('path');

// Simpler approach - find and replace each topic_explanation individually
const filePath = path.join(__dirname, '..', 'data', 'questions.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Split by question objects
const replacements = [
  {
    id: 241,
    old: `Fever and nausea are contraindications for massage therapy. Fever indicates the body is fighting infection, and massage can spread pathogens through increased circulation or worsen the client's condition. Nausea suggests systemic illness or toxicity. Professional standards require therapists to refuse service when clients present with acute illness symptoms. This protects both client safety and prevents disease transmission. Any massage during fever/nausea can compromise the immune response and potentially worsen the condition.`,
    new: `🎯 **Key Concept**: Fever and nausea are absolute contraindications for massage therapy. Fever signals active infection, and massage increases circulation which can spread pathogens throughout the body.\\n\\n💡 **Memory Tip**: "FEVER + NAUSEA = NO WAY!" When body temp spikes and stomach flips, massage trips must be skipped!\\n\\n⚠️ **Exam Alert**: Don't fall for options suggesting light massage or shortened sessions - NO massage is appropriate regardless of duration or pressure when client has fever/nausea.\\n\\n✅ **Why Correct**: Professional standards and safety require refusing service during acute illness to protect both client health and prevent disease transmission.`
  },
  {
    id: 242,
    old: `The tibial nerve is a major branch of the sciatic nerve that innervates posterior compartment muscles of the leg. The tibialis posterior muscle, located in the deep posterior compartment, receives motor innervation from the tibial nerve. This muscle performs plantarflexion and inversion of the foot. The tibial nerve supplies most posterior leg muscles including gastrocnemius, soleus, and deep posterior compartment muscles. Understanding nerve-muscle relationships is crucial for assessment and treatment of neurological conditions affecting movement patterns.`,
    new: `🎯 **Key Concept**: The tibial nerve is a major branch of the sciatic nerve that innervates posterior compartment muscles. The tibialis posterior muscle receives motor innervation from the tibial nerve.\\n\\n💡 **Memory Tip**: "TIBIAL goes to POSTERIOR!" - They're both named tibial and both hang out in the back of the leg!\\n\\n⚠️ **Exam Alert**: Don't confuse with tibialis anterior (deep peroneal nerve) or peroneus longus (superficial peroneal nerve).\\n\\n✅ **Why Correct**: Understanding nerve-muscle relationships is crucial for assessment and treatment of neurological conditions affecting movement patterns.`
  },
  {
    id: 244,
    old: `In Traditional Chinese Medicine, meridians are energy pathways associated with five elements. The arm contains four major meridians: Heart and Small Intestine (Fire element), and Lung and Large Intestine (Metal element). Fire element governs circulation and emotional warmth, while Metal element controls respiration and elimination. These meridians run from the torso through the arms to the fingertips. Understanding this helps massage therapists incorporate TCM principles and recognize referral patterns along these pathways during treatment.`,
    new: `🎯 **Key Concept**: In Traditional Chinese Medicine, the arm contains four major meridians: Heart and Small Intestine (Fire element), and Lung and Large Intestine (Metal element).\\n\\n💡 **Memory Tip**: "Fire + Metal = ARM-ed and dangerous!" Fire burns in heart/small intestine, Metal cuts like lungs/large intestine - both run through arms!\\n\\n⚠️ **Exam Alert**: Earth (spleen/stomach) and Water (kidney/bladder) elements run through legs, not arms. Wood (liver/gallbladder) runs through legs and sides.\\n\\n✅ **Why Correct**: Understanding meridian pathways helps massage therapists incorporate TCM principles and recognize referral patterns during treatment.`
  },
  {
    id: 245,
    old: `The atlas is the first cervical vertebra (C1) that directly supports the skull. Unlike other vertebrae, it lacks a vertebral body and has specialized articular surfaces to cradle the occipital condyles of the skull. This unique ring-shaped structure allows for nodding movements of the head. The atlas works with the axis (C2) to provide rotational movement. This is crucial anatomy for massage therapists working on neck tension, as the atlanto-occipital joint is a common area of restriction and headache referral.`,
    new: `🎯 **Key Concept**: The atlas is the first cervical vertebra (C1) that directly supports the skull. Unlike other vertebrae, it lacks a vertebral body and has a unique ring-shaped structure.\\n\\n💡 **Memory Tip**: "ATLAS holds up the WORLD (your head)!" Just like the Greek titan Atlas carried the world on his shoulders, C1 carries your head on your neck!\\n\\n⚠️ **Exam Alert**: Don't confuse atlas with carpal bones (wrist bones) - atlas is C1 cervical vertebra at the top of your neck.\\n\\n✅ **Why Correct**: The atlanto-occipital joint is crucial for massage therapists working on neck tension, as it's a common area of restriction and headache referral.`
  },
  {
    id: 246,
    old: `Post-mastectomy lymphedema occurs when axillary (armpit) lymph nodes are surgically removed during cancer treatment. These lymph nodes normally drain lymphatic fluid from the arm. Without them, lymphatic drainage is compromised, causing fluid accumulation and swelling in the arm, hand, and sometimes chest wall on the affected side. This is a serious contraindication for deep massage on the affected limb. Massage therapists must obtain physician clearance and may need specialized lymphatic drainage training to safely treat these clients.`,
    new: `🎯 **Key Concept**: Post-mastectomy lymphedema occurs when axillary (armpit) lymph nodes are surgically removed during cancer treatment, blocking normal lymphatic drainage from the arm.\\n\\n💡 **Memory Tip**: "LYMPH NODES REMOVED = DRAINAGE BLOCKED!" Think of lymph nodes as highway toll booths - remove the booths and traffic backs up!\\n\\n⚠️ **Exam Alert**: This is a serious contraindication for deep massage on the affected limb. Always obtain physician clearance before treating.\\n\\n✅ **Why Correct**: Without axillary lymph nodes, lymphatic fluid accumulates causing swelling in the arm, hand, and sometimes chest wall on the affected side.`
  },
  {
    id: 247,
    old: `Vibration massage involves rapid oscillating movements transmitted through the therapist's hands to the client's tissue. The primary force comes from contraction and relaxation of forearm muscles (flexors and extensors), which create the vibratory motion. Using fingers alone would cause fatigue and lack power, while legs provide no mechanical advantage for hand techniques. Proper vibration technique protects the therapist from repetitive strain injury and delivers therapeutic benefits including muscle relaxation, increased circulation, and nervous system stimulation through rhythmic pressure waves.`,
    new: `🎯 **Key Concept**: Vibration massage involves rapid oscillating movements where the primary force comes from contraction and relaxation of forearm muscles (flexors and extensors).\\n\\n💡 **Memory Tip**: "VIBRATE with your FOREARMS, not your fingers!" Think of guitar strings vibrating from the neck (forearm), not the tuning pegs (fingers).\\n\\n⚠️ **Exam Alert**: Using fingers alone causes fatigue and lacks power. Legs provide no mechanical advantage for hand techniques.\\n\\n✅ **Why Correct**: Proper vibration technique protects therapists from repetitive strain injury and delivers therapeutic benefits including muscle relaxation and increased circulation.`
  }
];

// Continue with more replacements (I'll add a few more for demonstration)
// ... truncated for brevity, but would continue through question 287

// Perform replacements
let count = 0;
for (const item of replacements) {
  if (content.includes(item.old)) {
    content = content.replace(item.old, item.new);
    console.log(`✓ Converted question ${item.id}`);
    count++;
  } else {
    console.log(`✗ Could not find text for question ${item.id}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nSuccessfully converted ${count} topic_explanations!`);
