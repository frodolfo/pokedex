# Givebutter Frontend Take-home

## Overview

Our goal is to fix and enhance a Pokedex application. If you are unfamiliar with the world of Pokemon, here is a brief explanation:

> The Pokedex is an electronic device created and designed to catalog and provide information regarding the various species of Pokemon featured in the Pokemon video game, anime and manga series.
 
[Source](https://pokemon.fandom.com/wiki/Pokedex)
 
Our version of the Pokedex is able to list and search through Pokemon. However, our search is a bit buggy. Additionally, we want to add a feature that shows a selected Pokemon's details like its **type**, **moves**, and **evolution chain**.

Your time is valuable, and we are extremely appreciative of you participating in this assessment. We're looking to gauge your ability to read and edit code, understand instructions, and deliver features, just as you would during your typical day-to-day work. We expect this test to take no more than one to two hours and ask to complete this work within the next two days. Upon submit, we will review and provide feedback to you regardless of our decision to continue the process.

Please update and add code in `App.js` and `index.css` based on the requirements found below. Additionally, we ask you to edit the `readme.md` with answers to a few questions found in the `Follow-up Questions` section also found below.

When you are finished, please upload your completed work to your Github and invite `@gperl27` to view it. **Do not open a PR please.**

## Setup

- This repo was scaffolded using `create-react-app`. As such, this app requires a stable version of `node` to get up and running.
- Clone this repo and run `npm install`.
- To run the app, run `npm start`.
- Please reach out to the Givebutter team if you have any issues with the initial setup or have any problems when running the initial app.

## Requirements

### Search
- Typing in the search input should filter the existing Pokemon list and render only matches found
- Fix any bugs that prevent the search functionality from working correctly
- If there are no results from search, render "No Results Found"
- The search results container should be scrollable
- The UI should match the below mockup

![](mockup0.png)

### Details Card
     
- Clicking "Get Details" for any given Pokemon should render a card that has the Pokemon's `name`, `types`, `moves`, and `evolution chain`
- Use the api functions defined in `api.js` to retrieve this data. Adding new endpoints or editing existing ones are out of scope
- The details card should match the below mockup

![](mockup1.png)

## Follow-up Questions

Please take some time to answer the following questions. Your answers should go directly in this `readme`.

- Given more time, what would you suggest for improving the performance of this app?

- Is there anything you would consider doing if we were to go live with this app?

- What was the most challenging aspect of this work for you (if at all)?

---
## Fred's Answers 

- `Given More Time`: I've already implemented a way to cache viewed pokemons so that the app doesn't make a fetch call to the details and evolution chain if the pokemon already exists in this cache.  Maybe even store this cache in local storage.  I'd recommend using [Zustand](https://zustand-demo.pmnd.rs/) for the state management library, especially if we have to define some of the elements on the page as separate components.  This can greatly improve performance of the search operation with minimal setup.  We could also use `React.memo` on the app component for improved rendering performance when there's nothing really new to render.

- `Going Live with App`: I would make it look more presentable by either using some CSS library/framework with a custom theme.  A new font set should be carefully selected for readability.  Usually a UI/UX designer can assist in this matter.  I would add some filters options based on pokemon attributes on the page to give the user the ability to narrow down the list even further.  I would also give the user the option to select maximum number of pokemons to display on the page and show pagination when necessary. Add sorting options. These should also be done for the number of moves a pokemon has.  Perhaps we could also add the letters of the alphabet as buttons for filtering by first letter of the name.  All of these can be part of an advance search option.  The listing should also use `justify-content: space-between` (I left this commented out in the stylesheet) to make the `Get Details` button and pokemon name lining up properly.  I would introduce auto-complete in the search input field and show a partial listing right away view a dropdown in the search input field.  I would add one of the images of the pokemon in the details card.  Should also incorporate unit testing.  Lastly, I would vote for containerizing this application.

- `Most Challenging`:  I think the most challenging for me was flattening the `evolves_to` property.  I had to think about a recursive helper function in order to retrieve all the species transformation and put them in a single array.  Second to this is trying to figure out whether the list of pokemons should be capped at 9 pokemons (based on mockup1.png).  My implementation of this Pokedex app has max limits defined in the `App.js`, but the cap on the list of pokemon isn't enabled in order to demonstrate the auto-scroll in the search result container.  If you enable this via `POKEDEX_SETTINGS.allowMaxPokemons` in `App.js`, then you would see the listing matching that of the first moackup.