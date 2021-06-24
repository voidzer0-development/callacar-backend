<template>
    <div>
        <ion-list>
            <ion-item>
                <ion-label position="floating">Car</ion-label>
                <ion-input
                type="text"
                class="form-control"
                v-model="ride.car"
                id="car"
                required
                />
            </ion-item>
            <ion-item>
                <ion-label position="floating">Locatie</ion-label>
                <ion-input
                type="text"
                class="form-control"
                v-model="ride.startPoint"
                id="locatie"
                required
                />
            </ion-item>
            <ion-item>
                <ion-label position="floating">Bestemming</ion-label>
                <ion-input
                type="text"
                class="form-control"
                v-model="ride.endPoint"
                id="destination"
                required
                />
            </ion-item>
        </ion-list>
        <ion-button @click="callACar" :disabled="disableSubmit" shape="round">Bel een auto!</ion-button>

    </div>
</template>

<script>
import {
  IonItem,
  IonLabel,
  IonInput,
  IonList,
} from "@ionic/vue";
import { defineComponent } from "vue";

// import { AuthService } from "@/services/auth.service";
// import { CustomerService } from "@/services/customer.service";

export default defineComponent({
  name: "ListItem",
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonList,
  },
  props: {
    userId: String,
  },
  data() {
    return {
      disableSubmit: false,
      loading: true,
      ride: { 
          car: null,
          customerId: null,
          startPoint: null,
          endPoint: null,
          lengthKm: null,
          costEuro: null,
          paid: null,
      },
    };
  },
//   async mounted() {
// //     this.user = await AuthService.getUser();

// //     if (this.userId) {
// //       const response = await CustomerService.getCustomer(this.userId);
// //       this.customer = response.data;
// //     }

// //     this.loading = false;
// //   },
//   methods: {
//     async saveGuest() {
//       if (this.disableSubmit) return;

//       try {
//         this.disableSubmit = true;

//         this.customer.dateOfBirth = this.customer.dateOfBirth.split("T")[0];
//         this.customer.createdBy = this.user.id;

//         let result = null;
//         if (this.userId) {
//           const response = await CustomerService.editCustomer(this.userId, this.customer);
//           result = response.data.id;
//         } else {
//           const response = await CustomerService.createCustomer(this.customer);
//           result = response.data.id;
//         }

//         await modalController.dismiss(result);
//       } catch (error) {
//         const errorAlert = await alertController.create({
//           header: "Creating failed",
//           message: `Something went wrong trying to create this customer: ${
//             error.message || "Unknown Error"
//           }`,
//           buttons: ["OK"],
//         });
//         await errorAlert.present();
//         this.disableSubmit = false;
//       }
//     },
//     async cancel() {
//       await modalController.dismiss(null);
//     },
//   },
//   setup() {
//     return {};
//   },
});
</script>
