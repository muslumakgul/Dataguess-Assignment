import React, { useState, useEffect } from 'react';
import { useQuery, gql } from "@apollo/client";
import "./CharacterList.css";

const GET_CHARACTERS = gql`
  query {
    characters {
      results {
        id
        name
      }
    }
  }   
`;

export default function CharactersList() {
  const { error, data, loading } = useQuery(GET_CHARACTERS);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [filteredCharacters, setFilteredCharacters] = useState([]);

  // Update filteredCharacters when data or searchInput changes
  useEffect(() => {
    if (data) {
      const filtered = data.characters.results.filter(character =>
        character.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  }, [data, searchInput]);

  // Effect to auto-select the last item when items are filtered
  useEffect(() => {
    if (filteredCharacters.length > 0) {
      setSelectedCharacter(filteredCharacters[filteredCharacters.length - 1]);
    } else {
      setSelectedCharacter(null);
    }
  }, [filteredCharacters]);

  if (loading) return <div>spinner</div>
  if (error) return <div>something went wrong</div>

  // Handle selecting or deselecting a character
  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  }

  return (
    <div className="CharacterList">
      <input
        type="text"
        placeholder="Search characters"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {filteredCharacters.map((character) => (
        <div
          key={character.id}
          className={`character-item ${selectedCharacter === character ? "selected" : ""}`}
          onClick={() => handleSelectCharacter(character)}
        >
          <input
            type="radio"
            name="character"
            id={`character-${character.id}`}
            checked={character === selectedCharacter}
            onChange={() => handleSelectCharacter(character)}
          />
          <label htmlFor={`character-${character.id}`}>{character.name}</label>
        </div>
      ))}
      <div>
        <h3>Selected Character:</h3>
        {selectedCharacter ? (
          <p>{selectedCharacter.name}</p>
        ) : (
          <p>No character selected</p>
        )}
      </div>
    </div>
  );
}
