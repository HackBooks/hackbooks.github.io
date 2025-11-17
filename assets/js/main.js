// Initial tools data
        const defaultTools = [
            {
                id: 1,
                name: "Nmap",
                description: "Network exploration and security auditing tool for port scanning and network mapping",
                category: "reconnaissance",
                install: "apt install nmap",
                usage: "nmap -sV -sC target.com",
                tags: ["scanner", "network", "reconnaissance"]
            },
            {
                id: 2,
                name: "Burp Suite",
                description: "Comprehensive web application security testing platform with proxy, scanner, and intruder tools",
                category: "web",
                install: "Download from portswigger.net",
                usage: "Configure browser proxy to 127.0.0.1:8080",
                tags: ["web", "proxy", "scanner"]
            },
            {
                id: 3,
                name: "John the Ripper",
                description: "Fast password cracking tool supporting multiple hash and cipher types",
                category: "crypto",
                install: "apt install john",
                usage: "john --wordlist=rockyou.txt hashes.txt",
                tags: ["password", "crypto", "cracking"]
            },
            {
                id: 4,
                name: "Metasploit",
                description: "Advanced penetration testing framework with extensive exploit database",
                category: "exploitation",
                install: "apt install metasploit-framework",
                usage: "msfconsole",
                tags: ["exploitation", "framework", "ruby"]
            },
            {
                id: 5,
                name: "Wireshark",
                description: "Network protocol analyzer for packet capture and analysis",
                category: "network",
                install: "apt install wireshark",
                usage: "wireshark",
                tags: ["network", "packet", "analysis"]
            },
            {
                id: 6,
                name: "SQLMap",
                description: "Automated SQL injection and database takeover tool",
                category: "web",
                install: "apt install sqlmap",
                usage: "sqlmap -u 'http://target.com?id=1' --dbs",
                tags: ["web", "sql", "python", "injection"]
            },
            {
                id: 7,
                name: "Ghidra",
                description: "NSA's software reverse engineering framework with decompiler",
                category: "reverse",
                install: "Download from ghidra-sre.org",
                usage: "ghidraRun",
                tags: ["reverse", "decompiler", "java"]
            },
            {
                id: 8,
                name: "Hashcat",
                description: "World's fastest password recovery tool with GPU acceleration",
                category: "crypto",
                install: "apt install hashcat",
                usage: "hashcat -m 0 -a 0 hashes.txt wordlist.txt",
                tags: ["password", "crypto", "gpu", "cracking"]
            }
        ];

        // Load tools from localStorage or use defaults
        let tools = JSON.parse(localStorage.getItem('hackbook-tools')) || defaultTools;
        let currentFilter = '';
        let currentTagFilter = '';

        // Save tools to localStorage
        function saveTools() {
            localStorage.setItem('hackbook-tools', JSON.stringify(tools));
        }

        // Get all unique tags
        function getAllTags() {
            const tagSet = new Set();
            tools.forEach(tool => {
                tool.tags.forEach(tag => tagSet.add(tag));
            });
            return Array.from(tagSet).sort();
        }

        // Render tag filter buttons
        function renderTagFilters() {
            const container = document.getElementById('tagFilters');
            const tags = getAllTags();
            
            if (tags.length === 0) {
                container.innerHTML = '';
                return;
            }
            
            container.innerHTML = `
                <button 
                    onclick="filterByTag('')" 
                    class="filter-btn px-3 py-1 rounded-full text-sm border border-slate-600 ${currentTagFilter === '' ? 'active' : ''}"
                >
                    All
                </button>
                ${tags.map(tag => `
                    <button 
                        onclick="filterByTag('${tag}')" 
                        class="filter-btn px-3 py-1 rounded-full text-sm border border-slate-600 ${currentTagFilter === tag ? 'active' : ''}"
                    >
                        ${tag}
                    </button>
                `).join('')}
            `;
        }

        // Filter by tag
        function filterByTag(tag) {
            currentTagFilter = tag;
            renderTagFilters();
            renderTools();
        }

        // Copy to clipboard
        function copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '✓ Copied';
                button.classList.add('text-green-400');
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('text-green-400');
                }, 2000);
            });
        }

        // Render tools
        function renderTools() {
            const container = document.getElementById('toolsContainer');
            const emptyState = document.getElementById('emptyState');
            const searchTerm = currentFilter.toLowerCase();
            
            let filteredTools = tools.filter(tool => {
                const matchesSearch = !searchTerm || 
                    tool.name.toLowerCase().includes(searchTerm) ||
                    tool.description.toLowerCase().includes(searchTerm) ||
                    tool.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                
                const matchesTag = !currentTagFilter || tool.tags.includes(currentTagFilter);
                
                return matchesSearch && matchesTag;
            });

            // Update tool count
            document.getElementById('toolCount').textContent = 
                `Showing ${filteredTools.length} of ${tools.length} tools`;

            if (filteredTools.length === 0) {
                container.classList.add('hidden');
                emptyState.classList.remove('hidden');
                return;
            }

            container.classList.remove('hidden');
            emptyState.classList.add('hidden');

            container.innerHTML = filteredTools.map(tool => `
                <div class="tool-card rounded-xl p-6">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-xl font-bold text-blue-400">${tool.name}</h3>
                        <button 
                            onclick="deleteTool(${tool.id})" 
                            class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/30 transition"
                            title="Delete tool"
                        >
                            Delete
                        </button>
                    </div>
                    
                    <p class="text-gray-300 mb-4">${tool.description}</p>
                    
                    <div class="mb-3">
                        <span class="inline-block px-3 py-1 bg-slate-700 text-blue-300 rounded-full text-xs font-medium">
                            ${tool.category}
                        </span>
                    </div>
                    
                    ${tool.install ? `
                        <div class="code-block mb-3 relative group">
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs text-gray-400 font-semibold">INSTALL</label>
                                <button 
                                    onclick="copyToClipboard('${tool.install.replace(/'/g, "\\'")}', this)" 
                                    class="copy-btn text-xs text-blue-400 hover:text-blue-300"
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <code class="block bg-slate-900 px-3 py-2 rounded text-sm code-font text-green-400">
                                ${tool.install}
                            </code>
                        </div>
                    ` : ''}
                    
                    ${tool.usage ? `
                        <div class="code-block relative group">
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs text-gray-400 font-semibold">USAGE</label>
                                <button 
                                    onclick="copyToClipboard('${tool.usage.replace(/'/g, "\\'")}', this)" 
                                    class="copy-btn text-xs text-blue-400 hover:text-blue-300"
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <code class="block bg-slate-900 px-3 py-2 rounded text-sm code-font text-cyan-400">
                                ${tool.usage}
                            </code>
                        </div>
                    ` : ''}
                    
                    <div class="flex flex-wrap gap-2 mt-4">
                        ${tool.tags.map(tag => `
                            <span class="tag px-2 py-1 rounded text-xs code-font cursor-pointer" onclick="filterByTag('${tag}')">
                                #${tag}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        // Delete tool
        function deleteTool(id) {
            if (confirm('Are you sure you want to delete this tool?')) {
                tools = tools.filter(tool => tool.id !== id);
                saveTools();
                renderTagFilters();
                renderTools();
            }
        }

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            currentFilter = e.target.value;
            renderTools();
        });

        // Modal functions
        function openModal() {
            document.getElementById('addToolModal').classList.remove('hidden');
            document.getElementById('addToolModal').classList.add('flex');
        }

        function closeModal() {
            document.getElementById('addToolModal').classList.add('hidden');
            document.getElementById('addToolModal').classList.remove('flex');
            document.getElementById('addToolForm').reset();
        }

        // Add tool form submission
        document.getElementById('addToolForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newTool = {
                id: Date.now(),
                name: document.getElementById('toolName').value.trim(),
                description: document.getElementById('toolDescription').value.trim(),
                category: document.getElementById('toolCategory').value,
                install: document.getElementById('toolInstall').value.trim(),
                usage: document.getElementById('toolUsage').value.trim(),
                tags: document.getElementById('toolTags').value
                    .split(',')
                    .map(tag => tag.trim().toLowerCase())
                    .filter(tag => tag.length > 0)
            };
            
            tools.unshift(newTool);
            saveTools();
            renderTagFilters();
            renderTools();
            closeModal();
            
            // Scroll to top to show new tool
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Close modal on outside click
        document.getElementById('addToolModal').addEventListener('click', (e) => {
            if (e.target.id === 'addToolModal') {
                closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Initialize
        renderTagFilters();
        renderTools();