import { useId, useState } from 'react';

/**
 * Single-expand accordion — keeps thank-you / landing pages uncluttered.
 */
export default function Accordion({ items, defaultOpenId = null }) {
  const baseId = useId();
  const [openId, setOpenId] = useState(defaultOpenId);

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}`;
        return (
          <div key={item.id} className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              {item.icon && <span className="accordion-icon" aria-hidden="true">{item.icon}</span>}
              <span className="accordion-trigger-text">
                <span className="accordion-title">{item.title}</span>
                {item.subtitle && <span className="accordion-subtitle">{item.subtitle}</span>}
              </span>
              <span className="accordion-chevron" aria-hidden="true" />
            </button>
            <div id={panelId} className="accordion-panel" hidden={!isOpen}>
              <div className="accordion-panel-inner">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
