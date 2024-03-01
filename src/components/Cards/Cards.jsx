import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import useMode from "../../hooks/useMode";
import { useNavigate } from "react-router-dom";
import useLeaders from "../../hooks/useLeaders";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

const STATUS_PAUSE = "STATUS_PAUSE";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const { isEasyMode } = useMode();
  const [attempts, setAttempts] = useState(isEasyMode ? 3 : 1);
  // const { leadersData } = useLeaders();
  let navigate = useNavigate();

  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const { leadersData } = useLeaders();

  const [isLeader, setIsLeader] = useState(false);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);
  const [gamePauseDate, setGamePauseDate] = useState(false);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  // отслеживает была ли нажата суперсила прозрение
  const [onEpiphany, setOnEpiphany] = useState(true);

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setAttempts(isEasyMode ? 3 : 1);
    setIsLeader(false);
  }
  function navigateHome() {
    navigate("/");
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon && !isEasyMode && pairsCount === 3) {
      const timeLastLeader = leadersData[leadersData.length - 1].time;
      const timeWin = timer.minutes * 60 + timer.seconds;
      if (timeWin >= timeLastLeader) {
        setIsLeader(false);
      } else {
        setIsLeader(true);
      }
      finishGame(STATUS_WON);
      return;
    } else if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });
    if (isEasyMode) {
      if (openCardsWithoutPair.length === 2 && attempts === 1) {
        setAttempts(prevValue => prevValue - 1);
        finishGame(STATUS_LOST);
      } else if (openCardsWithoutPair.length === 2) {
        setAttempts(prevValue => prevValue - 1);
        setTimeout(() => {
          setCards(
            cards.map(card => {
              return openCardsWithoutPair.includes(card) ? { ...card, open: false } : card;
            }),
          );
        }, 1000);
      }
      return;
    }
    const playerLost = openCardsWithoutPair.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost) {
      finishGame(STATUS_LOST);
      return;
    }

    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    if (gamePauseDate) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate, gamePauseDate]);

  function workEpiphany() {
    setGamePauseDate(true);
    setStatus(STATUS_PAUSE);

    setTimeout(() => {
      setStatus(STATUS_IN_PROGRESS);
      setGamePauseDate(false);
      let newDate = new Date(gameStartDate);
      newDate.setSeconds(newDate.getSeconds() + 2);
      setGameStartDate(newDate);
    }, 2000);
    clearTimeout();

    setOnEpiphany(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS || status === STATUS_PAUSE ? (
          <>
            <div className={styles.superpower}>
              <button
                disabled={onEpiphany ? false : true}
                className={styles.superpowerEpiphany_btn}
                type="button"
                onClick={workEpiphany}
              >
                <div className={styles.hintOne_wrap}>
                  <h6 className={styles.hintOne_title}>Прозрение</h6>
                  <p className={styles.hintOne_text}>
                    На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.
                  </p>
                </div>
              </button>
              <button type="button" className={styles.superpowerAlohomora_btn} disabled>
                <div className={styles.hintTwo_wrap}>
                  <h6 className={styles.hintTwo_title}>Алохомора</h6>
                  <p className={styles.hintTwo_text}>Открывается случайная пара карт.</p>
                </div>
              </button>
            </div>
            <Button onClick={resetGame}>Начать заново</Button>
          </>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>
      {isEasyMode && (
        <div className={styles.modeContainer}>
          <div className={styles.modeText}>Включен легкий режим</div>
          <div className={styles.modeText}>Осталось {attempts} попытки</div>
        </div>
      )}
      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={navigateHome}
            isLeader={isLeader}
            onEpiphany={onEpiphany}
          />
        </div>
      ) : null}
    </div>
  );
}
