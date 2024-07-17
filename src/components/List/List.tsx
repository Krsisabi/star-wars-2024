import { Card } from './Card';
import type { Character } from '~/types';
import styles from './List.module.scss';

type ListProps = {
  data: Character[];
};

export function List({ data }: ListProps) {
  return (
    <ul className={styles.list}>
      {data.map((el) => (
        <Card key={el.name} {...el} />
      ))}
    </ul>
  );
}
