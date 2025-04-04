const messages = [
    "Ishonching komilmi?",
    "Haqiqatan hammi??",
    "Aniqmi??",
    "Annniqmi dedim senga??",
    "Yana bir o'ylab ko'r!",
    "Qara lekin yo'q desang?",
    "Juda xafa bo'laman lekin",
    "Oxirgi marta so'rayapman!?",
    "Mayli unda so'rashni to'xtataman!",
    "Hazil! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    window.location.href = "yes_page.html";
}