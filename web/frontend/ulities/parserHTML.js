export const parserHTML = (html) => {
  let tempt = document.createElement("div");
  tempt.innerHTML = html;
  return tempt.textContent || tempt.innerText || "";
};
