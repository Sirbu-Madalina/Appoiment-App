<template>
  <body>
    <header>
      <img class="logo" src="../src/img/Alinalogo.png" alt="logo" />
      <button class="hamburger" @click="toggleMenu">☰</button>
    </header>
    <nav :class="{ 'active': isMenuOpen }">
      <router-link to="/" exact @click="toggleMenu">Home</router-link>
      <router-link to="/appointment" @click="toggleMenu">Appointment</router-link>
      <router-link v-if="!isLoggedIn" to="/signin" @click="toggleMenu">Sign In</router-link>
      <button @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
    </nav>
    <RouterView /> 
  </body>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter(); //get the router object
const isLoggedIn = ref(false);

let auth;
onMounted(() => {
  auth = getAuth(); //get the auth object
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSignOut = () => { //function to sign out
  signOut(auth).then(() => {
    router.push("/");
  });
};

// Menu state
const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value; // Toggle the menu state
};
</script>

<style>
* {
  margin: 0;
  margin-top: 5px;
  padding: 0;
  box-sizing: border-box;
  background-color: #F1F1F1;
}

header {
  line-height: 1.5;
  display: flex;
  justify-content: space-evenly; /* Space between logo and hamburger */
  align-items: center; 
}

.logo {
  display: block;
  margin: 0 auto 0rem;
  border-radius: 10px;
  width: auto;
  height: 70px;
  margin-bottom: 10px;
}

nav.active {
  display: block; /* Show nav when active */
  text-align: center;
}

nav a.router-link-exact-active {
  background-color: #EDDBDB;
  border-radius: 8px;
  color: #CB8587;
  font-weight: bold;
}

nav a.router-link-exact-active:hover {
  background-color: #CB8587;
  color: #EDDBDB;
}

nav a {
  display: inline-block;
  padding: 10px 20px;
  border-left: 1px solid var(#CB8587);
  text-decoration: none;
  color: #CB8587;
}

nav a:first-of-type {
  border: 0;
}

button {
  background-color: #D6D4AD;
  color: #8E8B62;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin: 0;
  margin-left: 10px;
}

button:hover {
  background-color: #ccc892;
}

/* Hamburger styles */
.hamburger {
  display: none; /* Hide hamburger by default */
}

/* Show the hamburger button only on small screens */
@media (max-width: 768px) {
  nav {
    display: none; /* Hide nav by default */
    flex-direction: column; /* Stack links vertically when visible */
    align-items: center; 
  }

  nav.active {
    display: flex; /* Show navigation */
    background-color: #F1F1F1; 
    position: absolute; /* Optional: position it absolutely */
    top: 60px; /* Adjust based on header height */
    width: 100%; 
    z-index: 10; /* Above other content */
    padding:10px;
    border-radius: 10px;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);
  }

  nav.active a {
    margin-bottom: 10px;
  }

  .hamburger {
    display: block; /* Show hamburger on small screens */
    background: none;
    border: none;
    font-size: 24px; /* Size of the hamburger icon */
    cursor: pointer; /* Hand cursor on hover */
    margin-right: 5px;
    margin-left: 0px;
  }

  .logo{
    margin-left: 5px;
    margin-right: 0px;
  }
}

/* Other existing styles for larger screens */
@media (min-width: 1024px) {
  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: center;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }

  button {
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    margin: 0;
    margin-left: 10px;
  }
}
</style>


