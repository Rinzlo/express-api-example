const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');

describe('recipes', () => {
  it("It should do some stuff", async () => {
    const response = await request(app).get('/recipes');
    expect(response.statusCode).toBe(200);
  });

  it("responds correctly to '/recipes'", async () => {
    const response = await request(app).get('/recipes');
    expect(response.body).toEqual({
      "recipeNames": [
        "scrambledEggs",
        "garlicPasta",
        "chai"
      ]
    })
  })

  it("correctly responds to existing recipe from GET '/recipes/details/garlicPasta'", async () => {
    const recipeName = "garlicPasta";
    const response = await request(app).get(`/recipes/details/${recipeName}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      "details":
        {
          "ingredients": [
            "500mL water",
            "100g spaghetti",
            "25mL olive oil",
            "4 cloves garlic",
            "Salt"
          ],
          "numSteps":5
        }
    });
  });

  it("correctly responds to non existing recipe from GET '/recipes/details/does_not_exist'", async () => {
    const recipeName = "does_not_exist";
    const response = await request(app).get(`/recipes/details/${recipeName}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it("correctly updates recipe from POST '/recipes'", async () => {
    const recipeName = "butteredBagel";
    const postBody = {
      "name": recipeName, 
        "ingredients": [
          "1 bagel",
          "butter"
        ], 
      "instructions": [
        "cut the bagel",
        "spread butter on bagel"
      ] 
    };

    const getResBefore = await request(app).get('/recipes');
    expect(getResBefore.body.recipeNames).not.toContain(recipeName);

    const postResBefore = await request(app).post(`/recipes`).send(postBody);
    expect(postResBefore.statusCode).toBe(201);
    expect(postResBefore.body).toEqual("");

    const getResAfter = await request(app).get('/recipes');
    expect(getResAfter.body.recipeNames).toContain(recipeName);

    const postResAfter = await request(app).post(`/recipes`).send(postBody);
    expect(postResAfter.statusCode).toBe(400);
    expect(postResAfter.body).toEqual({"error": "Recipe already exists"});
  });

  it("correctly updates recipe from PUT '/recipes'", async () => {
    const existingRecipeName = "butteredBagel";
    const postBody = {
      "name": `${existingRecipeName}`,
        "ingredients": [
          "1 bagel",
          "2 tbsp butter"
        ],
      "instructions": [
        "cut the bagel",
        "spread butter on bagel"
      ]
    };
    const missingRecipeName = "does_not_exist";
    const postBodyMissing = {
      "name": `${missingRecipeName}`,
        "ingredients": [
          "1 bagel",
          "2 tbsp butter"
        ],
      "instructions": [
        "cut the bagel",
        "spread butter on bagel"
      ]
    };


    const getResBefore = await request(app).get(`/recipes/details/${existingRecipeName}`);
    expect(getResBefore.body.details.ingredients).not.toContain("2 tbsp butter");

    const postResBefore = await request(app).put(`/recipes`).send(postBody);
    expect(postResBefore.statusCode).toBe(204);
    expect(postResBefore.body).toEqual({});

    const getResAfter = await request(app).get('/recipes');
    expect(getResAfter.body.recipeNames).toContain(existingRecipeName);

    const postResAfter = await request(app).put(`/recipes`).send(postBodyMissing);
    expect(postResAfter.statusCode).toBe(404);
    expect(postResAfter.body).toEqual({"error": "Recipe does not exist"});
  });

  // it('gets all', () => {
  //   const val = 1;
  //   const obj = {};

  //   expect(val).toBe(1);
  //   expect(obj).toEqual({});
  // });

  // it.todo('can create');

  // it.todo('get\'s details');
})