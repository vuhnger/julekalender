export default function RecipeContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const ingredients = Array.isArray(entry?.ingredients)
    ? entry.ingredients
    : ['2 dl melk', '1 ss kakao', '1 ss sukker']
  const steps = Array.isArray(entry?.steps)
    ? entry.steps
    : ['Varm melk forsiktig.', 'Rør inn kakao og sukker.', 'Hell i kopp og nyt.']

  return (
    <>
      <h2>{title}</h2>
      <p>{entry?.body || 'En liten oppskrift for kos.'}</p>
      {ingredients.length > 0 && (
        <>
          <h3>Ingredienser</h3>
          <ul className="recipe-list">
            {ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </>
      )}
      {steps.length > 0 && (
        <>
          <h3>Slik gjør du</h3>
          <ol className="recipe-steps">
            {steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </>
      )}
    </>
  )
}
