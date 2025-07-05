"use client";
import React, { useState, useMemo, useEffect } from "react";
import InlineEdit from '@/components/InlineEdit';
import { dataAPI } from '@/utils/dataAPI';

const ColorPalette = () => {
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [autoRotate, setAutoRotate] = useState(false);
  const colors = useMemo(() => ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#F97316"], []);
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRotate) {
      interval = setInterval(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setSelectedColor(randomColor);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [autoRotate, colors]);
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h4 className="font-semibold mb-3">🎨 Live Color Palette</h4>
      <div className="flex gap-2 mb-3">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
              selectedColor === color ? 'border-gray-800 dark:border-gray-200' : 'border-gray-300 dark:border-gray-600'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
      <div className="text-sm mb-2">
        Selected: <span className="font-mono bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 rounded transition-colors duration-300" style={{ borderLeft: `4px solid ${selectedColor}` }}>{selectedColor}</span>
      </div>
      <button
        onClick={() => setAutoRotate(!autoRotate)}
        className={`w-full px-4 py-1 rounded text-sm transition-colors ${
          autoRotate 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-purple-500 hover:bg-purple-600 text-white'
        }`}
      >
        {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
      </button>
    </div>
  );
};

const TextAnimator = () => {
  const [text, setText] = useState("Hello, World!");
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animate = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h4 className="font-semibold mb-3">✨ Text Animator</h4>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        placeholder="Enter text to animate"
      />
      <div className={`text-center p-4 transition-all duration-1000 ${isAnimating ? 'scale-125 rotate-3 text-blue-600' : ''}`}>
        {text}
      </div>
      <button
        onClick={animate}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Animate!
      </button>
    </div>
  );
};

const CodeSnippet = () => {
  const [copied, setCopied] = useState(false);
  
  const codeExample = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h4 className="font-semibold mb-3">💻 Code Snippet</h4>
      <div className="relative">
        <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{codeExample}
        </pre>
        <button
          onClick={copyCode}
          className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

const InteractiveCounter = () => {
  const [count, setCount] = useState(0);
  const [autoIncrement, setAutoIncrement] = useState(false);
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoIncrement) {
      interval = setInterval(() => {
        setCount(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoIncrement]);
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h4 className="font-semibold mb-3">🔢 Live Counter</h4>
      <div className="text-center">
        <div className="text-3xl font-bold mb-4 transition-all duration-300 hover:scale-110">{count}</div>
        <div className="flex gap-2 justify-center mb-2">
          <button
            onClick={() => setCount(count - 1)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            -
          </button>
          <button
            onClick={() => setCount(0)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            +
          </button>
        </div>
        <button
          onClick={() => setAutoIncrement(!autoIncrement)}
          className={`w-full px-4 py-1 rounded text-sm transition-colors ${
            autoIncrement 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {autoIncrement ? 'Stop Auto' : 'Start Auto'}
        </button>
      </div>
    </div>
  );
};

const SimpleCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const calculate = (firstOperand: number, secondOperand: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "×":
        return firstOperand * secondOperand;
      case "÷":
        return firstOperand / secondOperand;
      case "=":
        return secondOperand;
      default:
        return secondOperand;
    }
  };

  const inputNumber = (num: number) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h4 className="font-semibold mb-3">🧮 Simple Calculator</h4>
      <div className="bg-gray-900 text-white p-3 rounded mb-3 text-right text-xl font-mono">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={clearAll}
          className="col-span-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={() => inputOperation("÷")}
          className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          ÷
        </button>
        <button
          onClick={() => inputOperation("×")}
          className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          ×
        </button>
        
        {[7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => inputNumber(num)}
            className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => inputOperation("-")}
          className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          -
        </button>
        
        {[4, 5, 6].map(num => (
          <button
            key={num}
            onClick={() => inputNumber(num)}
            className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => inputOperation("+")}
          className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          +
        </button>
        
        {[1, 2, 3].map(num => (
          <button
            key={num}
            onClick={() => inputNumber(num)}
            className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={performCalculation}
          className="row-span-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          =
        </button>
        
        <button
          onClick={() => inputNumber(0)}
          className="col-span-2 bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          0
        </button>
        <button
          onClick={() => {
            if (display.indexOf(".") === -1) {
              setDisplay(display + ".");
            }
          }}
          className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          .
        </button>
      </div>
    </div>
  );
};

const RandomQuoteGenerator = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Code is like humor. When you have to explain it, it's bad. - Cory House",
    "First, solve the problem. Then, write the code. - John Johnson",
    "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
    "The best error message is the one that never shows up. - Thomas Fuchs",
    "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
    "It's not a bug – it's an undocumented feature. - Anonymous"
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRotate) {
      interval = setInterval(() => {
        setCurrentQuote(prev => (prev + 1) % quotes.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoRotate, quotes.length]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(randomIndex);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h4 className="font-semibold mb-3">💬 Live Quote Generator</h4>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded mb-3 italic text-center min-h-[80px] flex items-center justify-center transition-all duration-500">
        &ldquo;{quotes[currentQuote]}&rdquo;
      </div>
      <div className="flex gap-2">
        <button
          onClick={getRandomQuote}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          New Quote
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-4 py-2 rounded transition-colors ${
            autoRotate 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {autoRotate ? 'Stop' : 'Auto'}
        </button>
      </div>
    </div>
  );
};

const SystemMonitor = () => {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    network: 23
  });
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.max(10, Math.min(95, metrics.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(90, metrics.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(0, Math.min(100, metrics.network + (Math.random() - 0.5) * 15))
      });
    }, 1500);
    
    return () => clearInterval(interval);
  }, [metrics]);
  
  const getColorForMetric = (value: number) => {
    if (value < 30) return 'bg-green-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h4 className="font-semibold mb-3">📊 Live System Monitor</h4>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>CPU Usage</span>
            <span>{Math.round(metrics.cpu)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${getColorForMetric(metrics.cpu)}`}
              style={{ width: `${metrics.cpu}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Memory</span>
            <span>{Math.round(metrics.memory)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${getColorForMetric(metrics.memory)}`}
              style={{ width: `${metrics.memory}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Network</span>
            <span>{Math.round(metrics.network)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${getColorForMetric(metrics.network)}`}
              style={{ width: `${metrics.network}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        ⚡ Live simulated data
      </div>
    </div>
  );
};

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h4 className="font-semibold mb-3">🕒 Live Clock</h4>
      <div className="text-center">
        <div className="text-2xl font-mono font-bold mb-2 text-blue-600 dark:text-blue-400">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(time)}
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>
    </div>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Build amazing projects", completed: false },
    { id: 2, text: "Learn new technologies", completed: true }
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h4 className="font-semibold mb-3">📝 Mini Todo List</h4>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
        <button
          onClick={addTodo}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="rounded"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 px-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function LabPage() {
  // Editable content state - loaded from JSON
  const [pageTitle, setPageTitle] = useState('The Lab')
  const [pageSubtitle, setPageSubtitle] = useState('Experimental Zone • Interactive Demos • Creative Coding')
  const [pageDescription, setPageDescription] = useState('Welcome to my digital laboratory! This is where I experiment with new technologies, test creative ideas, and build interactive demos.')
  const [warningText, setWarningText] = useState('WIP – things might break 🚧')
  const [loading, setLoading] = useState(true)
  
  const [activeTab, setActiveTab] = useState("tools");

  // Load content from JSON file
  useEffect(() => {
    loadSiteContent()
  }, [])

  const loadSiteContent = async () => {
    try {
      setLoading(true)
      const content = await dataAPI.getSiteContent()
      setPageTitle(content.labTitle)
      setPageSubtitle(content.labSubtitle)
      setPageDescription(content.labDescription)
    } catch (error) {
      console.error('Failed to load site content:', error)
      // Keep default values if loading fails
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTitle = async (newTitle: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        labTitle: newTitle
      })
      setPageTitle(newTitle)
    } catch (error) {
      console.error('Failed to save lab title:', error)
    }
  }

  const handleSaveSubtitle = async (newSubtitle: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        labSubtitle: newSubtitle
      })
      setPageSubtitle(newSubtitle)
    } catch (error) {
      console.error('Failed to save lab subtitle:', error)
    }
  }

  const handleSaveDescription = async (newDescription: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        labDescription: newDescription
      })
      setPageDescription(newDescription)
    } catch (error) {
      console.error('Failed to save lab description:', error)
    }
  }

  // Dynamic progress bars for experiments
  const [algorithmProgress, setAlgorithmProgress] = useState(75);
  const [dataStructureProgress, setDataStructureProgress] = useState(50);
  const [gameProgress, setGameProgress] = useState(25);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAlgorithmProgress(prev => {
        const newVal = prev + (Math.random() - 0.5) * 2;
        return Math.max(70, Math.min(100, newVal));
      });
      setDataStructureProgress(prev => {
        const newVal = prev + (Math.random() - 0.5) * 3;
        return Math.max(45, Math.min(80, newVal));
      });
      setGameProgress(prev => {
        const newVal = prev + (Math.random() - 0.5) * 4;
        return Math.max(20, Math.min(60, newVal));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2 mb-2">
          <span role="img" aria-label="test tube">🧪</span> 
          <InlineEdit
            type="text"
            value={pageTitle}
            onSave={handleSaveTitle}
            placeholder="Enter page title..."
            inline={true}
          >
            {pageTitle}
          </InlineEdit>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
          <InlineEdit
            type="text"
            value={pageSubtitle}
            onSave={handleSaveSubtitle}
            placeholder="Enter page subtitle..."
            inline={true}
          >
            {pageSubtitle}
          </InlineEdit>
        </p>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          <InlineEdit
            type="textarea"
            value={pageDescription}
            onSave={handleSaveDescription}
            placeholder="Enter page description..."
            maxLength={300}
          >
            {pageDescription}
          </InlineEdit>
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded mb-8 flex items-center gap-2">
        <span role="img" aria-label="warning">⚠️</span>
        <span className="font-semibold">
          <InlineEdit
            type="text"
            value={warningText}
            onSave={setWarningText}
            placeholder="Enter warning text..."
            inline={true}
          >
            WIP – things might break 🚧
          </InlineEdit>
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-8 overflow-x-auto">
        {[
          { id: "tools", label: "🛠️ Interactive Tools", icon: "🛠️" },
          { id: "experiments", label: "🔬 JS Experiments", icon: "🔬" },
          { id: "ui", label: "🎨 UI Concepts", icon: "🎨" },
          { id: "ml", label: "🤖 ML Models", icon: "🤖" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "tools" && (
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span role="img" aria-label="tools">🛠️</span> Interactive Tools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InteractiveCounter />
              <ColorPalette />
              <LiveClock />
              <SystemMonitor />
              <TextAnimator />
              <CodeSnippet />
              <SimpleCalculator />
              <RandomQuoteGenerator />
              <TodoList />
            </div>
          </section>
        </div>
      )}

      {activeTab === "experiments" && (
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span role="img" aria-label="microscope">🔬</span> JavaScript Experiments
            </h2>
            <div className="grid gap-4">
              <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-gray-900 dark:text-gray-100">
                <h3 className="font-semibold mb-2">🌀 Algorithm Visualizer</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Live development: Interactive sorting algorithms with real-time visualization</p>
                <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: `${algorithmProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(algorithmProgress)}% complete • Live updating</span>
              </div>
              
              <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 text-gray-900 dark:text-gray-100">
                <h3 className="font-semibold mb-2">📊 Data Structure Playground</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Active development: Interactive binary trees, linked lists, and graph traversals</p>
                <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: `${dataStructureProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(dataStructureProgress)}% complete • Live updating</span>
              </div>

              <div className="p-6 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-gray-900 dark:text-gray-100">
                <h3 className="font-semibold mb-2">🎮 Mini Games</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">In progress: Simple browser games: Snake, Tetris, and Memory Card games</p>
                <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: `${gameProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(gameProgress)}% complete • Live updating</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "ui" && (
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span role="img" aria-label="art">🎨</span> UI Component Concepts
            </h2>
            <div className="grid gap-4">
              <div className="p-6 border rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-gray-900 dark:text-gray-100">
                <h3 className="font-semibold mb-2">🌈 Live Animated Gradients</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Real-time gradient transitions and morphing color schemes</p>
                <div className="h-20 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x" style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient 3s ease infinite'
                }}></div>
                <style jsx>{`
                  @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                `}</style>
              </div>
              
              <div className="p-6 border rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-gray-900 dark:text-gray-100">
                <h3 className="font-semibold mb-2">⚡ Loading States</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Various loading indicators and skeleton screens</p>
                <div className="flex items-center space-x-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 text-gray-900 dark:text-gray-100">
                <h3 className="font-semibold mb-2">🎯 Interactive Buttons</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Creative button designs with hover effects and animations</p>
                <div className="flex gap-3 flex-wrap">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transform hover:scale-105 transition-all duration-200">
                    Hover Me
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                    Gradient
                  </button>
                  <button className="px-4 py-2 border-2 border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition-all duration-300">
                    Outline
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "ml" && (
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span role="img" aria-label="robot">🤖</span> ML Models & AI Demos
            </h2>
            <div className="grid gap-4">
              <div className="p-6 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-gray-900 dark:text-gray-100">
                <h3 className="font-semibold mb-2">🧠 Neural Network Visualization</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Interactive neural network layers with live training visualization</p>
                <div className="flex gap-2 mb-2 items-center justify-center">
                  <div className="flex flex-col gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-4 h-4 bg-purple-300 dark:bg-purple-600 rounded-full"></div>
                    ))}
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="flex flex-col gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-4 h-4 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
                    ))}
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="w-4 h-4 bg-red-300 dark:bg-red-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Planning phase</span>
              </div>
              
              <div className="p-6 border rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 text-gray-900 dark:text-gray-100">
                <h3 className="font-semibold mb-2">💬 Simple Chatbot Demo</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Basic conversational AI with pre-trained responses</p>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm space-y-2">
                  <div className="flex">
                    <strong className="text-blue-600 dark:text-blue-400">Bot:</strong>
                    <span className="ml-2">Hello! I&apos;m a simple demo chatbot.</span>
                  </div>
                  <div className="flex">
                    <strong className="text-green-600 dark:text-green-400">User:</strong>
                    <span className="ml-2">How are you?</span>
                  </div>
                  <div className="flex">
                    <strong className="text-blue-600 dark:text-blue-400">Bot:</strong>
                    <span className="ml-2">I&apos;m doing great! Thanks for asking. 🤖</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-gray-900 dark:text-gray-100">
                <h3 className="font-semibold mb-2">🎨 Style Transfer</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">AI-powered image style transfer and artistic filters</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-gradient-to-br from-blue-200 to-blue-400 rounded"></div>
                  <div className="aspect-square bg-gradient-to-br from-green-200 to-green-400 rounded"></div>
                  <div className="aspect-square bg-gradient-to-br from-purple-200 to-purple-400 rounded"></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">Concept phase</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
