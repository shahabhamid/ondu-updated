export const addMessage = (message) => {
  return {
    type: "ADD_MESSAGE",
    payload: message,
  };
};

// getChatHistory action
export const getChatHistory = (userData) => {
  return (dispatch) => {
    fetch(`http://localhost:5000/api/chat/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "GET_CHAT_HISTORY",
          payload: data,
        });
      })
      .catch((err) => console.log(err));
  };
};
