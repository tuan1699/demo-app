export const validDate = (dueDate) => {
  const date = new Date(dueDate);
  return date.toDateString().slice(4);
};
