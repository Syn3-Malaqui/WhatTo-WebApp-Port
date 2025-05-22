document.addEventListener('DOMContentLoaded', function() {
  console.log('WhatTo WebApp is running!'); 

  // Theme management
  const headerLogo = document.getElementById('header-logo');
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  
  // Toggle theme when the button is clicked
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const wasDropdownOpen = settingsDropdown.classList.contains('show');
      
      // Toggle theme
      if (htmlElement.classList.contains('dark')) {
        disableDarkMode();
      } else {
        enableDarkMode();
      }
      
      // Force dropdown refresh
      if (wasDropdownOpen) {
        // Hide dropdown
        settingsDropdown.classList.remove('show');
        settingsDropdown.classList.add('hidden');
        
        // Force browser to reflow the element
        void settingsDropdown.offsetHeight;
        
        // Reopen dropdown with new styling
        setTimeout(() => {
          settingsDropdown.classList.remove('hidden');
          settingsDropdown.classList.add('show');
        }, 50);
      }
    });
  }
  
  function enableDarkMode() {
    // Apply a transition class first
    document.body.classList.add('theme-transitioning');
    
    // Use setTimeout to ensure transitions have a chance to apply
    setTimeout(() => {
      htmlElement.classList.add('dark');
      if (headerLogo) {
        headerLogo.src = 'assets/header3.svg';
      }
      
      // Update theme toggle switch state
      const toggleSwitch = document.querySelector('.theme-toggle-switch');
      if (toggleSwitch) {
        toggleSwitch.classList.add('active');
      }
      
      localStorage.setItem('theme', 'dark');
      
      // Remove the transition class after transition completes
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 300);
    }, 10);
  }
  
  function disableDarkMode() {
    // Apply a transition class first
    document.body.classList.add('theme-transitioning');
    
    // Use setTimeout to ensure transitions have a chance to apply
    setTimeout(() => {
      htmlElement.classList.remove('dark');
      if (headerLogo) {
        headerLogo.src = 'assets/header.svg';
      }
      
      // Update theme toggle switch state
      const toggleSwitch = document.querySelector('.theme-toggle-switch');
      if (toggleSwitch) {
        toggleSwitch.classList.remove('active');
      }
      
      localStorage.setItem('theme', 'light');
      
      // Remove the transition class after transition completes
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 300);
    }, 10);
  }

  const titleBtn = document.getElementById('title-btn');
  const titleInput = document.getElementById('title-input');
  const noteTitle = document.getElementById('note-title');
  const noteBody = document.getElementById('note-body');

  // Clear any existing search highlights that might be saved in localStorage
  function clearStoredSearchHighlights() {
    try {
      const savedPages = localStorage.getItem('whatToPages');
      if (savedPages) {
        const parsedPages = JSON.parse(savedPages);
        let needsUpdate = false;
        
        // Check each page for search-highlight spans
        parsedPages.forEach((page, index) => {
          if (page.body && page.body.includes('search-highlight')) {
            // Create a temporary div to parse and clean the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = page.body;
            
            // Find and remove all search highlights
            const highlights = tempDiv.querySelectorAll('.search-highlight');
            if (highlights.length > 0) {
              needsUpdate = true;
              highlights.forEach(highlight => {
                const textNode = document.createTextNode(highlight.textContent);
                highlight.parentNode.replaceChild(textNode, highlight);
              });
              
              // Update the page body without highlights
              parsedPages[index].body = tempDiv.innerHTML;
            }
          }
        });
        
        // If we removed any highlights, save the updated pages back to localStorage
        if (needsUpdate) {
          localStorage.setItem('whatToPages', JSON.stringify(parsedPages));
        }
      }
    } catch (e) {
      console.error('Error clearing search highlights:', e);
    }
  }
  
  // Call the function to clear highlights on page load
  clearStoredSearchHighlights();

  if (titleBtn && titleInput && noteTitle && noteBody) {
    titleBtn.addEventListener('click', () => {
      titleBtn.classList.add('hidden');
      titleInput.classList.remove('hidden');
      titleInput.focus();
      
      // Save current page state
      saveCurrentPage();
    });

    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && titleInput.value.trim() !== '') {
        e.preventDefault();
        noteTitle.textContent = titleInput.value;
        noteTitle.classList.remove('hidden');
        titleInput.classList.add('hidden');
        noteBody.classList.remove('hidden');
        noteBody.focus();
        
        // Save current page when title is updated
        saveCurrentPage();
      }
    });

    // Re-edit title when clicked
    noteTitle.addEventListener('click', () => {
      titleInput.value = noteTitle.textContent;
      noteTitle.classList.add('hidden');
      titleInput.classList.remove('hidden');
      titleInput.focus();
    });

    // Save title on blur
    titleInput.addEventListener('blur', () => {
      if (titleInput.value.trim() !== '') {
        noteTitle.textContent = titleInput.value;
        noteTitle.classList.remove('hidden');
        titleInput.classList.add('hidden');
        noteBody.classList.remove('hidden');
        
        // Save current page when title is updated
        saveCurrentPage();
      }
    });

    // Handle input for ghosting effect and special patterns
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

      // Check if the user just typed '---' (potential separator)
      if (currentLine.trim() === '---') {
        // Immediately convert to separator if the user has typed exactly '---'
        // Get the containing div if we're in a text node
        let containerNode = currentNode;
        if (currentNode.nodeType === Node.TEXT_NODE) {
          containerNode = currentNode.parentNode;
        }
        
        // Only proceed if we have a div container
        if (containerNode.tagName === 'DIV') {
          // Create separator
          const separator = document.createElement('hr');
          separator.className = 'separator';
          
          // Replace the div with the separator
          containerNode.replaceWith(separator);
          
          // Create a new line after separator for the cursor
          const newLine = document.createElement('div');
          separator.after(newLine);
          
          // Set cursor position on new line
          const newRange = document.createRange();
          newRange.setStart(newLine, 0);
          newRange.setEnd(newLine, 0);
          selection.removeAllRanges();
          selection.addRange(newRange);
          
          // Save current state
          saveCurrentPage();
          return;
        }
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
          <input type="checkbox" class="checkbox checkbox-primary" ${isChecked ? 'checked="checked"' : ''}>
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
        
        // Save the current page state
        saveCurrentPage();
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
          
          // Mark this div as coming from a checkbox (for debugging)
          newLine.dataset.fromCheckbox = "true";
          
          // Save the current page state
          saveCurrentPage();
          
          // Add a one-time input listener to this specific line
          newLine.addEventListener('input', function onInput(e) {
            if (newLine.textContent.trim() === '---') {
              // Convert to separator immediately
              const separator = document.createElement('hr');
              separator.className = 'separator';
              newLine.replaceWith(separator);
              saveCurrentPage();
            }
          });
          
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
          
          // Save the current page state
          saveCurrentPage();
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
          
          // Save the current page state
          saveCurrentPage();
          return;
        } else {
          // If not a bullet point or separator, just insert a new line
          document.execCommand('insertLineBreak');
        }
      }

      // Add a special key handler for force saving (Ctrl+S)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault(); // Prevent browser save dialog
        console.log("Force save triggered");
        
        // Find all potential separators and convert them
        const allNodes = noteBody.querySelectorAll('div');
        let separatorsFound = false;
        
        allNodes.forEach(node => {
          if (node.textContent.trim() === '---') {
            console.log("Found potential separator to convert");
            const separator = document.createElement('hr');
            separator.className = 'separator';
            node.replaceWith(separator);
            separatorsFound = true;
          }
        });
        
        if (separatorsFound) {
          console.log("Converted separators and saving");
        } else {
          console.log("No separators found, saving anyway");
        }
        
        // Force save
        saveCurrentPage();
        
        // Alert the user
        const savedNotice = document.createElement('div');
        savedNotice.textContent = "All separators fixed and saved!";
        savedNotice.style.position = "fixed";
        savedNotice.style.top = "10px";
        savedNotice.style.left = "50%";
        savedNotice.style.transform = "translateX(-50%)";
        savedNotice.style.backgroundColor = "#4CAF50";
        savedNotice.style.color = "white";
        savedNotice.style.padding = "10px 20px";
        savedNotice.style.borderRadius = "5px";
        savedNotice.style.zIndex = "1000";
        document.body.appendChild(savedNotice);
        
        // Remove the notice after 2 seconds
        setTimeout(() => {
          document.body.removeChild(savedNotice);
        }, 2000);
        
        return false;
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
                  checkbox.innerHTML = `\n                <input type="checkbox" class="checkbox checkbox-primary" ${checked ? 'checked="checked"' : ''}>\n                <span class="ml-2">${text}</span>\n              `;
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
      
      settingsDropdown.classList.remove('opacity-0', 'invisible'); // Make it ready to be shown
      // Use requestAnimationFrame to ensure the transition works
      requestAnimationFrame(() => {
        settingsDropdown.classList.add('show');
      });
    } else {
      settingsDropdown.classList.remove('show');
      // Wait for animation to complete before making it invisible and opacity-0
      setTimeout(() => {
        settingsDropdown.classList.add('opacity-0', 'invisible');
      }, 300); // Match duration-300
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
          settingsDropdown.classList.add('opacity-0', 'invisible');
        }, 300); // Match duration-300
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

  function loadPage(idx) {
    // Update title
    noteTitle.textContent = pages[idx].title;
    
    // Update body content
    noteBody.innerHTML = pages[idx].body;
    
    // Ensure checkbox states are properly set based on the 'checked' attribute
    noteBody.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      // Make sure the checked property matches the attribute
      if (checkbox.hasAttribute('checked')) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
    
    // Show/hide title/body as needed
    if (pages[idx].title && pages[idx].title.trim() !== '') {
      noteTitle.classList.remove('hidden');
      titleBtn.classList.add('hidden');
      titleInput.classList.add('hidden');
      noteBody.classList.remove('hidden');
    } else {
      noteTitle.classList.add('hidden');
      titleBtn.classList.remove('hidden');
      titleInput.classList.add('hidden');
      if (pages[idx].body && pages[idx].body.trim() !== '') {
        noteBody.classList.remove('hidden');
      } else {
        noteBody.classList.add('hidden');
      }
    }
    
    // Calculate and set container height based on content
    // This must happen after content is updated but before transitions
    adjustContainerSize();
  }
  
  // Function to adjust container size based on content with smooth animation
  function adjustContainerSize() {
    const container = document.querySelector('.app-container');
    const titleArea = document.getElementById('note-title-area');
    const contentArea = document.querySelector('.content-area');
    
    // Schedule the height adjustment to allow content to render properly first
    setTimeout(() => {
      // Get current height for transition start point
      const currentHeight = container.offsetHeight;
      
      // Temporarily remove transition to measure natural height
      const originalTransition = container.style.transition;
      const originalOverflow = container.style.overflow;
      container.style.transition = 'none';
      
      // Reset height to auto to get the natural content height
      container.style.height = 'auto';
      
      // Calculate the natural height of the content
      const titleHeight = titleArea.offsetHeight;
      const contentHeight = contentArea.scrollHeight;
      
      // Set a minimum height for the container
      const minHeight = 250;
      
      // Set the container height based on content with a minimum
      const naturalHeight = titleHeight + contentHeight + 12;
      const targetHeight = Math.max(naturalHeight, minHeight);
      
      // Set back to the current height before transitioning
      container.style.height = `${currentHeight}px`;
      
      // Temporarily ensure no content overflow during transition
      if (targetHeight > currentHeight) {
        container.style.overflow = 'hidden';
      }
      
      // Force layout recalculation
      container.offsetHeight;
      
      // Restore transition and set to target height to animate
      container.style.transition = originalTransition || 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Smoothly transition to new height
      container.style.height = `${targetHeight}px`;
      
      // Restore original overflow after transition completes
      setTimeout(() => {
        container.style.overflow = originalOverflow;
      }, 500); // Match to transition duration
    }, 10); // Small delay to ensure content is properly rendered
  }

  function saveCurrentPage() {
    // If title input is active, use its value instead of the title element
    if (!titleInput.classList.contains('hidden')) {
      pages[currentPage].title = titleInput.value.trim() || '';
    } else {
      pages[currentPage].title = noteTitle.textContent || '';
    }
    
    // Special handling for separators: convert any --- text to actual separators before saving
    const allLines = noteBody.querySelectorAll('div');
    allLines.forEach(line => {
      if (line.textContent.trim() === '---') {
        const separator = document.createElement('hr');
        separator.className = 'separator';
        line.replaceWith(separator);
      }
    });
    
    pages[currentPage].body = noteBody.innerHTML || '';
    
    // Also save to localStorage for persistence
    try {
      localStorage.setItem('whatToPages', JSON.stringify(pages));
    } catch (e) {
      console.error('Error saving pages:', e);
    }
  }

  function updatePageBtns() {
    pageBtns.forEach((btn, i) => {
      // First, update the active state
      const isActive = i === currentPage;
      
      if (isActive && !btn.classList.contains('active')) {
        // Only trigger animation if button is not already active
        btn.classList.remove('active');
        // Use setTimeout with 0ms to ensure the class is removed before adding it back
        setTimeout(() => {
          btn.classList.add('active');
        }, 0);
      } else if (!isActive && btn.classList.contains('active')) {
        btn.classList.remove('active');
      } else if (isActive && btn.classList.contains('active')) {
        // Already active, no need to trigger animation
      } else {
        // Not active and shouldn't be active, no change needed
      }
    });
  }
  pageBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (i === currentPage) return;
      
      // If title input is active, save its value before switching
      if (!titleInput.classList.contains('hidden')) {
        if (titleInput.value.trim() !== '') {
          noteTitle.textContent = titleInput.value;
        }
      }
      
      // Save current page state before switching
      saveCurrentPage();
      
      // Start transition - animate content out
      const container = document.querySelector('.app-container');
      const titleArea = document.getElementById('note-title-area');
      
      // Add fade-out class to content elements
      titleArea.classList.add('fade-out');
      noteTitle.classList.add('fade-out');
      noteBody.classList.add('fade-out');
      
      // After content fades out, prepare for page switch
      setTimeout(() => {
        // Switch to new page (update data but keep elements invisible)
        currentPage = i;
        
        // Temporarily hide content while we measure the new size
        titleArea.style.visibility = 'hidden';
        document.getElementById('page-controls').style.visibility = 'hidden';
        if (!noteTitle.classList.contains('hidden')) {
          noteTitle.style.visibility = 'hidden';
        }
        noteBody.style.visibility = 'hidden';
        
        // Load page content
        loadPage(i);
        updatePageBtns();
        
        // Give browser time to render content before measuring height
        setTimeout(() => {
          // Calculate the height for new content
          adjustContainerSize();
          
          // After height transition starts, fade in the content
          setTimeout(() => {
            // Restore visibility first
            titleArea.style.visibility = '';
            document.getElementById('page-controls').style.visibility = '';
            noteTitle.style.visibility = '';
            noteBody.style.visibility = '';
            
            // Then fade in
            titleArea.classList.remove('fade-out');
            noteTitle.classList.remove('fade-out');
            noteBody.classList.remove('fade-out');
          }, 150);
        }, 20);
      }, 250); // Match this to the CSS opacity transition duration
    });
  });
  // On first load, show first page and animate the widget
  loadPage(0);
  updatePageBtns();
  
  // Add initial animation for the app container
  const container = document.querySelector('.app-container');
  container.style.opacity = '0';
  container.style.transform = 'scale(0.98) translateY(10px)';
  
  // Store original transition for restoration
  const originalTransition = container.style.transition;
  
  // Set initial animation transition
  container.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out, width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  
  // Trigger layout calculation
  container.offsetHeight;
  
  // Animate in with simple easing
  container.style.opacity = '1';
  container.style.transform = 'scale(1) translateY(0)';
  
  // Then adjust container size after initial animation
  setTimeout(() => {
    adjustContainerSize();
  }, 400);
  
  // Also adjust container size when window is resized
  window.addEventListener('resize', adjustContainerSize);

  // When editing title or body, always save to current page and adjust size
  titleInput.addEventListener('blur', () => {
    saveCurrentPage();
    adjustContainerSize();
  });
  
  noteBody.addEventListener('input', () => {
    saveCurrentPage();
    adjustContainerSize();
  });
  
  noteBody.addEventListener('blur', () => {
    saveCurrentPage();
    adjustContainerSize();
  });

  // Add event delegation for checkbox changes
  noteBody.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
      // Ensure the checked attribute is properly set in the HTML
      if (e.target.checked) {
        e.target.setAttribute('checked', 'checked');
      } else {
        e.target.removeAttribute('checked');
      }
      
      saveCurrentPage();
    }
  });

  // Add function to toggle checkbox state
  function toggleCheckbox(checkbox) {
    // Add a quick fade effect for visual feedback
    checkbox.style.transition = 'opacity 0.15s ease';
    checkbox.style.opacity = '0.5';
    
    setTimeout(() => {
      checkbox.checked = !checkbox.checked;
      
      // Ensure the checked attribute is properly set in the HTML
      if (checkbox.checked) {
        checkbox.setAttribute('checked', 'checked');
      } else {
        checkbox.removeAttribute('checked');
      }
      
      checkbox.style.opacity = '1';
      saveCurrentPage();
      adjustContainerSize();
    }, 50);
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
    // Also handle direct clicks on the checkbox (this is redundant but ensures we catch all changes)
    else if (e.target.type === 'checkbox') {
      // The change event will handle this, so we don't need to do anything here
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
              checkbox.innerHTML = `\n                <input type="checkbox" class="checkbox checkbox-primary" ${checked ? 'checked="checked"' : ''}>\n                <span class="ml-2">${text}</span>\n              `;
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

  // Add a paste event listener to handle pasted content that might include separators
  noteBody.addEventListener('paste', function(e) {
    // Let the paste event complete naturally
    setTimeout(() => {
      // After paste, check if any line contains '---' and save
      const content = noteBody.textContent;
      if (content.includes('---')) {
        saveCurrentPage();
      }
    }, 0);
  });

  // Search functionality
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    // Create a counter element to show number of matches
    const searchCounter = document.createElement('div');
    searchCounter.className = 'search-counter';
    searchCounter.textContent = '0';
    document.querySelector('.search-container').appendChild(searchCounter);

    // Create navigation buttons for cycling through results
    const searchNavContainer = document.createElement('div');
    searchNavContainer.className = 'search-nav hidden';
    
    const prevButton = document.createElement('button');
    prevButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>`;
    prevButton.className = 'search-nav-btn search-prev-btn';
    prevButton.title = 'Previous result (Left or Shift+Enter)';
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>`;
    nextButton.className = 'search-nav-btn search-next-btn';
    nextButton.title = 'Next result (Right or Enter)';
    
    const resultCounter = document.createElement('span');
    resultCounter.className = 'search-result-counter';
    resultCounter.textContent = '0/0';
    
    searchNavContainer.appendChild(prevButton);
    searchNavContainer.appendChild(resultCounter);
    searchNavContainer.appendChild(nextButton);
    
    document.querySelector('.search-container').appendChild(searchNavContainer);
    
    // Variables to track search results across pages
    let currentSearchTerm = '';
    let allSearchResults = [];
    let currentResultIndex = -1;
    let isSearchTransitioning = false;
    
    // Store search results for each page
    let pageSearchResults = Array.from({length: NUM_PAGES}, () => []);
    
    // Add search input event
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.trim();
      
      if (searchTerm.length < 2) {
        searchCounter.classList.remove('has-results');
        searchNavContainer.classList.add('hidden');
        clearHighlights();
        currentSearchTerm = '';
        allSearchResults = [];
        pageSearchResults = Array.from({length: NUM_PAGES}, () => []);
        currentResultIndex = -1;
        return;
      }
      
      // If search term changed, reset index
      if (searchTerm !== currentSearchTerm) {
        currentResultIndex = -1;
        currentSearchTerm = searchTerm;
        
        // Clear previous results
        allSearchResults = [];
        pageSearchResults = Array.from({length: NUM_PAGES}, () => []);
        
        // Build search results for all pages
        for (let pageIndex = 0; pageIndex < NUM_PAGES; pageIndex++) {
          const page = pages[pageIndex];
          
          // Create a temporary div to parse the HTML content
          const tempDiv = document.createElement('div');
          
          // Set title
          const titleElement = document.createElement('h2');
          titleElement.textContent = page.title || '';
          tempDiv.appendChild(titleElement);
          
          // Set body
          const bodyElement = document.createElement('div');
          bodyElement.innerHTML = page.body || '';
          tempDiv.appendChild(bodyElement);
          
          // Find all text nodes in the temp div
          const walker = document.createTreeWalker(
            tempDiv,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: function(node) {
                // Skip empty text nodes or nodes in script or style elements
                if (!node.textContent.trim() || 
                    node.parentNode.tagName === 'SCRIPT' ||
                    node.parentNode.tagName === 'STYLE') {
                  return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
              }
            }
          );
          
          // Collect matches from this page
          const pageResults = [];
          
          let node;
          while (node = walker.nextNode()) {
            const nodeText = node.textContent;
            const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
            let match;
            
            while ((match = regex.exec(nodeText)) !== null) {
              // Get some context around the match
              const start = Math.max(0, match.index - 30);
              const end = Math.min(nodeText.length, match.index + match[0].length + 30);
              const context = nodeText.substring(start, end);
              
              // Create a result object
              pageResults.push({
                pageIndex: pageIndex,
                node: node,
                matchIndex: match.index,
                matchLength: match[0].length,
                context: context,
                contextStart: start,
                nodeText: nodeText
              });
            }
          }
          
          // Store results for this page
          pageSearchResults[pageIndex] = pageResults;
          allSearchResults = allSearchResults.concat(pageResults);
        }
        
        // If we're on current page and have results, find closest result to viewport
        if (pageSearchResults[currentPage].length > 0) {
          // We'll determine this after highlighting
          currentResultIndex = -1;
        }
      }
      
      // Update the current page results display
      updatePageSearchResults();
      
      // Find closest visible result if we haven't selected one yet
      if (currentResultIndex === -1 && allSearchResults.length > 0) {
        findClosestVisibleResult();
      }
    });
    
    // Function to find the closest visible result to the current viewport
    function findClosestVisibleResult() {
      // Only applicable for results on the current page
      const currentPageResults = pageSearchResults[currentPage];
      if (currentPageResults.length === 0) {
        // If no results on current page, just use the first result overall
        if (allSearchResults.length > 0) {
          currentResultIndex = 0;
          resultCounter.textContent = `1/${allSearchResults.length}`;
        }
        return;
      }
      
      // Get all highlights on the page
      const highlights = Array.from(document.querySelectorAll('.search-highlight'));
      if (highlights.length === 0) return;
      
      // Get viewport bounds
      const viewportTop = window.scrollY || document.documentElement.scrollTop;
      const viewportBottom = viewportTop + window.innerHeight;
      const viewportCenter = viewportTop + (window.innerHeight / 2);
      
      // Find visible highlights and calculate distance to viewport center
      const visibleHighlights = highlights.map((highlight, index) => {
        const rect = highlight.getBoundingClientRect();
        const highlightTop = rect.top + viewportTop;
        const highlightBottom = rect.bottom + viewportTop;
        
        // Check if visible
        const isVisible = (highlightBottom >= viewportTop && highlightTop <= viewportBottom);
        
        // Calculate distance to center of viewport
        const distance = Math.abs((highlightTop + highlightBottom) / 2 - viewportCenter);
        
        return { 
          element: highlight, 
          index: index, 
          isVisible: isVisible,
          distance: distance 
        };
      });
      
      // First try to find visible highlights
      const visibleResults = visibleHighlights.filter(h => h.isVisible);
      
      let closestHighlight;
      if (visibleResults.length > 0) {
        // Sort by distance to center
        closestHighlight = visibleResults.sort((a, b) => a.distance - b.distance)[0];
      } else {
        // If no visible results, find the closest one above or below viewport
        closestHighlight = visibleHighlights.sort((a, b) => a.distance - b.distance)[0];
      }
      
      if (closestHighlight) {
        // Find which global result this corresponds to
        const pageResultIndices = pageSearchResults[currentPage].map((_, i) => i);
        const globalIndices = allSearchResults.map((result, index) => 
          result.pageIndex === currentPage ? index : -1).filter(i => i !== -1);
        
        if (globalIndices.length > closestHighlight.index) {
          currentResultIndex = globalIndices[closestHighlight.index];
          resultCounter.textContent = `${currentResultIndex + 1}/${allSearchResults.length}`;
          highlightCurrentResult();
        }
      }
    }
    
    // Function to update search results display for current page
    function updatePageSearchResults() {
      clearHighlights();
      
      const totalResults = allSearchResults.length;
      let currentPageResults = 0;
      
      // Check if we have results
      if (totalResults > 0) {
        // Count results on current page
        currentPageResults = pageSearchResults[currentPage].length;
        
        // Highlight matches on the current page
        if (currentPageResults > 0) {
          // Title
          const titleText = noteTitle.textContent;
          if (titleText && titleText.includes(currentSearchTerm)) {
            noteTitle.innerHTML = highlightText(titleText, currentSearchTerm, 0);
          }
          // Body
          highlightInElements(noteBody, currentSearchTerm, 0);
          
          // Highlight the current result if it's on this page
          if (currentResultIndex >= 0) {
            const currentPageResultIndices = allSearchResults
              .map((result, index) => result.pageIndex === currentPage ? index : -1)
              .filter(index => index !== -1);
              
            if (currentPageResultIndices.includes(currentResultIndex)) {
              highlightCurrentResult();
            }
          }
        }
        
        // Show navigation and counter only if there are results
        searchCounter.textContent = totalResults;
        searchCounter.classList.add('has-results');
        searchNavContainer.classList.remove('hidden');
        
        // Update result counter
        const currentNumber = currentResultIndex >= 0 ? currentResultIndex + 1 : 0;
        resultCounter.textContent = `${currentNumber}/${totalResults}`;
      } else {
        // No results found
        searchCounter.classList.remove('has-results');
        searchNavContainer.classList.add('hidden');
      }
    }
    
    // Highlight current search result
    function highlightCurrentResult() {
      // Remove previous current highlight
      const previousCurrentHighlight = document.querySelector('.search-highlight-current');
      if (previousCurrentHighlight) {
        previousCurrentHighlight.classList.remove('search-highlight-current');
      }
      
      if (currentResultIndex >= 0 && currentResultIndex < allSearchResults.length) {
        // Find the highlight with the correct data-result-index
        const highlight = document.querySelector('.search-highlight[data-result-index="' + currentResultIndex + '"]');
        if (highlight) {
          highlight.classList.add('search-highlight-current');
          // Scroll into view visually only, never select
          setTimeout(() => {
            const rect = highlight.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - (window.innerHeight / 2) + (rect.height / 2);
            window.scrollTo({
              top: targetY,
              behavior: 'smooth'
            });
          }, 50);
        }
      }
    }
    
    // Navigate to next/previous result
    function navigateSearchResult(direction) {
      if (allSearchResults.length === 0 || isSearchTransitioning) return;
      isSearchTransitioning = true;

      // Calculate new index
      let newIndex;
      if (direction === 'next') {
        newIndex = currentResultIndex < allSearchResults.length - 1 ? currentResultIndex + 1 : 0;
      } else {
        newIndex = currentResultIndex > 0 ? currentResultIndex - 1 : allSearchResults.length - 1;
      }

      currentResultIndex = newIndex;
      const result = allSearchResults[currentResultIndex];
      
      // Update result counter
      resultCounter.textContent = `${currentResultIndex + 1}/${allSearchResults.length}`;
      
      // Check if we need to switch pages
      if (result.pageIndex !== currentPage) {
        // Save current page
        saveCurrentPage();
        
        // Switch to the page containing the result
        const previousPage = currentPage;
        currentPage = result.pageIndex;
        
        // Start transition - animate content out
        const container = document.querySelector('.app-container');
        const titleArea = document.getElementById('note-title-area');
        
        // Add fade-out class to content elements
        titleArea.classList.add('fade-out');
        noteTitle.classList.add('fade-out');
        noteBody.classList.add('fade-out');
        
        // After content fades out, prepare for page switch
        setTimeout(() => {
          // Temporarily hide content while we measure the new size
          titleArea.style.visibility = 'hidden';
          document.getElementById('page-controls').style.visibility = 'hidden';
          if (!noteTitle.classList.contains('hidden')) {
            noteTitle.style.visibility = 'hidden';
          }
          noteBody.style.visibility = 'hidden';
          
          // Load page content
          loadPage(result.pageIndex);
          updatePageBtns();
          
          // Give browser time to render content before measuring height
          setTimeout(() => {
            // Calculate the height for new content
            adjustContainerSize();
            
            // After height transition starts, fade in the content
            setTimeout(() => {
              // Restore visibility first
              titleArea.style.visibility = '';
              document.getElementById('page-controls').style.visibility = '';
              noteTitle.style.visibility = '';
              noteBody.style.visibility = '';
              
              // Then fade in
              titleArea.classList.remove('fade-out');
              noteTitle.classList.remove('fade-out');
              noteBody.classList.remove('fade-out');
              
              // Re-apply the search highlights to the new page
              updatePageSearchResults();
              
              // Highlight the current result
              setTimeout(() => {
                highlightCurrentResult();
                isSearchTransitioning = false;
              }, 50);
            }, 150);
          }, 20);
        }, 250);
      } else {
        // Just highlight the current result on the same page
        highlightCurrentResult();
        isSearchTransitioning = false;
      }
    }
    
    // Add navigation button click events
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateSearchResult('next');
    });
    
    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateSearchResult('prev');
    });
    
    // Add keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Clear search
        this.value = '';
        clearHighlights();
        searchCounter.classList.remove('has-results');
        searchNavContainer.classList.add('hidden');
        currentSearchTerm = '';
        this.blur();
      } else if (e.key === 'Enter') {
        if (allSearchResults.length > 0) {
          e.preventDefault();
          // Shift+Enter goes to previous, Enter goes to next
          navigateSearchResult(e.shiftKey ? 'prev' : 'next');
          // Return focus to search input for continued searching
          setTimeout(() => {
            // Keep focus on the search input
            this.focus();
          }, 50);
        }
      }
      // For all other keys, let normal typing continue
    });
    
    // Clear highlights when focusing away from search
    searchInput.addEventListener('blur', function() {
      // Keep highlights when navigating
      if (document.activeElement === prevButton || 
          document.activeElement === nextButton || 
          document.activeElement === resultCounter) {
        return;
      }
      
      // Only clear if we're not on search elements
      if (!searchNavContainer.contains(document.activeElement)) {
        // Keep the term and results, just remove visual highlights
        if (this.value.trim().length < 2) {
          clearHighlights();
          searchCounter.classList.remove('has-results');
          searchNavContainer.classList.add('hidden');
        }
      }
    });
    
    // Re-highlight when focusing back on search
    searchInput.addEventListener('focus', function() {
      if (this.value.trim().length >= 2) {
        this.dispatchEvent(new Event('input'));
      }
    });
    
    // Update the search results when switching pages
    const originalUpdatePageBtns = updatePageBtns;
    updatePageBtns = function() {
      originalUpdatePageBtns();
      
      // Re-apply search if there's an active search term
      if (currentSearchTerm && currentSearchTerm.length >= 2) {
        updatePageSearchResults();
      }
    };
    
    // Update search when page content changes
    const originalSaveCurrentPage = saveCurrentPage;
    saveCurrentPage = function() {
      originalSaveCurrentPage();
      
      // Update search results for the current page
      if (currentSearchTerm && currentSearchTerm.length >= 2) {
        // Clear previous results for this page
        pageSearchResults[currentPage] = [];
        
        // Create a temporary div to parse the HTML content
        const tempDiv = document.createElement('div');
        
        // Set title
        const titleElement = document.createElement('h2');
        titleElement.textContent = pages[currentPage].title || '';
        tempDiv.appendChild(titleElement);
        
        // Set body
        const bodyElement = document.createElement('div');
        bodyElement.innerHTML = pages[currentPage].body || '';
        tempDiv.appendChild(bodyElement);
        
        // Find all text nodes in the temp div
        const walker = document.createTreeWalker(
          tempDiv,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: function(node) {
              // Skip empty text nodes or nodes in script or style elements
              if (!node.textContent.trim() || 
                  node.parentNode.tagName === 'SCRIPT' ||
                  node.parentNode.tagName === 'STYLE') {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );
        
        // Collect matches from this page
        const pageResults = [];
        
        let node;
        while (node = walker.nextNode()) {
          const nodeText = node.textContent;
          const regex = new RegExp(escapeRegExp(currentSearchTerm), 'gi');
          let match;
          
          while ((match = regex.exec(nodeText)) !== null) {
            // Get some context around the match
            const start = Math.max(0, match.index - 30);
            const end = Math.min(nodeText.length, match.index + match[0].length + 30);
            const context = nodeText.substring(start, end);
            
            // Create a result object
            pageResults.push({
              pageIndex: currentPage,
              node: node,
              matchIndex: match.index,
              matchLength: match[0].length,
              context: context,
              contextStart: start,
              nodeText: nodeText
            });
          }
        }
        
        // Store results for this page
        pageSearchResults[currentPage] = pageResults;
        
        // Rebuild full results list
        allSearchResults = [];
        for (let i = 0; i < NUM_PAGES; i++) {
          allSearchResults = allSearchResults.concat(pageSearchResults[i]);
        }
        
        // Update display
        updatePageSearchResults();
      }
    };
  }
  
  // Replace highlightText and highlightInElements to add data-result-index attributes
  function highlightText(text, searchTerm, baseIndex = 0) {
    if (!searchTerm) return text;
    let matchIndex = 0;
    const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
    return text.replace(regex, match => {
      const span = `<span class="search-highlight" data-result-index="${baseIndex + matchIndex}">${match}</span>`;
      matchIndex++;
      return span;
    });
  }

  function highlightInElements(element, searchTerm, baseIndex = 0) {
    if (!element || !searchTerm) return 0;
    let count = 0;
    if (element.nodeType === Node.TEXT_NODE) {
      const parent = element.parentNode;
      if (parent.classList && parent.classList.contains('search-highlight')) return 0;
      const text = element.nodeValue;
      const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
      let lastIndex = 0, match, idx = 0;
      let found = false;
      const fragment = document.createDocumentFragment();
      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        found = true;
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }
        const highlightSpan = document.createElement('span');
        highlightSpan.className = 'search-highlight';
        highlightSpan.textContent = match[0];
        highlightSpan.setAttribute('data-result-index', baseIndex + count);
        fragment.appendChild(highlightSpan);
        lastIndex = regex.lastIndex;
        count++;
      }
      if (found) {
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }
        parent.replaceChild(fragment, element);
      }
      return count;
    } else if (element.nodeType === Node.ELEMENT_NODE) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') return 0;
      let total = 0;
      const childNodes = Array.from(element.childNodes);
      for (const child of childNodes) {
        total += highlightInElements(child, searchTerm, baseIndex + total);
      }
      return total;
    }
    return 0;
  }

  // Function to clear all highlights
  function clearHighlights() {
    // Clear title highlights
    if (noteTitle.innerHTML.includes('search-highlight')) {
      noteTitle.textContent = noteTitle.textContent;
    }
    
    // Clear body highlights
    const highlights = noteBody.querySelectorAll('.search-highlight');
    for (const highlight of highlights) {
      const textNode = document.createTextNode(highlight.textContent);
      highlight.parentNode.replaceChild(textNode, highlight);
    }
    
    // Normalize the note body to merge adjacent text nodes
    noteBody.normalize();
  }
  
  // Helper function to escape special regex characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Helper function to count occurrences
  function countOccurrences(string, subString) {
    if (!string || !subString) return 0;
    
    const regex = new RegExp(escapeRegExp(subString), 'gi');
    const matches = string.match(regex);
    return matches ? matches.length : 0;
  }

  // Also make sure the theme toggle button is properly initialized in the settings section
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    // Set initial state based on current theme
    if (document.documentElement.classList.contains('dark')) {
      themeToggleBtn.querySelector('.theme-toggle-switch').classList.add('active');
    }
  }
}); 