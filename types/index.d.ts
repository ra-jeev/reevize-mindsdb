declare global {
  type Option = {
    label: string;
    value: string;
    name: string;
  };

  type Question = {
    text: string;
    options: string[];
    answer: string;
  };

  type GenerateResponse = {
    status: string;
    result?: { id: string; value: string | undefined };
  };

  interface QuizQuestion extends Omit<Question, "options"> {
    text: string;
    answer: string;
    options: Option[];
    selected?: string;
  }
}

export {};
