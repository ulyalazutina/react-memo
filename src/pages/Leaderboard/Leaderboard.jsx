// import { useEffect } from "react";
import { Button } from "../../components/Button/Button";
import styles from "./Leaderboard.module.css";
// import { getList } from "../../api";
import useLeaders from "../../hooks/useLeaders";
import { Leader } from "../../components/Leader/Leader";
import { useNavigate } from "react-router-dom";

export function Leaderboard() {
  const { leadersData, listError } = useLeaders();
  let navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };
  const leaders = leadersData.sort((a, b) => a.time - b.time);
  // console.log(leadersData);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Лидерборд</h2>
        <Button onClick={navigateToHome}>Начать игру</Button>
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={styles.th}>Позиция</th>
            <th className={styles.th}>Имя</th>
            <th className={styles.th}>Достижения</th>
            <th className={styles.th}>Время</th>
          </tr>
        </thead>
        {leaders.map((item, index) => (
          <Leader key={index} id={item.id} name={item.name} time={item.time} />
        ))}
      </table>
      {listError ? <p className={styles.errorMsg}>{listError}</p> : null}
    </div>
  );
}
