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
        <ion-title>Facility</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form @submit.prevent="handleCreate">
        <div class="ion-padding">
          <ion-item>
            <ion-label position="floating">Start point</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="ride.startPoint"
              id="ride_startPoint"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">End point</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="ride.endPoint"
              id="ride_endPoint"
              required
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
  alertController,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

import { RideService } from "@/services/ride.service";
import { TokenService} from "@/services/token.service";
// import { UtilityService } from "@/services/utility.service";

export default defineComponent({
  name: "Detail",
  data() {
    return {
      getBackButtonText: () => {
        const mode = window && window.Ionic && window.Ionic.mode;
        return mode === "ios" ? "Back" : "";
      },
      loading: true,

      disableSubmit: false,
      carId: null,
      ride: {
        customerId: null,
        carId: null,
        car: null,
        startPoint: null,
        endPoint: null,
        lenghtKm: null,
        costEuro: null,
        paid: null
      },
    };
  },
  async mounted() {
    const route = useRoute();
    this.carId = route.params.id;
    
    this.loading = false;
  },
  methods: {
    async handleCreate() {
      if (this.disableSubmit) return;

      const data = {
        carId: this.carId,
        car: this.car,
        startPoint: this.ride.startPoint,
        endPoint: this.ride.endPoint,
        customerId: await TokenService.getToken()
      };

      try {
        this.disableSubmit = true;
        const res = await RideService.create(data);
        console.log(res);
        this.router.push("/ride/" + res.data._id);
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Creating failed",
          message: `Something went wrong trying to create this facility: ${
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
    IonItem,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
