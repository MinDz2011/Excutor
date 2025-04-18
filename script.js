document.getElementById("search-input").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const cards = document.querySelectorAll(".card");
  
    cards.forEach(card => {
      const title = card.querySelector("h2").textContent.toLowerCase();
      if (title.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
  
  // Get modal elements
  const modal = document.getElementById("updateModal");
  const modalVersion = document.getElementById("modalVersion");
  const changelogContent = document.getElementById("changelogContent");
  const updateButtons = document.querySelectorAll(".btn.update");
  const closeBtn = document.querySelector(".close");
  
  // Add click event to all update buttons
  updateButtons.forEach(button => {
    button.addEventListener("click", () => {
      const version = button.getAttribute("data-version");
      const changelog = button.getAttribute("data-changelog");
      
      if (!changelog) {
        showNotification("No updates available for this executor!");
        return;
      }
      
      // Format changelog text (split by newlines and create list items)
      const changelogLines = changelog.split('\n');
      const formattedChangelog = changelogLines.map(line => 
        line.startsWith('+') ? `<li>${line}</li>` : `<h3>${line}</h3>`
      ).join('');
  
      modalVersion.textContent = version;
      changelogContent.innerHTML = `<ul>${formattedChangelog}</ul>`;
      modal.style.display = "block";
      
      // Thêm delay nhỏ để animation hoạt động
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
    });
  });
  
  // Cập nhật đóng modal
  function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
  
  closeBtn.addEventListener("click", closeModal);
  
  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      closeModal();
    }
  });
  
  // Webhook Discord configuration
  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1358667839388647454/V0-AyioPMYCLadawU7MF0gqrcFRMBRBm585fvhHeHq2PyR-VVe_UcDEOIfhEuT0JovtJ';
  
  // Function to send data to Discord webhook
  async function sendToDiscord(message, type) {
      try {
          // Get user's IP and location
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          const ip = ipData.ip;
  
          // Get additional location info
          const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
          const locationData = await locationResponse.json();
  
          // Format timestamp
          const timestamp = new Date().toLocaleString();
  
          // Create embed message for Discord
          const embedData = {
              embeds: [{
                  title: type === 'visit' ? '🌐 New Website Visit' : 
                         type === 'download' ? '⬇️ New Download' : '👀 Update View',
                  color: type === 'visit' ? 3447003 : 
                         type === 'download' ? 15158332 : 10181046,
                  fields: [
                      {
                          name: '📍 Location',
                          value: `Country: ${locationData.country_name}\nCity: ${locationData.city}\nRegion: ${locationData.region}`,
                          inline: true
                      },
                      {
                          name: '🔧 Technical Info',
                          value: `IP: ${ip}\nBrowser: ${navigator.userAgent}`,
                          inline: true
                      },
                      {
                          name: '📝 Details',
                          value: message
                      }
                  ],
                  timestamp: new Date(),
                  footer: {
                      text: 'Yushiha Oren Tracking System'
                  }
              }]
          };
  
          // Send to Discord
          await fetch(DISCORD_WEBHOOK_URL, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(embedData)
          });
      } catch (error) {
          console.error('Error sending to Discord:', error);
      }
  }
  
  // Track page visits
  document.addEventListener('DOMContentLoaded', () => {
      sendToDiscord('User visited the website', 'visit');
  });
  
  // Track downloads
  document.querySelectorAll('.btn.download').forEach(button => {
      button.addEventListener('click', function() {
          const executorName = this.closest('.card').querySelector('h2').textContent;
          sendToDiscord(`Downloaded ${executorName}`, 'download');
      });
  });
  
  // Track update views
  document.querySelectorAll('.btn.update').forEach(button => {
      button.addEventListener('click', function() {
          const executorName = this.closest('.card').querySelector('h2').textContent;
          sendToDiscord(`Viewed updates for ${executorName}`, 'update');
      });
  });
  
  const searchInput = document.getElementById("search-input");
  const searchContainer = document.querySelector(".search-container");
  
  // Đảm bảo placeholder hiển thị ngay từ đầu
  searchInput.setAttribute("placeholder", "Search executors...");
  
  // Xử lý khi click vào input lần đầu
  searchInput.addEventListener("focus", function() {
      if (this.value === "Search executors...") {
          this.value = "";
      }
  });
  
  // Xử lý khi blur (click ra ngoài) input
  searchInput.addEventListener("blur", function() {
      if (this.value === "") {
          this.value = "Search executors...";
      }
  });
  
  let searchTimeout;
  searchInput.addEventListener("input", function() {
      const query = this.value.toLowerCase();
      
      // Không tìm kiếm nếu là text mặc định
      if (query === "search executors...") return;
      
      // Clear timeout cũ nếu có
      clearTimeout(searchTimeout);
      
      // Đặt timeout mới với delay 1.5 giây
      searchTimeout = setTimeout(() => {
          const cards = document.querySelectorAll(".card");
          let hasResults = false;
  
          cards.forEach(card => {
              const title = card.querySelector("h2").textContent.toLowerCase();
              if (title.includes(query)) {
                  card.style.display = "block";
                  hasResults = true;
              } else {
                  card.style.display = "none";
              }
          });
  
          // Hiển thị "No executors found" trong ô input khi không tìm thấy
          if (!hasResults && query !== '') {
              this.value = ""; // Xóa text đã nhập
              this.value = "No executors found";
              
              // Sau 2 giây, đặt lại text mặc định
              setTimeout(() => {
                  this.value = "Search executors...";
              }, 2000);
          }
  
      }, 1500);
  });
  
  // Reset khi xóa hết text
  searchInput.addEventListener("keyup", function(e) {
      if (this.value === "") {
          const cards = document.querySelectorAll(".card");
          cards.forEach(card => card.style.display = "block");
      }
  });
  
  // Đảm bảo placeholder luôn hiển thị khi focus out
  searchInput.addEventListener("focusout", function() {
      if (this.value === "") {
          this.setAttribute("placeholder", "Search executors...");
      }
  });
  
  // Reset placeholder khi focus vào input
  searchInput.addEventListener("focus", function() {
      if (this.getAttribute("placeholder") === "No executors found") {
          this.setAttribute("placeholder", "Search executors...");
      }
  });
  
  // Preload ảnh
  const preloadImage = new Image();
  preloadImage.src = "https://share.creavite.co/67c45a5989908441e5523943.gif";
  
  // Hàm hiển thị thông báo
  function showNotification(message, imageUrl) {
      const notification = document.createElement('div');
      notification.className = 'notification';
  
      // Nội dung thông báo
      notification.innerHTML = `
          <div class="notification-content">
              <span class="close-x">×</span> 
              <p>${message}</p>
              ${imageUrl ? `<img src="${imageUrl}" class="notification-img" alt="Notification Image">` : ''}
              <div class="notification-buttons">
                  <button class="dismiss-btn">Đóng</button>
                  <button class="dismiss-24h-btn">Đóng 24h</button>
              </div>
          </div>
      `;
  
      // Chèn notify vào ngay đầu body
      document.body.insertAdjacentElement("afterbegin", notification);
  
      // Hiển thị notify
      setTimeout(() => notification.classList.add('show'), 10);
  
      // Xử lý đóng notify
      notification.querySelector('.close-x').addEventListener('click', () => {
          notification.classList.remove('show');
          setTimeout(() => notification.remove(), 300);
      });
  
      notification.querySelector('.dismiss-btn').addEventListener('click', () => {
          notification.classList.remove('show');
          setTimeout(() => notification.remove(), 300);
      });
  
      notification.querySelector('.dismiss-24h-btn').addEventListener('click', () => {
          notification.classList.remove('show');
          setTimeout(() => notification.remove(), 300);
          localStorage.setItem('notificationDismissed', Date.now());
      });
  
      // Kiểm tra tắt 24h
      const lastDismissed = localStorage.getItem('notificationDismissed');
      if (lastDismissed && Date.now() - lastDismissed < 24 * 60 * 60 * 1000) {
          notification.remove();
      }
  }
  
  // Hiển thị notify sau 1 giây khi tải trang
  window.addEventListener('load', () => {
      setTimeout(() => {
          showNotification("Welcome to YuongzMin Executor Hub! 🚀", "https://cdn.discordapp.com/attachments/1281022650222772294/1349276146138877962/giphy.gif?ex=67d7c8d5&is=67d67755&hm=48a26ccf3fb73f4db26a3922aacbec46e125617d3d24ee2dae414c5c6bcd1483&");
      }, 1000);
  });
  // Thêm animation khi scroll
  window.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (cardTop < windowHeight * 0.85) {
        card.classList.add('card-visible');
      }
    });
  });
  
