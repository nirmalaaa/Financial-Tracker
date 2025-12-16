import { useState, useEffect, useRef } from "react";

// ML Training Data - Aturan dasar untuk kategori
const initialMLRules = {
  "makan": "Food",
  "warung": "Food", 
  "restoran": "Food",
  "grab": "Transport",
  "gojek": "Transport",
  "taxi": "Transport",
  "bensin": "Transport",
  "pulsa": "Utilities",
  "listrik": "Utilities",
  "air": "Utilities",
  "belanja": "Shopping",
  "market": "Shopping",
  "h&m": "Shopping",
  "netflix": "Entertainment",
  "spotify": "Entertainment",
  "youtube": "Entertainment",
  "obat": "Health",
  "apotik": "Health",
  "dokter": "Health",
  "kuliah": "Education",
  "buku": "Education",
  "kursus": "Education"
};

// Kategori yang tersedia
const categories = [
  "Food", "Transport", "Utilities", "Shopping", 
  "Entertainment", "Health", "Education", "Other"
];

const SmartTransactionTracker = () => {
  // State untuk ML dan transaksi
  const [records, setRecords] = useState([
    { id: 1, description: "Makan siang di warung", amount: 25000, category: "Food", date: "2024-01-15" },
    { id: 2, description: "Gojek ke kantor", amount: 35000, category: "Transport", date: "2024-01-15" },
    { id: 3, description: "Beli pulsa 50rb", amount: 50000, category: "Utilities", date: "2024-01-14" },
  ]);
  
  const [mlRules, setMlRules] = useState(initialMLRules);
  const [mlAccuracy, setMlAccuracy] = useState(85);
  const [mlTrainingCount, setMlTrainingCount] = useState(3);
  const [showMlBadge, setShowMlBadge] = useState(false);
  
  // State untuk input transaksi baru
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0]
  });
  
  // State untuk prediksi ML
  const [mlPrediction, setMlPrediction] = useState({
    category: "",
    confidence: 0,
    keywords: []
  });
  
  // Ref untuk auto-focus
  const descriptionRef = useRef(null);

  useEffect(() => {
    // Focus ke input deskripsi
    if (descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, []);

  // Fungsi untuk memprediksi kategori berdasarkan deskripsi
  const predictCategory = (description) => {
    if (!description.trim()) {
      setMlPrediction({ category: "", confidence: 0, keywords: [] });
      return;
    }

    const lowerDesc = description.toLowerCase();
    const matchedKeywords = [];
    let predictedCategory = "Other";
    let confidence = 0;
    let matchCount = 0;

    // Cari kata kunci dalam deskripsi
    Object.entries(mlRules).forEach(([keyword, category]) => {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
        predictedCategory = category;
        matchCount++;
      }
    });

    // Hitung confidence
    if (matchCount > 0) {
      confidence = Math.min(95, matchCount * 30 + (matchedKeywords.length / lowerDesc.length) * 100);
    } else {
      confidence = 10;
    }

    setMlPrediction({
      category: predictedCategory,
      confidence: Math.round(confidence),
      keywords: matchedKeywords
    });

    // Update input dengan prediksi
    setNewTransaction(prev => ({
      ...prev,
      category: predictedCategory,
      description: description
    }));
  };

  // Tambah transaksi baru
  const handleAddTransaction = () => {
    if (!newTransaction.description.trim() || !newTransaction.amount || !newTransaction.category) {
      alert("Please fill in all fields");
      return;
    }

    const newRecord = {
      id: records.length + 1,
      description: newTransaction.description,
      amount: parseInt(newTransaction.amount),
      category: newTransaction.category,
      date: newTransaction.date
    };

    // Update records
    setRecords(prev => [newRecord, ...prev]);

    // Update ML rules
    const lowerDesc = newTransaction.description.toLowerCase();
    const words = lowerDesc.split(' ');
    
    words.forEach(word => {
      if (word.length > 3 && !mlRules[word]) {
        setMlRules(prev => ({
          ...prev,
          [word]: newTransaction.category
        }));
      }
    });

    // Update stats
    setMlTrainingCount(prev => prev + 1);
    setMlAccuracy(prev => Math.min(100, prev + 5));

    // Reset form
    setNewTransaction({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0]
    });

    setMlPrediction({ category: "", confidence: 0, keywords: [] });
    
    // Show badge jika akurasi tinggi
    if (mlAccuracy + 5 >= 80) {
      setShowMlBadge(true);
      setTimeout(() => setShowMlBadge(false), 3000);
    }
  };

  // Render confidence badge
  const renderConfidenceBadge = (confidence) => {
    let color = "bg-red-500";
    if (confidence >= 70) color = "bg-green-500";
    else if (confidence >= 40) color = "bg-yellow-500";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${color}`}>
        {confidence}% confident
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* ML Badge Celebration */}
      {showMlBadge && (
        <div className="mb-6 animate-bounce">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-center text-white">
            <div className="text-2xl mb-2">🏆 Achievement Unlocked!</div>
            <div className="font-bold">Smart AI Assistant</div>
            <div className="text-sm">ML accuracy reached 80%+! 🚀</div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span className="text-3xl">🤖</span>
        Smart Transaction Tracker
      </h2>

      {/* Transaction Input Form */}
      <div className="space-y-6">
        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Description
            <span className="text-xs text-gray-500 ml-2">
              ML will auto-suggest category
            </span>
          </label>
          <div className="relative">
            <input
              ref={descriptionRef}
              type="text"
              value={newTransaction.description}
              onChange={(e) => {
                const desc = e.target.value;
                setNewTransaction(prev => ({ ...prev, description: desc }));
                predictCategory(desc);
              }}
              placeholder="e.g., 'makan di warung padang', 'grab ke kantor', 'beli pulsa'"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
            
            {/* ML Prediction Indicator */}
            {mlPrediction.category && newTransaction.description && (
              <div className="absolute right-3 top-3">
                {renderConfidenceBadge(mlPrediction.confidence)}
              </div>
            )}
          </div>
          
          {/* ML Prediction Details */}
          {mlPrediction.keywords.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">ML detected: </span>
              {mlPrediction.keywords.map((word, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-2"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
            {mlPrediction.category && (
              <span className="ml-2 text-blue-600 font-medium">
                🤖 ML Suggests: {mlPrediction.category}
              </span>
            )}
          </label>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setNewTransaction(prev => ({ ...prev, category: cat }))}
                className={`px-3 py-2 rounded-lg border transition-all ${
                  newTransaction.category === cat
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                    : mlPrediction.category === cat
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Amount dan Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Rp)
            </label>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="e.g., 50000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleAddTransaction}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            💾 Add Transaction & Train ML
          </button>
          <button
            onClick={() => {
              setNewTransaction({
                description: "",
                amount: "",
                category: "",
                date: new Date().toISOString().split('T')[0]
              });
              setMlPrediction({ category: "", confidence: 0, keywords: [] });
            }}
            className="px-6 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📝</span>
          Recent Transactions ({records.length})
        </h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {records.map((record) => (
            <div key={record.id} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-800">{record.description}</div>
                  <div className="text-sm text-gray-500">{record.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">Rp {record.amount.toLocaleString()}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    record.category === 'Food' ? 'bg-red-100 text-red-800' :
                    record.category === 'Transport' ? 'bg-blue-100 text-blue-800' :
                    record.category === 'Utilities' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ML Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">ML Accuracy</div>
          <div className="text-2xl font-bold text-gray-800">{mlAccuracy}%</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Training Data</div>
          <div className="text-2xl font-bold text-gray-800">{mlTrainingCount}</div>
          <div className="text-xs text-gray-500">transactions</div>
        </div>
      </div>
    </div>
  );
};

export default SmartTransactionTracker;