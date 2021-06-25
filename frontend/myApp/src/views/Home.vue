<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card>
        <ion-img src="https://www.driving.co.uk/s3/st-driving-prod/uploads/2020/12/Zoox-1.jpg" />
        <ion-card-header>
          <ion-card-title>Call-a-car</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Welcome to call-a-car, your self driving taxi service.
          You may proceed to order a car on demand.
        </ion-card-content>
        <ion-item button router-link="/tabs/accomodations">
          <ion-icon :icon="bonfireOutline" slot="start"></ion-icon>
          <ion-label>Browse our accomodations</ion-label>
          <ion-icon :icon="arrowForward" slot="end"></ion-icon>
        </ion-item>
        <ion-item button router-link="/tabs/reservations">
          <ion-icon :icon="clipboardOutline" slot="start"></ion-icon>
          <ion-label>Make a reservation</ion-label>
          <ion-icon :icon="arrowForward" slot="end"></ion-icon>
        </ion-item>
      </ion-card>

      <ion-card v-if="user">
        <ion-img src="https://www.driving.co.uk/s3/st-driving-prod/uploads/2020/12/Zoox-1.jpg" />
        <ion-card-header>
          <ion-card-title>Welcome, {{ user.name }}!</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Thank you for signing in to the De Flierefluiter Campings app!
        </ion-card-content>
        <ion-item button disabled>
          <ion-icon :icon="personOutline" slot="start"></ion-icon>
          <ion-label>Profile</ion-label>
          <ion-icon :icon="arrowForward" slot="end"></ion-icon>
        </ion-item>
        <ion-item button @click="handleLogout">
          <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
          <ion-label>Log out</ion-label>
          <ion-icon :icon="arrowForward" slot="end"></ion-icon>
        </ion-item>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";

import { useRouter } from "vue-router";
import {
  arrowForward,
  bonfireOutline,
  clipboardOutline,
  personOutline,
  logOutOutline,
} from "ionicons/icons";

import { AuthService } from "@/services/auth.service";

export default {
  name: "Home",
  data() {
    return { user: null };
  },
  async mounted() {
    this.user = await AuthService.getUser();
  },
  methods: {
    handleLogout: async function () {
      AuthService.logout();
      this.router.go();
    },
  },
  setup() {
    const router = useRouter();
    return {
      router,
      arrowForward,
      bonfireOutline,
      clipboardOutline,
      personOutline,
      logOutOutline,
    };
  },
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
  },
};
</script>