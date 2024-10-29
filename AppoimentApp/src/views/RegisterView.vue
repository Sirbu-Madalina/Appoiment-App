<template>
  <main>
    <div class="login-container">
      <h1>Create an Account</h1>
      <p><input type="text" placeholder="Email" v-model="email" /></p>
      <p><input type="password" placeholder="Password" v-model="password" /></p>
      <p><button @click="register">Submit</button></p>
      <p><button @click="signInWithGoogle">Register with Google</button></p> 

      <!-- Add this new section for the "Sign in" link -->
      <p class="signin-text">
        You have an account? 
        <a @click.prevent="goToSignIn">Sign in here</a>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

const register = () => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Successfully registered");
      console.log(auth.currentUser);
      router.push("/feed");
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(result.user);
      router.push("/");
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};

// Function to redirect to Sign In page
const goToSignIn = () => {
  router.push("/signin"); // Assumes you have a route named 'signin'
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: center;
  font-family: Roboto, sans-serif;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0ecec;
  width: 100%; 
  max-width: 400px; /* Maximum width for larger screens */
  height: auto; /* Allow height to adjust based on content */
  padding: 20px;
  box-shadow: 0px 5px 40px 8px #E7CCCC;
  border-radius: 10px;
  margin: 20px; /* Add margin for spacing on small screens */
}

h1 {
  text-align: center;
  margin: 20px 0;
  color: #a5a381;
  font-weight: bold;
  font-family: Roboto;
  font-size: 24px; 
  background-color: #f0ecec;
}

p {
  text-align: center;
  margin-top: 10px 0;
  background-color: #f0ecec;
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  border-radius: 5px;
  outline: none;
  background-color: #EDDBDB;
}

input:focus {
  border: none;
}

.signin-text {
  margin-top: 15px;
  background-color: #f0ecec;
  text-align: center;
  color: #CB8587;
}

.signin-text a {
  color: #CB8587;
  cursor: pointer;
  text-decoration: underline;
  background-color: #f0ecec;
}

.signin-text a:hover {
  color: #8E8B62;
}

/* Media query for phones */
@media (max-width: 600px) {
  .login-container {
    width: 90%; /* Reduce the width for small screens */
    padding: 15px; /* Adjust padding for smaller devices */
  }

  h1 {
    font-size: 20px; 
  }

  input, button {
    padding: 8px; /* Adjust input and button padding */
  }

  p {
    margin: 0px;
  }

  .signin-text {
    margin-top: 10px;
    font-size: 10px;
  }
}
</style>
