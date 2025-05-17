import { Router } from "express";
import * as controllers from "../controllers/storyCard.controllers";

export const storyCardRouter = Router({ mergeParams: true })
  .get("/", controllers.listCards)
  .post("/", controllers.createCard)
  .get("/:id", controllers.getCard)
  .put("/:id", controllers.updateCard)
  .delete("/:id", controllers.deleteCard);
