export interface StoryCardPosition {
  x: number;
  y: number;
}

export interface StoryCard {
  id: string;
  content: string;
  pos: StoryCardPosition;
  suggestion?: boolean; // Not stored in db
  height: number;
  createdAt: string;
}
