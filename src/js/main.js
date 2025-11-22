document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }
});

// slider
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".testimonials__track");
  const slides = document.querySelectorAll(".testimonials__item");
  const dotsContainer = document.querySelector(".testimonials__dots");
  const prevBtn = document.querySelector(".testimonials__arrow--prev");
  const nextBtn = document.querySelector(".testimonials__arrow--next");

  let currentIndex = 0;
  let slideCount = slides.length;
  let autoSlideInterval;

  function getVisibleSlides() {
    if (window.innerWidth >= 768) return 3;
    return 1;
  }

  function createDots() {
    dotsContainer.innerHTML = "";
    const visible = getVisibleSlides();
    const pages = Math.ceil(slideCount / visible);

    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("div");
      dot.classList.add("testimonials__dot");
      if (i === Math.floor(currentIndex / visible)) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        currentIndex = i * visible;
        updateSlider();
        stopAutoSlide(); //
        startAutoSlide();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const visible = getVisibleSlides();
    const slide = slides[0];
    if (!slide) return;

    const slideWidth = slide.getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const offset = currentIndex * (slideWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    createDots();
  }

  function nextSlide() {
    const visible = getVisibleSlides();
    currentIndex = (currentIndex + visible) % slideCount;
    updateSlider();
  }

  function prevSlide() {
    const visible = getVisibleSlides();
    currentIndex = (currentIndex - visible + slideCount) % slideCount;
    updateSlider();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3000);
  }
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });
  prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  window.addEventListener("resize", updateSlider);

  updateSlider();
  startAutoSlide();

  let startX = 0;
  let isSwiping = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    track.style.transition = "none";
  });

  track.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    const deltaX = e.touches[0].clientX - startX;
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const offset = currentIndex * (slideWidth + gap) - deltaX;
    track.style.transform = `translateX(-${offset}px)`;
  });

  track.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    isSwiping = false;
    track.style.transition = "transform 0.5s ease";

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else {
      updateSlider();
    }
  });
});
// PRICE
document.addEventListener('DOMContentLoaded', () => {

  const section = document.querySelector('[data-pricing-id="main"]');
  const monthlyBtn = section.querySelector('.pricing__btn--monthly');
  const yearlyBtn = section.querySelector('.pricing__btn--yearly');
  const cards = section.querySelectorAll('.pricing__cart');

  function updatePrices(mode) {
    cards.forEach((card) => {
      const price = mode === 'yearly' ? card.dataset.year : card.dataset.month;
      const amountSpan = card.querySelector('.pricing__amount');
      if (amountSpan) {
        amountSpan.textContent = price;
      }
    });

    monthlyBtn.classList.toggle('active', mode === 'monthly');
    yearlyBtn.classList.toggle('active', mode === 'yearly');
  }

  monthlyBtn.addEventListener('click', () => {
    updatePrices('monthly');
  });

  yearlyBtn.addEventListener('click', () => {
    updatePrices('yearly');
  });

  updatePrices('monthly');
});

// button go to top
document.addEventListener('DOMContentLoaded', () => {
   const goToBtn = document.querySelector('.footer__nav-gotop');
   if (goToBtn) {
      goToBtn.addEventListener('click', () => {
         window.scrollTo({
            top: 0,
            behavior: 'smooth'
         });
      });
   }
});

//tabs
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.team__tab');
  const members = document.querySelectorAll('.team__member');

  // Мапа: вкладка → список індексів учасників
  const groupMap = {
    0: [0, 1, 2 , 3], // Management Team
    1: [2],    // Nutritionists and Dietitians
    2: [1],     // Nutritionists and Dietitians (дубль)
    3: [3],    // Marketing and Communications
    4: [0]      // Technology and Development
  };

  // ✅ Показати учасників групи 0 при старті
  const initialGroup = "0";
  members.forEach((member, index) => {
    if (groupMap[initialGroup].includes(index)) {
      member.classList.add('active');
    } else {
      member.classList.remove('active');
    }
  });

  // Обробка кліків по вкладках
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.member;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      members.forEach((member, index) => {
        if (groupMap[group] && groupMap[group].includes(index)) {
          member.classList.add('active');
        } else {
          member.classList.remove('active');
        }
      });
    });
  });
});

//acrdeon
document.addEventListener('DOMContentLoaded', () => {
  const accordItems = document.querySelectorAll('.pricing__accordeon-item');

  accordItems.forEach(item => {
    const header = item.querySelector('.pricing__accordeon-header');
    const icon = item.querySelector('.pricing__accordeon-icon');

    header.addEventListener('click', () => {
      // Закриваємо всі інші
      accordItems.forEach(i => {
        if (i !== item) {
          i.classList.remove('active');
          i.querySelector('.pricing__accordeon-icon').textContent = '+'; // повертаємо плюс
        }
      });

      // Перемикаємо поточний
      item.classList.toggle('active');

      // Змінюємо іконку
      icon.textContent = item.classList.contains('active') ? '×' : '+';
    });
  });
});

// tabs blog
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.blog__tab');   // всі кнопки табів
  const posts = document.querySelectorAll('.blog__post'); // всі статті

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1. Зняти активний клас з усіх табів
      tabs.forEach(t => t.classList.remove('active'));

      // 2. Додати активний клас до поточного
      tab.classList.add('active');

      // 3. Взяти категорію з data-атрибуту
      const category = tab.dataset.category;

      // 4. Фільтрувати пости
      posts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
          post.style.display = 'block'; // показати
        } else {
          post.style.display = 'none';  // приховати
        }
      });
    });
  });
});