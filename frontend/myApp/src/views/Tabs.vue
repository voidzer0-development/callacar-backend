<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Reservations" href="/tabs/reservations">
          <ion-icon :icon="clipboardOutline" />
          <ion-label>Reservations</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Accomodations" href="/tabs/accomodations">
          <ion-icon :icon="bonfireOutline" />
          <ion-label>Accomodations</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Sites" href="/tabs/sites" v-show="is_admin">
          <ion-icon :icon="locationOutline" />
          <ion-label>Sites</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="Facilities"
          href="/tabs/facilities"
          v-show="is_admin"
        >
          <ion-icon :icon="bicycleOutline" />
          <ion-label>Facilities</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="Utilities"
          href="/tabs/utilities"
          v-show="is_admin"
        >
          <ion-icon :icon="powerOutline" />
          <ion-label>Utilities</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="Customers"
          href="/tabs/customers"
          v-show="is_admin"
        >
          <ion-icon :icon="personOutline" />
          <ion-label>Customers</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
} from "@ionic/vue";

import {
  bonfireOutline,
  homeOutline,
  locationOutline,
  personOutline,
  clipboardOutline,
  bicycleOutline,
  powerOutline,
} from "ionicons/icons";

import { AuthService } from "@/services/auth.service";

export default {
  name: "Tabs",
  data() {
    return { is_admin: false };
  },
  async mounted() {
    try {
      const user = await AuthService.getUser();
      this.is_admin = user.is_admin;
    } catch (error) {
      this.is_admin = false;
    }
  },
  setup() {
    return {
      bonfireOutline,
      homeOutline,
      locationOutline,
      personOutline,
      clipboardOutline,
      bicycleOutline,
      powerOutline,
    };
  },
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage },
};
</script>