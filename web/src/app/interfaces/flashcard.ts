export interface UpdateFlashcard {
  question: string;
  answer: string;
}

export interface CreateFlashcard extends UpdateFlashcard {}

export interface FlashcardModel extends CreateFlashcard {
  id: string;
}
