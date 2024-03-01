import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useState } from "react";
import { addLeader } from "../../api";
import { useNavigate } from "react-router-dom";
import useLeaders from "../../hooks/useLeaders";
// import { addLeader } from "../../api";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, isLeader }) {
  const title = isWon && isLeader ? "Вы попали на Лидерборд!" : isWon ? "Вы победили!" : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const isWonTime = gameDurationMinutes * 60 + gameDurationSeconds;

  const inputName = isWon && isLeader;

  const isWonForm = {
    name: "Пользователь",
    time: isWonTime,
  };

  const [nameData, setNameData] = useState(isWonForm);
  const { listError, setListError } = useLeaders();

  let navigate = useNavigate();

  const addLeaderInList = () => {
    addLeader(nameData)
      .then(() => {
        navigate("/leaderboard");
      })
      .catch(error => {
        if (error.message === "Failed to fetch") {
          setListError("Ошибка сервера. Попробуйте зайти позже");
        }
      });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    setNameData({
      ...nameData,
      [name]: value,
    });
    // console.log(nameData);
  };

  return (
    <div className={styles.modal}>
      {listError ? <p className={styles.errorMsg}>{listError}</p> : null}
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {inputName ? (
        <>
          <input
            className={styles.inputUser}
            type="text"
            onChange={handleInputChange}
            value={nameData.name}
            name="name"
            placeholder="Пользователь"
          />
          <Button type="button" onClick={addLeaderInList}>
            Записать
          </Button>
        </>
      ) : null}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={onClick}>Начать сначала</Button>
    </div>
  );
}
