import { useScope } from '../../lib/useScope'
import { useSelection } from '../../lib/selection/SelectionContext'
import { ALL_CAMPAIGNS } from '../../lib/selection/SelectionContext'
import styles from './ScopeFilterChip.module.css'

/**
 * ScopeFilterChip — a visible, dismissable marker of the active campaign filter.
 * Shown on the dashboard pages (Overview/Replies/Reports) whenever a single
 * campaign is selected, so the filter is never invisible. ✕ returns to All. (C-19)
 */
export function ScopeFilterChip() {
  const { isAll, selectedCampaign } = useScope()
  const { setCampaign } = useSelection()

  if (isAll || !selectedCampaign) return null

  return (
    <div className={styles.wrap}>
      <span className={styles.chip}>
        <span className={styles.eyebrow}>Filtered</span>
        {selectedCampaign.name}
        <button
          type="button"
          className={styles.clear}
          onClick={() => setCampaign(ALL_CAMPAIGNS)}
          aria-label={`Clear campaign filter: ${selectedCampaign.name}`}
        >
          ✕
        </button>
      </span>
    </div>
  )
}
