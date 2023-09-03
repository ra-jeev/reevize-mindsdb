let dateTimeFormatter: Intl.DateTimeFormat;

export const formatDateTime = (dateString: string) => {
  if (!dateString) {
    return "";
  }

  if (!dateTimeFormatter) {
    dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  return dateTimeFormatter.format(new Date(dateString));
};
