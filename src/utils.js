// utils.js

/**
 * Displays a custom modal message.
 * @param {string} msg - The message to display.
 * @param {function} setModalMessage - React state setter for the modal message.
 * @param {function} setShowModal - React state setter for showing/hiding the modal.
 */
export const showMessageBox = (msg, setModalMessage, setShowModal) => {
  setModalMessage(msg);
  setShowModal(true);
};
