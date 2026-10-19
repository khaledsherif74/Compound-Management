/** Badge tone for an audit action code (destructive/failed = danger, creation = success, ...). */
export const auditActionTone = action => {
  if (/FAILED|DELETE/.test(action)) return 'danger';
  if (/DISABLE/.test(action)) return 'warning';
  if (/CREATE|ENABLE|SENT|RESET/.test(action)) return 'success';
  if (/LOGIN|LOGOUT/.test(action)) return 'neutral';
  return 'info';
};
