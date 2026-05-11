export const preventSpaceKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === " ") {
    e.preventDefault();
  }
};

export const toUtcMidnightIso = (dateInput?: string) => {
  const sourceDate = dateInput ? new Date(dateInput) : new Date();
  const year = sourceDate.getFullYear();
  const month = sourceDate.getMonth();
  const day = sourceDate.getDate();
  return new Date(Date.UTC(year, month, day, 0, 0, 0)).toISOString();
};
