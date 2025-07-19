document.addEventListener('DOMContentLoaded', function() {
    // Aquí puedes agregar funcionalidad JavaScript si es necesario
    console.log('Página cargada');
    
    // Ejemplo: Manejar clic en el botón de inicio de sesión
    document.getElementById('login-btn').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Botón de inicio de sesión clickeado');
        // Aquí iría la lógica para mostrar el formulario de inicio de sesión
    });
});

const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
let currentIndex = 0;

function updateCarousel() {
  const width = slides[0].offsetWidth;
  track.style.transform = `translateX(-${currentIndex * width}px)`;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto play cada 4 segundos
setInterval(nextSlide, 4000);

// Ajusta al redimensionar la ventana
window.addEventListener('resize', updateCarousel);

// Aquí podrías agregar filtros o comportamiento dinámico
console.log("Página de anime cargada correctamente.");

