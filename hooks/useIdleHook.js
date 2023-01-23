import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { signOut, useSession } from "next-auth/react"


export default function useIdleState() {
  let countdownInterval;
  let timeout;
  const [isModal, setIsModal] = useState(false);
  const [warnUser, setWarnUser] = useState(false);
  const [isUserIdle, setIsUserIdle] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(10);
  const [intervalId, setIntervalId] = useState(null);

  const logout = async () => {
    clearInterval(countdownInterval);
    console.log(countdownInterval, "countdownInterval");
    await signOut({redirect: false, callbackUrl: "/"})
  };

  const onIdle = () => {
    if (!warnUser) {
      setWarnUser(true);
      let countDown = 10;
      setTimeoutCountdown(countDown);
      countdownInterval = setInterval(() => {
        if (countDown > 0) {
          setTimeoutCountdown(--countDown);
          if(countDown === 1){
            clearInterval(countdownInterval);
            setWarnUser(false);
            setTimeoutCountdown(10);
            logout();
          }
        } else {
          setWarnUser(false);
          setTimeoutCountdown(10);
          logout(true);
        }
      }, 1000);
      setIntervalId(countdownInterval);
    }
  };

  const { isIdle, reset, getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 600000,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
    ],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: false,
    syncTimers: 0,
    leaderElection: false,
  });

  const onReset = (intervalId) => {
    setWarnUser(false)
    clearInterval(intervalId);
    reset()
  };

  // useEffect(() => {
  //   if (
  //     localStorage.getItem("isIdle") === "true" ||
  //     typeof localStorage.getItem("token") !== "string"
  //   ) {
  //     logout();
  //   }
  // }, []);

  return [isIdle, warnUser, timeoutCountdown, onReset, intervalId];
}
