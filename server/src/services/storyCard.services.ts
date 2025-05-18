import pool from "../db";
import { SQL } from "../models/sql.model";
import { StoryCard } from "../../src/models/storyCard.model";

export const checkBoardExists = async (boardId: string): Promise<boolean> => {
  const { rows } = await pool.query(SQL.checkBoardExists, [boardId]);
  return rows.length > 0;
};

export const getAllCards = async (boardId: string): Promise<StoryCard[]> => {
  const { rows } = await pool.query(SQL.all, [boardId]);
  return rows;
};

export const getCardById = async (id: string): Promise<StoryCard | null> => {
  const { rows } = await pool.query(SQL.find, [id]);
  return rows[0] || null;
};

export const createCard = async (card: {
  boardId: string;
  content: string;
  pos: { x: number; y: number };
  height: number;
}): Promise<StoryCard> => {
  const { content, pos, height, boardId } = card;
  const { rows } = await pool.query(SQL.create, [
    content,
    pos.x,
    pos.y,
    height,
    boardId,
  ]);
  return rows[0];
};

export const updateCard = async (
  id: string,
  boardId: string,
  cardData: {
    content: string;
    pos: { x: number; y: number };
    height: number;
  }
): Promise<StoryCard | null> => {
  const { content, pos, height } = cardData;
  const { rows } = await pool.query(SQL.update, [
    id,
    content,
    pos.x,
    pos.y,
    height,
    boardId,
  ]);
  return rows[0] || null;
};

export const removeCard = async (id: string): Promise<StoryCard | null> => {
  const { rows } = await pool.query(SQL.delete, [id]);
  return rows[0] || null;
};
