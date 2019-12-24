export const UTC = (date) => {
    if (date) return date.toISOString();
    else return date;
};