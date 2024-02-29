import { useEffect } from "react";
import { Button } from "../../components/Button/Button";
import styles from "./Leaderboard.module.css";
import { getList } from "../../api";
import useLeaders from "../../hooks/useLeaders";
import { Leader } from "../../components/Leader/Leader";

export function Leaderboard() {
  const { leadersData, setLeadersData } = useLeaders();

  useEffect(() => {
    getList().then(data => {
      setLeadersData(data.leaders);
    });
  }, []);
  // console.log(leadersData);

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
        {leadersData.map((item, index) => (
          <Leader key={index} id={item.id} name={item.name} time={item.time} />
        ))}
      </table>
    </div>
  );
}
