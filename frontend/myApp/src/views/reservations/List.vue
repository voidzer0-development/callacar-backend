<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Reservations</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)" v-if="is_admin">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Reservations</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list lines="full" v-if="is_admin">
        <ion-item>
          <ion-icon :icon="personOutline" slot="start" />
          <ion-label>Reservation view</ion-label>
          <ion-toggle slot="end" v-model="userViewEnabled"></ion-toggle>
        </ion-item>
      </ion-list>

      <div v-show="userViewEnabled || !is_admin">
        <UserReservation />
      </div>

      <div v-show="!userViewEnabled && is_admin" v-if="is_admin">
        <ion-list v-if="!loading">
          <ListItem
            v-for="reservation in reservations"
            :key="reservation.id"
            :reservation="reservation"
          />
        </ion-list>
        <ion-list v-else>
          <ListLoadingItems />
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { personOutline } from "ionicons/icons";

import ListLoadingItems from "@/components/ListLoadingItems.vue";
import ListItem from "@/components/reservations/ListItem.vue";
import UserReservation from "@/components/reservations/UserReservation.vue";

import { AuthService } from "@/services/auth.service";
import { ReservationService } from "@/services/reservation.service";

export default defineComponent({
  name: "Reservations",
  data() {
    return {
      is_admin: false,
      userViewEnabled: false,
      loading: true,
      reservations: null,
    };
  },
  async mounted() {
    // Is the user an admin? Show the list.
    try {
      const user = await AuthService.getUser();
      this.is_admin = user.is_admin;
    } catch (error) {
      this.is_admin = false;
    }

    if (this.is_admin) {
      // Actually retrieves the data.
      const response = await ReservationService.getReservations();
      this.reservations = response.data;
    }

    this.loading = false;
  },
  methods: {
    refresh: async function (ev) {
      try {
        if (this.is_admin) {
          this.loading = true;

          const response = await ReservationService.getReservations();
          this.reservations = response.data;

          this.loading = false;
        }

        ev.target.complete();
      } catch (error) {
        ev.target.cancel();
      }
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToggle,
    IonToolbar,
    ListLoadingItems,
    ListItem,
    UserReservation,
  },
  setup() {
    return { personOutline };
  },
});
</script>