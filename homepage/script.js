const AIRTABLE_CONFIG = {
    apiKey: 'patAQ44oTB9EfY3vo.accf866ae6fd479bc292faaecd3c96f857e9e2d84c69364b041b40c88efe197d',
    baseId: 'app3Pnv4423RRK52w',
    tableName: 'tblptL5RJrvRLAWzg'
};

const INDIAN_STOCKS = [
    {
      "symbol": "360ONE",
      "name": "360 ONE WAM Ltd."
    },
    {
      "symbol": "3MINDIA",
      "name": "3M India Ltd."
    },
    {
      "symbol": "ABB",
      "name": "ABB India Ltd."
    },
    {
      "symbol": "ACC",
      "name": "ACC Ltd."
    },
    {
      "symbol": "ACMESOLAR",
      "name": "ACME Solar Holdings Ltd."
    },
    {
      "symbol": "AIAENG",
      "name": "AIA Engineering Ltd."
    },
    {
      "symbol": "APLAPOLLO",
      "name": "APL Apollo Tubes Ltd."
    },
    {
      "symbol": "AUBANK",
      "name": "AU Small Finance Bank Ltd."
    },
    {
      "symbol": "AWL",
      "name": "AWL Agri Business Ltd."
    },
    {
      "symbol": "AADHARHFC",
      "name": "Aadhar Housing Finance Ltd."
    },
    {
      "symbol": "AARTIIND",
      "name": "Aarti Industries Ltd."
    },
    {
      "symbol": "AAVAS",
      "name": "Aavas Financiers Ltd."
    },
    {
      "symbol": "ABBOTINDIA",
      "name": "Abbott India Ltd."
    },
    {
      "symbol": "ACE",
      "name": "Action Construction Equipment Ltd."
    },
    {
      "symbol": "ADANIENSOL",
      "name": "Adani Energy Solutions Ltd."
    },
    {
      "symbol": "ADANIENT",
      "name": "Adani Enterprises Ltd."
    },
    {
      "symbol": "ADANIGREEN",
      "name": "Adani Green Energy Ltd."
    },
    {
      "symbol": "ADANIPORTS",
      "name": "Adani Ports and Special Economic Zone Ltd."
    },
    {
      "symbol": "ADANIPOWER",
      "name": "Adani Power Ltd."
    },
    {
      "symbol": "ATGL",
      "name": "Adani Total Gas Ltd."
    },
    {
      "symbol": "ABCAPITAL",
      "name": "Aditya Birla Capital Ltd."
    },
    {
      "symbol": "ABFRL",
      "name": "Aditya Birla Fashion and Retail Ltd."
    },
    {
      "symbol": "ABREL",
      "name": "Aditya Birla Real Estate Ltd."
    },
    {
      "symbol": "ABSLAMC",
      "name": "Aditya Birla Sun Life AMC Ltd."
    },
    {
      "symbol": "AEGISLOG",
      "name": "Aegis Logistics Ltd."
    },
    {
      "symbol": "AFCONS",
      "name": "Afcons Infrastructure Ltd."
    },
    {
      "symbol": "AFFLE",
      "name": "Affle 3i Ltd."
    },
    {
      "symbol": "AJANTPHARM",
      "name": "Ajanta Pharmaceuticals Ltd."
    },
    {
      "symbol": "AKUMS",
      "name": "Akums Drugs and Pharmaceuticals Ltd."
    },
    {
      "symbol": "APLLTD",
      "name": "Alembic Pharmaceuticals Ltd."
    },
    {
      "symbol": "ALIVUS",
      "name": "Alivus Life Sciences Ltd."
    },
    {
      "symbol": "ALKEM",
      "name": "Alkem Laboratories Ltd."
    },
    {
      "symbol": "ALKYLAMINE",
      "name": "Alkyl Amines Chemicals Ltd."
    },
    {
      "symbol": "ALOKINDS",
      "name": "Alok Industries Ltd."
    },
    {
      "symbol": "ARE&M",
      "name": "Amara Raja Energy & Mobility Ltd."
    },
    {
      "symbol": "AMBER",
      "name": "Amber Enterprises India Ltd."
    },
    {
      "symbol": "AMBUJACEM",
      "name": "Ambuja Cements Ltd."
    },
    {
      "symbol": "ANANDRATHI",
      "name": "Anand Rathi Wealth Ltd."
    },
    {
      "symbol": "ANANTRAJ",
      "name": "Anant Raj Ltd."
    },
    {
      "symbol": "ANGELONE",
      "name": "Angel One Ltd."
    },
    {
      "symbol": "APARINDS",
      "name": "Apar Industries Ltd."
    },
    {
      "symbol": "APOLLOHOSP",
      "name": "Apollo Hospitals Enterprise Ltd."
    },
    {
      "symbol": "APOLLOTYRE",
      "name": "Apollo Tyres Ltd."
    },
    {
      "symbol": "APTUS",
      "name": "Aptus Value Housing Finance India Ltd."
    },
    {
      "symbol": "ASAHIINDIA",
      "name": "Asahi India Glass Ltd."
    },
    {
      "symbol": "ASHOKLEY",
      "name": "Ashok Leyland Ltd."
    },
    {
      "symbol": "ASIANPAINT",
      "name": "Asian Paints Ltd."
    },
    {
      "symbol": "ASTERDM",
      "name": "Aster DM Healthcare Ltd."
    },
    {
      "symbol": "ASTRAZEN",
      "name": "AstraZenca Pharma India Ltd."
    },
    {
      "symbol": "ASTRAL",
      "name": "Astral Ltd."
    },
    {
      "symbol": "ATUL",
      "name": "Atul Ltd."
    },
    {
      "symbol": "AUROPHARMA",
      "name": "Aurobindo Pharma Ltd."
    },
    {
      "symbol": "AIIL",
      "name": "Authum Investment & Infrastructure Ltd."
    },
    {
      "symbol": "DMART",
      "name": "Avenue Supermarts Ltd."
    },
    {
      "symbol": "AXISBANK",
      "name": "Axis Bank Ltd."
    },
    {
      "symbol": "BASF",
      "name": "BASF India Ltd."
    },
    {
      "symbol": "BEML",
      "name": "BEML Ltd."
    },
    {
      "symbol": "BLS",
      "name": "BLS International Services Ltd."
    },
    {
      "symbol": "BSE",
      "name": "BSE Ltd."
    },
    {
      "symbol": "BAJAJ-AUTO",
      "name": "Bajaj Auto Ltd."
    },
    {
      "symbol": "BAJFINANCE",
      "name": "Bajaj Finance Ltd."
    },
    {
      "symbol": "BAJAJFINSV",
      "name": "Bajaj Finserv Ltd."
    },
    {
      "symbol": "BAJAJHLDNG",
      "name": "Bajaj Holdings & Investment Ltd."
    },
    {
      "symbol": "BAJAJHFL",
      "name": "Bajaj Housing Finance Ltd."
    },
    {
      "symbol": "BALKRISIND",
      "name": "Balkrishna Industries Ltd."
    },
    {
      "symbol": "BALRAMCHIN",
      "name": "Balrampur Chini Mills Ltd."
    },
    {
      "symbol": "BANDHANBNK",
      "name": "Bandhan Bank Ltd."
    },
    {
      "symbol": "BANKBARODA",
      "name": "Bank of Baroda"
    },
    {
      "symbol": "BANKINDIA",
      "name": "Bank of India"
    },
    {
      "symbol": "MAHABANK",
      "name": "Bank of Maharashtra"
    },
    {
      "symbol": "BATAINDIA",
      "name": "Bata India Ltd."
    },
    {
      "symbol": "BAYERCROP",
      "name": "Bayer Cropscience Ltd."
    },
    {
      "symbol": "BERGEPAINT",
      "name": "Berger Paints India Ltd."
    },
    {
      "symbol": "BDL",
      "name": "Bharat Dynamics Ltd."
    },
    {
      "symbol": "BEL",
      "name": "Bharat Electronics Ltd."
    },
    {
      "symbol": "BHARATFORG",
      "name": "Bharat Forge Ltd."
    },
    {
      "symbol": "BHEL",
      "name": "Bharat Heavy Electricals Ltd."
    },
    {
      "symbol": "BPCL",
      "name": "Bharat Petroleum Corporation Ltd."
    },
    {
      "symbol": "BHARTIARTL",
      "name": "Bharti Airtel Ltd."
    },
    {
      "symbol": "BHARTIHEXA",
      "name": "Bharti Hexacom Ltd."
    },
    {
      "symbol": "BIKAJI",
      "name": "Bikaji Foods International Ltd."
    },
    {
      "symbol": "BIOCON",
      "name": "Biocon Ltd."
    },
    {
      "symbol": "BSOFT",
      "name": "Birlasoft Ltd."
    },
    {
      "symbol": "BLUEDART",
      "name": "Blue Dart Express Ltd."
    },
    {
      "symbol": "BLUESTARCO",
      "name": "Blue Star Ltd."
    },
    {
      "symbol": "BBTC",
      "name": "Bombay Burmah Trading Corporation Ltd."
    },
    {
      "symbol": "BOSCHLTD",
      "name": "Bosch Ltd."
    },
    {
      "symbol": "FIRSTCRY",
      "name": "Brainbees Solutions Ltd."
    },
    {
      "symbol": "BRIGADE",
      "name": "Brigade Enterprises Ltd."
    },
    {
      "symbol": "BRITANNIA",
      "name": "Britannia Industries Ltd."
    },
    {
      "symbol": "MAPMYINDIA",
      "name": "C.E. Info Systems Ltd."
    },
    {
      "symbol": "CCL",
      "name": "CCL Products (I) Ltd."
    },
    {
      "symbol": "CESC",
      "name": "CESC Ltd."
    },
    {
      "symbol": "CGPOWER",
      "name": "CG Power and Industrial Solutions Ltd."
    },
    {
      "symbol": "CRISIL",
      "name": "CRISIL Ltd."
    },
    {
      "symbol": "CAMPUS",
      "name": "Campus Activewear Ltd."
    },
    {
      "symbol": "CANFINHOME",
      "name": "Can Fin Homes Ltd."
    },
    {
      "symbol": "CANBK",
      "name": "Canara Bank"
    },
    {
      "symbol": "CAPLIPOINT",
      "name": "Caplin Point Laboratories Ltd."
    },
    {
      "symbol": "CGCL",
      "name": "Capri Global Capital Ltd."
    },
    {
      "symbol": "CARBORUNIV",
      "name": "Carborundum Universal Ltd."
    },
    {
      "symbol": "CASTROLIND",
      "name": "Castrol India Ltd."
    },
    {
      "symbol": "CEATLTD",
      "name": "Ceat Ltd."
    },
    {
      "symbol": "CENTRALBK",
      "name": "Central Bank of India"
    },
    {
      "symbol": "CDSL",
      "name": "Central Depository Services (India) Ltd."
    },
    {
      "symbol": "CENTURYPLY",
      "name": "Century Plyboards (India) Ltd."
    },
    {
      "symbol": "CERA",
      "name": "Cera Sanitaryware Ltd"
    },
    {
      "symbol": "CHALET",
      "name": "Chalet Hotels Ltd."
    },
    {
      "symbol": "CHAMBLFERT",
      "name": "Chambal Fertilizers & Chemicals Ltd."
    },
    {
      "symbol": "CHENNPETRO",
      "name": "Chennai Petroleum Corporation Ltd."
    },
    {
      "symbol": "CHOLAHLDNG",
      "name": "Cholamandalam Financial Holdings Ltd."
    },
    {
      "symbol": "CHOLAFIN",
      "name": "Cholamandalam Investment and Finance Company Ltd."
    },
    {
      "symbol": "CIPLA",
      "name": "Cipla Ltd."
    },
    {
      "symbol": "CUB",
      "name": "City Union Bank Ltd."
    },
    {
      "symbol": "CLEAN",
      "name": "Clean Science and Technology Ltd."
    },
    {
      "symbol": "COALINDIA",
      "name": "Coal India Ltd."
    },
    {
      "symbol": "COCHINSHIP",
      "name": "Cochin Shipyard Ltd."
    },
    {
      "symbol": "COFORGE",
      "name": "Coforge Ltd."
    },
    {
      "symbol": "COHANCE",
      "name": "Cohance Lifesciences Ltd."
    },
    {
      "symbol": "COLPAL",
      "name": "Colgate Palmolive (India) Ltd."
    },
    {
      "symbol": "CAMS",
      "name": "Computer Age Management Services Ltd."
    },
    {
      "symbol": "CONCORDBIO",
      "name": "Concord Biotech Ltd."
    },
    {
      "symbol": "CONCOR",
      "name": "Container Corporation of India Ltd."
    },
    {
      "symbol": "COROMANDEL",
      "name": "Coromandel International Ltd."
    },
    {
      "symbol": "CRAFTSMAN",
      "name": "Craftsman Automation Ltd."
    },
    {
      "symbol": "CREDITACC",
      "name": "CreditAccess Grameen Ltd."
    },
    {
      "symbol": "CROMPTON",
      "name": "Crompton Greaves Consumer Electricals Ltd."
    },
    {
      "symbol": "CUMMINSIND",
      "name": "Cummins India Ltd."
    },
    {
      "symbol": "CYIENT",
      "name": "Cyient Ltd."
    },
    {
      "symbol": "DCMSHRIRAM",
      "name": "DCM Shriram Ltd."
    },
    {
      "symbol": "DLF",
      "name": "DLF Ltd."
    },
    {
      "symbol": "DOMS",
      "name": "DOMS Industries Ltd."
    },
    {
      "symbol": "DABUR",
      "name": "Dabur India Ltd."
    },
    {
      "symbol": "DALBHARAT",
      "name": "Dalmia Bharat Ltd."
    },
    {
      "symbol": "DATAPATTNS",
      "name": "Data Patterns (India) Ltd."
    },
    {
      "symbol": "DEEPAKFERT",
      "name": "Deepak Fertilisers & Petrochemicals Corp. Ltd."
    },
    {
      "symbol": "DEEPAKNTR",
      "name": "Deepak Nitrite Ltd."
    },
    {
      "symbol": "DELHIVERY",
      "name": "Delhivery Ltd."
    },
    {
      "symbol": "DEVYANI",
      "name": "Devyani International Ltd."
    },
    {
      "symbol": "DIVISLAB",
      "name": "Divi's Laboratories Ltd."
    },
    {
      "symbol": "DIXON",
      "name": "Dixon Technologies (India) Ltd."
    },
    {
      "symbol": "LALPATHLAB",
      "name": "Dr. Lal Path Labs Ltd."
    },
    {
      "symbol": "DRREDDY",
      "name": "Dr. Reddy's Laboratories Ltd."
    },
    {
      "symbol": "DUMMYABFRL",
      "name": "Dummy Aditya Birla Fashion and Retail Ltd."
    },
    {
      "symbol": "DUMMYSIEMS",
      "name": "Dummy Siemens Ltd."
    },
    {
      "symbol": "DUMMYRAYMN",
      "name": "Dummy2 Raymond Ltd."
    },
    {
      "symbol": "EIDPARRY",
      "name": "E.I.D. Parry (India) Ltd."
    },
    {
      "symbol": "EIHOTEL",
      "name": "EIH Ltd."
    },
    {
      "symbol": "EICHERMOT",
      "name": "Eicher Motors Ltd."
    },
    {
      "symbol": "ELECON",
      "name": "Elecon Engineering Co. Ltd."
    },
    {
      "symbol": "ELGIEQUIP",
      "name": "Elgi Equipments Ltd."
    },
    {
      "symbol": "EMAMILTD",
      "name": "Emami Ltd."
    },
    {
      "symbol": "EMCURE",
      "name": "Emcure Pharmaceuticals Ltd."
    },
    {
      "symbol": "ENDURANCE",
      "name": "Endurance Technologies Ltd."
    },
    {
      "symbol": "ENGINERSIN",
      "name": "Engineers India Ltd."
    },
    {
      "symbol": "ERIS",
      "name": "Eris Lifesciences Ltd."
    },
    {
      "symbol": "ESCORTS",
      "name": "Escorts Kubota Ltd."
    },
    {
      "symbol": "ETERNAL",
      "name": "Eternal Ltd."
    },
    {
      "symbol": "EXIDEIND",
      "name": "Exide Industries Ltd."
    },
    {
      "symbol": "NYKAA",
      "name": "FSN E-Commerce Ventures Ltd."
    },
    {
      "symbol": "FEDERALBNK",
      "name": "Federal Bank Ltd."
    },
    {
      "symbol": "FACT",
      "name": "Fertilisers and Chemicals Travancore Ltd."
    },
    {
      "symbol": "FINCABLES",
      "name": "Finolex Cables Ltd."
    },
    {
      "symbol": "FINPIPE",
      "name": "Finolex Industries Ltd."
    },
    {
      "symbol": "FSL",
      "name": "Firstsource Solutions Ltd."
    },
    {
      "symbol": "FIVESTAR",
      "name": "Five-Star Business Finance Ltd."
    },
    {
      "symbol": "FORTIS",
      "name": "Fortis Healthcare Ltd."
    },
    {
      "symbol": "GAIL",
      "name": "GAIL (India) Ltd."
    },
    {
      "symbol": "GVT&D",
      "name": "GE Vernova T&D India Ltd."
    },
    {
      "symbol": "GMRAIRPORT",
      "name": "GMR Airports Ltd."
    },
    {
      "symbol": "GRSE",
      "name": "Garden Reach Shipbuilders & Engineers Ltd."
    },
    {
      "symbol": "GICRE",
      "name": "General Insurance Corporation of India"
    },
    {
      "symbol": "GILLETTE",
      "name": "Gillette India Ltd."
    },
    {
      "symbol": "GLAND",
      "name": "Gland Pharma Ltd."
    },
    {
      "symbol": "GLAXO",
      "name": "Glaxosmithkline Pharmaceuticals Ltd."
    },
    {
      "symbol": "GLENMARK",
      "name": "Glenmark Pharmaceuticals Ltd."
    },
    {
      "symbol": "MEDANTA",
      "name": "Global Health Ltd."
    },
    {
      "symbol": "GODIGIT",
      "name": "Go Digit General Insurance Ltd."
    },
    {
      "symbol": "GPIL",
      "name": "Godawari Power & Ispat Ltd."
    },
    {
      "symbol": "GODFRYPHLP",
      "name": "Godfrey Phillips India Ltd."
    },
    {
      "symbol": "GODREJAGRO",
      "name": "Godrej Agrovet Ltd."
    },
    {
      "symbol": "GODREJCP",
      "name": "Godrej Consumer Products Ltd."
    },
    {
      "symbol": "GODREJIND",
      "name": "Godrej Industries Ltd."
    },
    {
      "symbol": "GODREJPROP",
      "name": "Godrej Properties Ltd."
    },
    {
      "symbol": "GRANULES",
      "name": "Granules India Ltd."
    },
    {
      "symbol": "GRAPHITE",
      "name": "Graphite India Ltd."
    },
    {
      "symbol": "GRASIM",
      "name": "Grasim Industries Ltd."
    },
    {
      "symbol": "GRAVITA",
      "name": "Gravita India Ltd."
    },
    {
      "symbol": "GESHIP",
      "name": "Great Eastern Shipping Co. Ltd."
    },
    {
      "symbol": "FLUOROCHEM",
      "name": "Gujarat Fluorochemicals Ltd."
    },
    {
      "symbol": "GUJGASLTD",
      "name": "Gujarat Gas Ltd."
    },
    {
      "symbol": "GMDCLTD",
      "name": "Gujarat Mineral Development Corporation Ltd."
    },
    {
      "symbol": "GNFC",
      "name": "Gujarat Narmada Valley Fertilizers and Chemicals Ltd."
    },
    {
      "symbol": "GPPL",
      "name": "Gujarat Pipavav Port Ltd."
    },
    {
      "symbol": "GSPL",
      "name": "Gujarat State Petronet Ltd."
    },
    {
      "symbol": "HEG",
      "name": "H.E.G. Ltd."
    },
    {
      "symbol": "HBLENGINE",
      "name": "HBL Engineering Ltd."
    },
    {
      "symbol": "HCLTECH",
      "name": "HCL Technologies Ltd."
    },
    {
      "symbol": "HDFCAMC",
      "name": "HDFC Asset Management Company Ltd."
    },
    {
      "symbol": "HDFCBANK",
      "name": "HDFC Bank Ltd."
    },
    {
      "symbol": "HDFCLIFE",
      "name": "HDFC Life Insurance Company Ltd."
    },
    {
      "symbol": "HFCL",
      "name": "HFCL Ltd."
    },
    {
      "symbol": "HAPPSTMNDS",
      "name": "Happiest Minds Technologies Ltd."
    },
    {
      "symbol": "HAVELLS",
      "name": "Havells India Ltd."
    },
    {
      "symbol": "HEROMOTOCO",
      "name": "Hero MotoCorp Ltd."
    },
    {
      "symbol": "HSCL",
      "name": "Himadri Speciality Chemical Ltd."
    },
    {
      "symbol": "HINDALCO",
      "name": "Hindalco Industries Ltd."
    },
    {
      "symbol": "HAL",
      "name": "Hindustan Aeronautics Ltd."
    },
    {
      "symbol": "HINDCOPPER",
      "name": "Hindustan Copper Ltd."
    },
    {
      "symbol": "HINDPETRO",
      "name": "Hindustan Petroleum Corporation Ltd."
    },
    {
      "symbol": "HINDUNILVR",
      "name": "Hindustan Unilever Ltd."
    },
    {
      "symbol": "HINDZINC",
      "name": "Hindustan Zinc Ltd."
    },
    {
      "symbol": "POWERINDIA",
      "name": "Hitachi Energy India Ltd."
    },
    {
      "symbol": "HOMEFIRST",
      "name": "Home First Finance Company India Ltd."
    },
    {
      "symbol": "HONASA",
      "name": "Honasa Consumer Ltd."
    },
    {
      "symbol": "HONAUT",
      "name": "Honeywell Automation India Ltd."
    },
    {
      "symbol": "HUDCO",
      "name": "Housing & Urban Development Corporation Ltd."
    },
    {
      "symbol": "HYUNDAI",
      "name": "Hyundai Motor India Ltd."
    },
    {
      "symbol": "ICICIBANK",
      "name": "ICICI Bank Ltd."
    },
    {
      "symbol": "ICICIGI",
      "name": "ICICI Lombard General Insurance Company Ltd."
    },
    {
      "symbol": "ICICIPRULI",
      "name": "ICICI Prudential Life Insurance Company Ltd."
    },
    {
      "symbol": "IDBI",
      "name": "IDBI Bank Ltd."
    },
    {
      "symbol": "IDFCFIRSTB",
      "name": "IDFC First Bank Ltd."
    },
    {
      "symbol": "IFCI",
      "name": "IFCI Ltd."
    },
    {
      "symbol": "IIFL",
      "name": "IIFL Finance Ltd."
    },
    {
      "symbol": "INOXINDIA",
      "name": "INOX India Ltd."
    },
    {
      "symbol": "IRB",
      "name": "IRB Infrastructure Developers Ltd."
    },
    {
      "symbol": "IRCON",
      "name": "IRCON International Ltd."
    },
    {
      "symbol": "ITC",
      "name": "ITC Ltd."
    },
    {
      "symbol": "ITI",
      "name": "ITI Ltd."
    },
    {
      "symbol": "INDGN",
      "name": "Indegene Ltd."
    },
    {
      "symbol": "INDIACEM",
      "name": "India Cements Ltd."
    },
    {
      "symbol": "INDIAMART",
      "name": "Indiamart Intermesh Ltd."
    },
    {
      "symbol": "INDIANB",
      "name": "Indian Bank"
    },
    {
      "symbol": "IEX",
      "name": "Indian Energy Exchange Ltd."
    },
    {
      "symbol": "INDHOTEL",
      "name": "Indian Hotels Co. Ltd."
    },
    {
      "symbol": "IOC",
      "name": "Indian Oil Corporation Ltd."
    },
    {
      "symbol": "IOB",
      "name": "Indian Overseas Bank"
    },
    {
      "symbol": "IRCTC",
      "name": "Indian Railway Catering And Tourism Corporation Ltd."
    },
    {
      "symbol": "IRFC",
      "name": "Indian Railway Finance Corporation Ltd."
    },
    {
      "symbol": "IREDA",
      "name": "Indian Renewable Energy Development Agency Ltd."
    },
    {
      "symbol": "IGL",
      "name": "Indraprastha Gas Ltd."
    },
    {
      "symbol": "INDUSTOWER",
      "name": "Indus Towers Ltd."
    },
    {
      "symbol": "INDUSINDBK",
      "name": "IndusInd Bank Ltd."
    },
    {
      "symbol": "NAUKRI",
      "name": "Info Edge (India) Ltd."
    },
    {
      "symbol": "INFY",
      "name": "Infosys Ltd."
    },
    {
      "symbol": "INOXWIND",
      "name": "Inox Wind Ltd."
    },
    {
      "symbol": "INTELLECT",
      "name": "Intellect Design Arena Ltd."
    },
    {
      "symbol": "INDIGO",
      "name": "InterGlobe Aviation Ltd."
    },
    {
      "symbol": "IGIL",
      "name": "International Gemmological Institute (India) Ltd."
    },
    {
      "symbol": "IKS",
      "name": "Inventurus Knowledge Solutions Ltd."
    },
    {
      "symbol": "IPCALAB",
      "name": "Ipca Laboratories Ltd."
    },
    {
      "symbol": "JBCHEPHARM",
      "name": "J.B. Chemicals & Pharmaceuticals Ltd."
    },
    {
      "symbol": "JKCEMENT",
      "name": "J.K. Cement Ltd."
    },
    {
      "symbol": "JBMA",
      "name": "JBM Auto Ltd."
    },
    {
      "symbol": "JKTYRE",
      "name": "JK Tyre & Industries Ltd."
    },
    {
      "symbol": "JMFINANCIL",
      "name": "JM Financial Ltd."
    },
    {
      "symbol": "JSWENERGY",
      "name": "JSW Energy Ltd."
    },
    {
      "symbol": "JSWHL",
      "name": "JSW Holdings Ltd."
    },
    {
      "symbol": "JSWINFRA",
      "name": "JSW Infrastructure Ltd."
    },
    {
      "symbol": "JSWSTEEL",
      "name": "JSW Steel Ltd."
    },
    {
      "symbol": "JPPOWER",
      "name": "Jaiprakash Power Ventures Ltd."
    },
    {
      "symbol": "J&KBANK",
      "name": "Jammu & Kashmir Bank Ltd."
    },
    {
      "symbol": "JINDALSAW",
      "name": "Jindal Saw Ltd."
    },
    {
      "symbol": "JSL",
      "name": "Jindal Stainless Ltd."
    },
    {
      "symbol": "JINDALSTEL",
      "name": "Jindal Steel & Power Ltd."
    },
    {
      "symbol": "JIOFIN",
      "name": "Jio Financial Services Ltd."
    },
    {
      "symbol": "JUBLFOOD",
      "name": "Jubilant Foodworks Ltd."
    },
    {
      "symbol": "JUBLINGREA",
      "name": "Jubilant Ingrevia Ltd."
    },
    {
      "symbol": "JUBLPHARMA",
      "name": "Jubilant Pharmova Ltd."
    },
    {
      "symbol": "JWL",
      "name": "Jupiter Wagons Ltd."
    },
    {
      "symbol": "JUSTDIAL",
      "name": "Justdial Ltd."
    },
    {
      "symbol": "JYOTHYLAB",
      "name": "Jyothy Labs Ltd."
    },
    {
      "symbol": "JYOTICNC",
      "name": "Jyoti CNC Automation Ltd."
    },
    {
      "symbol": "KPRMILL",
      "name": "K.P.R. Mill Ltd."
    },
    {
      "symbol": "KEI",
      "name": "KEI Industries Ltd."
    },
    {
      "symbol": "KNRCON",
      "name": "KNR Constructions Ltd."
    },
    {
      "symbol": "KPITTECH",
      "name": "KPIT Technologies Ltd."
    },
    {
      "symbol": "KAJARIACER",
      "name": "Kajaria Ceramics Ltd."
    },
    {
      "symbol": "KPIL",
      "name": "Kalpataru Projects International Ltd."
    },
    {
      "symbol": "KALYANKJIL",
      "name": "Kalyan Jewellers India Ltd."
    },
    {
      "symbol": "KANSAINER",
      "name": "Kansai Nerolac Paints Ltd."
    },
    {
      "symbol": "KARURVYSYA",
      "name": "Karur Vysya Bank Ltd."
    },
    {
      "symbol": "KAYNES",
      "name": "Kaynes Technology India Ltd."
    },
    {
      "symbol": "KEC",
      "name": "Kec International Ltd."
    },
    {
      "symbol": "KFINTECH",
      "name": "Kfin Technologies Ltd."
    },
    {
      "symbol": "KIRLOSBROS",
      "name": "Kirloskar Brothers Ltd."
    },
    {
      "symbol": "KIRLOSENG",
      "name": "Kirloskar Oil Eng Ltd."
    },
    {
      "symbol": "KOTAKBANK",
      "name": "Kotak Mahindra Bank Ltd."
    },
    {
      "symbol": "KIMS",
      "name": "Krishna Institute of Medical Sciences Ltd."
    },
    {
      "symbol": "LTF",
      "name": "L&T Finance Ltd."
    },
    {
      "symbol": "LTTS",
      "name": "L&T Technology Services Ltd."
    },
    {
      "symbol": "LICHSGFIN",
      "name": "LIC Housing Finance Ltd."
    },
    {
      "symbol": "LTFOODS",
      "name": "LT Foods Ltd."
    },
    {
      "symbol": "LTIM",
      "name": "LTIMindtree Ltd."
    },
    {
      "symbol": "LT",
      "name": "Larsen & Toubro Ltd."
    },
    {
      "symbol": "LATENTVIEW",
      "name": "Latent View Analytics Ltd."
    },
    {
      "symbol": "LAURUSLABS",
      "name": "Laurus Labs Ltd."
    },
    {
      "symbol": "LEMONTREE",
      "name": "Lemon Tree Hotels Ltd."
    },
    {
      "symbol": "LICI",
      "name": "Life Insurance Corporation of India"
    },
    {
      "symbol": "LINDEINDIA",
      "name": "Linde India Ltd."
    },
    {
      "symbol": "LLOYDSME",
      "name": "Lloyds Metals And Energy Ltd."
    },
    {
      "symbol": "LUPIN",
      "name": "Lupin Ltd."
    },
    {
      "symbol": "MMTC",
      "name": "MMTC Ltd."
    },
    {
      "symbol": "MRF",
      "name": "MRF Ltd."
    },
    {
      "symbol": "LODHA",
      "name": "Macrotech Developers Ltd."
    },
    {
      "symbol": "MGL",
      "name": "Mahanagar Gas Ltd."
    },
    {
      "symbol": "MAHSEAMLES",
      "name": "Maharashtra Seamless Ltd."
    },
    {
      "symbol": "M&MFIN",
      "name": "Mahindra & Mahindra Financial Services Ltd."
    },
    {
      "symbol": "M&M",
      "name": "Mahindra & Mahindra Ltd."
    },
    {
      "symbol": "MANAPPURAM",
      "name": "Manappuram Finance Ltd."
    },
    {
      "symbol": "MRPL",
      "name": "Mangalore Refinery & Petrochemicals Ltd."
    },
    {
      "symbol": "MANKIND",
      "name": "Mankind Pharma Ltd."
    },
    {
      "symbol": "MARICO",
      "name": "Marico Ltd."
    },
    {
      "symbol": "MARUTI",
      "name": "Maruti Suzuki India Ltd."
    },
    {
      "symbol": "MASTEK",
      "name": "Mastek Ltd."
    },
    {
      "symbol": "MFSL",
      "name": "Max Financial Services Ltd."
    },
    {
      "symbol": "MAXHEALTH",
      "name": "Max Healthcare Institute Ltd."
    },
    {
      "symbol": "MAZDOCK",
      "name": "Mazagoan Dock Shipbuilders Ltd."
    },
    {
      "symbol": "METROPOLIS",
      "name": "Metropolis Healthcare Ltd."
    },
    {
      "symbol": "MINDACORP",
      "name": "Minda Corporation Ltd."
    },
    {
      "symbol": "MSUMI",
      "name": "Motherson Sumi Wiring India Ltd."
    },
    {
      "symbol": "MOTILALOFS",
      "name": "Motilal Oswal Financial Services Ltd."
    },
    {
      "symbol": "MPHASIS",
      "name": "MphasiS Ltd."
    },
    {
      "symbol": "MCX",
      "name": "Multi Commodity Exchange of India Ltd."
    },
    {
      "symbol": "MUTHOOTFIN",
      "name": "Muthoot Finance Ltd."
    },
    {
      "symbol": "NATCOPHARM",
      "name": "NATCO Pharma Ltd."
    },
    {
      "symbol": "NBCC",
      "name": "NBCC (India) Ltd."
    },
    {
      "symbol": "NCC",
      "name": "NCC Ltd."
    },
    {
      "symbol": "NHPC",
      "name": "NHPC Ltd."
    },
    {
      "symbol": "NLCINDIA",
      "name": "NLC India Ltd."
    },
    {
      "symbol": "NMDC",
      "name": "NMDC Ltd."
    },
    {
      "symbol": "NSLNISP",
      "name": "NMDC Steel Ltd."
    },
    {
      "symbol": "NTPCGREEN",
      "name": "NTPC Green Energy Ltd."
    },
    {
      "symbol": "NTPC",
      "name": "NTPC Ltd."
    },
    {
      "symbol": "NH",
      "name": "Narayana Hrudayalaya Ltd."
    },
    {
      "symbol": "NATIONALUM",
      "name": "National Aluminium Co. Ltd."
    },
    {
      "symbol": "NAVA",
      "name": "Nava Ltd."
    },
    {
      "symbol": "NAVINFLUOR",
      "name": "Navin Fluorine International Ltd."
    },
    {
      "symbol": "NESTLEIND",
      "name": "Nestle India Ltd."
    },
    {
      "symbol": "NETWEB",
      "name": "Netweb Technologies India Ltd."
    },
    {
      "symbol": "NETWORK18",
      "name": "Network18 Media & Investments Ltd."
    },
    {
      "symbol": "NEULANDLAB",
      "name": "Neuland Laboratories Ltd."
    },
    {
      "symbol": "NEWGEN",
      "name": "Newgen Software Technologies Ltd."
    },
    {
      "symbol": "NAM-INDIA",
      "name": "Nippon Life India Asset Management Ltd."
    },
    {
      "symbol": "NIVABUPA",
      "name": "Niva Bupa Health Insurance Company Ltd."
    },
    {
      "symbol": "NUVAMA",
      "name": "Nuvama Wealth Management Ltd."
    },
    {
      "symbol": "OBEROIRLTY",
      "name": "Oberoi Realty Ltd."
    },
    {
      "symbol": "ONGC",
      "name": "Oil & Natural Gas Corporation Ltd."
    },
    {
      "symbol": "OIL",
      "name": "Oil India Ltd."
    },
    {
      "symbol": "OLAELEC",
      "name": "Ola Electric Mobility Ltd."
    },
    {
      "symbol": "OLECTRA",
      "name": "Olectra Greentech Ltd."
    },
    {
      "symbol": "PAYTM",
      "name": "One 97 Communications Ltd."
    },
    {
      "symbol": "OFSS",
      "name": "Oracle Financial Services Software Ltd."
    },
    {
      "symbol": "POLICYBZR",
      "name": "PB Fintech Ltd."
    },
    {
      "symbol": "PCBL",
      "name": "PCBL Chemical Ltd."
    },
    {
      "symbol": "PGEL",
      "name": "PG Electroplast Ltd."
    },
    {
      "symbol": "PIIND",
      "name": "PI Industries Ltd."
    },
    {
      "symbol": "PNBHOUSING",
      "name": "PNB Housing Finance Ltd."
    },
    {
      "symbol": "PNCINFRA",
      "name": "PNC Infratech Ltd."
    },
    {
      "symbol": "PTCIL",
      "name": "PTC Industries Ltd."
    },
    {
      "symbol": "PVRINOX",
      "name": "PVR INOX Ltd."
    },
    {
      "symbol": "PAGEIND",
      "name": "Page Industries Ltd."
    },
    {
      "symbol": "PATANJALI",
      "name": "Patanjali Foods Ltd."
    },
    {
      "symbol": "PERSISTENT",
      "name": "Persistent Systems Ltd."
    },
    {
      "symbol": "PETRONET",
      "name": "Petronet LNG Ltd."
    },
    {
      "symbol": "PFIZER",
      "name": "Pfizer Ltd."
    },
    {
      "symbol": "PHOENIXLTD",
      "name": "Phoenix Mills Ltd."
    },
    {
      "symbol": "PIDILITIND",
      "name": "Pidilite Industries Ltd."
    },
    {
      "symbol": "PEL",
      "name": "Piramal Enterprises Ltd."
    },
    {
      "symbol": "PPLPHARMA",
      "name": "Piramal Pharma Ltd."
    },
    {
      "symbol": "POLYMED",
      "name": "Poly Medicure Ltd."
    },
    {
      "symbol": "POLYCAB",
      "name": "Polycab India Ltd."
    },
    {
      "symbol": "POONAWALLA",
      "name": "Poonawalla Fincorp Ltd."
    },
    {
      "symbol": "PFC",
      "name": "Power Finance Corporation Ltd."
    },
    {
      "symbol": "POWERGRID",
      "name": "Power Grid Corporation of India Ltd."
    },
    {
      "symbol": "PRAJIND",
      "name": "Praj Industries Ltd."
    },
    {
      "symbol": "PREMIERENE",
      "name": "Premier Energies Ltd."
    },
    {
      "symbol": "PRESTIGE",
      "name": "Prestige Estates Projects Ltd."
    },
    {
      "symbol": "PNB",
      "name": "Punjab National Bank"
    },
    {
      "symbol": "RRKABEL",
      "name": "R R Kabel Ltd."
    },
    {
      "symbol": "RBLBANK",
      "name": "RBL Bank Ltd."
    },
    {
      "symbol": "RECLTD",
      "name": "REC Ltd."
    },
    {
      "symbol": "RHIM",
      "name": "RHI MAGNESITA INDIA LTD."
    },
    {
      "symbol": "RITES",
      "name": "RITES Ltd."
    },
    {
      "symbol": "RADICO",
      "name": "Radico Khaitan Ltd"
    },
    {
      "symbol": "RVNL",
      "name": "Rail Vikas Nigam Ltd."
    },
    {
      "symbol": "RAILTEL",
      "name": "Railtel Corporation Of India Ltd."
    },
    {
      "symbol": "RAINBOW",
      "name": "Rainbow Childrens Medicare Ltd."
    },
    {
      "symbol": "RKFORGE",
      "name": "Ramkrishna Forgings Ltd."
    },
    {
      "symbol": "RCF",
      "name": "Rashtriya Chemicals & Fertilizers Ltd."
    },
    {
      "symbol": "RTNINDIA",
      "name": "RattanIndia Enterprises Ltd."
    },
    {
      "symbol": "RAYMONDLSL",
      "name": "Raymond Lifestyle Ltd."
    },
    {
      "symbol": "RAYMOND",
      "name": "Raymond Ltd."
    },
    {
      "symbol": "REDINGTON",
      "name": "Redington Ltd."
    },
    {
      "symbol": "RELIANCE",
      "name": "Reliance Industries Ltd."
    },
    {
      "symbol": "RPOWER",
      "name": "Reliance Power Ltd."
    },
    {
      "symbol": "ROUTE",
      "name": "Route Mobile Ltd."
    },
    {
      "symbol": "SBFC",
      "name": "SBFC Finance Ltd."
    },
    {
      "symbol": "SBICARD",
      "name": "SBI Cards and Payment Services Ltd."
    },
    {
      "symbol": "SBILIFE",
      "name": "SBI Life Insurance Company Ltd."
    },
    {
      "symbol": "SJVN",
      "name": "SJVN Ltd."
    },
    {
      "symbol": "SKFINDIA",
      "name": "SKF India Ltd."
    },
    {
      "symbol": "SRF",
      "name": "SRF Ltd."
    },
    {
      "symbol": "SAGILITY",
      "name": "Sagility India Ltd."
    },
    {
      "symbol": "SAILIFE",
      "name": "Sai Life Sciences Ltd."
    },
    {
      "symbol": "SAMMAANCAP",
      "name": "Sammaan Capital Ltd."
    },
    {
      "symbol": "MOTHERSON",
      "name": "Samvardhana Motherson International Ltd."
    },
    {
      "symbol": "SAPPHIRE",
      "name": "Sapphire Foods India Ltd."
    },
    {
      "symbol": "SARDAEN",
      "name": "Sarda Energy and Minerals Ltd."
    },
    {
      "symbol": "SAREGAMA",
      "name": "Saregama India Ltd"
    },
    {
      "symbol": "SCHAEFFLER",
      "name": "Schaeffler India Ltd."
    },
    {
      "symbol": "SCHNEIDER",
      "name": "Schneider Electric Infrastructure Ltd."
    },
    {
      "symbol": "SCI",
      "name": "Shipping Corporation of India Ltd."
    },
    {
      "symbol": "SHREECEM",
      "name": "Shree Cement Ltd."
    },
    {
      "symbol": "RENUKA",
      "name": "Shree Renuka Sugars Ltd."
    },
    {
      "symbol": "SHRIRAMFIN",
      "name": "Shriram Finance Ltd."
    },
    {
      "symbol": "SHYAMMETL",
      "name": "Shyam Metalics and Energy Ltd."
    },
    {
      "symbol": "SIEMENS",
      "name": "Siemens Ltd."
    },
    {
      "symbol": "SIGNATURE",
      "name": "Signatureglobal (India) Ltd."
    },
    {
      "symbol": "SOBHA",
      "name": "Sobha Ltd."
    },
    {
      "symbol": "SOLARINDS",
      "name": "Solar Industries India Ltd."
    },
    {
      "symbol": "SONACOMS",
      "name": "Sona BLW Precision Forgings Ltd."
    },
    {
      "symbol": "SONATSOFTW",
      "name": "Sonata Software Ltd."
    },
    {
      "symbol": "STARHEALTH",
      "name": "Star Health and Allied Insurance Company Ltd."
    },
    {
      "symbol": "SBIN",
      "name": "State Bank of India"
    },
    {
      "symbol": "SAIL",
      "name": "Steel Authority of India Ltd."
    },
    {
      "symbol": "SWSOLAR",
      "name": "Sterling and Wilson Renewable Energy Ltd."
    },
    {
      "symbol": "SUMICHEM",
      "name": "Sumitomo Chemical India Ltd."
    },
    {
      "symbol": "SUNPHARMA",
      "name": "Sun Pharmaceutical Industries Ltd."
    },
    {
      "symbol": "SUNTV",
      "name": "Sun TV Network Ltd."
    },
    {
      "symbol": "SUNDARMFIN",
      "name": "Sundaram Finance Ltd."
    },
    {
      "symbol": "SUNDRMFAST",
      "name": "Sundram Fasteners Ltd."
    },
    {
      "symbol": "SUPREMEIND",
      "name": "Supreme Industries Ltd."
    },
    {
      "symbol": "SUZLON",
      "name": "Suzlon Energy Ltd."
    },
    {
      "symbol": "SWANENERGY",
      "name": "Swan Energy Ltd."
    },
    {
      "symbol": "SWIGGY",
      "name": "Swiggy Ltd."
    },
    {
      "symbol": "SYNGENE",
      "name": "Syngene International Ltd."
    },
    {
      "symbol": "SYRMA",
      "name": "Syrma SGS Technology Ltd."
    },
    {
      "symbol": "TBOTEK",
      "name": "TBO Tek Ltd."
    },
    {
      "symbol": "TVSMOTOR",
      "name": "TVS Motor Company Ltd."
    },
    {
      "symbol": "TANLA",
      "name": "Tanla Platforms Ltd."
    },
    {
      "symbol": "TATACHEM",
      "name": "Tata Chemicals Ltd."
    },
    {
      "symbol": "TATACOMM",
      "name": "Tata Communications Ltd."
    },
    {
      "symbol": "TCS",
      "name": "Tata Consultancy Services Ltd."
    },
    {
      "symbol": "TATACONSUM",
      "name": "Tata Consumer Products Ltd."
    },
    {
      "symbol": "TATAELXSI",
      "name": "Tata Elxsi Ltd."
    },
    {
      "symbol": "TATAINVEST",
      "name": "Tata Investment Corporation Ltd."
    },
    {
      "symbol": "TATAMOTORS",
      "name": "Tata Motors Ltd."
    },
    {
      "symbol": "TATAPOWER",
      "name": "Tata Power Co. Ltd."
    },
    {
      "symbol": "TATASTEEL",
      "name": "Tata Steel Ltd."
    },
    {
      "symbol": "TATATECH",
      "name": "Tata Technologies Ltd."
    },
    {
      "symbol": "TTML",
      "name": "Tata Teleservices (Maharashtra) Ltd."
    },
    {
      "symbol": "TECHM",
      "name": "Tech Mahindra Ltd."
    },
    {
      "symbol": "TECHNOE",
      "name": "Techno Electric & Engineering Company Ltd."
    },
    {
      "symbol": "TEJASNET",
      "name": "Tejas Networks Ltd."
    },
    {
      "symbol": "NIACL",
      "name": "The New India Assurance Company Ltd."
    },
    {
      "symbol": "RAMCOCEM",
      "name": "The Ramco Cements Ltd."
    },
    {
      "symbol": "THERMAX",
      "name": "Thermax Ltd."
    },
    {
      "symbol": "TIMKEN",
      "name": "Timken India Ltd."
    },
    {
      "symbol": "TITAGARH",
      "name": "Titagarh Rail Systems Ltd."
    },
    {
      "symbol": "TITAN",
      "name": "Titan Company Ltd."
    },
    {
      "symbol": "TORNTPHARM",
      "name": "Torrent Pharmaceuticals Ltd."
    },
    {
      "symbol": "TORNTPOWER",
      "name": "Torrent Power Ltd."
    },
    {
      "symbol": "TARIL",
      "name": "Transformers And Rectifiers (India) Ltd."
    },
    {
      "symbol": "TRENT",
      "name": "Trent Ltd."
    },
    {
      "symbol": "TRIDENT",
      "name": "Trident Ltd."
    },
    {
      "symbol": "TRIVENI",
      "name": "Triveni Engineering & Industries Ltd."
    },
    {
      "symbol": "TRITURBINE",
      "name": "Triveni Turbine Ltd."
    },
    {
      "symbol": "TIINDIA",
      "name": "Tube Investments of India Ltd."
    },
    {
      "symbol": "UCOBANK",
      "name": "UCO Bank"
    },
    {
      "symbol": "UNOMINDA",
      "name": "UNO Minda Ltd."
    },
    {
      "symbol": "UPL",
      "name": "UPL Ltd."
    },
    {
      "symbol": "UTIAMC",
      "name": "UTI Asset Management Company Ltd."
    },
    {
      "symbol": "ULTRACEMCO",
      "name": "UltraTech Cement Ltd."
    },
    {
      "symbol": "UNIONBANK",
      "name": "Union Bank of India"
    },
    {
      "symbol": "UBL",
      "name": "United Breweries Ltd."
    },
    {
      "symbol": "UNITDSPR",
      "name": "United Spirits Ltd."
    },
    {
      "symbol": "USHAMART",
      "name": "Usha Martin Ltd."
    },
    {
      "symbol": "VGUARD",
      "name": "V-Guard Industries Ltd."
    },
    {
      "symbol": "DBREALTY",
      "name": "Valor Estate Ltd."
    },
    {
      "symbol": "VTL",
      "name": "Vardhman Textiles Ltd."
    },
    {
      "symbol": "VBL",
      "name": "Varun Beverages Ltd."
    },
    {
      "symbol": "MANYAVAR",
      "name": "Vedant Fashions Ltd."
    },
    {
      "symbol": "VEDL",
      "name": "Vedanta Ltd."
    },
    {
      "symbol": "VIJAYA",
      "name": "Vijaya Diagnostic Centre Ltd."
    },
    {
      "symbol": "VMM",
      "name": "Vishal Mega Mart Ltd."
    },
    {
      "symbol": "IDEA",
      "name": "Vodafone Idea Ltd."
    },
    {
      "symbol": "VOLTAS",
      "name": "Voltas Ltd."
    },
    {
      "symbol": "WAAREEENER",
      "name": "Waaree Energies Ltd."
    },
    {
      "symbol": "WELCORP",
      "name": "Welspun Corp Ltd."
    },
    {
      "symbol": "WELSPUNLIV",
      "name": "Welspun Living Ltd."
    },
    {
      "symbol": "WESTLIFE",
      "name": "Westlife Foodworld Ltd."
    },
    {
      "symbol": "WHIRLPOOL",
      "name": "Whirlpool of India Ltd."
    },
    {
      "symbol": "WIPRO",
      "name": "Wipro Ltd."
    },
    {
      "symbol": "WOCKPHARMA",
      "name": "Wockhardt Ltd."
    },
    {
      "symbol": "YESBANK",
      "name": "Yes Bank Ltd."
    },
    {
      "symbol": "ZFCVINDIA",
      "name": "ZF Commercial Vehicle Control Systems India Ltd."
    },
    {
      "symbol": "ZEEL",
      "name": "Zee Entertainment Enterprises Ltd."
    },
    {
      "symbol": "ZENTEC",
      "name": "Zen Technologies Ltd."
    },
    {
      "symbol": "ZENSARTECH",
      "name": "Zensar Technolgies Ltd."
    },
    {
      "symbol": "ZYDUSLIFE",
      "name": "Zydus Lifesciences Ltd."
    },
    {
      "symbol": "ECLERX",
      "name": "eClerx Services Ltd."
    }
]

// Create a global object to hold all our functions
window.StocksBrew = {
    selectedStocks: new Set(),
    searchTimeout: null,
    MAX_STOCKS: 10,

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
            // const welcomeResponse = await fetch('/api/subscribe', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         email: data.email
            //     })
            // });

            // if (!welcomeResponse.ok) {
            //     const errorData = await welcomeResponse.json();
            //     console.warn('Welcome email failed:', errorData.message);
            //     // Don't throw error for welcome email failure, just log it
            // } else {
            //     console.log('Welcome email sent successfully');
            // }

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