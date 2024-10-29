<template>
  <main>
    <div class="signin-container">
      <h1>Sign In</h1>
      <p><input type="text" placeholder="Email" v-model="email"/></p>
      <p><input type="password" placeholder="Password" v-model="password"/></p>
      <p v-if="errMsg">{{ errMsg }}</p>
      <p><button @click="register">Submit</button></p>
      <p><button @click="signInWithGoogle">Sign in with Google</button></p>
      <!-- Add the registration message here -->
      <p class="register-link">
        Don't have an account? 
      <a @click="goToRegister">Register here</a>
      </p>
    </div>
  </main>
</template>

<script>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const errMsg = ref(""); //ERROR MESSAGE
    const router = useRouter();
    const register = () =>{
      signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
          console.log("Successfully registered");
          router.push("/appointment");
        })
        .catch((error) => {
          console.error(error);
          switch (error.code) {
            case "auth/invalid-email":
              errMsg.value = "Invalid email address format";
              break;
            case "auth/user-not-found":
              errMsg.value = "User not found";
              break;
            case "auth/wrong-password":
              errMsg.value = "Wrong password";
              break;
            default:
              errMsg.value = "Email or password is incorrect";
              break;
          }
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

    // Method to navigate to the Register page
    const goToRegister = () => {
      router.push("/register"); // Assumes your registration route is /register
    };

    return {
      email,
      password,
      register,
      signInWithGoogle,
      goToRegister, // Add this to the returned object so it can be used in the template
    };
  }
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

.signin-container {
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
  margin: 20px; 

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

.register-link {
  margin-top: 15px;
  background-color: #f0ecec;
  text-align: center;
  color: #CB8587;
}

.register-link a {
  color: #CB8587;
  cursor: pointer;
  text-decoration: underline;
  background-color: #f0ecec;
}

.register-link a:hover {
  color: #8E8B62;
}
}

/* Media query for phones */
@media (max-width: 600px) {
  .signin-container {
    width: 90%; 
    padding: 15px; 
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

  .register-link {
    margin-top: 10px;
    font-size: 10px;
  }
}

</style>
