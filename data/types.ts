export interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  correct_option: string | null;
  correct_answer_text: string | null;
  rewrite_question: string;
  mnemonic: string;
  topic_explanation: string;
  incorrect_explanations: Record<string, string>;
  visual_aid_prompt: string;
  category: string;
}
