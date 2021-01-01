import React, { useState } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([])

  const addIngredientHandler = (ingredient) => {
    setIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: Math.random().toString(), ...ingredient },
    ])
  }

  const onRemoveIngredientHandler = (id) => {
    setIngredients((prevIngredients) => {
      return prevIngredients.filter((ig) => id !== ig.id)
    })
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={onRemoveIngredientHandler}
        />
      </section>
    </div>
  )
}

export default Ingredients
