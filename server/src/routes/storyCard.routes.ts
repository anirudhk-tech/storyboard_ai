import { Router } from "express";
import * as controllers from "../controllers/storyCard.controllers";

export const storyCardRouter = Router()
  .get("/", controllers.listCards)
  .get("/:id", controllers.getCard)
  .post("/", controllers.createCard)
  .put("/:id", controllers.updateCard)
  .delete("/:id", controllers.deleteCard);
