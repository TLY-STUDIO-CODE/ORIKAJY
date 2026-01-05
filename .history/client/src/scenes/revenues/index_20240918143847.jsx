import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [choice, setChoice] = useState('');
  const [input, setInput] = useState('');

  const handleChoiceChange = (event) => {
    setChoice(event.target.value);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSearch = () => {
    onSearch({ choice, input });
  };

  return (
    <div className="search-bar">
      <select value={choice} onChange={handleChoiceChange}>
        <option value="">Choisir une option</option>
        <option value="revenus">Revenus</option>
        <option value="revenus_total">Revenus Total</option>
        <option value="revenus_par_date">Revenus par Date</option>
        <option value="vente_total">Vente Total</option>
      </select>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Entrez les détails"
      />
      <button onClick={handleSearch}>Rechercher</button>
    </div>
  );
};

const ResultDisplay = ({ results }) => {
  return (
    <div className="results">
      {results.map((result, index) => (
        <div key={index}>{result}</div>
      ))}
    </div>
  );
};

const App = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async ({ choice, input }) => {
    // Ici, vous devriez appeler votre API pour obtenir les résultats basés sur les choix et l'entrée
    // Voici un exemple simulé
    const fetchedResults = await fetchResults(choice, input);
    setResults(fetchedResults);
  };

  const fetchResults = async (choice, input) => {
    // Remplacez ceci par votre appel API réel
    // Vous pouvez utiliser `fetch` ou une autre méthode pour appeler votre API backend
    // Exemple fictif
    return [`Résultat pour ${choice} avec ${input}`];
  };

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} />
      <ResultDisplay results={results} />
    </div>
  );
};

export default App;


