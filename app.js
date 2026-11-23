/**
 * ==============================================================================
 * KAKEIBO LOCAL-FIRST PWA ENGINE & CONTROLLER (OFFLINE & PRIVAT)
 * ==============================================================================
 */

// Daftarkan Service Worker agar aplikasi bisa 100% Offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('Service Worker gagal didaftarkan:', err);
    });
  });
}

// ==============================================================================
// 1. ENGINE PENYIMPANAN DATA LOKAL DI HP (LOCAL STORAGE)
// ==============================================================================

const STORAGE_KEYS = {
  TRANSACTIONS: 'kakeibo_transactions',
  CONFIGS: 'kakeibo_configs',
  REFLEKSI: 'kakeibo_refleksi',
  PAYMENT_METHODS: 'kakeibo_payment_methods',
  SUBCATEGORIES: 'kakeibo_subcategories'
};

const DB = {
  get(key, defaultVal = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.error('Gagal membaca database lokal:', e);
      return defaultVal;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Gagal menyimpan ke database lokal:', e);
    }
  },
  initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.SUBCATEGORIES)) {
      const now = new Date().toISOString();
      const defaultSubcategories = [
        // Needs
        { id: 'SUB-1', kategori: 'Needs', nama: 'Belanja Dapur & Makanan Pokok', status: 'Aktif', createdAt: now },
        { id: 'SUB-2', kategori: 'Needs', nama: 'Kebutuhan Rumah Tangga', status: 'Aktif', createdAt: now },
        { id: 'SUB-3', kategori: 'Needs', nama: 'Sewa / Cicilan Rumah', status: 'Aktif', createdAt: now },
        { id: 'SUB-4', kategori: 'Needs', nama: 'Listrik, Air & Gas', status: 'Aktif', createdAt: now },
        { id: 'SUB-5', kategori: 'Needs', nama: 'Internet, Pulsa & Kuota', status: 'Aktif', createdAt: now },
        { id: 'SUB-6', kategori: 'Needs', nama: 'Bensin & Transportasi Harian', status: 'Aktif', createdAt: now },
        { id: 'SUB-7', kategori: 'Needs', nama: 'Kesehatan & Obat-obatan', status: 'Aktif', createdAt: now },
        // Wants
        { id: 'SUB-8', kategori: 'Wants', nama: 'Makan / Jajan di Luar', status: 'Aktif', createdAt: now },
        { id: 'SUB-9', kategori: 'Wants', nama: 'Kopi & Nongkrong', status: 'Aktif', createdAt: now },
        { id: 'SUB-10', kategori: 'Wants', nama: 'Belanja Online & Fashion', status: 'Aktif', createdAt: now },
        { id: 'SUB-11', kategori: 'Wants', nama: 'Gadget & Hobi', status: 'Aktif', createdAt: now },
        { id: 'SUB-12', kategori: 'Wants', nama: 'Hiburan & Streaming', status: 'Aktif', createdAt: now },
        // Culture
        { id: 'SUB-13', kategori: 'Culture', nama: 'Buku, Majalah & E-Book', status: 'Aktif', createdAt: now },
        { id: 'SUB-14', kategori: 'Culture', nama: 'Kursus, Pelatihan & Webinar', status: 'Aktif', createdAt: now },
        { id: 'SUB-15', kategori: 'Culture', nama: 'Tiket Museum, Galeri & Seni', status: 'Aktif', createdAt: now },
        // Unexpected
        { id: 'SUB-16', kategori: 'Unexpected', nama: 'Servis Kendaraan Darurat', status: 'Aktif', createdAt: now },
        { id: 'SUB-17', kategori: 'Unexpected', nama: 'Reparasi Rumah & Perabot', status: 'Aktif', createdAt: now },
        { id: 'SUB-18', kategori: 'Unexpected', nama: 'Biaya Berobat Mendadak', status: 'Aktif', createdAt: now },
        { id: 'SUB-19', kategori: 'Unexpected', nama: 'Sumbangan Sosial & Kondangan', status: 'Aktif', createdAt: now },
        // Pemasukan
        { id: 'SUB-20', kategori: 'Pemasukan', nama: 'Gaji Pokok', status: 'Aktif', createdAt: now },
        { id: 'SUB-21', kategori: 'Pemasukan', nama: 'Tunjangan & Lembur', status: 'Aktif', createdAt: now },
        { id: 'SUB-22', kategori: 'Pemasukan', nama: 'Bonus / THR', status: 'Aktif', createdAt: now },
        { id: 'SUB-23', kategori: 'Pemasukan', nama: 'Hasil Usaha / Bisnis', status: 'Aktif', createdAt: now },
        { id: 'SUB-24', kategori: 'Pemasukan', nama: 'Freelance & Sampingan', status: 'Aktif', createdAt: now }
      ];
      this.set(STORAGE_KEYS.SUBCATEGORIES, defaultSubcategories);
    }

    if (!localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS)) {
      const now = new Date().toISOString();
      const defaultMethods = [
        { id: 'MET-1', nama: 'Tunai (Cash)', kategori: 'Tunai', status: 'Aktif', createdAt: now },
        { id: 'MET-2', nama: 'Transfer BCA', kategori: 'Transfer Bank', status: 'Aktif', createdAt: now },
        { id: 'MET-3', nama: 'Transfer Mandiri', kategori: 'Transfer Bank', status: 'Aktif', createdAt: now },
        { id: 'MET-4', nama: 'GoPay', kategori: 'E-Wallet', status: 'Aktif', createdAt: now },
        { id: 'MET-5', nama: 'OVO / DANA', kategori: 'E-Wallet', status: 'Aktif', createdAt: now },
        { id: 'MET-6', nama: 'QRIS', kategori: 'QRIS', status: 'Aktif', createdAt: now }
      ];
      this.set(STORAGE_KEYS.PAYMENT_METHODS, defaultMethods);
    }

    const now = new Date();
    const currMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const configs = this.get(STORAGE_KEYS.CONFIGS, {});
    if (!configs[currMonth]) {
      configs[currMonth] = {
        bulan: currMonth,
        totalPemasukan: 10000000,
        targetTabungan: 2500000,
        budgetNeeds: 4500000,
        budgetWants: 1500000,
        budgetCulture: 800000,
        budgetUnexpected: 700000,
        catatan: 'Anggaran awal Kakeibo',
        updatedAt: new Date().toISOString()
      };
      this.set(STORAGE_KEYS.CONFIGS, configs);
    }
  }
};

DB.initDefaults();

// ==============================================================================
// 2. STATE MANAGEMENT
// ==============================================================================

const state = {
  currentMonth: '',
  activeTab: 'dashboard',
  categories: {},
  subcategories: [],
  subFilterActive: 'Semua',
  paymentMethods: [],
  dashboardData: null,
  allTransactions: [],
  filteredTransactions: [],
  refleksiList: [],
  config: null,
  chartDonut: null,
  chartBar: null,
  filterDebounceTimer: null
};

// ==============================================================================
// 3. UTILITY FORMATTER
// ==============================================================================

function showToast(title, icon = 'success') {
  if (window.Swal) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  } else {
    alert(title);
  }
}

function formatRupiah(num) {
  const val = Number(num) || 0;
  return 'Rp ' + val.toLocaleString('id-ID');
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  const mIndex = parseInt(parts[1], 10) - 1;
  return `${parseInt(parts[2], 10)} ${monthNames[mIndex] || parts[1]} ${parts[0]}`;
}

function formatMonthIndo(val) {
  if (!val) return '-';
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const str = String(val).trim();
  if (/^\d{4}-\d{2}$/.test(str)) {
    const parts = str.split('-');
    const mIdx = parseInt(parts[1], 10) - 1;
    return `${monthNames[mIdx] || parts[1]} ${parts[0]}`;
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return `${monthNames[parsed.getMonth()]} ${parsed.getFullYear()}`;
  }
  return str;
}

function terbilang(bilangan) {
  const angka = Math.floor(Math.abs(Number(bilangan) || 0));
  if (angka === 0) return 'Nol rupiah';

  const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
  function baca(n) {
    if (n < 12) return ' ' + satuan[n];
    if (n < 20) return baca(n - 10) + ' belas';
    if (n < 100) return baca(Math.floor(n / 10)) + ' puluh' + baca(n % 10);
    if (n < 200) return ' seratus' + baca(n - 100);
    if (n < 1000) return baca(Math.floor(n / 100)) + ' ratus' + baca(n % 100);
    if (n < 2000) return ' seribu' + baca(n - 1000);
    if (n < 1000000) return baca(Math.floor(n / 1000)) + ' ribu' + baca(n % 1000);
    if (n < 1000000000) return baca(Math.floor(n / 1000000)) + ' juta' + baca(n % 1000000);
    if (n < 1000000000000) return baca(Math.floor(n / 1000000000)) + ' milyar' + baca(n % 1000000000);
    return ' jumlah sangat besar';
  }
  const hasil = baca(angka).trim();
  return (hasil.charAt(0).toUpperCase() + hasil.slice(1)) + ' rupiah';
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateId(prefix = 'ID') {
  return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function refreshIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ==============================================================================
// 4. INISIALISASI HALAMAN UTAMA
// ==============================================================================

window.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function hideSplashScreen() {
  const splash = document.getElementById('splashScreen');
  if (splash) {
    splash.classList.add('fade-out');
    setTimeout(() => { splash.style.display = 'none'; }, 400);
  }
}

function initApp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  state.currentMonth = `${y}-${m}`;

  const todayStr = `${y}-${m}-${String(now.getDate()).padStart(2, '0')}`;
  const txnDateInput = document.getElementById('txnTanggal');
  if (txnDateInput) txnDateInput.value = todayStr;

  loadSubcategories();
  loadPaymentMethods();
  loadAvailableMonths();
  loadDashboardData();

  hideSplashScreen();
  refreshIcons();
}

function loadAvailableMonths() {
  const monthsSet = new Set();
  monthsSet.add(state.currentMonth);

  const configs = DB.get(STORAGE_KEYS.CONFIGS, {});
  Object.keys(configs).forEach(b => monthsSet.add(b));

  const txns = DB.get(STORAGE_KEYS.TRANSACTIONS, []);
  txns.forEach(t => {
    if (t.tanggal && t.tanggal.length >= 7) monthsSet.add(t.tanggal.substring(0, 7));
  });

  const sorted = Array.from(monthsSet).sort().reverse();
  const select = document.getElementById('selectMonth');
  if (!select) return;

  select.innerHTML = '';
  sorted.forEach(ym => {
    const opt = document.createElement('option');
    opt.value = ym;
    opt.textContent = formatMonthIndo(ym);
    if (ym === state.currentMonth) opt.selected = true;
    select.appendChild(opt);
  });
}

function onMonthSelected(newMonth) {
  if (newMonth && newMonth !== state.currentMonth) {
    state.currentMonth = newMonth;
    refreshData();
  }
}

function changeMonthOffset(offset) {
  const select = document.getElementById('selectMonth');
  if (!select) return;
  const currIdx = select.selectedIndex;
  const newIdx = currIdx - offset;
  if (newIdx >= 0 && newIdx < select.options.length) {
    select.selectedIndex = newIdx;
    onMonthSelected(select.value);
  } else {
    const parts = state.currentMonth.split('-');
    let y = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10) + offset;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    const newMonthStr = `${y}-${String(m).padStart(2, '0')}`;
    state.currentMonth = newMonthStr;

    const opt = document.createElement('option');
    opt.value = newMonthStr;
    opt.textContent = formatMonthIndo(newMonthStr);
    opt.selected = true;
    select.prepend(opt);
    onMonthSelected(newMonthStr);
  }
}

function goToCurrentMonth() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  state.currentMonth = `${y}-${m}`;
  const select = document.getElementById('selectMonth');
  if (select) select.value = state.currentMonth;
  refreshData();
}

function refreshData() {
  if (state.activeTab === 'dashboard') loadDashboardData();
  else if (state.activeTab === 'history') loadHistoryData();
  else if (state.activeTab === 'refleksi') loadRefleksiData();
  else if (state.activeTab === 'config') loadConfigData();
  showToast('Tampilan dimuat ulang', 'info');
  refreshIcons();
}

// ==============================================================================
// 5. NAVIGASI TAB
// ==============================================================================

function switchTab(tabName) {
  state.activeTab = tabName;

  ['dashboard', 'input', 'history', 'refleksi', 'config'].forEach(s => {
    const el = document.getElementById('view-' + s);
    if (el) el.classList.add('hidden');

    const dtab = document.getElementById('dtab-' + s);
    if (dtab) {
      if (s === tabName) dtab.classList.add('active');
      else dtab.classList.remove('active');
    }

    const mtab = document.getElementById('mtab-' + s);
    if (mtab) {
      if (s === tabName) mtab.classList.add('active');
      else mtab.classList.remove('active');
    }
  });

  const targetEl = document.getElementById('view-' + tabName);
  if (targetEl) targetEl.classList.remove('hidden');

  if (tabName === 'dashboard') loadDashboardData();
  else if (tabName === 'history') loadHistoryData();
  else if (tabName === 'refleksi') loadRefleksiData();
  else if (tabName === 'config') loadConfigData();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  refreshIcons();
}

// ==============================================================================
// 6. DASHBOARD & 4 PILAR KAKEIBO
// ==============================================================================

function getLocalConfig(monthStr) {
  const configs = DB.get(STORAGE_KEYS.CONFIGS, {});
  if (configs[monthStr]) return configs[monthStr];

  return {
    bulan: monthStr,
    totalPemasukan: 10000000,
    targetTabungan: 2500000,
    budgetNeeds: 4500000,
    budgetWants: 1500000,
    budgetCulture: 800000,
    budgetUnexpected: 700000,
    catatan: 'Anggaran bulan ' + formatMonthIndo(monthStr)
  };
}

function loadDashboardData() {
  const monthStr = state.currentMonth;
  const config = getLocalConfig(monthStr);
  const allTxns = DB.get(STORAGE_KEYS.TRANSACTIONS, []);
  
  const txns = allTxns.filter(t => t.tanggal && t.tanggal.startsWith(monthStr));

  let totalRecordedIncome = 0;
  let totalExpense = 0;
  const categorySpent = { Needs: 0, Wants: 0, Culture: 0, Unexpected: 0 };

  txns.forEach(t => {
    if (t.jenis === 'Pemasukan') {
      totalRecordedIncome += Number(t.nominal) || 0;
    } else {
      totalExpense += Number(t.nominal) || 0;
      if (categorySpent.hasOwnProperty(t.kategori)) {
        categorySpent[t.kategori] += Number(t.nominal) || 0;
      } else {
        categorySpent.Needs += Number(t.nominal) || 0;
      }
    }
  });

  const totalIncome = totalRecordedIncome > 0 ? totalRecordedIncome : config.totalPemasukan;
  const targetSavings = config.targetTabungan;
  const availableToSpend = Math.max(0, totalIncome - targetSavings);
  const remainingAvailable = availableToSpend - totalExpense;

  const elRemaining = document.getElementById('dashRemainingAvailable');
  if (elRemaining) {
    elRemaining.innerText = formatRupiah(remainingAvailable);
    elRemaining.className = remainingAvailable < 0 
      ? 'text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-rose-400 mt-1' 
      : 'text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-1';
  }

  const elIncome = document.getElementById('dashTotalIncome');
  if (elIncome) elIncome.innerText = formatRupiah(totalIncome);

  const elSavings = document.getElementById('dashTargetSavings');
  if (elSavings) elSavings.innerText = formatRupiah(targetSavings);

  const elExpense = document.getElementById('dashTotalExpense');
  if (elExpense) elExpense.innerText = formatRupiah(totalExpense);

  const elExpenseRatio = document.getElementById('dashExpenseRatio');
  if (elExpenseRatio) {
    const ratio = availableToSpend > 0 ? Math.round((totalExpense / availableToSpend) * 100) : 0;
    elExpenseRatio.innerText = `${ratio}% dari Uang Belanja`;
  }

  const categories = [
    { key: 'Needs', title: 'Needs', spent: categorySpent.Needs, budget: config.budgetNeeds },
    { key: 'Wants', title: 'Wants', spent: categorySpent.Wants, budget: config.budgetWants },
    { key: 'Culture', title: 'Culture', spent: categorySpent.Culture, budget: config.budgetCulture },
    { key: 'Unexpected', title: 'Unexpected', spent: categorySpent.Unexpected, budget: config.budgetUnexpected }
  ].map(cat => {
    const budget = cat.budget || 0;
    const spent = cat.spent || 0;
    const remaining = budget - spent;
    const percent = budget > 0 ? Math.round((spent / budget) * 100) : (spent > 0 ? 100 : 0);
    let status = 'safe';
    if (percent >= 100) status = 'danger';
    else if (percent >= 80) status = 'warning';
    return { ...cat, remaining, percent, status };
  });

  renderKakeiboCards(categories);

  if (typeof Chart !== 'undefined') {
    renderDonutChart(categories);
    renderBarChart(categories);
  }

  txns.sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  renderRecentTransactions(txns.slice(0, 7));
  refreshIcons();
}

function renderKakeiboCards(categories) {
  const container = document.getElementById('kakeiboCardsContainer');
  if (!container) return;

  const colorConfig = {
    Needs: { borderClass: 'card-border-needs', barBg: 'bg-sky-500', lucideIcon: 'home', iconColor: 'text-sky-600 dark:text-sky-400', desc: 'Kebutuhan Pokok' },
    Wants: { borderClass: 'card-border-wants', barBg: 'bg-purple-600', lucideIcon: 'coffee', iconColor: 'text-purple-600 dark:text-purple-400', desc: 'Keinginan & Gaya Hidup' },
    Culture: { borderClass: 'card-border-culture', barBg: 'bg-amber-500', lucideIcon: 'book-open', iconColor: 'text-amber-600 dark:text-amber-400', desc: 'Wawasan, Seni & Buku' },
    Unexpected: { borderClass: 'card-border-unexpected', barBg: 'bg-rose-500', lucideIcon: 'alert-circle', iconColor: 'text-rose-600 dark:text-rose-400', desc: 'Biaya Tak Terduga' }
  };

  container.innerHTML = '';
  categories.forEach(cat => {
    const cfg = colorConfig[cat.key] || colorConfig.Needs;
    let statusBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Aman</span>`;
    let barColor = cfg.barBg;

    if (cat.status === 'danger') {
      statusBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 animate-overbudget">Overbudget</span>`;
      barColor = 'bg-rose-600';
    } else if (cat.status === 'warning') {
      statusBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">Mendekati Batas</span>`;
      barColor = 'bg-amber-500';
    }

    const card = document.createElement('div');
    card.className = `k-card p-5 ${cfg.borderClass} flex flex-col justify-between`;
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <div class="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 ${cfg.iconColor}">
              <i data-lucide="${cfg.lucideIcon}" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-extrabold text-sm text-stone-900 dark:text-stone-100">${cat.key}</h4>
              <p class="text-[10px] text-stone-400 font-medium">${cfg.desc}</p>
            </div>
          </div>
          ${statusBadge}
        </div>
        <div class="mt-3">
          <div class="flex justify-between items-baseline">
            <span class="text-xs text-stone-500 dark:text-stone-400">Terpakai</span>
            <span class="text-xs text-stone-400 dark:text-stone-500">Budget: ${formatRupiah(cat.budget)}</span>
          </div>
          <div class="text-lg font-black text-stone-900 dark:text-stone-100 mt-0.5">${formatRupiah(cat.spent)}</div>
        </div>
        <div class="mt-3">
          <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
            <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${Math.min(cat.percent, 100)}%"></div>
          </div>
          <div class="flex justify-between items-center text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-1.5">
            <span>${cat.percent}% terpakai</span>
            <span>Sisa: <strong class="${cat.remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}">${formatRupiah(cat.remaining)}</strong></span>
          </div>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
        <button onclick="viewCategoryHistory('${cat.key}')" class="text-[11px] font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center space-x-1">
          <span>Lihat transaksi</span>
          <i data-lucide="chevron-right" class="w-3 h-3"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function viewCategoryHistory(categoryKey) {
  switchTab('history');
  const catSelect = document.getElementById('filterCategory');
  if (catSelect) {
    catSelect.value = categoryKey;
    filterTransactions();
  }
}

function renderDonutChart(categories) {
  const canvas = document.getElementById('kakeiboDonutChart');
  const emptyMsg = document.getElementById('donutEmptyMsg');
  if (!canvas) return;

  const isDark = document.documentElement.classList.contains('dark');
  const labels = categories.map(c => c.key);
  const data = categories.map(c => c.spent);
  const total = data.reduce((a, b) => a + b, 0);

  if (total === 0) {
    if (emptyMsg) emptyMsg.classList.remove('hidden');
    if (state.chartDonut) state.chartDonut.destroy();
    return;
  }
  if (emptyMsg) emptyMsg.classList.add('hidden');
  if (state.chartDonut) state.chartDonut.destroy();

  const ctx = canvas.getContext('2d');
  state.chartDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#3182CE', '#805AD5', '#D69E2E', '#E53E3E'],
        borderWidth: 2,
        borderColor: isDark ? '#1C1B1A' : '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            color: isDark ? '#ECE9E2' : '#1A1918',
            font: { size: 11, family: 'Plus Jakarta Sans' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const val = ctx.parsed || 0;
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return ` ${ctx.label}: ${formatRupiah(val)} (${pct}%)`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });
}

function renderBarChart(categories) {
  const canvas = document.getElementById('kakeiboBarChart');
  if (!canvas) return;
  if (state.chartBar) state.chartBar.destroy();

  const isDark = document.documentElement.classList.contains('dark');
  const labels = categories.map(c => c.key);
  const budgets = categories.map(c => c.budget);
  const spents = categories.map(c => c.spent);

  const ctx = canvas.getContext('2d');
  state.chartBar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Anggaran', data: budgets, backgroundColor: isDark ? '#383734' : '#E2E8F0', borderRadius: 6 },
        { label: 'Realisasi', data: spents, backgroundColor: ['#3182CE', '#805AD5', '#D69E2E', '#E53E3E'], borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 10,
            color: isDark ? '#ECE9E2' : '#1A1918',
            font: { size: 11, family: 'Plus Jakarta Sans' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) { return ` ${ctx.dataset.label}: ${formatRupiah(ctx.parsed.y)}`; }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: isDark ? '#9E9B93' : '#73716B',
            callback: function(val) {
              if (val >= 1000000) return (val / 1000000) + ' Jt';
              if (val >= 1000) return (val / 1000) + ' Rb';
              return val;
            },
            font: { size: 10 }
          },
          grid: { color: isDark ? '#2D2C2A' : '#F2EFEB' }
        },
        x: {
          grid: { display: false },
          ticks: {
            color: isDark ? '#ECE9E2' : '#1A1918',
            font: { size: 11, weight: 'bold' }
          }
        }
      }
    }
  });
}

function renderRecentTransactions(transactions) {
  const tbody = document.getElementById('recentTxnTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (!transactions || transactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-stone-400">Belum ada transaksi di bulan ini.</td></tr>`;
    return;
  }

  transactions.forEach(t => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-stone-50 dark:hover:bg-stone-800/40 transition';
    const isIncome = t.jenis === 'Pemasukan';
    const badgeClass = isIncome ? 'badge-pemasukan' : `badge-${t.kategori.toLowerCase()}`;
    const nominalColor = isIncome ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-stone-900 dark:text-stone-100 font-bold';
    const prefix = isIncome ? '+' : '-';

    tr.innerHTML = `
      <td class="py-2.5 px-3 text-stone-500 dark:text-stone-400 whitespace-nowrap">${formatDateIndo(t.tanggal)}</td>
      <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${badgeClass}">${t.kategori}</span></td>
      <td class="py-2.5 px-3">
        <div class="font-semibold text-stone-800 dark:text-stone-200">${escapeHtml(t.subkategori)}</div>
        <div class="text-[11px] text-stone-400 truncate max-w-xs">${escapeHtml(t.catatan || '-')}</div>
      </td>
      <td class="py-2.5 px-3 text-stone-500 dark:text-stone-400">${escapeHtml(t.metode)}</td>
      <td class="py-2.5 px-3 text-right ${nominalColor} whitespace-nowrap">${prefix} ${formatRupiah(t.nominal)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ==============================================================================
// 7. INPUT TRANSAKSI CEPAT
// ==============================================================================

function setTransactionType(type) {
  const inputJenis = document.getElementById('txnJenis');
  const btnExpense = document.getElementById('btnTypeExpense');
  const btnIncome = document.getElementById('btnTypeIncome');
  const secCategory = document.getElementById('sectionKakeiboCategory');

  if (!inputJenis || !btnExpense || !btnIncome) return;
  inputJenis.value = type;

  if (type === 'Pengeluaran') {
    btnExpense.className = 'py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 bg-white dark:bg-stone-700 text-rose-600 dark:text-rose-400 shadow-2xs';
    btnIncome.className = 'py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200';
    if (secCategory) secCategory.classList.remove('hidden');
    selectCategory('Needs');
  } else {
    btnIncome.className = 'py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 shadow-2xs';
    btnExpense.className = 'py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200';
    if (secCategory) secCategory.classList.add('hidden');
    selectCategory('Pemasukan');
  }
}

function selectCategory(catName) {
  const inputKategori = document.getElementById('txnKategori');
  if (inputKategori) inputKategori.value = catName;

  ['Needs', 'Wants', 'Culture', 'Unexpected'].forEach(c => {
    const btn = document.getElementById('catBtn-' + c);
    if (!btn) return;
    if (c === catName) {
      if (c === 'Needs') btn.className = 'p-3 border-2 rounded-xl text-center transition border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300';
      if (c === 'Wants') btn.className = 'p-3 border-2 rounded-xl text-center transition border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300';
      if (c === 'Culture') btn.className = 'p-3 border-2 rounded-xl text-center transition border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300';
      if (c === 'Unexpected') btn.className = 'p-3 border-2 rounded-xl text-center transition border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300';
    } else {
      btn.className = 'p-3 border-2 rounded-xl text-center transition border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300';
    }
  });

  updateSubcategoryOptions(catName);
}

function updateSubcategoryOptions(categoryKey, selectedVal = '') {
  const select = document.getElementById('txnSubkategoriSelect');
  if (!select) return;

  const list = (state.categories && state.categories[categoryKey]) || [];
  select.innerHTML = '';

  if (list.length === 0) {
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '-- Belum ada subkategori, silakan tambah --';
    select.appendChild(emptyOpt);
  } else {
    list.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.textContent = sub;
      if (selectedVal && sub === selectedVal) opt.selected = true;
      select.appendChild(opt);
    });
  }

  const customOpt = document.createElement('option');
  customOpt.value = '__CUSTOM__';
  customOpt.textContent = '+ Tulis Subkategori Lainnya...';
  select.appendChild(customOpt);

  onSubcategorySelected(select.value);
}

function onSubcategorySelected(val) {
  const customInput = document.getElementById('txnSubkategoriCustom');
  if (!customInput) return;
  if (val === '__CUSTOM__') {
    customInput.classList.remove('hidden');
    customInput.focus();
  } else {
    customInput.classList.add('hidden');
    customInput.value = '';
  }
}

function toggleCustomSubcategory() {
  const select = document.getElementById('txnSubkategoriSelect');
  if (select) {
    select.value = '__CUSTOM__';
    onSubcategorySelected('__CUSTOM__');
  }
}

function updateNominalPreview(val) {
  const preview = document.getElementById('nominalPreviewBox');
  if (!preview) return;
  const num = parseInt(val, 10);
  if (isNaN(num) || num <= 0) {
    preview.innerText = 'Rp 0';
    return;
  }
  preview.innerHTML = `<strong>${formatRupiah(num)}</strong> <span class="text-stone-400">(${terbilang(num)})</span>`;
}

function addQuickNominal(amount) {
  const input = document.getElementById('txnNominal');
  if (!input) return;
  const current = parseInt(input.value, 10) || 0;
  input.value = current + amount;
  updateNominalPreview(input.value);
}

function clearNominal() {
  const input = document.getElementById('txnNominal');
  if (!input) return;
  input.value = '';
  updateNominalPreview(0);
}

function handleSaveTransaction(e) {
  e.preventDefault();

  const tanggal = document.getElementById('txnTanggal').value;
  const jenis = document.getElementById('txnJenis').value;
  const kategori = document.getElementById('txnKategori').value;
  const nominal = Number(document.getElementById('txnNominal').value);
  const metode = document.getElementById('txnMetode').value;
  const catatan = document.getElementById('txnCatatan').value.trim();

  let subkategori = document.getElementById('txnSubkategoriSelect').value;
  if (subkategori === '__CUSTOM__') {
    subkategori = document.getElementById('txnSubkategoriCustom').value.trim();
    if (!subkategori) {
      showToast('Ketik nama subkategori kustom.', 'warning');
      return;
    }
  }

  if (!tanggal || isNaN(nominal) || nominal <= 0) {
    showToast('Isi tanggal dan nominal dengan benar.', 'warning');
    return;
  }

  const txns = DB.get(STORAGE_KEYS.TRANSACTIONS, []);
  const newTxn = {
    id: generateId('TXN'),
    tanggal,
    jenis,
    kategori,
    subkategori,
    nominal,
    metode,
    catatan,
    createdAt: new Date().toISOString()
  };

  txns.push(newTxn);
  DB.set(STORAGE_KEYS.TRANSACTIONS, txns);

  showToast('Transaksi berhasil dicatat di HP!', 'success');
  document.getElementById('txnNominal').value = '';
  document.getElementById('txnCatatan').value = '';
  updateNominalPreview(0);

  loadAvailableMonths();
  loadDashboardData();
}

// ==============================================================================
// 8. KELOLA SUBKATEGORI (CRUD)
// ==============================================================================

function loadSubcategories() {
  state.subcategories = DB.get(STORAGE_KEYS.SUBCATEGORIES, []);
  const map = { Needs: [], Wants: [], Culture: [], Unexpected: [], Pemasukan: [] };
  state.subcategories.forEach(item => {
    if (item.status === 'Aktif') {
      if (!map[item.kategori]) map[item.kategori] = [];
      map[item.kategori].push(item.nama);
    }
  });
  state.categories = map;

  const currentCat = document.getElementById('txnKategori') ? document.getElementById('txnKategori').value : 'Needs';
  updateSubcategoryOptions(currentCat);
  renderSubcategoriesTable(state.subFilterActive);
  renderSubcategoriesSummary();
}

function openSubcategoryManager(defaultCategory = '') {
  resetSubcategoryForm();
  if (defaultCategory && ['Needs', 'Wants', 'Culture', 'Unexpected', 'Pemasukan'].includes(defaultCategory)) {
    filterModalSubcategories(defaultCategory);
  } else {
    filterModalSubcategories('Semua');
  }
  const modal = document.getElementById('subcategoryModal');
  if (modal) modal.classList.remove('hidden');
  refreshIcons();
}

function closeSubcategoryManager() {
  const modal = document.getElementById('subcategoryModal');
  if (modal) modal.classList.add('hidden');
}

function resetSubcategoryForm() {
  document.getElementById('subId').value = '';
  document.getElementById('subNama').value = '';
  document.getElementById('subStatusSelect').value = 'Aktif';
  document.getElementById('subFormTitleText').innerText = 'Tambah Subkategori Baru';
  document.getElementById('btnSubmitSubText').innerText = 'Simpan Subkategori';
  document.getElementById('btnCancelEditSub').classList.add('hidden');
}

function filterModalSubcategories(catKey) {
  state.subFilterActive = catKey;
  ['Semua', 'Needs', 'Wants', 'Culture', 'Unexpected', 'Pemasukan'].forEach(k => {
    const btn = document.getElementById('subFilterTab-' + k);
    if (!btn) return;
    btn.className = (k === catKey)
      ? 'sub-filter-btn px-2.5 py-1 text-[11px] font-bold rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-2xs'
      : 'sub-filter-btn px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700';
  });

  const sel = document.getElementById('subKategoriSelect');
  if (sel && catKey !== 'Semua') sel.value = catKey;
  renderSubcategoriesTable(catKey);
}

function renderSubcategoriesTable(filterCategory = 'Semua') {
  const tbody = document.getElementById('subTableBody');
  if (!tbody) return;

  let list = state.subcategories || [];
  if (filterCategory && filterCategory !== 'Semua') {
    list = list.filter(item => item.kategori === filterCategory);
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-stone-400">Belum ada subkategori pada kategori ini.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  list.forEach(item => {
    let catBadge = 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300';
    if (item.kategori === 'Needs') catBadge = 'badge-needs';
    else if (item.kategori === 'Wants') catBadge = 'badge-wants';
    else if (item.kategori === 'Culture') catBadge = 'badge-culture';
    else if (item.kategori === 'Unexpected') catBadge = 'badge-unexpected';
    else if (item.kategori === 'Pemasukan') catBadge = 'badge-pemasukan';

    const statusBadge = item.status === 'Aktif'
      ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Aktif</span>`
      : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-500">Nonaktif</span>`;

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-stone-50 dark:hover:bg-stone-800/40 transition';
    tr.innerHTML = `
      <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${catBadge}">${escapeHtml(item.kategori)}</span></td>
      <td class="py-2.5 px-3 font-semibold text-stone-800 dark:text-stone-200">${escapeHtml(item.nama)}</td>
      <td class="py-2.5 px-3">${statusBadge}</td>
      <td class="py-2.5 px-3 text-center whitespace-nowrap">
        <button type="button" onclick="editSubcategory('${item.id}')" class="p-1.5 text-stone-500 hover:text-emerald-600 rounded-lg mr-1">
          <i data-lucide="edit-3" class="w-4 h-4"></i>
        </button>
        <button type="button" onclick="confirmDeleteSubcategory('${item.id}')" class="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  refreshIcons();
}

function editSubcategory(subId) {
  const item = (state.subcategories || []).find(s => s.id === subId);
  if (!item) return;

  document.getElementById('subId').value = item.id;
  document.getElementById('subNama').value = item.nama;
  document.getElementById('subKategoriSelect').value = item.kategori;
  document.getElementById('subStatusSelect').value = item.status;
  document.getElementById('subFormTitleText').innerText = 'Edit: ' + item.nama;
  document.getElementById('btnSubmitSubText').innerText = 'Perbarui Subkategori';
  document.getElementById('btnCancelEditSub').classList.remove('hidden');
  document.getElementById('subNama').focus();
}

function handleSaveSubcategory(e) {
  e.preventDefault();
  const id = document.getElementById('subId').value;
  const kategori = document.getElementById('subKategoriSelect').value;
  const nama = document.getElementById('subNama').value.trim();
  const status = document.getElementById('subStatusSelect').value;

  if (!nama) return;
  let list = DB.get(STORAGE_KEYS.SUBCATEGORIES, []);

  if (id) {
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], kategori, nama, status };
      showToast('Subkategori berhasil diperbarui!');
    }
  } else {
    list.push({ id: generateId('SUB'), kategori, nama, status, createdAt: new Date().toISOString() });
    showToast('Subkategori berhasil ditambahkan!');
  }

  DB.set(STORAGE_KEYS.SUBCATEGORIES, list);
  resetSubcategoryForm();
  loadSubcategories();
}

function confirmDeleteSubcategory(subId) {
  const item = (state.subcategories || []).find(s => s.id === subId);
  const nama = item ? item.nama : 'subkategori ini';

  if (confirm(`Hapus subkategori "${nama}"?`)) {
    let list = DB.get(STORAGE_KEYS.SUBCATEGORIES, []);
    list = list.filter(s => s.id !== subId);
    DB.set(STORAGE_KEYS.SUBCATEGORIES, list);
    showToast('Subkategori dihapus!');
    loadSubcategories();
  }
}

function renderSubcategoriesSummary() {
  const container = document.getElementById('cfgSubcategoriesSummary');
  if (!container) return;

  const categories = [
    { key: 'Needs', title: 'Needs', badge: 'badge-needs' },
    { key: 'Wants', title: 'Wants', badge: 'badge-wants' },
    { key: 'Culture', title: 'Culture', badge: 'badge-culture' },
    { key: 'Unexpected', title: 'Unexpected', badge: 'badge-unexpected' },
    { key: 'Pemasukan', title: 'Pemasukan', badge: 'badge-pemasukan' }
  ];

  container.innerHTML = categories.map(cat => {
    const items = (state.subcategories || []).filter(s => s.kategori === cat.key && s.status === 'Aktif');
    const chips = items.length > 0
      ? items.map(s => `<span class="px-2 py-0.5 text-[11px] font-medium rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">${escapeHtml(s.nama)}</span>`).join('')
      : `<span class="text-xs text-stone-400 italic">Belum ada subkategori aktif.</span>`;

    return `
      <div class="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold ${cat.badge} px-2 py-0.5 rounded-lg border">${cat.title}</span>
          <button type="button" onclick="openSubcategoryManager('${cat.key}')" class="text-[11px] font-semibold text-stone-700 dark:text-stone-300 hover:underline">+ Kelola</button>
        </div>
        <div class="flex flex-wrap gap-1.5">${chips}</div>
      </div>
    `;
  }).join('');
}

// ==============================================================================
// 9. METODE PEMBAYARAN CONTROLLER
// ==============================================================================

function loadPaymentMethods() {
  state.paymentMethods = DB.get(STORAGE_KEYS.PAYMENT_METHODS, []);
  const methods = state.paymentMethods.filter(m => m.status === 'Aktif').map(m => m.nama);

  ['txnMetode', 'editTxnMetode'].forEach(sId => {
    const el = document.getElementById(sId);
    if (!el) return;
    const curr = el.value;
    el.innerHTML = '';
    methods.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      el.appendChild(opt);
    });
    if (curr && methods.includes(curr)) el.value = curr;
  });

  renderPaymentMethodsSummary();
  renderPaymentMethodsTable();
}

function renderPaymentMethodsSummary() {
  const container = document.getElementById('cfgPaymentMethodsSummary');
  if (!container) return;

  const active = (state.paymentMethods || []).filter(m => m.status === 'Aktif');
  if (active.length === 0) {
    container.innerHTML = `<span class="text-xs text-stone-400 italic">Belum ada metode pembayaran.</span>`;
    return;
  }
  container.innerHTML = active.map(m => `
    <span class="px-2.5 py-1 text-xs font-semibold rounded-lg border bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 flex items-center space-x-1">
      <span>${escapeHtml(m.nama)}</span>
      <span class="text-[10px] opacity-60">(${escapeHtml(m.kategori)})</span>
    </span>
  `).join('');
}

function openPaymentMethodManager() {
  resetPaymentMethodForm();
  renderPaymentMethodsTable();
  document.getElementById('paymentMethodModal').classList.remove('hidden');
  refreshIcons();
}

function closePaymentMethodManager() {
  document.getElementById('paymentMethodModal').classList.add('hidden');
}

function resetPaymentMethodForm() {
  document.getElementById('pmId').value = '';
  document.getElementById('pmNama').value = '';
  document.getElementById('pmKategori').value = 'Transfer Bank';
  document.getElementById('pmStatus').value = 'Aktif';
  document.getElementById('pmFormTitleText').innerText = 'Tambah Metode Baru';
  document.getElementById('btnSubmitPmText').innerText = 'Simpan Metode';
  document.getElementById('btnCancelEditPm').classList.add('hidden');
}

function editPaymentMethod(pmId) {
  const item = (state.paymentMethods || []).find(m => m.id === pmId);
  if (!item) return;

  document.getElementById('pmId').value = item.id;
  document.getElementById('pmNama').value = item.nama;
  document.getElementById('pmKategori').value = item.kategori;
  document.getElementById('pmStatus').value = item.status;
  document.getElementById('pmFormTitleText').innerText = 'Edit: ' + item.nama;
  document.getElementById('btnSubmitPmText').innerText = 'Perbarui Metode';
  document.getElementById('btnCancelEditPm').classList.remove('hidden');
  document.getElementById('pmNama').focus();
}

function handleSavePaymentMethod(e) {
  e.preventDefault();
  const id = document.getElementById('pmId').value;
  const nama = document.getElementById('pmNama').value.trim();
  const kategori = document.getElementById('pmKategori').value;
  const status = document.getElementById('pmStatus').value;

  if (!nama) return;
  let list = DB.get(STORAGE_KEYS.PAYMENT_METHODS, []);

  if (id) {
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], nama, kategori, status };
      showToast('Metode pembayaran diperbarui!');
    }
  } else {
    list.push({ id: generateId('MET'), nama, kategori, status, createdAt: new Date().toISOString() });
    showToast('Metode pembayaran ditambahkan!');
  }

  DB.set(STORAGE_KEYS.PAYMENT_METHODS, list);
  resetPaymentMethodForm();
  loadPaymentMethods();
}

function confirmDeletePaymentMethod(pmId) {
  const item = (state.paymentMethods || []).find(m => m.id === pmId);
  const nama = item ? item.nama : 'metode ini';

  if (confirm(`Hapus metode "${nama}"?`)) {
    let list = DB.get(STORAGE_KEYS.PAYMENT_METHODS, []);
    list = list.filter(m => m.id !== pmId);
    DB.set(STORAGE_KEYS.PAYMENT_METHODS, list);
    showToast('Metode dihapus!');
    loadPaymentMethods();
  }
}

function renderPaymentMethodsTable() {
  const tbody = document.getElementById('pmTableBody');
  if (!tbody) return;

  const list = state.paymentMethods || [];
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-stone-400">Belum ada metode terdaftar.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  list.forEach(m => {
    const statusBadge = m.status === 'Aktif'
      ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Aktif</span>`
      : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-500">Nonaktif</span>`;

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-stone-50 dark:hover:bg-stone-800/40 transition';
    tr.innerHTML = `
      <td class="py-2.5 px-3 font-bold text-stone-800 dark:text-stone-200">${escapeHtml(m.nama)}</td>
      <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">${escapeHtml(m.kategori)}</span></td>
      <td class="py-2.5 px-3">${statusBadge}</td>
      <td class="py-2.5 px-3 text-center whitespace-nowrap">
        <button type="button" onclick="editPaymentMethod('${m.id}')" class="p-1.5 text-stone-500 hover:text-emerald-600 rounded-lg mr-1">
          <i data-lucide="edit-3" class="w-4 h-4"></i>
        </button>
        <button type="button" onclick="confirmDeletePaymentMethod('${m.id}')" class="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  refreshIcons();
}

// ==============================================================================
// 10. RIWAYAT TRANSAKSI
// ==============================================================================

function loadHistoryData() {
  const allTxns = DB.get(STORAGE_KEYS.TRANSACTIONS, []);
  state.allTransactions = allTxns.filter(t => t.tanggal && t.tanggal.startsWith(state.currentMonth));
  state.allTransactions.sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  filterTransactions();
}

function debounceFilterTransactions() {
  clearTimeout(state.filterDebounceTimer);
  state.filterDebounceTimer = setTimeout(() => { filterTransactions(); }, 200);
}

function filterTransactions() {
  const search = (document.getElementById('filterSearch').value || '').toLowerCase().trim();
  const category = document.getElementById('filterCategory').value;
  const type = document.getElementById('filterType').value;

  const filtered = state.allTransactions.filter(t => {
    if (category !== 'Semua' && t.kategori.toLowerCase() !== category.toLowerCase()) return false;
    if (type !== 'Semua' && t.jenis.toLowerCase() !== type.toLowerCase()) return false;
    if (search) {
      const text = `${t.catatan} ${t.subkategori} ${t.metode} ${t.kategori} ${t.nominal}`.toLowerCase();
      if (!text.includes(search)) return false;
    }
    return true;
  });

  state.filteredTransactions = filtered;
  renderHistoryUI(filtered);
}

function resetFilters() {
  document.getElementById('filterSearch').value = '';
  document.getElementById('filterCategory').value = 'Semua';
  document.getElementById('filterType').value = 'Semua';
  filterTransactions();
}

function renderHistoryUI(transactions) {
  const tbody = document.getElementById('historyTableBody');
  const mobileContainer = document.getElementById('historyCardsMobile');
  const emptyState = document.getElementById('historyEmptyState');
  const countEl = document.getElementById('filteredCount');
  const monthEl = document.getElementById('filterActiveMonth');
  const sumIncomeEl = document.getElementById('filterSumIncome');
  const sumExpenseEl = document.getElementById('filterSumExpense');

  if (monthEl) monthEl.innerText = formatMonthIndo(state.currentMonth);
  if (countEl) countEl.innerText = transactions.length;

  let sumIncome = 0;
  let sumExpense = 0;
  transactions.forEach(t => {
    if (t.jenis === 'Pemasukan') sumIncome += Number(t.nominal);
    else sumExpense += Number(t.nominal);
  });

  if (sumIncomeEl) sumIncomeEl.innerText = formatRupiah(sumIncome);
  if (sumExpenseEl) sumExpenseEl.innerText = formatRupiah(sumExpense);

  if (transactions.length === 0) {
    if (tbody) tbody.innerHTML = '';
    if (mobileContainer) mobileContainer.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }
  if (emptyState) emptyState.classList.add('hidden');

  if (tbody) {
    tbody.innerHTML = '';
    transactions.forEach(t => {
      const isIncome = t.jenis === 'Pemasukan';
      const badgeClass = isIncome ? 'badge-pemasukan' : `badge-${t.kategori.toLowerCase()}`;
      const prefix = isIncome ? '+' : '-';
      const nomColor = isIncome ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-stone-900 dark:text-stone-100 font-bold';

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-stone-50 dark:hover:bg-stone-800/40 transition';
      tr.innerHTML = `
        <td class="py-3 px-4 text-stone-500 dark:text-stone-400 whitespace-nowrap">${formatDateIndo(t.tanggal)}</td>
        <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${badgeClass}">${t.kategori}</span></td>
        <td class="py-3 px-4 font-semibold text-stone-800 dark:text-stone-200">${escapeHtml(t.subkategori)}</td>
        <td class="py-3 px-4 text-stone-500 dark:text-stone-400 max-w-xs truncate">${escapeHtml(t.catatan || '-')}</td>
        <td class="py-3 px-4 text-stone-500 dark:text-stone-400">${escapeHtml(t.metode)}</td>
        <td class="py-3 px-4 text-right ${nomColor} whitespace-nowrap">${prefix} ${formatRupiah(t.nominal)}</td>
        <td class="py-3 px-4 text-center whitespace-nowrap">
          <button onclick="openEditModal('${t.id}')" class="p-1.5 text-stone-500 hover:text-emerald-600 rounded-lg mr-1">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="confirmDeleteTransaction('${t.id}')" class="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  if (mobileContainer) {
    mobileContainer.innerHTML = '';
    transactions.forEach(t => {
      const isIncome = t.jenis === 'Pemasukan';
      const badgeClass = isIncome ? 'badge-pemasukan' : `badge-${t.kategori.toLowerCase()}`;
      const borderClass = isIncome ? 'card-border-pemasukan' : `card-border-${t.kategori.toLowerCase()}`;
      const prefix = isIncome ? '+' : '-';
      const nomColor = isIncome ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-stone-900 dark:text-stone-100 font-bold';

      const card = document.createElement('div');
      card.className = `p-4 bg-white dark:bg-stone-900 ${borderClass} hover:bg-stone-50 dark:hover:bg-stone-800/40 transition`;
      card.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}">${t.kategori}</span>
              <span class="text-xs text-stone-400">${formatDateIndo(t.tanggal)}</span>
            </div>
            <h5 class="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">${escapeHtml(t.subkategori)}</h5>
            <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">${escapeHtml(t.catatan || '-')}</p>
            <div class="text-[11px] text-stone-400 mt-1 flex items-center space-x-1">
              <span>Metode:</span>
              <span class="font-medium text-stone-600 dark:text-stone-300">${escapeHtml(t.metode)}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-base ${nomColor}">${prefix} ${formatRupiah(t.nominal)}</div>
            <div class="flex items-center justify-end space-x-1 mt-3">
              <button onclick="openEditModal('${t.id}')" class="px-2.5 py-1 text-xs text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg">Edit</button>
              <button onclick="confirmDeleteTransaction('${t.id}')" class="px-2.5 py-1 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg">Hapus</button>
            </div>
          </div>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  }
  refreshIcons();
}

function openEditModal(txnId) {
  const allTxns = DB.get(STORAGE_KEYS.TRANSACTIONS, []);
  const txn = allTxns.find(t => t.id === txnId);
  if (!txn) return;

  document.getElementById('editTxnId').value = txn.id;
  document.getElementById('editModalSubtitle').innerText = 'ID: ' + txn.id;
  document.getElementById('editTxnTanggal').value = txn.tanggal;
  document.getElementById('editTxnJenis').value = txn.jenis;
  document.getElementById('editTxnKategori').value = txn.kategori;
  document.getElementById('editTxnNominal').value = txn.nominal;
  document.getElementById('editTxnMetode').value = txn.metode;
  document.getElementById('editTxnCatatan').value = txn.catatan || '';

  updateEditSubcategoryOptions(txn.kategori, txn.subkategori);
  document.getElementById('editModal').classList.remove('hidden');
  refreshIcons();
}

function updateEditSubcategoryOptions(categoryKey, selectedVal = '') {
  const select = document.getElementById('editTxnSubkategoriSelect');
  const customInput = document.getElementById('editTxnSubkategori');
  if (!select) return;

  const list = (state.categories && state.categories[categoryKey]) || [];
  select.innerHTML = '';

  let found = false;
  list.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    if (selectedVal && sub === selectedVal) { opt.selected = true; found = true; }
    select.appendChild(opt);
  });

  const customOpt = document.createElement('option');
  customOpt.value = '__CUSTOM__';
  customOpt.textContent = '+ Tulis Subkategori Lainnya...';
  select.appendChild(customOpt);

  if (selectedVal && !found) {
    select.value = '__CUSTOM__';
    if (customInput) {
      customInput.classList.remove('hidden');
      customInput.value = selectedVal;
    }
  } else {
    if (customInput) {
      customInput.classList.add('hidden');
      customInput.value = '';
    }
  }
}

function onEditSubcategorySelected(val) {
  const customInput = document.getElementById('editTxnSubkategori');
  if (!customInput) return;
  if (val === '__CUSTOM__') {
    customInput.classList.remove('hidden');
    customInput.focus();
  } else {
    customInput.classList.add('hidden');
    customInput.value = '';
  }
}

function toggleEditCustomSubcategory() {
  const select = document.getElementById('editTxnSubkategoriSelect');
  if (select) {
    select.value = '__CUSTOM__';
    onEditSubcategorySelected('__CUSTOM__');
  }
}

function closeEditModal() {
  document.getElementById('editModal').classList.add('hidden');
}

function onEditTypeChange(type) {
  const kat = document.getElementById('editTxnKategori');
  if (!kat) return;
  if (type === 'Pemasukan') kat.value = 'Pemasukan';
  else if (kat.value === 'Pemasukan') kat.value = 'Needs';
  updateEditSubcategoryOptions(kat.value);
}

function onEditCategoryChange(cat) {
  const jenis = document.getElementById('editTxnJenis');
  if (!jenis) return;
  jenis.value = (cat === 'Pemasukan') ? 'Pemasukan' : 'Pengeluaran';
  updateEditSubcategoryOptions(cat);
}

function handleUpdateTransaction(e) {
  e.preventDefault();
  const id = document.getElementById('editTxnId').value;
  const tanggal = document.getElementById('editTxnTanggal').value;
  const jenis = document.getElementById('editTxnJenis').value;
  const kategori = document.getElementById('editTxnKategori').value;
  const nominal = Number(document.getElementById('editTxnNominal').value);
  const metode = document.getElementById('editTxnMetode').value;
  const catatan = document.getElementById('editTxnCatatan').value.trim();

  let subkategori = document.getElementById('editTxnSubkategoriSelect').value;
  if (subkategori === '__CUSTOM__') {
    subkategori = document.getElementById('editTxnSubkategori').value.trim();
  }

  if (!tanggal || isNaN(nominal) || nominal <= 0 || !subkategori) return;

  let allTxns = DB.get(STORAGE_KEYS.TRANSACTIONS, []);
  const idx = allTxns.findIndex(t => t.id === id);
  if (idx !== -1) {
    allTxns[idx] = { ...allTxns[idx], tanggal, jenis, kategori, subkategori, nominal, metode, catatan };
    DB.set(STORAGE_KEYS.TRANSACTIONS, allTxns);
    showToast('Transaksi berhasil diperbarui!');
    closeEditModal();
    loadHistoryData();
    loadDashboardData();
  }
}

function confirmDeleteTransaction(txnId) {
  if (confirm('Hapus transaksi ini?')) {
    let allTxns = DB.get(STORAGE_KEYS.TRANSACTIONS, []);
    allTxns = allTxns.filter(t => t.id !== txnId);
    DB.set(STORAGE_KEYS.TRANSACTIONS, allTxns);
    showToast('Transaksi dihapus!');
    loadHistoryData();
    loadDashboardData();
  }
}

// ==============================================================================
// 11. REFLEKSI KAKEIBO
// ==============================================================================

function loadRefleksiData() {
  const targetLabel = document.getElementById('refleksiTargetMonth');
  if (targetLabel) targetLabel.innerText = formatMonthIndo(state.currentMonth);

  const list = DB.get(STORAGE_KEYS.REFLEKSI, []);
  state.refleksiList = list;

  const currentRef = list.find(r => r.bulan === state.currentMonth);
  document.getElementById('refleksiId').value = currentRef ? currentRef.id : '';
  document.getElementById('refYangBerjalanBaik').value = currentRef ? currentRef.yangBerjalanBaik || '' : '';
  document.getElementById('refPosYangBoros').value = currentRef ? currentRef.posYangBoros || '' : '';
  document.getElementById('refRencanaPerbaikan').value = currentRef ? currentRef.rencanaPerbaikan || '' : '';
  document.getElementById('refCatatanTambahan').value = currentRef ? currentRef.catatanTambahan || '' : '';

  renderPastReflections(list);
  refreshIcons();
}

function handleSaveRefleksi(e) {
  e.preventDefault();
  const id = document.getElementById('refleksiId').value;
  const q1 = document.getElementById('refYangBerjalanBaik').value.trim();
  const q2 = document.getElementById('refPosYangBoros').value.trim();
  const q3 = document.getElementById('refRencanaPerbaikan').value.trim();
  const q4 = document.getElementById('refCatatanTambahan').value.trim();

  if (!q1 || !q2 || !q3) return;

  let list = DB.get(STORAGE_KEYS.REFLEKSI, []);
  const payload = {
    id: id || generateId('REF'),
    bulan: state.currentMonth,
    periodeTipe: 'Bulanan',
    yangBerjalanBaik: q1,
    posYangBoros: q2,
    rencanaPerbaikan: q3,
    catatanTambahan: q4,
    createdAt: new Date().toISOString()
  };

  const existingIdx = list.findIndex(r => (id && r.id === id) || r.bulan === state.currentMonth);
  if (existingIdx !== -1) {
    list[existingIdx] = { ...list[existingIdx], ...payload };
    showToast('Refleksi Kakeibo diperbarui!');
  } else {
    list.unshift(payload);
    showToast('Refleksi Kakeibo dicatat!');
  }

  DB.set(STORAGE_KEYS.REFLEKSI, list);
  loadRefleksiData();
}

function renderPastReflections(reflections) {
  const container = document.getElementById('pastRefleksiContainer');
  if (!container) return;

  container.innerHTML = '';
  if (!reflections || reflections.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 italic">Belum ada arsip refleksi Kakeibo.</p>`;
    return;
  }

  reflections.forEach(ref => {
    const card = document.createElement('div');
    card.className = 'k-card p-5 border-l-4 border-l-emerald-600 space-y-3';
    card.innerHTML = `
      <div class="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
        <div class="flex items-center space-x-2">
          <span class="text-base font-bold text-stone-900 dark:text-stone-100">Bulan: ${formatMonthIndo(ref.bulan)}</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">${ref.periodeTipe || 'Bulanan'}</span>
        </div>
        <div class="flex items-center space-x-1">
          <button type="button" onclick="editRefleksi('${ref.id}')" class="px-2.5 py-1 text-xs text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg">Edit</button>
          <button type="button" onclick="confirmDeleteRefleksi('${ref.id}')" class="px-2.5 py-1 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg">Hapus</button>
        </div>
      </div>
      <div class="space-y-2 text-xs">
        <div>
          <span class="font-bold text-emerald-800 dark:text-emerald-400">1. Hal Baik:</span>
          <p class="text-stone-700 dark:text-stone-300 pl-4 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg mt-0.5">${escapeHtml(ref.yangBerjalanBaik || '-')}</p>
        </div>
        <div>
          <span class="font-bold text-rose-800 dark:text-rose-400">2. Pos Boros:</span>
          <p class="text-stone-700 dark:text-stone-300 pl-4 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-lg mt-0.5">${escapeHtml(ref.posYangBoros || '-')}</p>
        </div>
        <div>
          <span class="font-bold text-sky-800 dark:text-sky-400">3. Rencana Perbaikan:</span>
          <p class="text-stone-700 dark:text-stone-300 pl-4 bg-sky-50/50 dark:bg-sky-950/20 p-2.5 rounded-lg mt-0.5">${escapeHtml(ref.rencanaPerbaikan || '-')}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function editRefleksi(refId) {
  const item = (state.refleksiList || []).find(r => r.id === refId);
  if (!item) return;

  document.getElementById('refleksiId').value = item.id;
  document.getElementById('refYangBerjalanBaik').value = item.yangBerjalanBaik || '';
  document.getElementById('refPosYangBoros').value = item.posYangBoros || '';
  document.getElementById('refRencanaPerbaikan').value = item.rencanaPerbaikan || '';
  document.getElementById('refCatatanTambahan').value = item.catatanTambahan || '';

  const formEl = document.getElementById('formRefleksi');
  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
}

function confirmDeleteRefleksi(refId) {
  if (confirm('Hapus refleksi bulan ini?')) {
    let list = DB.get(STORAGE_KEYS.REFLEKSI, []);
    list = list.filter(r => r.id !== refId);
    DB.set(STORAGE_KEYS.REFLEKSI, list);
    showToast('Refleksi dihapus!');
    loadRefleksiData();
  }
}

// ==============================================================================
// 12. PENGATURAN ANGGARAN (CONFIG BULANAN)
// ==============================================================================

function loadConfigData() {
  const label = document.getElementById('configActiveMonthLabel');
  if (label) label.innerText = formatMonthIndo(state.currentMonth);

  const cfg = getLocalConfig(state.currentMonth);
  state.config = cfg;

  document.getElementById('cfgIncome').value = cfg.totalPemasukan || 0;
  document.getElementById('cfgSavings').value = cfg.targetTabungan || 0;
  document.getElementById('cfgBudgetNeeds').value = cfg.budgetNeeds || 0;
  document.getElementById('cfgBudgetWants').value = cfg.budgetWants || 0;
  document.getElementById('cfgBudgetCulture').value = cfg.budgetCulture || 0;
  document.getElementById('cfgBudgetUnexpected').value = cfg.budgetUnexpected || 0;
  document.getElementById('cfgCatatan').value = cfg.catatan || '';

  recalcConfigBalance();
  renderPaymentMethodsSummary();
  renderSubcategoriesSummary();
  refreshIcons();
}

function recalcConfigBalance() {
  const income = Number(document.getElementById('cfgIncome').value) || 0;
  const savings = Number(document.getElementById('cfgSavings').value) || 0;
  const bNeeds = Number(document.getElementById('cfgBudgetNeeds').value) || 0;
  const bWants = Number(document.getElementById('cfgBudgetWants').value) || 0;
  const bCulture = Number(document.getElementById('cfgBudgetCulture').value) || 0;
  const bUnexpected = Number(document.getElementById('cfgBudgetUnexpected').value) || 0;

  const availableSpend = Math.max(0, income - savings);
  const totalBudget = bNeeds + bWants + bCulture + bUnexpected;

  const availLabel = document.getElementById('cfgAvailableSpendLabel');
  if (availLabel) availLabel.innerText = formatRupiah(availableSpend);

  const totalLabel = document.getElementById('cfgTotalBudgetLabel');
  if (totalLabel) totalLabel.innerText = formatRupiah(totalBudget);

  const alertBox = document.getElementById('cfgBalanceAlert');
  if (alertBox) {
    if (totalBudget > availableSpend) {
      alertBox.className = 'p-3.5 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 space-y-2';
      alertBox.innerHTML = `
        <div class="flex items-center justify-between font-bold">
          <span class="flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Melebihi Uang Belanja</span>
          </span>
          <span class="text-sm font-black text-rose-600 dark:text-rose-400">${formatRupiah(totalBudget)}</span>
        </div>
        <div class="flex justify-between items-center text-[11px] opacity-85 pt-1.5 border-t border-rose-200 dark:border-rose-800/60">
          <span>Defisit (Kekurangan)</span>
          <strong class="font-bold text-rose-600 dark:text-rose-400">-${formatRupiah(totalBudget - availableSpend)}</strong>
        </div>
      `;
    } else {
      alertBox.className = 'p-3.5 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 space-y-2';
      alertBox.innerHTML = `
        <div class="flex items-center justify-between font-bold">
          <span class="flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Alokasi Seimbang</span>
          </span>
          <span class="text-sm font-black">${formatRupiah(totalBudget)}</span>
        </div>
        <div class="flex justify-between items-center text-[11px] opacity-85 pt-1.5 border-t border-emerald-200 dark:border-emerald-800/60">
          <span>Sisa alokasi bebas</span>
          <strong class="font-bold">${formatRupiah(availableSpend - totalBudget)}</strong>
        </div>
      `;
    }
  }
}

function handleSaveConfig(e) {
  e.preventDefault();
  const income = Number(document.getElementById('cfgIncome').value) || 0;
  const savings = Number(document.getElementById('cfgSavings').value) || 0;
  const bNeeds = Number(document.getElementById('cfgBudgetNeeds').value) || 0;
  const bWants = Number(document.getElementById('cfgBudgetWants').value) || 0;
  const bCulture = Number(document.getElementById('cfgBudgetCulture').value) || 0;
  const bUnexpected = Number(document.getElementById('cfgBudgetUnexpected').value) || 0;
  const catatan = document.getElementById('cfgCatatan').value.trim();

  const configs = DB.get(STORAGE_KEYS.CONFIGS, {});
  configs[state.currentMonth] = {
    bulan: state.currentMonth,
    totalPemasukan: income,
    targetTabungan: savings,
    budgetNeeds: bNeeds,
    budgetWants: bWants,
    budgetCulture: bCulture,
    budgetUnexpected: bUnexpected,
    catatan: catatan,
    updatedAt: new Date().toISOString()
  };

  DB.set(STORAGE_KEYS.CONFIGS, configs);
  showToast('Anggaran berhasil disimpan di HP!');
  loadDashboardData();
}

// ==============================================================================
// 13. CADANGAN (BACKUP) & PEMULIHAN DATA
// ==============================================================================

function exportBackupData() {
  const backup = {
    app: 'Kakeibo PWA',
    version: '2.0',
    exportDate: new Date().toISOString(),
    transactions: DB.get(STORAGE_KEYS.TRANSACTIONS, []),
    configs: DB.get(STORAGE_KEYS.CONFIGS, {}),
    refleksi: DB.get(STORAGE_KEYS.REFLEKSI, []),
    subcategories: DB.get(STORAGE_KEYS.SUBCATEGORIES, []),
    paymentMethods: DB.get(STORAGE_KEYS.PAYMENT_METHODS, [])
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute('href', dataStr);
  const nowStr = new Date().toISOString().substring(0, 10);
  dlAnchorElem.setAttribute('download', `kakeibo-backup-${nowStr}.json`);
  dlAnchorElem.click();

  showToast('File cadangan berhasil diunduh ke HP!', 'success');
}

function importBackupData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const backup = JSON.parse(e.target.result);
      if (!backup.transactions || !backup.configs) {
        throw new Error('Format file cadangan tidak valid');
      }

      if (confirm('Pulihkan data dari file cadangan ini? Data saat ini di HP akan ditimpa.')) {
        DB.set(STORAGE_KEYS.TRANSACTIONS, backup.transactions);
        DB.set(STORAGE_KEYS.CONFIGS, backup.configs);
        DB.set(STORAGE_KEYS.REFLEKSI, backup.refleksi || []);
        if (backup.subcategories) DB.set(STORAGE_KEYS.SUBCATEGORIES, backup.subcategories);
        if (backup.paymentMethods) DB.set(STORAGE_KEYS.PAYMENT_METHODS, backup.paymentMethods);

        showToast('Data berhasil dipulihkan 100%!', 'success');
        setTimeout(() => { window.location.reload(); }, 1000);
      }
    } catch (err) {
      alert('Gagal membaca file cadangan: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function resetAllData() {
  if (confirm('PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA DATA di HP ini? Pastikan Anda sudah mengunduh cadangan.')) {
    localStorage.clear();
    DB.initDefaults();
    showToast('Seluruh data berhasil di-reset!', 'info');
    setTimeout(() => { window.location.reload(); }, 1000);
  }
}
