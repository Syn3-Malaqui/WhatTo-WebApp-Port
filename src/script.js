document.addEventListener('DOMContentLoaded', function() {
  console.log('WhatTo WebApp is running!'); 
  const titleBtn = document.getElementById('title-btn');
  const titleInput = document.getElementById('title-input');
  const noteTitle = document.getElementById('note-title');
  const noteBody = document.getElementById('note-body');

  if (titleBtn && titleInput && noteTitle && noteBody) {
    titleBtn.addEventListener('click', () => {
      titleBtn.classList.add('hidden');
      titleInput.classList.remove('hidden');
      titleInput.focus();
    });

    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && titleInput.value.trim() !== '') {
        e.preventDefault();
        noteTitle.textContent = titleInput.value;
        noteTitle.classList.remove('hidden');
        titleInput.classList.add('hidden');
        noteBody.classList.remove('hidden');
        noteBody.focus();
      }
    });

    // Re-edit title when clicked
    noteTitle.addEventListener('click', () => {
      titleInput.value = noteTitle.textContent;
      noteTitle.classList.add('hidden');
      titleInput.classList.remove('hidden');
      titleInput.focus();
    });

    // Handle input for ghosting effect
    noteBody.addEventListener('input', function(e) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const currentNode = range.startContainer;
      
      // Get the current line's text
      let currentLine = '';
      if (currentNode.nodeType === Node.TEXT_NODE) {
        currentLine = currentNode.textContent;
      } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
        currentLine = currentNode.textContent;
      }

      // Check for checkbox pattern "- [ ]" or "- [x]" and convert to checkbox
      if (currentLine.match(/^-\s*\[[ xX]\]/)) {
        // Get the text after the checkbox pattern
        const text = currentLine.replace(/^-\s*\[[ xX]\]\s*/, '');
        const isChecked = currentLine.match(/^-\s*\[[xX]\]/);
        
        // Create checkbox element
        const checkbox = document.createElement('div');
        checkbox.className = 'flex items-center gap-2 my-1';
        checkbox.innerHTML = `
          <input type="checkbox" class="checkbox checkbox-primary" ${isChecked ? 'checked' : ''}>
          <span class="ml-2">${text}</span>
        `;
        
        // Replace the text node with the checkbox
        if (currentNode.nodeType === Node.TEXT_NODE) {
          currentNode.parentNode.replaceChild(checkbox, currentNode);
        } else {
          currentNode.innerHTML = '';
          currentNode.appendChild(checkbox);
        }
        
        // Save the current page state
        saveCurrentPage();
        return;
      }

      // Remove any existing ghost lines
      const allGhostLines = noteBody.querySelectorAll('.text-gray-300');
      allGhostLines.forEach(line => line.remove());

      // Only show ghost line if the current line starts with '- '
      if (currentLine.trim().startsWith('- ')) {
        // Check if there's already a ghost line after this one
        const nextSibling = currentNode.nextSibling;
        if (!nextSibling || !nextSibling.textContent.includes('- ')) {
          // Create ghost line
          const ghostLine = document.createElement('div');
          ghostLine.className = 'text-gray-300';
          ghostLine.textContent = '- ';
          if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode.parentNode.insertBefore(ghostLine, currentNode.nextSibling);
          } else {
            currentNode.after(ghostLine);
          }
        }
      }
    });

    // Handle blur to show ghosting effect
    noteBody.addEventListener('blur', function(e) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      const currentNode = range.startContainer;
      
      // Get the current line's text
      let currentLine = '';
      if (currentNode.nodeType === Node.TEXT_NODE) {
        currentLine = currentNode.textContent;
      } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
        currentLine = currentNode.textContent;
      }

      // Check if the line starts with '- '
      if (currentLine.trim().startsWith('- ')) {
        // Remove any existing ghost lines
        const allGhostLines = noteBody.querySelectorAll('.text-gray-300');
        allGhostLines.forEach(line => line.remove());

        // Check if there's already a ghost line after this one
        const nextSibling = currentNode.nextSibling;
        if (!nextSibling || !nextSibling.textContent.includes('- ')) {
          // Create ghost line
          const ghostLine = document.createElement('div');
          ghostLine.className = 'text-gray-300';
          ghostLine.textContent = '- ';
          if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode.parentNode.insertBefore(ghostLine, currentNode.nextSibling);
          } else {
            currentNode.after(ghostLine);
          }
        }
      }
    });

    // Handle focus to remove ghosting effect
    noteBody.addEventListener('focus', function(e) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      const currentNode = range.startContainer;
      
      // Remove ghost line if it exists
      const nextSibling = currentNode.nextSibling;
      if (nextSibling && nextSibling.textContent.includes('- ')) {
        nextSibling.remove();
      }
    });

    // Handle selection to convert separator back to ---
    noteBody.addEventListener('mouseup', function(e) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const selectedNode = range.startContainer;

      // Check if the selected node is a separator
      if (selectedNode.nodeName === 'HR' || selectedNode.parentNode?.nodeName === 'HR') {
        const separator = selectedNode.nodeName === 'HR' ? selectedNode : selectedNode.parentNode;
        
        // Create text node with ---
        const textNode = document.createTextNode('---');
        
        // Replace separator with ---
        separator.parentNode.replaceChild(textNode, separator);
        
        // Select the --- text
        range.setStart(textNode, 0);
        range.setEnd(textNode, 3);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });

    // Handle Enter key for checkbox conversion and separator
    noteBody.addEventListener('keydown', function(e) {
      // Create checkbox with Ctrl+Space or Alt+C
      if ((e.ctrlKey && e.key === ' ') || (e.altKey && e.key === 'c')) {
        e.preventDefault();
        
        // Create checkbox element
        const checkbox = document.createElement('div');
        checkbox.className = 'flex items-center gap-2 my-1';
        checkbox.innerHTML = `
          <input type="checkbox" class="checkbox checkbox-primary">
          <span class="ml-2">New task</span>
        `;
        
        // Insert at cursor position
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(checkbox);
        
        // Position cursor in the text of the checkbox
        const span = checkbox.querySelector('span');
        const textRange = document.createRange();
        textRange.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(textRange);
        
        // Save current state
        saveCurrentPage();
        return;
      }
      
      // Shift+Enter in checkbox span: exit editing and move caret after checkbox
      if (e.key === 'Enter' && e.shiftKey) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        // If inside a text node, get its parent
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        // Check if inside a checkbox span
        if (node.tagName === 'SPAN' && node.parentNode.classList.contains('flex') && node.parentNode.classList.contains('items-center')) {
          e.preventDefault();
          const checkboxDiv = node.parentNode;
          // Create a new line after the checkbox
          const newLine = document.createElement('div');
          newLine.innerHTML = '-&nbsp;';
          checkboxDiv.after(newLine);
          // Place caret in the new line
          const cursorNode = document.createTextNode('');
          newLine.appendChild(cursorNode);
          const newRange = document.createRange();
          newRange.setStart(cursorNode, 0);
          newRange.setEnd(cursorNode, 0);
          selection.removeAllRanges();
          selection.addRange(newRange);
          return;
        }
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const currentNode = range.startContainer;
        
        // Get the current line's text
        let currentLine = '';
        if (currentNode.nodeType === Node.TEXT_NODE) {
          currentLine = currentNode.textContent;
        } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
          currentLine = currentNode.textContent;
        }

        // Check if the line is a separator
        if (currentLine.trim() === '---') {
          // Create separator
          const separator = document.createElement('hr');
          separator.className = 'separator';
          separator.style.border = 'none';
          if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode.parentNode.replaceChild(separator, currentNode);
          } else {
            currentNode.replaceWith(separator);
          }
          
          // Create a new line after separator
          const newLine = document.createElement('div');
          separator.after(newLine);
          
          // Set cursor position on new line
          range.setStart(newLine, 0);
          range.setEnd(newLine, 0);
          selection.removeAllRanges();
          selection.addRange(range);
          return;
        }

        // Check if the line starts with '- '
        if (currentLine.trim().startsWith('- ')) {
          // Create checkbox container
          const checkboxContainer = document.createElement('div');
          checkboxContainer.className = 'flex items-center gap-2';
          
          // Create checkbox
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'checkbox checkbox-primary';
          
          // Get the text content after '- ' without duplicating
          const text = currentLine.substring(2).trim();
          
          // Create span for text
          const textSpan = document.createElement('span');
          textSpan.className = 'ml-2';
          textSpan.textContent = text;
          
          // Assemble the line
          checkboxContainer.appendChild(checkbox);
          checkboxContainer.appendChild(textSpan);
          
          // Replace the current line with the checkbox
          if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode.parentNode.replaceChild(checkboxContainer, currentNode);
          } else {
            currentNode.replaceWith(checkboxContainer);
          }
          
          // Create new line with dash and space
          const newLine = document.createElement('div');
          newLine.innerHTML = '-&nbsp;'; // Use non-breaking spaces to ensure proper spacing
          checkboxContainer.after(newLine);
          
          // Create a new text node for the cursor position
          const cursorNode = document.createTextNode('');
          newLine.appendChild(cursorNode);
          
          // Set cursor position at the end of the new line
          range.setStart(cursorNode, 0);
          range.setEnd(cursorNode, 0);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // If not a bullet point or separator, just insert a new line
          document.execCommand('insertLineBreak');
        }
      }
    });
  }

  // Drag and drop functionality
  const dropZone = document.getElementById('drop-zone');
  if (dropZone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
      dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
      dropZone.classList.remove('drag-over');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;

      if (files.length > 0) {
        const file = files[0];
        if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const markdown = event.target.result;
            // Split on custom page marker
            const pageBlocks = markdown.split(/\n?<!-- whatto:page -->\n?/);
            // If only one page, fallback to old behavior
            for (let i = 0; i < NUM_PAGES; i++) {
              pages[i] = { title: '', body: '' };
            }
            pageBlocks.forEach((block, idx) => {
              if (idx >= NUM_PAGES) return;
              const lines = block.split('\n');
              let currentLine = '';
              let inParagraph = false;
              let isFirstLine = true;
              let title = '';
              let noteBodyTemp = document.createElement('div');
              lines.forEach((line, lineIdx) => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('# ')) {
                  title = trimmedLine.substring(2).trim();
                } else if (trimmedLine.startsWith('## ')) {
                  if (currentLine) {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = currentLine.trim();
                    noteBodyTemp.appendChild(paragraph);
                    currentLine = '';
                  }
                  const heading = document.createElement('h3');
                  heading.className = 'text-xl font-semibold mt-4 mb-2';
                  heading.textContent = trimmedLine.substring(3).trim();
                  noteBodyTemp.appendChild(heading);
                } else if (trimmedLine.startsWith('- [')) {
                  if (currentLine) {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = currentLine.trim();
                    noteBodyTemp.appendChild(paragraph);
                    currentLine = '';
                  }
                  const checked = trimmedLine.includes('[x]');
                  let text = trimmedLine.replace(/^\-\s*\[[ xX]\]\s*/, '');
                  if (!text && lineIdx + 1 < lines.length) {
                    text = lines[lineIdx + 1].trim();
                    lineIdx++;
                  }
                  const checkbox = document.createElement('div');
                  checkbox.className = 'flex items-center gap-2 my-1';
                  checkbox.innerHTML = `\n                <input type="checkbox" class="checkbox checkbox-primary" ${checked ? 'checked' : ''}>\n                <span class="ml-2">${text}</span>\n              `;
                  noteBodyTemp.appendChild(checkbox);
                  inParagraph = false;
                } else if (trimmedLine === '---') {
                  if (currentLine) {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = currentLine.trim();
                    noteBodyTemp.appendChild(paragraph);
                    currentLine = '';
                  }
                  const separator = document.createElement('hr');
                  separator.className = 'separator';
                  noteBodyTemp.appendChild(separator);
                  inParagraph = false;
                } else if (trimmedLine) {
                  if (!inParagraph) {
                    currentLine = trimmedLine;
                  } else {
                    currentLine += ' ' + trimmedLine;
                  }
                  inParagraph = true;
                } else if (currentLine) {
                  const paragraph = document.createElement('p');
                  paragraph.textContent = currentLine.trim();
                  noteBodyTemp.appendChild(paragraph);
                  currentLine = '';
                  inParagraph = false;
                } else if (!inParagraph && !isFirstLine) {
                  noteBodyTemp.appendChild(document.createElement('br'));
                }
                isFirstLine = false;
              });
              if (currentLine) {
                const paragraph = document.createElement('p');
                paragraph.textContent = currentLine.trim();
                noteBodyTemp.appendChild(paragraph);
              }
              pages[idx].title = title;
              pages[idx].body = noteBodyTemp.innerHTML;
            });
            // Show first page after import
            currentPage = 0;
            loadPage(0);
            updatePageBtns();
          };
          reader.readAsText(file);
        }
      }
    }
  }

  // Settings functionality
  const headerLogo = document.getElementById('header-logo');
  const settingsDropdown = document.getElementById('settings-dropdown');
  const exportMarkdownBtn = document.getElementById('export-markdown');
  const importMarkdownInput = document.getElementById('import-markdown');

  // Toggle dropdown
  function toggleSettings(e) {
    const isVisible = settingsDropdown.classList.contains('show');
    
    if (!isVisible) {
      // Position the dropdown below the header logo
      const rect = headerLogo.getBoundingClientRect();
      settingsDropdown.style.top = `${rect.bottom + 8}px`;
      settingsDropdown.style.left = `${rect.left}px`;
      
      // Show the dropdown with animation
      settingsDropdown.classList.remove('hidden');
      // Use requestAnimationFrame to ensure the transition works
      requestAnimationFrame(() => {
        settingsDropdown.classList.add('show');
      });
    } else {
      // Hide the dropdown with animation
      settingsDropdown.classList.remove('show');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        settingsDropdown.classList.add('hidden');
      }, 200);
    }
  }

  if (headerLogo) {
    headerLogo.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettings(e);
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!settingsDropdown.contains(e.target) && !headerLogo.contains(e.target)) {
      if (settingsDropdown.classList.contains('show')) {
        settingsDropdown.classList.remove('show');
        setTimeout(() => {
          settingsDropdown.classList.add('hidden');
        }, 200);
      }
    }
  });

  // Multi-page logic
  const pageBtns = Array.from(document.querySelectorAll('.page-btn'));
  const NUM_PAGES = 3;
  let currentPage = 0;
  // Store {title, bodyHTML} for each page
  let pages = Array.from({length: NUM_PAGES}, () => ({ title: '', body: '' }));

  // Try to load saved pages from localStorage if available
  try {
    const savedPages = localStorage.getItem('whatToPages');
    if (savedPages) {
      const parsedPages = JSON.parse(savedPages);
      if (Array.isArray(parsedPages) && parsedPages.length === NUM_PAGES) {
        pages = parsedPages;
      }
    }
  } catch (e) {
    console.error('Error loading saved pages:', e);
  }

  function saveCurrentPage() {
    pages[currentPage].title = noteTitle.textContent || '';
    pages[currentPage].body = noteBody.innerHTML || '';
    
    // Also save to localStorage for persistence
    try {
      localStorage.setItem('whatToPages', JSON.stringify(pages));
    } catch (e) {
      console.error('Error saving pages:', e);
    }
  }
  function loadPage(idx) {
    noteTitle.textContent = pages[idx].title;
    noteBody.innerHTML = pages[idx].body;
    
    // Restore event handlers for checkboxes
    noteBody.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        saveCurrentPage();
      });
    });
    
    // Show/hide title/body as needed
    if (pages[idx].title) {
      noteTitle.classList.remove('hidden');
      titleBtn.classList.add('hidden');
      titleInput.classList.add('hidden');
      noteBody.classList.remove('hidden');
    } else {
      noteTitle.classList.add('hidden');
      titleBtn.classList.remove('hidden');
      titleInput.classList.add('hidden');
      noteBody.classList.add('hidden');
    }
  }
  function updatePageBtns() {
    pageBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentPage);
    });
  }
  pageBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (i === currentPage) return;
      saveCurrentPage();
      currentPage = i;
      loadPage(i);
      updatePageBtns();
    });
  });
  // On first load, show first page
  loadPage(0);
  updatePageBtns();

  // When editing title or body, always save to current page
  titleInput.addEventListener('blur', saveCurrentPage);
  noteBody.addEventListener('input', saveCurrentPage);
  noteBody.addEventListener('blur', saveCurrentPage);

  // Add event delegation for checkbox changes
  noteBody.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
      saveCurrentPage();
    }
  });

  // Add function to toggle checkbox state
  function toggleCheckbox(checkbox) {
    checkbox.checked = !checkbox.checked;
    saveCurrentPage();
  }

  // Add click handler for checkboxes
  noteBody.addEventListener('click', function(e) {
    // Check if clicked on checkbox text span
    if (e.target.tagName === 'SPAN' && 
        e.target.parentNode.classList.contains('flex') && 
        e.target.parentNode.classList.contains('items-center')) {
      const checkbox = e.target.parentNode.querySelector('input[type="checkbox"]');
      if (checkbox) {
        toggleCheckbox(checkbox);
      }
    }
  });

  // When exporting, export all pages
  if (exportMarkdownBtn) {
    exportMarkdownBtn.addEventListener('click', () => {
      saveCurrentPage();
      let markdown = '';
      pages.forEach((page, idx) => {
        if (!page.title && !page.body) return;
        if (idx > 0) markdown += '\n<!-- whatto:page -->\n\n';
        markdown += `# ${page.title || 'Untitled'}\n\n`;
        // Use a temp element to parse HTML and reuse processNode
        const temp = document.createElement('div');
        temp.innerHTML = page.body;
        for (let node of temp.childNodes) {
          markdown += processNode(node);
        }
      });
      markdown = markdown
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+$/gm, '')
        .replace(/^\s+/gm, '')
        .replace(/([^\n])\n([^\n])/g, '$1\n$2')
        .trim();
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'whatto-notes.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Update import logic to support multi-page import
  if (importMarkdownInput) {
    importMarkdownInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const markdown = event.target.result;
        // Split on custom page marker
        const pageBlocks = markdown.split(/\n?<!-- whatto:page -->\n?/);
        // If only one page, fallback to old behavior
        for (let i = 0; i < NUM_PAGES; i++) {
          pages[i] = { title: '', body: '' };
        }
        pageBlocks.forEach((block, idx) => {
          if (idx >= NUM_PAGES) return;
          const lines = block.split('\n');
          let currentLine = '';
          let inParagraph = false;
          let isFirstLine = true;
          let title = '';
          let bodyHTML = '';
          let noteBodyTemp = document.createElement('div');
          lines.forEach((line, lineIdx) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('# ')) {
              title = trimmedLine.substring(2).trim();
            } else if (trimmedLine.startsWith('## ')) {
              if (currentLine) {
                const paragraph = document.createElement('p');
                paragraph.textContent = currentLine.trim();
                noteBodyTemp.appendChild(paragraph);
                currentLine = '';
              }
              const heading = document.createElement('h3');
              heading.className = 'text-xl font-semibold mt-4 mb-2';
              heading.textContent = trimmedLine.substring(3).trim();
              noteBodyTemp.appendChild(heading);
            } else if (trimmedLine.startsWith('- [')) {
              if (currentLine) {
                const paragraph = document.createElement('p');
                paragraph.textContent = currentLine.trim();
                noteBodyTemp.appendChild(paragraph);
                currentLine = '';
              }
              const checked = trimmedLine.includes('[x]');
              let text = trimmedLine.replace(/^\-\s*\[[ xX]\]\s*/, '');
              if (!text && lineIdx + 1 < lines.length) {
                text = lines[lineIdx + 1].trim();
                lineIdx++;
              }
              const checkbox = document.createElement('div');
              checkbox.className = 'flex items-center gap-2 my-1';
              checkbox.innerHTML = `\n                <input type="checkbox" class="checkbox checkbox-primary" ${checked ? 'checked' : ''}>\n                <span class="ml-2">${text}</span>\n              `;
              noteBodyTemp.appendChild(checkbox);
              inParagraph = false;
            } else if (trimmedLine === '---') {
              if (currentLine) {
                const paragraph = document.createElement('p');
                paragraph.textContent = currentLine.trim();
                noteBodyTemp.appendChild(paragraph);
                currentLine = '';
              }
              const separator = document.createElement('hr');
              separator.className = 'separator';
              noteBodyTemp.appendChild(separator);
              inParagraph = false;
            } else if (trimmedLine) {
              if (!inParagraph) {
                currentLine = trimmedLine;
              } else {
                currentLine += ' ' + trimmedLine;
              }
              inParagraph = true;
            } else if (currentLine) {
              const paragraph = document.createElement('p');
              paragraph.textContent = currentLine.trim();
              noteBodyTemp.appendChild(paragraph);
              currentLine = '';
              inParagraph = false;
            } else if (!inParagraph && !isFirstLine) {
              noteBodyTemp.appendChild(document.createElement('br'));
            }
            isFirstLine = false;
          });
          if (currentLine) {
            const paragraph = document.createElement('p');
            paragraph.textContent = currentLine.trim();
            noteBodyTemp.appendChild(paragraph);
          }
          pages[idx].title = title;
          pages[idx].body = noteBodyTemp.innerHTML;
        });
        // Show first page after import
        currentPage = 0;
        loadPage(0);
        updatePageBtns();
        // Reset file input
        e.target.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Define processNode at top-level so it can be reused for export/import
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'DIV') {
        // Checkbox line (already handled above)
        if (node.classList.contains('flex') && node.classList.contains('items-center') && node.classList.contains('gap-2')) {
          const input = node.querySelector('input[type="checkbox"]');
          const span = node.querySelector('span');
          if (input && span) {
            const isChecked = input.checked;
            const text = span.textContent.trim();
            return `- [${isChecked ? 'x' : ' '}] ${text}\n`;
          }
          // Fallback: process as normal div
          let content = '';
          for (let child of node.childNodes) {
            content += processNode(child);
          }
          return content;
        }
        // New line divs (created for spacing, e.g. with only '-\u00a0' or '- ')
        const text = node.textContent.replace(/\u00a0/g, ' ').trim();
        if (text === '-' || text === '') {
          // Treat as a blank line
          return '\n';
        }
        // Otherwise, process children
        let content = '';
        for (let child of node.childNodes) {
          content += processNode(child);
        }
        return content;
      }
      if (node.tagName === 'INPUT' && node.type === 'checkbox') {
        const text = node.nextSibling?.textContent || '';
        const isChecked = node.checked;
        return `- [${isChecked ? 'x' : ' '}] ${text}`;
      }
      if (node.tagName === 'HR') {
        return '\n---\n\n';
      }
      if (node.tagName === 'BR') {
        return '\n';
      }
      if (node.tagName === 'SPAN') {
        return node.textContent;
      }
      if (node.tagName === 'P') {
        let content = '';
        for (let child of node.childNodes) {
          content += processNode(child);
        }
        return content + '\n\n';
      }
      if (node.tagName === 'H3') {
        let content = '';
        for (let child of node.childNodes) {
          content += processNode(child);
        }
        return `\n## ${content}\n\n`;
      }
    }
    return '';
  }
}); 