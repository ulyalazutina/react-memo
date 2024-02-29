import { Button } from "../../components/Button/Button";
import { Leader } from "../../components/Leader/Leader";
import styles from "./Leaderboard.module.css";

export function Leaderboard() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Лидерборд</h2>
        <Button>Начать игру</Button>
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={styles.th}>Позиция</th>
            <th className={styles.th}>Имя</th>
            <th className={styles.th}>Время</th>
          </tr>
        </thead>
        <Leader></Leader>
      </table>
    </div>
  );
}
