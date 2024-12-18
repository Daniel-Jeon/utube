export const checkPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    alert("비밀번호가 맞지 않습니다.");
    return false;
  }
  return true;
};
