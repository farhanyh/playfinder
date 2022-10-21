import { Character } from "../../database/models/character";

export class CharacterListener {
  constructor(public character: Character) {
    character.onEvent((event) => {
      console.log(event.id);
    });
  }
}
