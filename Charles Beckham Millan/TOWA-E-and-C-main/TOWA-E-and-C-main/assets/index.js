document.addEventListener('DOMContentLoaded', function() {
            const burgerBtn = document.getElementById('burgerBtn');
            const closeBtn = document.getElementById('closeMenu');
            const mobileMenu = document.getElementById('mobileMenu');
            const body = document.body;

            function openMenu() {
                mobileMenu.classList.add('active');
                body.classList.add('menu-open');
            }

            function closeMenu() {
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }

            burgerBtn.addEventListener('click', openMenu);
            closeBtn.addEventListener('click', closeMenu);
            
            // Close on link click
            document.querySelectorAll('.mobile-nav-links a').forEach(link => {
                link.addEventListener('click', closeMenu);
            });
            
            // Close on backdrop click
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) closeMenu();
            });
            
            // Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    closeMenu();
                }
            });
        });



// case section

// Select all the groups we created
const regionGroups = document.querySelectorAll('.map-region');

regionGroups.forEach(group => {
  group.addEventListener('click', function() {
    // 1. Remove 'active' from all groups to clear previous selection
    regionGroups.forEach(g => g.classList.remove('active'));
    
    // 2. Add 'active' to the group that was just clicked
    this.classList.add('active');
    
    // 3. Optional: Get the ID to show the name of the region
    console.log("You clicked the " + this.id + " region!");
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.case-card-item');
    const filterButtons = document.querySelectorAll('.filter-group .btn');

    // --- 1. THE FILTER FUNCTION ---
    function filterAll() {
        const activeRegion = document.querySelector('button[data-region].active-orange')?.getAttribute('data-region') || 'all';
        const activeCategory = document.querySelector('button[data-category].active-orange')?.getAttribute('data-category') || 'all';
        const activeSystem = document.querySelector('button[data-system].active-orange')?.getAttribute('data-system') || 'all';

        cards.forEach(card => {
            const matchesRegion = (activeRegion === 'all' || card.getAttribute('data-region') === activeRegion);
            const matchesCategory = (activeCategory === 'all' || card.getAttribute('data-category') === activeCategory);
            const matchesSystem = (activeSystem === 'all' || card.getAttribute('data-system') === activeSystem);

            card.style.display = (matchesRegion && matchesCategory && matchesSystem) ? 'block' : 'none';
        });
    }

    // --- 2. INITIAL STATE (Handling Map Redirects) ---
    const urlParams = new URLSearchParams(window.location.search);
    const selectedRegion = urlParams.get('region');

    // Default: Highlight "All" in every group first
    document.querySelectorAll('.filter-group').forEach(group => {
        const allButton = group.querySelector('[data-region="all"], [data-category="all"], [data-system="all"]');
        if (allButton) {
            allButton.classList.add('active-orange');
            allButton.classList.remove('btn-outline-secondary');
        }
    });

    // Overwrite: If URL has ?region=north, switch the highlight
    if (selectedRegion && selectedRegion !== 'all') {
        const allRegBtn = document.querySelector('button[data-region="all"]');
        const targetRegBtn = document.querySelector(`button[data-region="${selectedRegion}"]`);

        if (targetRegBtn && allRegBtn) {
            allRegBtn.classList.remove('active-orange');
            allRegBtn.classList.add('btn-outline-secondary');
            targetRegBtn.classList.add('active-orange');
            targetRegBtn.classList.remove('btn-outline-secondary');
        }
    }

    // --- 3. CLICK HANDLERS ---
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // CHANGE: Use .mobile-filter-container instead of .d-flex
            // This container holds BOTH the 'all' wrapper and the 'choices' wrapper
            const filterRow = this.closest('.mobile-filter-container');
            
            if (filterRow) {
                filterRow.querySelectorAll('.btn').forEach(b => {
                    b.classList.remove('active-orange');
                    b.classList.remove('active'); // Added to ensure 'active' from HTML is also removed
                    b.classList.add('btn-outline-secondary');
                });
            }

            // Activate clicked button
            this.classList.add('active-orange');
            this.classList.remove('btn-outline-secondary');

            // Trigger filtering
            filterAll(); 
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.case-card-item');
    const pageNums = document.querySelectorAll('.page-num');
    const itemsPerPage = 9; 
    let currentPage = 1;

    function updateDisplay() {
        // 1. Get current filters
        const activeRegion = document.querySelector('[data-region].active-orange')?.getAttribute('data-region') || 'all';
        const activeCategory = document.querySelector('[data-category].active-orange')?.getAttribute('data-category') || 'all';

        // 2. Filter the cards
        let filtered = Array.from(cards).filter(card => {
            const regMatch = (activeRegion === 'all' || card.getAttribute('data-region') === activeRegion);
            const catMatch = (activeCategory === 'all' || card.getAttribute('data-category') === activeCategory);
            return regMatch && catMatch;
        });

        const maxPages = Math.ceil(filtered.length / itemsPerPage) || 1;

        // 3. Ensure we don't go out of bounds
        if (currentPage > maxPages) currentPage = maxPages;
        if (currentPage < 1) currentPage = 1;

        // 4. Show/Hide Cards
        cards.forEach(card => card.style.display = 'none');
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        filtered.slice(start, end).forEach(card => card.style.display = 'block');

        // 5. Update Pagination Background (Active Button)
        pageNums.forEach(num => {
            const pageVal = parseInt(num.getAttribute('data-page'));
            
            // Background moves here
            if (pageVal === currentPage) {
                num.classList.add('active');
            } else {
                num.classList.remove('active');
            }

            // Keep numbers visible but fade them if they have no content
            num.style.opacity = (pageVal > maxPages) ? "0.2" : "1";
            num.style.cursor = (pageVal > maxPages) ? "default" : "pointer";
        });

        // 6. Arrow Visibility
        document.getElementById('prevPage').style.opacity = (currentPage === 1) ? "0.3" : "1";
        document.getElementById('nextPage').style.opacity = (currentPage === maxPages || currentPage === 3) ? "0.3" : "1";
    }

    // CLICKING REGIONS/FILTERS
    document.querySelectorAll('.filter-group .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const region = this.getAttribute('data-region');
            
            // THE TRICK: 
            // If "All" is clicked, go to Page 2. 
            // If a specific region is clicked, go to Page 1.
            if (region === 'all' || !region) {
                currentPage = 2;
            } else {
                currentPage = 1;
            }
            
            setTimeout(updateDisplay, 10);
        });
    });

    // ARROW CONTROLS
    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < 3) {
            currentPage++;
            updateDisplay();
        }
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateDisplay();
        }
    });

    // INITIAL LOAD CHECK (For "View More" from index.html)
    const urlParams = new URLSearchParams(window.location.search);
    const initialRegion = urlParams.get('region');
    
    if (!initialRegion || initialRegion === 'all') {
        currentPage = 2; // Default to middle page if viewing all
    } else {
        currentPage = 1; // Default to first page if coming from a specific map region
    }

    updateDisplay();
});

