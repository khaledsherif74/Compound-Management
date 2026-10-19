/** Flattens a zod safeParse result into [{ path, message }] for readable assertions. */
export const schemaIssues = result =>
  result.success ? [] : result.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message }));

/** True when the result has an issue at `path` with exactly this message. */
export const hasIssue = (result, path, message) =>
  schemaIssues(result).some(issue => issue.path === path && issue.message === message);
