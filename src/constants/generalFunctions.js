export const TabTitle = (newTitle) => {
    return document.title = `Trivi.ca ${newTitle === '' ? '' : ' - '} ${newTitle}`;
}