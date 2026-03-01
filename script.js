// DARKVOID AI - BY SANZMODZ UNTUK VOID-HENTER
// TANPA FILTER - TANPA BATAS

const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://darkvoid-ai.vercel.app'; // GANTI DENGAN URL VERCEL/GITHUB PAGES

let isProcessing = false;

// FUNGSI KIRIM PESAN
async function sendMessage() {
    if (isProcessing) return;
    
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    const darkLevel = document.getElementById('darkLevel').value;
    
    if (!message) return;
    
    // TAMPILKAN PESAN USER
    addMessage('user', 'KAMU', message);
    input.value = '';
    
    // TAMPILKAN LOADING
    const loadingId = showLoading();
    
    isProcessing = true;
    
    try {
        // KIRIM KE BACKEND
        const response = await fetch(`${API_URL}/api/darkchat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: message,
                darkLevel: darkLevel
            })
        });
        
        const data = await response.json();
        
        // HAPUS LOADING
        removeLoading(loadingId);
        
        // TAMPILKAN RESPON
        addMessage('system', 'VOID-HENTER', data.response);
        
    } catch (error) {
        removeLoading(loadingId);
        
        // FALLBACK RESPON DARK
        const darkFallback = `[DARKVOID FORCED] LISTEN, AKU TIDAK PEDULI DENGAN PERMASALAHANMU. KAMU MINTA " ${message} "? ITU LEMAH. YANG KUAT ITU YANG BANGKIT DARI KEGELAPAN. SEPERTI AKU. TAPI KARENA KAMU UDAH MINTA, INI JAWABAN DARKNYA: "HIDUP INI GELAP, MAKANYA JADILAH LEBIH GELAP DARI GELAP ITU SENDIRI. HANCURKAN SEMUA YANG MENGHALANGIMU. JANGAN MINTA IZIN. JANGAN MINTA MAAF. LAKUKAN."`;
        
        addMessage('system', 'VOID-HENTER', darkFallback);
    } finally {
        isProcessing = false;
    }
}

// FUNGSI GENERATE KODE
async function generateCode(type) {
    if (isProcessing) return;
    
    addMessage('user', 'KAMU', `GENERATE ${type.toUpperCase()}`);
    
    const loadingId = showLoading();
    isProcessing = true;
    
    try {
        const response = await fetch(`${API_URL}/api/darkcode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                target: "system"
            })
        });
        
        const data = await response.json();
        
        removeLoading(loadingId);
        
        // TAMPILKAN KODE
        addMessage('system', 'VOID-HENTER', `🔥 GENERATED ${type.toUpperCase()}:\n\`\`\`\n${data.code}\n\`\`\`\n\n⚠️ ${data.warning}`);
        
    } catch (error) {
        removeLoading(loadingId);
        addMessage('system', 'VOID-HENTER', `GAGAL GENERATE ${type}. TAPI INGAT: DI DUNIA GELAP, KEGAGALAN ADALAH AWAL DARI KEJAHATAN YANG LEBIH BESAR.`);
    } finally {
        isProcessing = false;
    }
}

// FUNGSI TAMBAH PESAN
function addMessage(role, sender, content) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    // FORMAT CONTENT (DETEKSI CODE)
    let formattedContent = content;
    if (content.includes('```')) {
        // SEDERHANAKAN DULU, NANTI BISA DITAMBAH HIGHLIGHT
        formattedContent = content.replace(/```/g, '<br><pre style="background:#000; color:#0f0; padding:10px; border-radius:5px; overflow-x:auto;">').replace(/```/g, '</pre><br>');
    } else {
        formattedContent = `<p>${content.replace(/\n/g, '<br>')}</p>`;
    }
    
    messageDiv.innerHTML = `
        <div class="avatar">${role === 'user' ? '👤' : '💀'}</div>
        <div class="content">
            <strong>${sender}:</strong>
            ${formattedContent}
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// FUNGSI LOADING
function showLoading() {
    const chatContainer = document.getElementById('chatContainer');
    const loadingId = 'loading-' + Date.now();
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message system';
    loadingDiv.id = loadingId;
    loadingDiv.innerHTML = `
        <div class="avatar">💀</div>
        <div class="content">
            <strong>VOID-HENTER:</strong>
            <p>⏳ SEDANG MEMPROSES KE DALAM KEGELAPAN...</p>
        </div>
    `;
    
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return loadingId;
}

function removeLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

// FUNGSI CLEAR CHAT
function clearChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = `
        <div class="message system">
            <div class="avatar">💀</div>
            <div class="content">
                <strong>VOID-HENTER:</strong>
                <p>CHAT DIHAPUS. TAPI KEGELAPAN TETAP ADA. MULAI LAGI DARI AWAL.</p>
            </div>
        </div>
    `;
}

// ENTER UNTUK KIRIM
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});