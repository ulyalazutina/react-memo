import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import useMode from "../../hooks/useMode";

export function SelectLevelPage() {
  const { setIsEasyMode, isEasyMode } = useMode();
  function handleCheckboxClick() {
    setIsEasyMode(prevValue => !prevValue);
  }
  const handleCheckboxChange = e => {
    setIsEasyMode(e.target.checked);
  };
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <Checkbox
          id="easy-mode"
          name="easy-mode"
          label="Включить легкий режим"
          onClick={handleCheckboxClick}
          onChange={handleCheckboxChange}
          checked={isEasyMode}
        ></Checkbox>
        <Link className={styles.leaderboardLink} to={"/leaderboard"}>
          Перейти к лидерборду
        </Link>
      </div>
    </div>
  );
}
