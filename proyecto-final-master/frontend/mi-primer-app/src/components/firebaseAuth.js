import axios from "axios";
import { auth } from "./firebaseConfig";

const fetchProtectedData = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await axios.get(
      "http://localhost:3000/api/rutaProtegida",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
  }
};
