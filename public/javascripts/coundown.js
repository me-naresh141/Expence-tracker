let coundown = document.querySelector(".coundown");
let otpFormDiv = document.getElementById("otp-form-div");
function timePeriod() {
  var sec = 59;
  timer = setInterval(() => {
    coundown.innerHTML = "00:" + sec;
    sec--;
    if (sec < 0) {
      clearInterval(timer);
      window.location.replace("/users/forget-password");
    }
  }, 1000);
}
timePeriod();
