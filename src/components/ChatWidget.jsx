import { useState } from 'react'
import ChatInterface from './ChatInterface'
import { logEduardDevEvent } from '../lib/eduardLogs'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    const nextIsOpen = !isOpen
    setIsOpen(nextIsOpen)

    void logEduardDevEvent({
      eventName: nextIsOpen ? 'chat_widget_open' : 'chat_widget_close',
      eventType: 'chat',
      metadata: {
        surface: 'widget',
      },
    })
  }

  return (
    <div className="chat-widget-root">
      {isOpen ? (
        <aside
          id="chat-widget-panel"
          className="chat-widget-panel"
          aria-label="Eduard AI Assistant"
        >
          <div className="chat-widget-header">
            <div>
              <p className="chat-widget-title">Eduard AI Assistant</p>
              <p className="chat-widget-subtitle">Projects, skills, and availability.</p>
            </div>
            <button
              type="button"
              className="chat-widget-close"
              onClick={handleToggle}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <ChatInterface variant="widget" />
        </aside>
      ) : null}

      <button
        type="button"
        className={`chat-toggle ${isOpen ? 'chat-toggle-open' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="chat-widget-panel"
      >
        {isOpen ? 'Hide AI Chat' : 'Ask AI'}
      </button>
    </div>
  )
}

export default ChatWidget
