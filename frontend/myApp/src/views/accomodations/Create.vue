<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            :text="getBackButtonText()"
            default-href="/"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>Accomodation</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form @submit.prevent="handleCreate">
        <div class="ion-padding">
          <ion-item>
            <ion-label position="floating">Name</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="ride.car"
              id="accomodation_name"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Type</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="ride.customerId"
              id="accomodation_type"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Area</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="ride.startPoint"
              id="accomodation_area"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Price per Day</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="ride.endPoint"
              id="accomodation_daily_price"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Price per Season</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="ride.lengthKm"
              id="accomodation_season_price"
            />
          </ion-item>

          <ion-button type="submit" :disabled="disableSubmit">
            Create
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  // IonSelect,
  // IonSelectOption,
  alertController,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import { RideService } from "@/services/ride.service";
// import { UtilityService } from "@/services/utility.service";

export default defineComponent({
  name: "Detail",
  data() {
    return {
      getBackButtonText: () => {
        const mode = window && window.Ionic && window.Ionic.mode;
        return mode === "ios" ? "Back" : "";
      },
      disableSubmit: false,
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
  methods: {
    async handleCreate() {
      if (this.disableSubmit) return;

      if (!this.ride.customerId) {
        const errorAlert = await alertController.create({
          header: "Type is required",
          message: "Please select a type for this accomodation.",
          buttons: ["OK"],
        });
        return errorAlert.present();
      }

      const data = {
        car: this.ride.car,
        customerId: this.ride.customerId,
        startPoint: this.ride.startPoint,
        endPoint: this.ride.endPoint,
        lengthKm: this.ride.lengthKm,
        costEuro: this.ride.costEuro,
        paid: this.ride.paid,
      };

      try {
        this.disableSubmit = true;
        await RideService.create(data);
        this.router.push("/tabs/accomodations");
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Creating failed",
          message: `Something went wrong trying to create this accomodation: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableSubmit = false;
      }
    },
  },
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonLabel,
    // IonSelect,
    // IonSelectOption,
    IonItem,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
