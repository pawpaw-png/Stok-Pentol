const DATA_AWAL = [
    { nama: "Ori", awal: 300, stok: 300, modal: 150000 },
    { nama: "Tahu", awal: 50, stok: 50, modal: 25000 },
    { nama: "Puyuh", awal: 7, stok: 7, modal: 14000 },
    { nama: "Pangsit", awal: 7, stok: 7, modal: 7000 },
    { nama: "Urat", awal: 40, stok: 40, modal: 40000 },
    { nama: "Daging", awal: 40, stok: 40, modal: 40000 },
    { nama: "Keju", awal: 30, stok: 30, modal: 30000 },
    { nama: "Sosis", awal: 20, stok: 20, modal: 20000 },
    { nama: "Jamur", awal: 25, stok: 25, modal: 25000 },
    { nama: "Ati", awal: 20, stok: 20, modal: 20000 },
    { nama: "Mercon", awal: 25, stok: 25, modal: 25000 },
    { nama: "Jumbo", awal: 2, stok: 2, modal: 10000 }
];

const STORAGE_KEY = "HitungPentol";

let stok = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (!stok) {
    stok = JSON.parse(JSON.stringify(DATA_AWAL));
}

const grid = document.getElementById("stokGrid");
const totalSisa = document.getElementById("totalSisa");
const nilaiStok = document.getElementById("nilaiStok");
const totalTerjual = document.getElementById("totalTerjual");
const persentase = document.getElementById("persentase");
const tanggal = document.getElementById("tanggal");
const resetButton = document.getElementById("resetButton");

const cardMap = [];

if (tanggal) {
    tanggal.textContent = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function simpan() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(stok)
    );
}

function rupiah(angka) {
    return "Rp" + Math.round(angka).toLocaleString("id-ID");
}

function updateSummary() {

    let sisa = 0;
    let terjual = 0;
    let modal = 0;
    let totalAwal = 0;

    stok.forEach(item => {

        sisa += item.stok;
        terjual += item.awal - item.stok;
        totalAwal += item.awal;

        modal += (item.modal / item.awal) * item.stok;

    });

    if (totalSisa)
        totalSisa.textContent = sisa + " Biji";

    if (nilaiStok)
        nilaiStok.textContent = rupiah(modal);

    if (totalTerjual)
        totalTerjual.textContent = terjual + " Biji";

    if (persentase)
        persentase.textContent =
            Math.round((sisa / totalAwal) * 100) + "%";

}
function buatCard(item, index) {

    const card = document.createElement("div");
    card.className = "stokCard";

    card.innerHTML = `
        <h3>${item.nama}</h3>

        <div class="jumlah">${item.stok}</div>

        <div class="status"></div>

        <div class="control">
            <button class="minus">➖</button>
            <button class="plus">➕</button>
        </div>
    `;

    grid.appendChild(card);

    const data = {
        root: card,
        jumlah: card.querySelector(".jumlah"),
        status: card.querySelector(".status"),
        minus: card.querySelector(".minus"),
        plus: card.querySelector(".plus")
    };

    cardMap[index] = data;

    updateCard(index);

}

function updateCard(index) {

    const item = stok[index];
    const card = cardMap[index];

    if (!card) return;

    card.jumlah.textContent = item.stok;

    card.jumlah.classList.remove("pop");
    void card.jumlah.offsetWidth;
    card.jumlah.classList.add("pop");

    card.root.classList.remove("safe");
    card.root.classList.remove("low");
    card.root.classList.remove("empty");

    const persen = item.stok / item.awal;

    if (item.stok === 0) {

        card.root.classList.add("empty");
        card.status.textContent = "❌ Habis";

    } else if (persen <= 0.2) {

        card.root.classList.add("low");
        card.status.textContent = "⚠️ Hampir Habis";

    } else {

        card.root.classList.add("safe");
card.status.textContent = "🟢 Tersedia";

    }

}

function buatSemuaCard() {

    if (!grid) return;

    grid.innerHTML = "";

    cardMap.length = 0;

    stok.forEach((item, index) => {

        buatCard(item, index);

    });

}
function pasangHold(button, callback) {

    let delay;
    let interval;

    function mulai() {

        callback();

        delay = setTimeout(() => {

            interval = setInterval(callback, 100);

        }, 350);

    }

    function berhenti() {

        clearTimeout(delay);
        clearInterval(interval);

    }

    button.addEventListener("pointerdown", mulai);
    button.addEventListener("pointerup", berhenti);
    button.addEventListener("pointerleave", berhenti);
    button.addEventListener("pointercancel", berhenti);

}

cardMap.forEach((card, index) => {

    pasangHold(card.minus, () => {

        if (stok[index].stok <= 0) return;

        stok[index].stok--;

        updateCard(index);
        updateSummary();
        simpan();

    });

    pasangHold(card.plus, () => {

        if (stok[index].stok >= stok[index].awal) return;

        stok[index].stok++;

        updateCard(index);
        updateSummary();
        simpan();

    });

});

buatSemuaCard();

cardMap.forEach((card, index) => {

    pasangHold(card.minus, () => {

        if (stok[index].stok <= 0) return;

        stok[index].stok--;

        updateCard(index);
        updateSummary();
        simpan();

    });

    pasangHold(card.plus, () => {

        if (stok[index].stok >= stok[index].awal) return;

        stok[index].stok++;

        updateCard(index);
        updateSummary();
        simpan();

    });

});

updateSummary();

if (resetButton) {

    resetButton.addEventListener("click", () => {

        if (!confirm("Reset stok ke kondisi awal?")) return;

        stok = JSON.parse(JSON.stringify(DATA_AWAL));

        simpan();

        stok.forEach((item, index) => {

            updateCard(index);

        });

        updateSummary();

    });

}