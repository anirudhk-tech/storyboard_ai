import pool from "../db";
import { SQL } from "../models/sql.model";
import { StoryCard } from "../../src/models/storyCard.model";

export const getAllCards = async (): Promise<StoryCard[]> => {
  const { rows } = await pool.query(SQL.all);
  return rows;
};

export const getCardById = async (id: string): Promise<StoryCard | null> => {
  const { rows } = await pool.query(SQL.find, [id]);
  return rows[0] || null;
};

export const createCard = async (card: {
  content: string;
  pos: { x: number; y: number };
  height: number;
}): Promise<StoryCard> => {
  const { content, pos, height } = card;
  const { rows } = await pool.query(SQL.create, [
    content,
    pos.x,
    pos.y,
    height,
  ]);
  return rows[0];
};

export const updateCard = async (
  id: string,
  cardData: { content: string; pos: { x: number; y: number }; height: number }
): Promise<StoryCard | null> => {
  const { content, pos, height } = cardData;
  const { rows } = await pool.query(SQL.update, [
    id,
    content,
    pos.x,
    pos.y,
    height,
  ]);
  return rows[0] || null;
};

export const removeCard = async (id: string): Promise<StoryCard | null> => {
  const { rows } = await pool.query(SQL.delete, [id]);
  return rows[0] || null;
};
