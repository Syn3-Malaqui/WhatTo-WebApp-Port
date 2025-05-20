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
            const lines = markdown.split('\n');
            
            // Clear current content
            noteBody.innerHTML = '';
            
            // Process each line
            let currentLine = '';
            let inParagraph = false;
            let isFirstLine = true;
            
            lines.forEach((line, index) => {
              // Trim the line but preserve empty lines
              const trimmedLine = line.trim();
              
              if (trimmedLine.startsWith('# ')) {
                // Set title
                noteTitle.textContent = trimmedLine.substring(2);
                noteTitle.classList.remove('hidden');
                titleBtn.classList.add('hidden');
                titleInput.classList.add('hidden');
                noteBody.classList.remove('hidden');
              } else if (trimmedLine.startsWith('## ')) {
                // Add heading
                if (currentLine) {
                  const paragraph = document.createElement('p');
                  paragraph.textContent = currentLine;
                  noteBody.appendChild(paragraph);
                  currentLine = '';
                }
                const heading = document.createElement('h3');
                heading.className = 'text-xl font-semibold mt-4 mb-2';
                heading.textContent = trimmedLine.substring(3);
                noteBody.appendChild(heading);
              } else if (trimmedLine.startsWith('- [')) {
                // Convert markdown checkbox to HTML
                if (currentLine) {
                  const paragraph = document.createElement('p');
                  paragraph.textContent = currentLine.trim();
                  noteBody.appendChild(paragraph);
                  currentLine = '';
                }
                const checked = trimmedLine.includes('[x]');
                // Get the text from the next line if current line only has checkbox
                let text = trimmedLine.replace(/^-\s*\[[ xX]\]\s*/, '');
                if (!text && index + 1 < lines.length) {
                  text = lines[index + 1].trim();
                  index++; // Skip the next line since we used its text
                }
                const checkbox = document.createElement('div');
                checkbox.className = 'flex items-center gap-2 my-1';
                checkbox.innerHTML = `
                  <input type="checkbox" class="checkbox checkbox-primary" ${checked ? 'checked' : ''}>
                  <span class="ml-2">${text}</span>
                `;
                noteBody.appendChild(checkbox);
                inParagraph = false;
              } else if (trimmedLine === '---') {
                // Convert markdown separator to HTML
                if (currentLine) {
                  const paragraph = document.createElement('p');
                  paragraph.textContent = currentLine;
                  noteBody.appendChild(paragraph);
                  currentLine = '';
                }
                const separator = document.createElement('hr');
                separator.className = 'separator';
                noteBody.appendChild(separator);
                inParagraph = false;
              } else if (trimmedLine) {
                // Regular text
                if (currentLine) {
                  currentLine += ' ' + trimmedLine;
                } else {
                  currentLine = trimmedLine;
                }
                inParagraph = true;
              } else if (currentLine) {
                // Empty line after content - create paragraph
                const paragraph = document.createElement('p');
                paragraph.textContent = currentLine;
                noteBody.appendChild(paragraph);
                currentLine = '';
                inParagraph = false;
              } else if (!inParagraph && !isFirstLine) {
                // Add extra line break for spacing, but not at the start
                noteBody.appendChild(document.createElement('br'));
              }
              isFirstLine = false;
            });

            // Add any remaining content
            if (currentLine) {
              const paragraph = document.createElement('p');
              paragraph.textContent = currentLine;
              noteBody.appendChild(paragraph);
            }
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

  if (exportMarkdownBtn) {
    exportMarkdownBtn.addEventListener('click', () => {
      const title = noteTitle.textContent;
      const content = noteBody.innerHTML;
      
      // Convert content to markdown while preserving structure
      let markdown = `# ${title}\n\n`;
      
      // Process each node to preserve structure
      const processNode = (node) => {
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
      };

      // Process all nodes in the note body
      for (let node of noteBody.childNodes) {
        markdown += processNode(node);
      }

      // Trim extra spaces and normalize line endings
      markdown = markdown
        .replace(/\n{3,}/g, '\n\n')  // Replace 3 or more newlines with 2
        .replace(/\s+$/gm, '')        // Trim trailing spaces on each line
        .replace(/^\s+/gm, '')        // Trim leading spaces on each line
        .replace(/([^\n])\n([^\n])/g, '$1\n$2')  // Ensure single newline between lines
        .trim();                      // Trim the entire string

      // Create and download file
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  if (importMarkdownInput) {
    importMarkdownInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const markdown = event.target.result;
        const lines = markdown.split('\n');
        
        // Clear current content
        noteBody.innerHTML = '';
        
        // Process each line
        let currentLine = '';
        let inParagraph = false;
        let isFirstLine = true;
        
        lines.forEach((line, index) => {
          // Trim the line but preserve empty lines
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('# ')) {
            // Set title
            noteTitle.textContent = trimmedLine.substring(2).trim();
            noteTitle.classList.remove('hidden');
            titleBtn.classList.add('hidden');
            titleInput.classList.add('hidden');
            noteBody.classList.remove('hidden');
          } else if (trimmedLine.startsWith('## ')) {
            // Add heading
            if (currentLine) {
              const paragraph = document.createElement('p');
              paragraph.textContent = currentLine.trim();
              noteBody.appendChild(paragraph);
              currentLine = '';
            }
            const heading = document.createElement('h3');
            heading.className = 'text-xl font-semibold mt-4 mb-2';
            heading.textContent = trimmedLine.substring(3).trim();
            noteBody.appendChild(heading);
          } else if (trimmedLine.startsWith('- [')) {
            // Convert markdown checkbox to HTML
            if (currentLine) {
              const paragraph = document.createElement('p');
              paragraph.textContent = currentLine.trim();
              noteBody.appendChild(paragraph);
              currentLine = '';
            }
            const checked = trimmedLine.includes('[x]');
            // Get the text from the next line if current line only has checkbox
            let text = trimmedLine.replace(/^-\s*\[[ xX]\]\s*/, '');
            if (!text && index + 1 < lines.length) {
              text = lines[index + 1].trim();
              index++; // Skip the next line since we used its text
            }
            const checkbox = document.createElement('div');
            checkbox.className = 'flex items-center gap-2 my-1';
            checkbox.innerHTML = `
              <input type="checkbox" class="checkbox checkbox-primary" ${checked ? 'checked' : ''}>
              <span class="ml-2">${text}</span>
            `;
            noteBody.appendChild(checkbox);
            inParagraph = false;
          } else if (trimmedLine === '---') {
            // Convert markdown separator to HTML
            if (currentLine) {
              const paragraph = document.createElement('p');
              paragraph.textContent = currentLine.trim();
              noteBody.appendChild(paragraph);
              currentLine = '';
            }
            const separator = document.createElement('hr');
            separator.className = 'separator';
            noteBody.appendChild(separator);
            inParagraph = false;
          } else if (trimmedLine) {
            // Regular text
            if (!inParagraph) {
              currentLine = trimmedLine;
            } else {
              currentLine += ' ' + trimmedLine;
            }
            inParagraph = true;
          } else if (currentLine) {
            // Empty line after content - create paragraph
            const paragraph = document.createElement('p');
            paragraph.textContent = currentLine.trim();
            noteBody.appendChild(paragraph);
            currentLine = '';
            inParagraph = false;
          } else if (!inParagraph && !isFirstLine) {
            // Add extra line break for spacing, but not at the start
            noteBody.appendChild(document.createElement('br'));
          }
          isFirstLine = false;
        });

        // Add any remaining content
        if (currentLine) {
          const paragraph = document.createElement('p');
          paragraph.textContent = currentLine.trim();
          noteBody.appendChild(paragraph);
        }

        // Reset file input
        e.target.value = '';
      };
      reader.readAsText(file);
    });
  }
}); 