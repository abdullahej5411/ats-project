// src/components/common/StatusBadge.js

export default function StatusBadge({ status }) {
  const map = {
    'Submitted':          'badge-submitted',
    'Under Review':       'badge-under-review',
    'Shortlisted':        'badge-shortlisted',
    'Interview Scheduled':'badge-interview',
    'Rejected':           'badge-rejected',
    'Selected':           'badge-selected'
  };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
}
