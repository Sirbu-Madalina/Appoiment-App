<template>
  <main>
    <div class="existing-appointments">
      <!-- Show existing appointments -->
      <div v-if="appointments.length > 0">
        <h2>Your Appointments</h2>
        <ul>
          <li v-for="(appointment, index) in appointments" :key="index">
            <p>{{ appointment.artistName }} - {{ appointment.service }}</p>
            <p>{{ appointment.message }}</p>
            <button @click="deleteAppointment(appointment.id)">Delete</button>
          </li>
        </ul>
      </div>
      <!-- If there are no appointments, show a "No appointments yet" message -->
      <div v-else>
        <h2>No Appointments Yet</h2>
        <p>It looks like you haven't made any appointments yet. Use the form below to schedule one.</p>
      </div>
    </div>

    <!-- Button to make a new appointment -->
    <button v-if="!showForm" @click="showForm = true">Make New Appointment</button>

    <div v-if="showForm" class="appointment-container">
      <h1>Make an Appointment</h1>
      <!-- Form to make a new appointment -->
      <form @submit.prevent="submitAppointment">
        <div class="artist-procedure">
          <!-- Artist dropdown -->
          <select v-model="selectedArtist" @change="loadProcedures">
            <option value="">Select Artist</option>
            <option v-for="artist in artists" :key="artist.id" :value="artist.name">
              {{ artist.name }}
            </option>
          </select>

          <!-- Procedure dropdown, showing only procedure names -->
          <select v-model="selectedProcedure">
            <option value="">Select Procedure</option>
            <option v-for="procedure in filteredProcedures" :key="procedure">
              {{ procedure.procedurename }}
            </option>
          </select>
        </div>

        <input type="text" v-model="userName" placeholder="Your Name" required />
        <input type="email" v-model="userEmail" placeholder="Your Email" required />
        <input type="tel" v-model="userPhone" placeholder="Phone Number" required />
        <textarea v-model="userMessage" placeholder="Date and hour you want" required rows="3"></textarea>
        
        <!-- Form buttons -->
        <div class="form-buttons">
          <button type="submit">Make an Appointment</button>
          <button type="button" @click="cancelAppointment">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Pop-up message -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <p>Appointment successfully added! Wait for the confirmation email!</p>
        <button @click="closePopup">Close</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/main.js';
import { getAuth} from 'firebase/auth';

const artists = ref([]);
const selectedArtist = ref('');
const selectedProcedure = ref('');
const filteredProcedures = ref([]);
const userName = ref('');
const userEmail = ref('');
const userPhone = ref('');
const userMessage = ref('');
const showPopup = ref(false); // Track the pop-up visibility
const appointments = ref([]);
const showForm = ref(false); // Control form visibility

const auth = getAuth();
const user = auth.currentUser;

onMounted(async () => {
  if (user) {
    userEmail.value = user.email;
    await fetchAppointments();
    fetchArtists(); // Fetch artists data
  }
});

const fetchArtists = () => {
  const artistsCollection = collection(db, 'artist');
  
  // Set up a real-time listener on the 'artists' collection
  onSnapshot(artistsCollection, (snapshot) => {
    artists.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
};

const loadProcedures = () => {
  const artist = artists.value.find(artist => artist.name === selectedArtist.value);
  filteredProcedures.value = artist ? artist.procedures : [];
};

const fetchAppointments = async () => {
  try {
    const q = query(collection(db, 'appointments'), where('customerEmail', '==', userEmail.value));
    const querySnapshot = await getDocs(q);
    appointments.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching appointments: ', error);
  }
};

const submitAppointment = async () => {
  if (!selectedArtist.value || !selectedProcedure.value || !userName.value || !userEmail.value || !userPhone.value) {
    return console.error('Please fill out all the fields.');
  }
  try {
    const appointmentData = {
      artistName: selectedArtist.value,
      service: selectedProcedure.value,
      customerName: userName.value,
      customerEmail: userEmail.value,
      customerPhone: userPhone.value,
      message: userMessage.value,
    };

    await addDoc(collection(db, 'appointments'), appointmentData);
    console.log('Appointment successfully added!', appointmentData);

    await fetchAppointments();

    // Reset form
    selectedArtist.value = '';
    selectedProcedure.value = '';
    userName.value = '';
    userPhone.value = '';
    userMessage.value = '';

    showPopup.value = true;
    showForm.value = false;

  } catch (error) {
    console.error('Error adding appointment: ', error);
  }
};

const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
    console.log('Appointment deleted:', appointmentId);
    await fetchAppointments();
  } catch (error) {
    console.error('Error deleting appointment: ', error);
  }
};

// Close the pop-up
const closePopup = () => {
  showPopup.value = false; // Set showPopup to false when "Close" button is clicked
};

// Cancel the form
const cancelAppointment = () => {
  showForm.value = false;
};
</script>



<style scoped>
main {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
font-family: Roboto, sans-serif;
}

.existing-appointments {
  background-color: #F1F1F1;
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 5px 40px 8px #E7CCCC;
  margin: 20px;
  text-align: center;
  color:#CB8587;
 
  ul {
    list-style-type: none;
    padding: 0;
  }

  h2{
    color: #a5a381;
    font-weight: bold;
    font-family: Roboto;
    margin-bottom: 20px;
    font-size: 24px;
  }
}
  
.appointment-container {
  background-color: #F1F1F1;
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 5px 40px 8px #E7CCCC;
  margin: 20px;
}

h1 {
  text-align: center;
  color: #a5a381;
  font-weight: bold;
  font-family: Roboto;
  margin-bottom: 20px;
  font-size: 24px;
}
  
.artist-procedure {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  select{
    width: 48%;
    padding: 10px;
    margin: 5px 0;
    border: none;
    border-radius: 5px;
    outline: none;
  }
}

button {
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  margin-left:0;
  padding: 10px;
  width: 50%;
  align-self: center;
}
  
form{
  display: flex;
  flex-direction: column;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  border-radius: 5px;
  outline: none;
  background-color: #EDDBDB;
}



/* Pop-up styling */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.popup-content {
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
  color: #CB8587;
}

.popup-content button {
  margin-top: 15px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #D6D4AD;
  color: #8E8B62;
  cursor: pointer;
}

.popup-content button:hover{
  background-color: #a5a381;
  color: #F1F1F1;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

button {
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
}


/* Mobile version */
@media (max-width: 600px) {
  .appointment-container, 
  .existing-appointments {
    width: 90%; /* Reduce width for small screens */
    padding: 15px; /* Adjust padding */
  }

  h1 {
    font-size: 20px; /* Reduce font size for small screens */
  }

  select {
    width: 100%; /* Full width for select options */
    margin-bottom: 10px; /* Add margin between stacked select options */
  }

  input, select, textarea {
    padding: 8px; 
  }

  .popup-content {
    width: 80%; 
    padding: 15px; 
  }

  .popup-content button {
    width: 100%; 
  }
  
  .popup-content button:hover{
    background-color: #a5a381;
    color: #F1F1F1;
  }
}


</style>