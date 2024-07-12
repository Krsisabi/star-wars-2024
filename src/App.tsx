import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Search } from './components/Search';
import { List } from './components/List';
import { Character, TResponse } from './types';
import { useLocalStorage } from './hooks';
import styles from './App.module.scss';

const BASE_URL = 'https://swapi.dev/api/people/';
export const LSKey = 'searchValue';

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { value: searchValue, setValue: setSearchValue } = useLocalStorage(
    LSKey,
    ''
  );

  const initSearchValue = useRef(searchValue);

  const fetchCharacters = useCallback(
    async (character: string) => {
      try {
        setSearchValue((prev) => prev.trim());
        setIsLoading(true);
        const url = new URL(BASE_URL);

        if (character) {
          url.searchParams.append('search', character);
        }

        const res = await fetch(url.toString());
        if (!res.ok) {
          throw new Error(`Error fetching characters: ${res.statusText}`);
        }

        setIsLoading(false);
        const { results } = (await res.json()) as TResponse;

        setCharacters(results);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
        setIsLoading(false);
      }
    },
    [setSearchValue]
  );

  useEffect(() => {
    fetchCharacters(initSearchValue.current);
  }, [fetchCharacters]);

  useEffect(() => {
    if (hasError) throw new Error('Your bad =(');
  }, [hasError]);

  const searchInputHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);

  const throwError = () => setHasError(true);

  return (
    <div className={styles.app}>
      <button className={styles.button} onClick={throwError}>
        Generate error
      </button>
      <Search
        value={searchValue}
        onChange={searchInputHandler}
        onSubmit={fetchCharacters}
      />
      {isLoading ? (
        <h2 style={{ marginTop: '32px' }}>Loading...</h2>
      ) : (
        <List data={characters} />
      )}
    </div>
  );
}

export default App;
