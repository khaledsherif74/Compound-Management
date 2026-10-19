/** Shared by Modal, Drawer and ConfirmDialog so overlays look identical. */
export const OVERLAY_CLASS =
  'fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out';

export const CENTERED_PANEL_CLASS =
  'fixed inset-0 z-50 m-auto h-fit max-h-[90vh] w-[calc(100%-2rem)] rounded-xl border border-line bg-surface shadow-overlay outline-none ' +
  'data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out';
