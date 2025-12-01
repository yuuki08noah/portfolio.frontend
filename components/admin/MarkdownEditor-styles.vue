<style scoped>
.markdown-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', sans-serif;
}

.editor-toolbar {
  display: flex;
  gap: 2px;
  padding: 8px 12px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.toolbar-btn {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  padding: 0 8px;
}

.toolbar-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.toolbar-btn:active {
  background: #d1d5db;
  transform: scale(0.98);
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
  align-self: center;
}

.editor-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 40px 60px;
  position: relative;
  background: #ffffff;
}

.editor-wrapper::-webkit-scrollbar {
  width: 8px;
}

.editor-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.editor-wrapper::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.editor-wrapper::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.blocks-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 900px;
  margin: 0 auto;
}

/* Typography */
.heading-1 { 
  font-size: 2.5em; 
  font-weight: 700; 
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  line-height: 1.2;
  color: #111827;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

.heading-2 { 
  font-size: 1.875em; 
  font-weight: 700; 
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  line-height: 1.3;
  color: #111827;
}

.heading-3 { 
  font-size: 1.5em; 
  font-weight: 600; 
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  line-height: 1.4;
  color: #111827;
}

.paragraph { 
  font-size: 16px; 
  line-height: 1.75;
  color: #374151;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.callout { 
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 16px 20px;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Layout */
.block-row {
  display: flex;
  gap: 24px;
  width: 100%;
  align-items: flex-start;
  margin: 8px 0;
}

.block-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  background: #fafafa;
}

.block-column:hover {
  border-color: #e5e7eb;
  background: #f9fafb;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 40px;
}

.empty-column-drop-zone {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 13px;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  margin-top: 8px;
  transition: all 0.2s ease;
  background: #fafafa;
}

.empty-column-drop-zone:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.empty-editor {
  padding: 60px 20px;
  color: #9ca3af;
  cursor: text;
  text-align: center;
  font-size: 16px;
}

/* Slash Menu */
.slash-menu {
  position: absolute;
  z-index: 100;
  width: 280px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
  max-height: 320px;
  overflow-y: auto;
  padding: 6px;
}

.menu-header {
  padding: 8px 12px 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.5px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.menu-item:hover, .menu-item.active {
  background: #f3f4f6;
}

.menu-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  flex-shrink: 0;
}

.menu-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-label { 
  font-size: 14px; 
  font-weight: 500;
  color: #111827;
  line-height: 1.3;
}

.menu-desc { 
  font-size: 12px; 
  color: #6b7280;
  line-height: 1.3;
}
</style>
