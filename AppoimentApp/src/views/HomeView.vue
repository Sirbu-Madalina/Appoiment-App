<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';  // To navigate to the appointment page
import { db } from "@/main.js"; 
import { collection, getDocs } from "firebase/firestore";

// Define a reactive reference for artists
const artists = ref([]);
const selectedArtist = ref(null);
const router = useRouter();

// Fetch artists from Firestore
const fetchArtists = async () => {
  try {
    const artistsCollection = collection(db, 'artist');  // Access the 'artists' collection
    const snapshot = await getDocs(artistsCollection);
    
    // Map the retrieved documents to the artists array
    artists.value = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id // Optional but useful for unique key
    }));
  } catch (error) {
    console.error("Error fetching artists: ", error);
  }
};

// Function to handle artist selection
const selectArtist = (artist) => {
  selectedArtist.value = artist;
};

// Function to handle "Make an Appointment" button click
const makeAppointment = (procedure) => {
  const appointmentData = {
    artist: selectedArtist.value.name,
    procedure: procedure.name,
    price: procedure.price
  };

  // Pass the selected artist and procedure data to the appointment view
  router.push({ 
    name: 'Appointment', 
    query: appointmentData 
  });
};

// Fetch the artists from Firestore when the component mounts
onMounted(() => {
  fetchArtists();
});
</script>

<template>
  <main>
    <div class="artists-container">
      <div 
        v-for="artist in artists" :key="artist.id" class="artist" @click="selectArtist(artist)" style="cursor: pointer;">
        <!-- Use the imageURL referring to your Firestore document structure -->
        <img :src="artist.img" :alt="artist.name" width="90" height="95"> 
        <p>{{ artist.name }}</p> <!-- Display the artist's name -->
      </div>
    </div>
    <div class="procedures-container">
      <!-- Show procedures only for the selected artist -->
      <div v-if="selectedArtist" class="procedures">
        <h2>{{ selectedArtist.name }}'s Procedures</h2>
        <div v-for="procedures in selectedArtist.procedures" :key="procedures.procedurename" class="procedure">
          <p>{{ procedures.procedurename }}</p> <!-- Display the procedure name -->
          <h5>Price: €{{ procedures.price }}</h5> <!-- Display the procedure price -->
          <button @click="makeAppointment(procedures)">Make an appointment</button>
        </div>
      </div>
      <!-- Message if no artist is selected -->
      <div class="first-message" v-else>
        <p>Please select an artist to see their procedures.</p>
      </div>
    </div>
  </main>
</template>




<style scoped>
main {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: center;
  font-family: Roboto, sans-serif;
}

.artists-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.artist {
  text-align: center;
  margin-bottom: 10px;
}

.artist img {
  border-radius: 50%;
  width: 80px;
  height: 80px;
}

.artist p {
  color: #8E8B62;
  font-size: 17px;
}

.procedures-container {
  display: flex;
  flex-direction: column;
  margin-left: 50px;
}

.procedure {
  width: 600px;
  height: auto;
  background-color: #F1F1F1;
  box-shadow: 0px 0px 10px 3px #E7CCCC;
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 10px;
}

.procedure p {
  text-align: start;
  color: #8E8B62;
  font-weight: 500;
  font-size: 20px;
  margin-left: 10px;
}

.procedure h5 {
  text-align: start;
  color: #A87676;
  font-size: 15px;
  margin: 10px 0;
  margin-left: 10px;
}

.procedures h2 {
  text-align: start;
  color: #8E8B62;
  font-size: 30px;
  margin-top: 10px;
  border-radius: 10px;
  padding: 10px;
}

.first-message {
  text-align: center;
  color: #8E8B62;
  font-size: 20px;
  background-color: #F1F1F1;
  margin-top: 50%;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 0px 30px 5px #E7CCCC;
}

/* Media query for responsive design */
@media (max-width: 600px) {
  main {
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
    
  }

  .procedures-container {
    margin-left: 20px;
  }

  .artists-container {
    margin-bottom: 5px;
    margin-top: 20px;
  }

  .procedure {
    width: 90%;
    padding: 8px;
  
  }

  .procedures h2 {
    font-size: 15px;
  }

  .artist img {
    width: 60px;
    height: 60px;
  }

  .artist p, .procedure p, .procedure h5, .first-message {
    font-size: 12px;
    padding: 2px;
  }

  button{
    width: 80%;
    font-size: 12px;
    text-align: start;
    padding-left: 8px;
  }

  .first-message {
  font-size: 10px;
  padding: 5px;
  margin-top: 20%;
  margin-right: 20px;
  }
}

</style>
