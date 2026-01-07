#!/usr/bin/perl
use strict;
use warnings;
use utf8;
binmode(STDOUT, ":utf8");

# Read the entire file
my $filename = 'data/questions.ts';
open(my $fh, '<:utf8', $filename) or die "Cannot open $filename: $!";
my $content = do { local $/; <$fh> };
close($fh);

# Track replacements
my $count = 0;

# Question 245
if ($content =~ s/The atlas is the first cervical vertebra \(C1\) that directly supports the skull\. Unlike other vertebrae, it lacks a vertebral body and has specialized articular surfaces to cradle the occipital condyles of the skull\. This unique ring-shaped structure allows for nodding movements of the head\. The atlas works with the axis \(C2\) to provide rotational movement\. This is crucial anatomy for massage therapists working on neck tension, as the atlanto-occipital joint is a common area of restriction and headache referral\./🎯 **Key Concept**: The atlas is the first cervical vertebra (C1) that directly supports the skull. Unlike other vertebrae, it lacks a vertebral body and has a unique ring-shaped structure.\\n\\n💡 **Memory Tip**: "ATLAS holds up the WORLD (your head)!" Just like the Greek titan Atlas carried the world on his shoulders, C1 carries your head on your neck!\\n\\n⚠️ **Exam Alert**: Don't confuse atlas with carpal bones (wrist bones) - atlas is C1 cervical vertebra at the top of your neck.\\n\\n✅ **Why Correct**: The atlanto-occipital joint is crucial for massage therapists working on neck tension, as it's a common area of restriction and headache referral./g) {
    print "✓ Converted question 245\n";
    $count++;
}

# Question 246
if ($content =~ s/Post-mastectomy lymphedema occurs when axillary \(armpit\) lymph nodes are surgically removed during cancer treatment\. These lymph nodes normally drain lymphatic fluid from the arm\. Without them, lymphatic drainage is compromised, causing fluid accumulation and swelling in the arm, hand, and sometimes chest wall on the affected side\. This is a serious contraindication for deep massage on the affected limb\. Massage therapists must obtain physician clearance and may need specialized lymphatic drainage training to safely treat these clients\./🎯 **Key Concept**: Post-mastectomy lymphedema occurs when axillary (armpit) lymph nodes are surgically removed during cancer treatment, blocking normal lymphatic drainage from the arm.\\n\\n💡 **Memory Tip**: "LYMPH NODES REMOVED = DRAINAGE BLOCKED!" Think of lymph nodes as highway toll booths - remove the booths and traffic backs up!\\n\\n⚠️ **Exam Alert**: This is a serious contraindication for deep massage on the affected limb. Always obtain physician clearance before treating.\\n\\n✅ **Why Correct**: Without axillary lymph nodes, lymphatic fluid accumulates causing swelling in the arm, hand, and sometimes chest wall on the affected side./g) {
    print "✓ Converted question 246\n";
    $count++;
}

# Question 247
if ($content =~ s/Vibration massage involves rapid oscillating movements transmitted through the therapist's hands to the client's tissue\. The primary force comes from contraction and relaxation of forearm muscles \(flexors and extensors\), which create the vibratory motion\. Using fingers alone would cause fatigue and lack power, while legs provide no mechanical advantage for hand techniques\. Proper vibration technique protects the therapist from repetitive strain injury and delivers therapeutic benefits including muscle relaxation, increased circulation, and nervous system stimulation through rhythmic pressure waves\./🎯 **Key Concept**: Vibration massage involves rapid oscillating movements where the primary force comes from contraction and relaxation of forearm muscles (flexors and extensors).\\n\\n💡 **Memory Tip**: "VIBRATE with your FOREARMS, not your fingers!" Think of guitar strings vibrating from the neck (forearm), not the tuning pegs (fingers).\\n\\n⚠️ **Exam Alert**: Using fingers alone causes fatigue and lacks power. Legs provide no mechanical advantage for hand techniques.\\n\\n✅ **Why Correct**: Proper vibration technique protects therapists from repetitive strain injury and delivers therapeutic benefits including muscle relaxation and increased circulation./g) {
    print "✓ Converted question 247\n";
    $count++;
}

# Write the modified content back
open($fh, '>:utf8', $filename) or die "Cannot write to $filename: $!";
print $fh $content;
close($fh);

print "\n✅ Successfully converted $count topic_explanations!\n";
