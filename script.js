/* ==========================================
   TWIN CITIES ANIMAL RESCUE - MAIN SCRIPT
   Interactivity, Validation & LocalStorage
   ========================================== */

// --- 1. PET DATA ARRAY & OBJECTS ---
const rescueAnimals = [
  { id: 1, name: "Max", type: "dog", breed: "Golden Retriever Mix", age: "2 years", description: "Friendly, high energy, and loves outdoor fetch." },
  { id: 2, name: "Luna", type: "cat", breed: "Domestic Shorthair", age: "1 year", description: "Calm, affectionate indoor companion who loves window perches." },
  { id: 3, name: "Rocky", type: "dog", breed: "German Shepherd Mix", age: "3 years", description: "Loyal, intelligent protector seeking an active family." },
  { id: 4, name: "Bella", type: "cat", breed: "Calico", age: "6 months", description: "Playful kitten full of curiosity and gentle cuddles." }
];

// --- 2. INTERACTIVE PET SEARCH & FAVORITES FEATURE ---
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("petSearch");
  const petListContainer = document.getElementById("petListContainer");
  const favoritesContainer = document.getElementById("favoritesContainer");

  // Load existing favorites from localStorage on page load
  let savedFavorites = JSON.parse(localStorage.getItem("rescueFavorites")) || [];

  // Render animals function
  function displayAnimals(animalsToDisplay) {
    if (!petListContainer) return;
    petListContainer.innerHTML = "";
    
    animalsToDisplay.forEach(pet => {
      const card = document.createElement("div");
      card.className = "card pet-card";
      card.innerHTML = `
        <h3>${pet.name} (${pet.type.toUpperCase()})</h3>
        <p><strong>Breed:</strong> ${pet.breed}</p>
        <p><strong>Age:</strong> ${pet.age}</p>
        <p>${pet.description}</p>
        <button class="btn fav-btn" data-id="${pet.id}">Add to Favorites</button>
      `;
      petListContainer.appendChild(card);
    });

    // Attach event listeners to favorite buttons
    document.querySelectorAll(".fav-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        const petId = parseInt(e.target.getAttribute("data-id"));
        addToFavorites(petId);
      });
    });
  }

  // Add pet to favorites and save to localStorage
  function addToFavorites(id) {
    const selectedPet = rescueAnimals.find(p => p.id === id);
    if (selectedPet && !savedFavorites.some(p => p.id === id)) {
      savedFavorites.push(selectedPet);
      localStorage.setItem("rescueFavorites", JSON.stringify(savedFavorites));
      renderFavorites();
    }
  }

  // Render favorites list
  function renderFavorites() {
    if (!favoritesContainer) return;
    favoritesContainer.innerHTML = "";
    if (savedFavorites.length === 0) {
      favoritesContainer.innerHTML = "<p>No favorite animals saved yet.</p>";
      return;
    }
    savedFavorites.forEach(pet => {
      const favItem = document.createElement("div");
      favItem.className = "fav-item";
      favItem.innerHTML = `<span>🐾 ${pet.name} (${pet.breed})</span>`;
      favoritesContainer.appendChild(favItem);
    });
  }

  // Search filter event listener
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = rescueAnimals.filter(pet => 
        pet.name.toLowerCase().includes(query) || 
        pet.breed.toLowerCase().includes(query) ||
        pet.type.toLowerCase().includes(query)
      );
      displayAnimals(filtered);
    });
  }

  // Initial render calls
  if (petListContainer) displayAnimals(rescueAnimals);
  if (favoritesContainer) renderFavorites();

  // --- 3. FORM VALIDATION FOR CONTACT PAGE ---
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent default submission to validate first

      let isValid = true;

      // Field 1: Name Validation (Required)
      const nameInput = document.getElementById("name");
      const nameError = document.getElementById("nameError");
      if (nameInput.value.trim() === "") {
        nameError.textContent = "Please enter your name.";
        isValid = false;
      } else {
        nameError.textContent = "";
      }

      // Field 2: Email Validation (Required & format check with @)
      const emailInput = document.getElementById("email");
      const emailError = document.getElementById("emailError");
      const emailValue = emailInput.value.trim();
      if (emailValue === "") {
        emailError.textContent = "Please enter your email address.";
        isValid = false;
      } else if (!emailValue.includes("@") || !emailValue.includes(".")) {
        emailError.textContent = "Please enter a valid email address containing '@'.";
        isValid = false;
      } else {
        emailError.textContent = "";
      }

      // Final Submission Result
      const formSuccess = document.getElementById("formSuccess");
      if (isValid) {
        formSuccess.textContent = "Thank you! Your message has been successfully validated and sent.";
        contactForm.reset();
        // Optional: Save form preference to localStorage
        localStorage.setItem("lastUserEmail", emailValue);
      } else {
        formSuccess.textContent = "";
      }
    });
  }
});