const AIRTABLE_CONFIG = {
    apiKey: 'patAQ44oTB9EfY3vo.accf866ae6fd479bc292faaecd3c96f857e9e2d84c69364b041b40c88efe197d',
    baseId: 'app3Pnv4423RRK52w',
    tableName: 'tblptL5RJrvRLAWzg'
};

// Indian stocks list - comprehensive list of major Indian companies
const INDIAN_STOCKS = [

    // Sectors in general
    { symbol: 'IT', name: 'Information Technology' },
    { symbol: 'BANKING', name: 'Banking' },
    { symbol: 'FINANCE', name: 'Finance' },
    { symbol: 'ENERGY', name: 'Energy' },
    { symbol: 'METALS', name: 'Metals & Mining' },
    { symbol: 'NIFTY', name: 'Nifty 50' },

    // IT & Technology
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'INFY', name: 'Infosys Limited' },
    { symbol: 'WIPRO', name: 'Wipro Limited' },
    { symbol: 'HCLTECH', name: 'HCL Technologies' },
    { symbol: 'TECHM', name: 'Tech Mahindra' },
    { symbol: 'LTI', name: 'Larsen & Toubro Infotech' },
    { symbol: 'MINDTREE', name: 'Mindtree Limited' },
    { symbol: 'MPHASIS', name: 'Mphasis Limited' },
    { symbol: 'COFORGE', name: 'Coforge Limited' },
    { symbol: 'PERSISTENT', name: 'Persistent Systems' },
    
    // Banking & Financial Services
    { symbol: 'HDFCBANK', name: 'HDFC Bank' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'AXISBANK', name: 'Axis Bank' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank' },
    { symbol: 'INDUSINDBK', name: 'IndusInd Bank' },
    { symbol: 'FEDERALBNK', name: 'Federal Bank' },
    { symbol: 'BANDHANBNK', name: 'Bandhan Bank' },
    { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank' },
    { symbol: 'PNB', name: 'Punjab National Bank' },
    { symbol: 'BANKBARODA', name: 'Bank of Baroda' },
    { symbol: 'CANBK', name: 'Canara Bank' },
    { symbol: 'UNIONBANK', name: 'Union Bank of India' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv' },
    { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance' },
    { symbol: 'SBILIFE', name: 'SBI Life Insurance' },
    { symbol: 'ICICIGI', name: 'ICICI Lombard General Insurance' },
    
    // Oil & Gas
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation' },
    { symbol: 'IOC', name: 'Indian Oil Corporation' },
    { symbol: 'BPCL', name: 'Bharat Petroleum Corporation' },
    { symbol: 'HPCL', name: 'Hindustan Petroleum Corporation' },
    { symbol: 'GAIL', name: 'GAIL (India) Limited' },
    { symbol: 'PETRONET', name: 'Petronet LNG' },
    
    // Automobiles
    { symbol: 'MARUTI', name: 'Maruti Suzuki India' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors' },
    { symbol: 'M&M', name: 'Mahindra & Mahindra' },
    { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto' },
    { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp' },
    { symbol: 'EICHERMOT', name: 'Eicher Motors' },
    { symbol: 'ASHOKLEY', name: 'Ashok Leyland' },
    { symbol: 'TVSMOTOR', name: 'TVS Motor Company' },
    { symbol: 'BHARATFORG', name: 'Bharat Forge' },
    { symbol: 'MOTHERSUMI', name: 'Motherson Sumi Systems' },
    
    // Pharmaceuticals
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries' },
    { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories' },
    { symbol: 'CIPLA', name: 'Cipla Limited' },
    { symbol: 'LUPIN', name: 'Lupin Limited' },
    { symbol: 'BIOCON', name: 'Biocon Limited' },
    { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma' },
    { symbol: 'CADILAHC', name: 'Cadila Healthcare' },
    { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals' },
    { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals' },
    { symbol: 'ALKEM', name: 'Alkem Laboratories' },
    
    // FMCG
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever' },
    { symbol: 'ITC', name: 'ITC Limited' },
    { symbol: 'NESTLEIND', name: 'Nestle India' },
    { symbol: 'BRITANNIA', name: 'Britannia Industries' },
    { symbol: 'DABUR', name: 'Dabur India' },
    { symbol: 'MARICO', name: 'Marico Limited' },
    { symbol: 'GODREJCP', name: 'Godrej Consumer Products' },
    { symbol: 'COLPAL', name: 'Colgate Palmolive India' },
    { symbol: 'EMAMILTD', name: 'Emami Limited' },
    { symbol: 'UBL', name: 'United Breweries' },
    
    // Metals & Mining
    { symbol: 'TATASTEEL', name: 'Tata Steel' },
    { symbol: 'JSWSTEEL', name: 'JSW Steel' },
    { symbol: 'HINDALCO', name: 'Hindalco Industries' },
    { symbol: 'VEDL', name: 'Vedanta Limited' },
    { symbol: 'SAIL', name: 'Steel Authority of India' },
    { symbol: 'NMDC', name: 'NMDC Limited' },
    { symbol: 'COALINDIA', name: 'Coal India' },
    { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power' },
    { symbol: 'RATNAMANI', name: 'Ratnamani Metals & Tubes' },
    
    // Cement
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement' },
    { symbol: 'SHREECEM', name: 'Shree Cement' },
    { symbol: 'ACC', name: 'ACC Limited' },
    { symbol: 'AMBUJACEMENT', name: 'Ambuja Cements' },
    { symbol: 'JKCEMENT', name: 'JK Cement' },
    { symbol: 'RAMCOCEM', name: 'The Ramco Cements' },
    
    // Telecom
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
    { symbol: 'IDEA', name: 'Vodafone Idea' },
    { symbol: 'RCOM', name: 'Reliance Communications' },
    
    // Power & Utilities
    { symbol: 'POWERGRID', name: 'Power Grid Corporation' },
    { symbol: 'NTPC', name: 'NTPC Limited' },
    { symbol: 'TATAPOWER', name: 'Tata Power' },
    { symbol: 'ADANIPOWER', name: 'Adani Power' },
    { symbol: 'ADANIGREEN', name: 'Adani Green Energy' },
    { symbol: 'RPOWER', name: 'Reliance Power' },
    
    // Infrastructure & Construction
    { symbol: 'LT', name: 'Larsen & Toubro' },
    { symbol: 'DLF', name: 'DLF Limited' },
    { symbol: 'GODREJPROP', name: 'Godrej Properties' },
    { symbol: 'OBEROIRLTY', name: 'Oberoi Realty' },
    { symbol: 'PRESTIGE', name: 'Prestige Estates Projects' },
    { symbol: 'BRIGADE', name: 'Brigade Enterprises' },
    
    // Retail & E-commerce
    { symbol: 'DMART', name: 'Avenue Supermarts (DMart)' },
    { symbol: 'TRENT', name: 'Trent Limited' },
    { symbol: 'SHOPERSTOP', name: 'Shoppers Stop' },
    { symbol: 'FRETAIL', name: 'Future Retail' },
    
    // Airlines & Travel
    { symbol: 'INDIGO', name: 'InterGlobe Aviation (IndiGo)' },
    { symbol: 'SPICEJET', name: 'SpiceJet Limited' },
    { symbol: 'IRCTC', name: 'Indian Railway Catering and Tourism Corporation' },
    
    // Media & Entertainment
    { symbol: 'ZEEL', name: 'Zee Entertainment Enterprises' },
    { symbol: 'SUNTV', name: 'Sun TV Network' },
    { symbol: 'BALAJITELE', name: 'Balaji Telefilms' },
    { symbol: 'PVRINOX', name: 'PVR INOX' },
    
    // Agriculture & Food
    { symbol: 'UPL', name: 'UPL Limited' },
    { symbol: 'PIIND', name: 'PI Industries' },
    { symbol: 'RALLIS', name: 'Rallis India' },
    { symbol: 'KRBL', name: 'KRBL Limited' },
    
    // Textiles
    { symbol: 'RTNPOWER', name: 'RattanIndia Power' },
    { symbol: 'WELCORP', name: 'Welspun Corp' },
    { symbol: 'TRIDENT', name: 'Trident Limited' },
    
    // Others
    { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone' },
    { symbol: 'ADANIENT', name: 'Adani Enterprises' },
    { symbol: 'HDFCAMC', name: 'HDFC Asset Management Company' },
    { symbol: 'MCDOWELL-N', name: 'United Spirits' },
    { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise' },
    { symbol: 'FORTIS', name: 'Fortis Healthcare' },
    { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories' },
    { symbol: 'DIVISLAB', name: 'Divis Laboratories' }
];

// Create a global object to hold all our functions
window.StocksBrew = {
    selectedStocks: new Set(),
    searchTimeout: null,
    MAX_STOCKS: 15,

    selectStock: function(symbol, name) {
        if (this.selectedStocks.size >= this.MAX_STOCKS) {
            this.showNotification(`You can only select up to ${this.MAX_STOCKS} stocks.`, 'error');
            return;
        }

        if (!this.selectedStocks.has(symbol)) {
            this.selectedStocks.add(symbol);
            this.updateSelectedStocksDisplay();
            this.updateSubmitButton();
            
            // Clear search
            document.getElementById('stockSearch').value = '';
            this.hideSearchResults();
            
            // Show selected stocks container
            document.getElementById('selectedStocksContainer').classList.remove('hidden');
        }
    },

    removeStock: function(symbol) {
        this.selectedStocks.delete(symbol);
        this.updateSelectedStocksDisplay();
        this.updateSubmitButton();
        
        if (this.selectedStocks.size === 0) {
            document.getElementById('selectedStocksContainer').classList.add('hidden');
        }
    },

    showSearchResults: function(query) {
        const searchResults = document.getElementById('searchResults');
        const queryLower = query.toLowerCase();
        
        // If max stocks reached, show message instead of results
        if (this.selectedStocks.size >= this.MAX_STOCKS) {
            searchResults.innerHTML = `
                <div class="p-4 text-center text-red-400">
                    Maximum limit of ${this.MAX_STOCKS} stocks reached. Remove some stocks to add more.
                </div>
            `;
            searchResults.classList.remove('hidden');
            return;
        }
        
        // First filter out selected stocks
        const availableStocks = INDIAN_STOCKS.filter(stock => 
            !this.selectedStocks.has(stock.symbol)
        );

        // Separate stocks into three groups: 
        // 1. Stocks where symbol starts with query
        // 2. Stocks where name starts with query
        // 3. Stocks that contain query anywhere
        const symbolStartMatches = [];
        const nameStartMatches = [];
        const containsMatches = [];

        availableStocks.forEach(stock => {
            const symbolLower = stock.symbol.toLowerCase();
            const nameLower = stock.name.toLowerCase();

            if (symbolLower.startsWith(queryLower)) {
                symbolStartMatches.push(stock);
            } else if (nameLower.startsWith(queryLower)) {
                nameStartMatches.push(stock);
            } else if (symbolLower.includes(queryLower) || nameLower.includes(queryLower)) {
                containsMatches.push(stock);
            }
        });

        // Combine all matches in priority order and limit to 10 results
        const filteredStocks = [
            ...symbolStartMatches,
            ...nameStartMatches,
            ...containsMatches
        ].slice(0, 10);
    
        if (filteredStocks.length > 0) {
            searchResults.innerHTML = filteredStocks.map(stock => `
                <div class="p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0" 
                     onclick="StocksBrew.selectStock('${stock.symbol}', '${stock.name}')">
                    <div class="font-semibold text-white">${stock.symbol}</div>
                    <div class="text-sm text-gray-400">${stock.name}</div>
                </div>
            `).join('');
            searchResults.classList.remove('hidden');
        } else {
            const message = this.selectedStocks.size > 0 
                ? `No additional stocks found matching "${query}"`
                : `No stocks found matching "${query}"`;
            
            searchResults.innerHTML = `
                <div class="p-4 text-center text-gray-400">
                    ${message}
                </div>
            `;
            searchResults.classList.remove('hidden');
        }
    },

    hideSearchResults: function() {
        document.getElementById('searchResults').classList.add('hidden');
    },

    updateSelectedStocksDisplay: function() {
        const container = document.getElementById('selectedStocksList');
        const countElement = document.getElementById('selectedCount');
        
        container.innerHTML = Array.from(this.selectedStocks).map(symbol => {
            const stock = INDIAN_STOCKS.find(s => s.symbol === symbol);
            return `
                <div class="bg-gradient-to-r from-accent/20 to-neon/20 border border-accent/30 rounded-xl px-3 py-2 flex items-center gap-2">
                    <span class="text-white font-semibold text-sm">${symbol}</span>
                    <button onclick="StocksBrew.removeStock('${symbol}')" class="text-gray-400 hover:text-white transition-colors">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>
            `;
        }).join('');
        
        // Add count with limit information
        countElement.textContent = `${this.selectedStocks.size}/${this.MAX_STOCKS}`;
        
        // Add visual feedback when approaching/reaching limit
        if (this.selectedStocks.size >= this.MAX_STOCKS) {
            countElement.classList.add('text-red-400');
        } else if (this.selectedStocks.size >= this.MAX_STOCKS - 3) {
            countElement.classList.add('text-yellow-400');
        } else {
            countElement.classList.remove('text-red-400', 'text-yellow-400');
        }
    },

    updateSubmitButton: function() {
        const submitBtn = document.getElementById('submitBtn');
        const email = document.getElementById('email').value;
        
        if (this.selectedStocks.size >= 3 && email.trim() !== '') {
            submitBtn.disabled = false;
            submitBtn.classList.add('hover:scale-105');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.remove('hover:scale-105');
        }
    },

    setupEventListeners: function() {
        // Handle form submission
        document.getElementById('subscriptionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(e);
        });
    
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    
        // Update submit button when email changes
        document.getElementById('email').addEventListener('input', () => this.updateSubmitButton());
    
        // Add glow effect to email input
        document.getElementById('email').addEventListener('focus', function() {
            document.getElementById('emailGlow').style.opacity = '1';
        });
    
        document.getElementById('email').addEventListener('blur', function() {
            document.getElementById('emailGlow').style.opacity = '0';
        });
    },

    setupSearchFunctionality: function() {
        const searchInput = document.getElementById('stockSearch');
        const searchResults = document.getElementById('searchResults');
    
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    this.showSearchResults(query);
                } else {
                    this.hideSearchResults();
                }
            }, 300);
        });
    
        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                this.hideSearchResults();
            }
        });
    },

    async handleFormSubmission(e) {
        const email = document.getElementById('email').value;
        const selectedStocksList = Array.from(this.selectedStocks);
        
        if (selectedStocksList.length < 3) {
            this.showNotification('Please select at least 3 stocks to track.', 'error');
            return;
        }

        const selectedStocksNames = selectedStocksList.map(symbol => INDIAN_STOCKS.find(s => s.symbol === symbol)?.name || symbol).join(', ');

        const subscriptionData = {
            email: email,
            selectedStocks: selectedStocksNames,
            subscribedAt: new Date().toISOString(),
            status: 'active',
            market: 'indian'
        };
        
        try {
            // Add loading state
            this.addLoadingState();
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Save to Airtable
            await this.saveSubscriptionData(subscriptionData);
            
            // Show success message
            document.getElementById('subscriptionForm').style.display = 'none';
            document.getElementById('successMessage').classList.remove('hidden');
            document.getElementById('successMessage').classList.add('success-bounce');
            
            // Scroll to success message
            document.getElementById('successMessage').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
        } catch (error) {
            console.error('Error saving subscription:', error);
            this.showNotification('There was an error processing your subscription. Please try again.', 'error');
            this.removeLoadingState();
        }
    },

    async saveSubscriptionData(data) {
        try {
            // First check if email already exists
            const checkResponse = await fetch(
                `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}?filterByFormula=Email%3D%22${encodeURIComponent(data.email)}%22`,
                {
                    headers: {
                        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!checkResponse.ok) {
                throw new Error('Failed to check existing email');
            }

            const existingRecords = await checkResponse.json();
            let airtableResponse;

            if (existingRecords.records && existingRecords.records.length > 0) {
                // Update existing record
                const recordId = existingRecords.records[0].id;
                airtableResponse = await fetch(
                    `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}/${recordId}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fields: {
                                'Email': data.email,
                                'Selected Stocks': data.selectedStocks,
                                'Subscription Date': data.subscribedAt,
                                'Status': data.status,
                                'Market': data.market
                            }
                        })
                    }
                );
            } else {
                // Create new record
                airtableResponse = await fetch(
                    `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            records: [{
                                fields: {
                                    'Email': data.email,
                                    'Selected Stocks': data.selectedStocks,
                                    'Subscription Date': data.subscribedAt,
                                    'Status': data.status,
                                    'Market': data.market
                                }
                            }]
                        })
                    }
                );
            }

            if (!airtableResponse.ok) {
                const errorData = await airtableResponse.json();
                throw new Error(`Failed to save to Airtable: ${errorData.error?.message || 'Unknown error'}`);
            }

            // Send welcome email via Flask server
            const welcomeResponse = await fetch('http://localhost:5000/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email
                })
            });

            if (!welcomeResponse.ok) {
                const errorData = await welcomeResponse.json();
                console.warn('Welcome email failed:', errorData.message);
                // Don't throw error for welcome email failure, just log it
            } else {
                console.log('Welcome email sent successfully');
            }

            console.log('Subscription saved to Airtable:', data);
            return true;
        } catch (error) {
            console.error('Error saving subscription:', error);
            throw error;
        }
    },

    addLoadingState: function() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.innerHTML = `
            <span class="flex items-center justify-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Launching...
            </span>
        `;
        submitBtn.disabled = true;
    },

    removeLoadingState: function() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.innerHTML = `
            <span class="flex items-center justify-center">
                <i class="fas fa-rocket mr-2"></i>
                Launch My Newsletter
            </span>
        `;
        this.updateSubmitButton();
    },

    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 transform translate-x-full`;
        
        if (type === 'error') {
            notification.className += ' bg-red-500/20 border-red-500/30 text-red-300';
        } else {
            notification.className += ' bg-accent/20 border-accent/30 text-accent';
        }
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    },

    init: function() {
        this.setupEventListeners();
        this.setupSearchFunctionality();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    StocksBrew.init();
}); 