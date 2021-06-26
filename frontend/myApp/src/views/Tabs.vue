<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Rides" href="/tabs/rides">
          <ion-icon :icon="clipboardOutline" />
          <ion-label>Rides</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Cars" href="/tabs/cars">
          <ion-icon :icon="carOutline" />
          <ion-label>cars</ion-label>
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
  carOutline,
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
      carOutline,
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