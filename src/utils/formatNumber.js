/** Western digits with grouping in every language, consistent with the rest of the UI. */
export const formatNumber = value => new Intl.NumberFormat('en-US').format(value ?? 0);
