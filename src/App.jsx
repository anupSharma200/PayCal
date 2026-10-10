import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Clock, DollarSign, Calendar, Info, ShieldCheck, Users, Zap, MapPin, Moon, Sun, GraduationCap, PiggyBank, PieChart, History, Home, Menu, X, ChevronDown, Mail, MessageCircle } from 'lucide-react';

export default function App() {
  const [salary, setSalary] = useState('60000');
  const [frequency, setFrequency] = useState('Annually');
  const [isCasual, setIsCasual] = useState(false);
  const [hasStudentLoan, setHasStudentLoan] = useState(false);
  const [includesSuper, setIncludesSuper] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Default set to dark theme as requested
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Navigation State
  const [currentPage, setCurrentPage] = useState('calculator');

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Parse input
  const numericSalary = parseFloat(salary.replace(/,/g, '')) || 0;
  
  // Calculate Base Annual
  let rawAnnual = numericSalary;
  if (frequency === 'Hourly') rawAnnual = numericSalary * 38 * 52;
  if (frequency === 'Weekly') rawAnnual = numericSalary * 52;
  if (frequency === 'Fortnightly') rawAnnual = numericSalary * 26;
  if (frequency === 'Monthly') rawAnnual = numericSalary * 12;

  // Handle Superannuation
  let annual = rawAnnual;
  let superAnnual = 0;
  if (includesSuper) {
    annual = rawAnnual / 1.115;
    superAnnual = rawAnnual - annual;
  } else {
    superAnnual = annual * 0.115;
  }

  // Tax Brackets
  let annualTax = 0;
  if (annual <= 18200) annualTax = 0;
  else if (annual <= 45000) annualTax = (annual - 18200) * 0.16;
  else if (annual <= 135000) annualTax = 4288 + (annual - 45000) * 0.30;
  else if (annual <= 190000) annualTax = 31288 + (annual - 135000) * 0.37;
  else annualTax = 51638 + (annual - 190000) * 0.45;

  let medicare = annual > 25000 ? annual * 0.02 : 0; 
  let studentLoan = 0;
  if (hasStudentLoan) {
    if (annual > 54435 && annual <= 62850) studentLoan = annual * 0.01;
    else if (annual > 62850 && annual <= 66620) studentLoan = annual * 0.02;
    else if (annual > 66620 && annual <= 70618) studentLoan = annual * 0.025;
    else if (annual > 70618 && annual <= 74867) studentLoan = annual * 0.03;
    else if (annual > 74867 && annual <= 79369) studentLoan = annual * 0.035;
    else if (annual > 79369 && annual <= 84144) studentLoan = annual * 0.04;
    else if (annual > 84144 && annual <= 89204) studentLoan = annual * 0.045;
    else if (annual > 89204 && annual <= 94567) studentLoan = annual * 0.05;
    else if (annual > 94567 && annual <= 100253) studentLoan = annual * 0.055;
    else if (annual > 100253 && annual <= 106283) studentLoan = annual * 0.06;
    else if (annual > 106283 && annual <= 112674) studentLoan = annual * 0.065;
    else if (annual > 112674 && annual <= 119448) studentLoan = annual * 0.07;
    else if (annual > 119448 && annual <= 126630) studentLoan = annual * 0.075;
    else if (annual > 126630 && annual <= 134244) studentLoan = annual * 0.08;
    else if (annual > 134244 && annual <= 142316) studentLoan = annual * 0.085;
    else if (annual > 142316 && annual <= 150880) studentLoan = annual * 0.09;
    else if (annual > 150880 && annual <= 159942) studentLoan = annual * 0.095;
    else if (annual > 159942) studentLoan = annual * 0.10;
  }
  
  const totalTax = annualTax + medicare + studentLoan;
  const netAnnual = annual - totalTax;

  const formatMoney = (val) => val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

  const generateRow = (label, annualVal, isBold=false, isDeduct=false, colorClass="") => (
    <tr className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${isBold ? 'font-semibold' : ''} ${colorClass}`}>
      <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-left whitespace-nowrap">{label}</td>
      <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-right">${formatMoney(annualVal)}</td>
      <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-right hidden sm:table-cell">${formatMoney(annualVal / 12)}</td>
      <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-right hidden md:table-cell">${formatMoney(annualVal / 26)}</td>
      <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-right">${formatMoney(annualVal / 52)}</td>
    </tr>
  );

  const getPageTitle = () => {
    switch(currentPage) {
      case 'calculator': return 'Calculator';
      case 'about': return 'About Us';
      case 'tax-info': return 'Tax Info';
      case 'tax-distribution': return 'Tax Distribution';
      case 'student-loans': return 'Student Loans';
      case 'privacy-policy': return 'Privacy Policy';
      default: return 'Calculator';
    }
  };

  const getNavClass = (page) => {
    return `w-full flex items-center gap-3 px-3 py-3 rounded-lg font-semibold transition-colors ${currentPage === page ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-500' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`;
  };

  const getSmallNavClass = (page) => {
    return `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${currentPage === page ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-500 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`;
  };

  return (
     <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
        
        {/* Sidebar - Dynamically themes based on light/dark mode */}
        <aside className={`flex-shrink-0 z-20 w-72 bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-300 transition-all duration-300 ease-in-out flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-2xl ${sidebarOpen ? 'ml-0' : '-ml-72'}`}>
           {/* Logo Area */}
           <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
             <div className="w-8 h-8 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center shadow-sm text-sm mr-3">Pc</div>
             <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">PayCal</span>
             <button className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
               <X className="w-6 h-6" />
             </button>
           </div>

           {/* Sidebar Links */}
           <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
              <nav className="space-y-1 px-3">
                 <button onClick={() => {setCurrentPage('calculator'); setSidebarOpen(false);}} className={getNavClass('calculator')}>
                    <Calculator className="w-5 h-5" /> CALCULATOR
                 </button>
                 
                 <button onClick={() => {setCurrentPage('tax-info'); setSidebarOpen(false);}} className={getNavClass('tax-info')}>
                    <Info className="w-5 h-5" /> TAX INFO
                 </button>
                 
                 <button onClick={() => {setCurrentPage('tax-distribution'); setSidebarOpen(false);}} className={getNavClass('tax-distribution')}>
                    <PieChart className="w-5 h-5" /> TAX DISTRIBUTION
                 </button>
                 
                 <button onClick={() => {setCurrentPage('student-loans'); setSidebarOpen(false);}} className={getNavClass('student-loans')}>
                    <GraduationCap className="w-5 h-5" /> STUDENT LOANS
                 </button>
                 
              </nav>

              <div className="mt-8 px-6 text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">Themes</div>
              <nav className="space-y-1 px-3">
                 <button 
                    onClick={() => setIsDarkMode(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${!isDarkMode ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                 >
                    <Sun className={`w-5 h-5 ${!isDarkMode ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} /> Light Theme
                 </button>
                 <button 
                    onClick={() => setIsDarkMode(true)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                 >
                    <Moon className={`w-5 h-5 ${isDarkMode ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} /> Dark Theme
                 </button>
              </nav>

              <div className="mt-8 px-6 text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">Legal & Help</div>
              <nav className="space-y-1 px-3 pb-8">
                 <button onClick={() => {setCurrentPage('about'); setSidebarOpen(false);}} className={getSmallNavClass('about')}>
                    About Us
                 </button>
                 <button onClick={() => {setCurrentPage('privacy-policy'); setSidebarOpen(false);}} className={getSmallNavClass('privacy-policy')}>
                    Privacy Policy
                 </button>
              </nav>
           </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0b1120] transition-colors duration-300">
           {/* Top Header */}
           <header className="relative h-16 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0 z-30 shadow-sm transition-colors duration-300">
              <div className="flex items-center h-full">
                 <button 
                   className="h-full px-5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors focus:outline-none border-r border-slate-100 dark:border-slate-800"
                   onClick={() => setSidebarOpen(true)}
                 >
                   <Menu className="w-6 h-6" />
                 </button>
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2">
                 <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">
                   {getPageTitle()}
                 </h1>
              </div>

              <div className="flex items-center gap-3 pr-4 md:pr-8">
                <button 
                   onClick={toggleTheme} 
                   className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                   aria-label="Toggle Dark Mode"
                >
                   {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
                </button>
              </div>
           </header>

           {/* Scrollable Content */}
           <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8">
              
              {currentPage === 'calculator' && (
                <div className="max-w-6xl mx-auto">
                   <div className="mb-8 md:mb-10">
                     <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 transition-colors">PayCal Salary Calculator <span className="text-blue-500">✨</span></h2>
                     <p className="text-slate-500 dark:text-slate-400 text-lg font-medium transition-colors">Estimate your true take-home pay with precision</p>
                   </div>
                   <div className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col xl:flex-row transition-colors duration-300">
                      
                      {/* Left Column - Inputs */}
                      <div className="p-4 sm:p-6 lg:p-8 xl:w-5/12 border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b] transition-colors duration-300">
                         <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                           <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Salary details
                         </h3>

                         <div className="space-y-6 mb-8">
                            <div>
                               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Base Salary / Rate</label>
                               <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                     <DollarSign className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                  </div>
                                  <input
                                     type="text"
                                     value={salary}
                                     onChange={(e) => setSalary(e.target.value)}
                                     className="pl-11 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] py-3.5 text-lg font-bold text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all shadow-sm"
                                  />
                               </div>
                            </div>

                            <div>
                               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pay Frequency</label>
                               <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                     <Clock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                  </div>
                                  <select
                                     value={frequency}
                                     onChange={(e) => setFrequency(e.target.value)}
                                     className="pl-11 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] py-3.5 text-lg font-bold text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 appearance-none outline-none transition-all shadow-sm"
                                  >
                                     <option>Hourly</option>
                                     <option>Weekly</option>
                                     <option>Fortnightly</option>
                                     <option>Monthly</option>
                                     <option>Annually</option>
                                  </select>
                               </div>
                            </div>
                         </div>

                         <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Options & Add-ons</h3>
                         
                         <div className="space-y-3 mb-8">
                            <label className="flex items-center p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border-2 border-transparent hover:border-blue-100 dark:hover:border-slate-700 cursor-pointer transition-all">
                               <input type="checkbox" checked={includesSuper} onChange={(e) => setIncludesSuper(e.target.checked)} className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-600 dark:focus:ring-blue-500" />
                               <div className="ml-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                  <PiggyBank className="w-5 h-5 text-blue-500" /> Includes Superannuation
                               </div>
                            </label>

                            <label className="flex items-center p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border-2 border-transparent hover:border-blue-100 dark:hover:border-slate-700 cursor-pointer transition-all">
                               <input type="checkbox" checked={hasStudentLoan} onChange={(e) => setHasStudentLoan(e.target.checked)} className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-600 dark:focus:ring-blue-500" />
                               <div className="ml-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                  <GraduationCap className="w-5 h-5 text-blue-500" /> Has HECS / HELP (Loan)
                               </div>
                            </label>

                            <label className="flex items-center p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border-2 border-transparent hover:border-blue-100 dark:hover:border-slate-700 cursor-pointer transition-all">
                               <input type="checkbox" checked={isCasual} onChange={(e) => setIsCasual(e.target.checked)} className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-600 dark:focus:ring-blue-500" />
                               <div className="ml-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                  <Clock className="w-5 h-5 text-blue-500" /> Casual loading / No leave
                               </div>
                            </label>
                         </div>

                         <div className="flex gap-4 items-center">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                               <Calculator className="w-5 h-5" /> Calculate
                            </button>
                            <button className="bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 px-5 rounded-2xl transition-all flex items-center justify-center shadow-sm" 
                                    onClick={() => { setSalary('60000'); setFrequency('Annually'); setIncludesSuper(false); setHasStudentLoan(false); setIsCasual(false); }}>
                               <RotateCcw className="w-5 h-5" />
                            </button>
                         </div>
                      </div>

                      {/* Right Column - Output */}
                      <div className="bg-slate-50 dark:bg-[#111827] p-4 sm:p-6 lg:p-8 xl:w-7/12 flex flex-col justify-between transition-colors duration-300">
                         <div>
                             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                               <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Your Estimated Pay
                             </h3>

                             {/* Highlight Card */}
                             <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 text-white p-6 sm:p-7 rounded-2xl shadow-xl shadow-blue-600/20 mb-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                                   <DollarSign className="w-48 h-48" />
                                </div>
                                <div className="relative z-10">
                                   <div className="text-blue-100 font-semibold mb-2 text-sm md:text-base uppercase tracking-wider">Net Take-Home Pay</div>
                                   <div className="text-3xl font-black tracking-tight mb-4 drop-shadow-md">
                                     ${formatMoney(netAnnual)} <span className="text-xl font-semibold text-blue-200">/ yr</span>
                                   </div>
                                   <div className="flex gap-6 text-blue-100 text-base font-medium mt-6 pt-6 border-t border-blue-400/30">
                                     <div>Weekly: <span className="text-white font-bold tracking-wide">${formatMoney(netAnnual / 52)}</span></div>
                                     <div>Monthly: <span className="text-white font-bold tracking-wide">${formatMoney(netAnnual / 12)}</span></div>
                                   </div>
                                </div>
                             </div>

                             {/* Detailed Table */}
                             <div className="overflow-x-auto bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                                <table className="w-full text-sm">
                                   <thead>
                                      <tr className="bg-slate-50 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                         <th className="py-4 px-5 text-left font-bold">Breakdown</th>
                                         <th className="py-4 px-5 text-right font-bold">Annually</th>
                                         <th className="py-4 px-5 text-right font-bold hidden sm:table-cell">Monthly</th>
                                         <th className="py-4 px-5 text-right font-bold hidden md:table-cell">Fortnightly</th>
                                         <th className="py-4 px-5 text-right font-bold">Weekly</th>
                                      </tr>
                                   </thead>
                                   <tbody className="text-slate-700 dark:text-slate-300 font-medium">
                                      {generateRow("Gross Salary", annual, true)}
                                      {generateRow("Superannuation", superAnnual, false, false, "text-emerald-600 dark:text-emerald-400")}
                                      {generateRow("Tax on Income", -annualTax, false, true, "text-red-500 dark:text-red-400")}
                                      {generateRow("Medicare Levy", -medicare, false, true, "text-red-500 dark:text-red-400")}
                                      {hasStudentLoan && generateRow("HECS / HELP", -studentLoan, false, true, "text-red-500 dark:text-red-400")}
                                      <tr className="bg-slate-50 dark:bg-[#0f172a] border-t-2 border-slate-200 dark:border-slate-800 font-black text-slate-900 dark:text-white transition-colors duration-300 text-base">
                                         <td className="py-4 px-3 sm:py-5 sm:px-5 text-left">Net Pay</td>
                                         <td className="py-4 px-3 sm:py-5 sm:px-5 text-right">${formatMoney(netAnnual)}</td>
                                         <td className="py-4 px-3 sm:py-5 sm:px-5 text-right hidden sm:table-cell">${formatMoney(netAnnual / 12)}</td>
                                         <td className="py-4 px-3 sm:py-5 sm:px-5 text-right hidden md:table-cell">${formatMoney(netAnnual / 26)}</td>
                                         <td className="py-4 px-3 sm:py-5 sm:px-5 text-right text-blue-600 dark:text-blue-400">${formatMoney(netAnnual / 52)}</td>
                                      </tr>
                                   </tbody>
                                </table>
                             </div>
                         </div>

                         <div className="mt-8 bg-blue-50 dark:bg-[#0f172a] rounded-2xl p-4 flex gap-3 border border-blue-100 dark:border-slate-800 transition-colors duration-300">
                            <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-800 dark:text-slate-400 leading-relaxed font-medium">
                               Calculations match ATO 2024-2025 resident tax rates (including stage 3 tax cuts). Used as an estimate only.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {currentPage === 'about' && (
                <div className="max-w-4xl mx-auto py-5 md:py-8 text-center">
                   <Users className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                   <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">About Us</h2>
                   <div className="bg-white dark:bg-[#1e293b] p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 text-left">
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                         We are committed to providing you with the most accurate, reliable, and user-friendly tools for managing your finances.
                      </p>
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                         Our Salary Calculator is meticulously designed using the latest ATO tax rates to give you precise estimates of your take-home pay, helping you plan your future with confidence. No confusing jargon, just straight answers.
                      </p>
                   </div>
                   
                   <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 text-left mt-8">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Get in Touch</h3>
                      <div className="flex flex-col md:flex-row gap-4">
                         <a href="mailto:Dummi@gmail.com" className="flex items-center justify-center md:justify-start gap-3 p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex-1 border border-transparent hover:border-blue-100 dark:hover:border-blue-800/50">
                            <Mail className="w-6 h-6 text-blue-500" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300 text-lg">Dummi@gmail.com</span>
                         </a>
                         <a href="https://wa.me/917807924147" target="_blank" rel="noreferrer" className="flex items-center justify-center md:justify-start gap-3 p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex-1 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800/50">
                            <MessageCircle className="w-6 h-6 text-emerald-500" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300 text-lg">7807924147</span>
                         </a>
                      </div>
                   </div>
                </div>
              )}

              {currentPage === 'tax-info' && (
                <div className="max-w-4xl mx-auto py-8 text-center">
                   <Info className="w-20 h-20 text-blue-500 mx-auto mb-6" />
                   <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Tax Info</h2>
                   <div className="bg-white dark:bg-[#1e293b] p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 text-left">
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                         The Australian taxation system utilizes a progressive tax scale. This means that as your income increases, the rate of tax applied to each additional dollar you earn also increases. Our calculator automatically applies the most recent 2024-2025 resident tax rates (including the Stage 3 tax cuts) and the 2% Medicare Levy to ensure you have the most up-to-date estimate of your obligations.
                      </p>
                   </div>
                </div>
              )}

              {currentPage === 'tax-distribution' && (
                <div className="max-w-4xl mx-auto py-8 text-center">
                   <PieChart className="w-20 h-20 text-blue-500 mx-auto mb-6" />
                   <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Tax Distribution</h2>
                   <div className="bg-white dark:bg-[#1e293b] p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 text-left">
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                         Have you ever wondered where your tax dollars go? The government allocates income tax towards various public sectors. While the exact distribution fluctuates, it primarily funds:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-lg text-slate-600 dark:text-slate-300">
                         <li><strong>Social Security & Welfare:</strong> Support for the elderly, disabled, and unemployed.</li>
                         <li><strong>Health:</strong> Medicare, public hospitals, and pharmaceutical benefits.</li>
                         <li><strong>Education:</strong> Public schools and university funding.</li>
                         <li><strong>Defense & Infrastructure:</strong> National security and public transport systems.</li>
                      </ul>
                   </div>
                </div>
              )}

              {currentPage === 'student-loans' && (
                <div className="max-w-4xl mx-auto py-8 text-center">
                   <GraduationCap className="w-20 h-20 text-blue-500 mx-auto mb-6" />
                   <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Student Loans</h2>
                   <div className="bg-white dark:bg-[#1e293b] p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 text-left">
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                         If you have a Higher Education Loan Program (HELP) debt, VET Student Loan (VSL), Student Start-up Loan (SSL), or Trade Support Loan (TSL), you are required to make compulsory repayments once your repayment income exceeds the minimum threshold. 
                      </p>
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                         For the 2024-2025 income year, compulsory repayments begin at 1.0% when your repayment income hits $54,435, and progressively scale up to 10.0% for higher income brackets. Our calculator automatically applies these specific deductions based on your gross salary.
                      </p>
                   </div>
                </div>
              )}

              {currentPage === 'privacy-policy' && (
                <div className="max-w-4xl mx-auto py-8 text-center">
                   <ShieldCheck className="w-20 h-20 text-blue-500 mx-auto mb-6" />
                   <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Privacy Policy</h2>
                   <div className="bg-white dark:bg-[#1e293b] p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 text-left">
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                         Your privacy is absolutely critical to us. 
                      </p>
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                         PayCal operates entirely on your local device. We do not transmit, collect, or store any of your financial data, salary inputs, or calculation results on our servers. The calculations happen instantly in your browser to guarantee 100% security and peace of mind.
                      </p>
                   </div>
                </div>
              )}

           </main>
        </div>
     </div>
  );
}
