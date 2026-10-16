export type InteractionTabKey = 'read' | 'heart' | 'share' | 'unread';

export interface ModalUserViewItem {
  id: string;
  fullName: string;
  jobTitle?: string | null;
  unitName?: string | null;
  avatarUrl?: string | null;
  timeText: string;
  status: 'read' | 'unread';
  isHearted: boolean;
  isShared: boolean;
  shareCount?: number;
}

export function formatModalTime(raw?: string | null): string {
  if (!raw) return '10:57';
  if (!raw.includes('T') && !raw.includes('-')) return raw;
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return `${hh}:${mm}`;
    const dd = String(d.getDate()).padStart(2, '0');
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mo}/${d.getFullYear()} lúc ${hh}:${mm}`;
  } catch {
    return raw;
  }
}

export function exportModalUsersToCsv(postId: string, list: ModalUserViewItem[]): void {
  const rows = [
    ['Họ và tên', 'Chức danh', 'Đơn vị', 'Trạng thái', 'Thời gian', 'Thả tim', 'Chia sẻ'],
    ...list.map((u) => [
      `"${u.fullName}"`,
      `"${u.jobTitle || ''}"`,
      `"${u.unitName || ''}"`,
      `"${u.status === 'read' ? 'Đã đọc' : 'Chưa đọc'}"`,
      `"${u.timeText}"`,
      `"${u.isHearted ? 'Có' : 'Không'}"`,
      `"${u.isShared ? `Có (${u.shareCount || 1})` : 'Không'}"`,
    ]),
  ];
  const csv = '\uFEFF' + rows.map((r) => r.join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Thong-ke-tuong-tac-${postId}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
