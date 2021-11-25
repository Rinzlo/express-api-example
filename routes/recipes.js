const express = require('express');
const data = require('./recipe.json');
const router = express.Router();

router.get('/', (_, res) => {
  const names = data.recipes.map(recipe => recipe.name);
  res.json({ recipeNames: names });
});

router.get('/details/:name', (req, res) => {
  const name = req.params.name;
  const recipe = data.recipes.find(recipe => recipe.name === name);
  if (recipe) {
    const { ingredients, instructions } = recipe;
    const numSteps = instructions.length;
    res.json({ details: { ingredients, numSteps } });
  } else
    res.json({});
});

router.post('/', (req, res) => {
  const { name, ingredients, instructions } = req.body;
  const exists = !!data.recipes.find(recipe => recipe.name === name);
  if (exists)
    res.status(400).json({ error: "Recipe already exists" });
  else {
    data.recipes.push({ name, ingredients, instructions });
    res.status(201).json();
  }
});

router.put('/', (req, res) => {
  const { name, ingredients, instructions } = req.body;
  const recipe = data.recipes.find(recipe => recipe.name === name);
  if (recipe) {
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    res.status(204).json({});
  } else {
    res.status(404).json({ error: "Recipe does not exist" });
  }
});

module.exports = router;