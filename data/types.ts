export interface Question {
  id: number;
  original_question: string;
  paraphrased_question: string;
  options: Record<string, string>;
  correct_option: string | null;
  correct_answer_text: string | null;
  category: string;
  explanation: string;
  mnemonic: string;
}
